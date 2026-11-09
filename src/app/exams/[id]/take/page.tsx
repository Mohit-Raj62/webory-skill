"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  AlertTriangle,
  HelpCircle,
  FileText,
  User,
  Check,
  X,
  Grid3X3,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Lock,
  Eye,
  AlertOctagon,
} from "lucide-react";
import { toast } from "sonner";

interface ClientQuestion {
  _id: string;
  questionText: string;
  questionType: "mcq" | "multiple-correct" | "true-false" | "fill-in-the-blanks" | "short-answer" | "coding";
  options: string[];
  marks: number;
  negativeMarks: number;
  difficulty?: string;
  subject?: string;
  topic?: string;
  codeSnippet?: string;
  language?: string;
}

interface SavedResponseItem {
  questionId: string;
  selectedAnswer: any;
  status:
    | "answered"
    | "not-answered"
    | "marked-for-review"
    | "answered-marked-for-review"
    | "not-visited";
  updatedAt?: string;
}

export default function StudentExamTakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<any>(null);
  const [candidate, setCandidate] = useState<any>(null);
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [attemptId, setAttemptId] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Responses map: questionId -> { selectedAnswer, status }
  const [responses, setResponses] = useState<Record<string, { selectedAnswer: any; status: string }>>({});

  // Timer State
  const [remainingSeconds, setRemainingSeconds] = useState<number>(3600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmSubmitModalOpen, setConfirmSubmitModalOpen] = useState(false);
  const [questionPaperModalOpen, setQuestionPaperModalOpen] = useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "error">("saved");

  // Proctoring & Anti-Cheating Security States
  const [enableProctoring, setEnableProctoring] = useState(true);
  const [maxTabSwitches, setMaxTabSwitches] = useState(3);
  const [requireFullscreen, setRequireFullscreen] = useState(true);
  const [disableCopyPaste, setDisableCopyPaste] = useState(true);
  const [autoSubmitOnViolations, setAutoSubmitOnViolations] = useState(true);

  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenModalOpen, setFullscreenModalOpen] = useState(false);
  const [securityWarningModalOpen, setSecurityWarningModalOpen] = useState(false);
  const [securityModalData, setSecurityModalData] = useState<{
    title: string;
    description: string;
    tabCount: number;
    maxAllowed: number;
    remaining: number;
    isAutoSubmitted: boolean;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastViolationTimeRef = useRef<number>(0);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Initialize Exam Session
  useEffect(() => {
    const startSession = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/exams/${id}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data.success) {
          setExam(data.exam);
          setCandidate(data.student || { name: "Student Candidate" });
          setQuestions(data.questions || []);
          setAttemptId(data.attemptId);
          setRemainingSeconds(data.remainingSeconds);

          if (data.exam) {
            setEnableProctoring(data.exam.enableProctoring !== false);
            setMaxTabSwitches(data.exam.maxTabSwitches || 3);
            setRequireFullscreen(data.exam.requireFullscreen !== false);
            setDisableCopyPaste(data.exam.disableCopyPaste !== false);
            setAutoSubmitOnViolations(data.exam.autoSubmitOnViolations !== false);
          }

          if (data.securityState) {
            setTabSwitchCount(data.securityState.tabSwitchCount || 0);
            setFullscreenExitCount(data.securityState.fullscreenExitCount || 0);
          }

          // Restore saved responses
          const initialMap: Record<string, { selectedAnswer: any; status: string }> = {};
          (data.questions || []).forEach((q: ClientQuestion) => {
            initialMap[q._id] = { selectedAnswer: null, status: "not-visited" };
          });

          (data.savedResponses || []).forEach((sr: SavedResponseItem) => {
            if (initialMap[sr.questionId]) {
              initialMap[sr.questionId] = {
                selectedAnswer: sr.selectedAnswer,
                status: sr.status,
              };
            }
          });

          // Mark first question as not-answered if it was not-visited
          const firstQId = data.questions?.[0]?._id;
          if (firstQId && initialMap[firstQId].status === "not-visited") {
            initialMap[firstQId].status = "not-answered";
          }

          setResponses(initialMap);
          setSessionStarted(true);

          // Check if fullscreen is required
          if (data.exam?.requireFullscreen !== false && !document.fullscreenElement) {
            setFullscreenModalOpen(true);
          }
        } else {
          toast.error(data.error || "Unable to start examination");
          router.push(`/exams/${id}`);
        }
      } catch {
        toast.error("Failed to connect to exam server");
      } finally {
        setLoading(false);
      }
    };

    startSession();
  }, [id, router]);

  // Live Timer Countdown & Periodic Heartbeat Ping
  useEffect(() => {
    if (loading || remainingSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const pingInterval = setInterval(async () => {
      if (!attemptId) return;
      try {
        const pingRes = await fetch(`/api/exams/${id}/ping`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attemptId }),
        });
        const pingData = await pingRes.json();
        if (pingData.success && typeof pingData.remainingSeconds === "number") {
          setRemainingSeconds(pingData.remainingSeconds);
        }
      } catch {
        // Ping error handled silently
      }
    }, 15000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearInterval(pingInterval);
    };
  }, [loading, attemptId, id]);

  // Fullscreen Helpers
  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        setFullscreenModalOpen(false);
      }
    } catch {
      toast.error("Fullscreen mode requires browser permission");
      setFullscreenModalOpen(false);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch {
      toast.error("Could not toggle fullscreen");
    }
  };

  // Report Security Violation to Server
  const reportViolation = async (violationType: string, details: string) => {
    if (!attemptId || !sessionStarted) return;

    // Throttle calls to once per 1.2s to prevent duplicate triggers from simultaneous events
    const now = Date.now();
    if (now - lastViolationTimeRef.current < 1200) {
      return;
    }
    lastViolationTimeRef.current = now;

    try {
      const res = await fetch(`/api/exams/${id}/violation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          violationType,
          details,
        }),
      });

      const data = await res.json();

      if (data.alreadySubmitted) {
        toast.error("Examination session has ended.");
        router.push(`/exams/${id}/result`);
        return;
      }

      if (data.success) {
        const newTabCount = Number(data.tabSwitchCount || 0);
        const maxLimit = Number(data.maxAllowed || 3);
        const remaining = Math.max(0, maxLimit - newTabCount);

        setTabSwitchCount(newTabCount);
        if (typeof data.fullscreenExitCount === "number") {
          setFullscreenExitCount(data.fullscreenExitCount);
        }

        if (data.autoSubmitted) {
          toast.error("Test auto-submitted due to security violations!");
          setSecurityModalData({
            title: "Examination Terminated (Security Breach)",
            description: `You have reached ${newTabCount} tab switches (limit: ${maxLimit}). In accordance with strict examination security standards, your test has been automatically submitted and terminated.`,
            tabCount: newTabCount,
            maxAllowed: maxLimit,
            remaining: 0,
            isAutoSubmitted: true,
          });
          setSecurityWarningModalOpen(true);
          return;
        }

        if (violationType === "tab_switch") {
          toast.error(`Security Warning (${newTabCount}/${maxLimit}): Tab switch detected!`);
          setSecurityModalData({
            title: "Security Alert: Tab Switch / Unfocused Window Detected",
            description: `Switching browser tabs, minimizing the window, or using other applications during the test is strictly prohibited. This incident has been logged.`,
            tabCount: newTabCount,
            maxAllowed: maxLimit,
            remaining,
            isAutoSubmitted: false,
          });
          setSecurityWarningModalOpen(true);
        }
      }
    } catch {
      // Handled silently
    }
  };

  const handleAcknowledgeSecurityWarning = () => {
    if (securityModalData?.isAutoSubmitted) {
      router.push(`/exams/${id}/result`);
      return;
    }
    setSecurityWarningModalOpen(false);
    if (requireFullscreen && !document.fullscreenElement) {
      setFullscreenModalOpen(true);
    }
  };

  // Attach Security Listeners (Proctoring Engine)
  useEffect(() => {
    if (!sessionStarted || !enableProctoring) return;

    // 1. Tab Switch / Visibility Change
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === "hidden") {
        reportViolation("tab_switch", "Tab switch or browser minimization detected");
      }
    };

    // 2. Window Blur (switching to another window or external software)
    const handleWindowBlur = () => {
      reportViolation("tab_switch", "Window lost focus to external application");
    };

    // 3. Fullscreen state tracking
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);

      if (!isNowFullscreen && sessionStarted && requireFullscreen) {
        setFullscreenModalOpen(true);
        reportViolation("fullscreen_exit", "Exited full screen mode");
      }
    };

    // 4. Developer Tools & Keyboard Shortcuts Prevention
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        toast.error("Developer tools are disabled!");
        reportViolation("devtools_attempt", "F12 pressed");
        return false;
      }

      // Ctrl+Shift+I / J / C (DevTools)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        ["I", "i", "J", "j", "C", "c"].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        toast.error("Developer tools are disabled!");
        reportViolation("devtools_attempt", "Devtools keyboard shortcut");
        return false;
      }

      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        e.stopPropagation();
        toast.error("Viewing page source is disabled!");
        return false;
      }

      // Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        e.stopPropagation();
        toast.error("Printing examination questions is prohibited!");
        return false;
      }

      // Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Copy / Cut shortcuts
      if (
        disableCopyPaste &&
        (e.ctrlKey || e.metaKey) &&
        ["c", "C", "x", "X"].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
        toast.warning("Copying test questions is strictly prohibited!");
        return false;
      }
    };

    // 5. PrintScreen Key listener
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText("Screenshots are prohibited during examination.");
        }
        toast.warning("Screenshots / Print Screen is prohibited!");
      }
    };

    // 6. Right-click context menu prevention
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.warning("Right-click is disabled to ensure test integrity.");
      return false;
    };

    // 7. Copy / Cut / Paste event prevention
    const handleCopyCutPaste = (e: ClipboardEvent) => {
      if (disableCopyPaste) {
        e.preventDefault();
        toast.warning("Copy and paste actions are disabled during examination.");
        return false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyCutPaste);
    document.addEventListener("cut", handleCopyCutPaste);
    document.addEventListener("paste", handleCopyCutPaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyCutPaste);
      document.removeEventListener("cut", handleCopyCutPaste);
      document.removeEventListener("paste", handleCopyCutPaste);
    };
  }, [sessionStarted, enableProctoring, requireFullscreen, disableCopyPaste, attemptId, id]);

  // Auto-save Answer to Server
  const saveAnswerToServer = async (
    qId: string,
    answer: any,
    status: string
  ) => {
    if (!attemptId) return;
    try {
      setAutoSaveStatus("saving");
      const res = await fetch(`/api/exams/${id}/save-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          questionId: qId,
          selectedAnswer: answer,
          status,
        }),
      });

      if (res.ok) {
        setAutoSaveStatus("saved");
      } else {
        setAutoSaveStatus("error");
      }
    } catch {
      setAutoSaveStatus("error");
    }
  };

  const currentQuestion = questions[currentIndex];
  const currentResponse = currentQuestion
    ? responses[currentQuestion._id] || { selectedAnswer: null, status: "not-visited" }
    : { selectedAnswer: null, status: "not-visited" };

  // Handle Option Click
  const handleSelectOption = (optIndex: number) => {
    if (!currentQuestion) return;
    const qId = currentQuestion._id;

    let newAnswer: any;
    if (currentQuestion.questionType === "multiple-correct") {
      const current = Array.isArray(currentResponse.selectedAnswer)
        ? [...currentResponse.selectedAnswer]
        : [];
      if (current.includes(optIndex)) {
        newAnswer = current.filter((i) => i !== optIndex);
      } else {
        newAnswer = [...current, optIndex];
      }
    } else {
      newAnswer = optIndex;
    }

    const currentStatus = currentResponse.status;
    const newStatus =
      currentStatus === "marked-for-review" || currentStatus === "answered-marked-for-review"
        ? "answered-marked-for-review"
        : "answered";

    setResponses((prev) => ({
      ...prev,
      [qId]: { selectedAnswer: newAnswer, status: newStatus },
    }));

    saveAnswerToServer(qId, newAnswer, newStatus);
  };

  // JEE Action 1: Save & Next
  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion._id;

    const hasAnswer =
      currentResponse.selectedAnswer !== null &&
      !(Array.isArray(currentResponse.selectedAnswer) && currentResponse.selectedAnswer.length === 0);

    const newStatus = hasAnswer ? "answered" : "not-answered";

    setResponses((prev) => ({
      ...prev,
      [qId]: { ...currentResponse, status: newStatus },
    }));

    saveAnswerToServer(qId, currentResponse.selectedAnswer, newStatus);
    goToNextQuestion();
  };

  // JEE Action 2: Save & Mark for Review
  const handleSaveAndMarkForReview = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion._id;

    const hasAnswer =
      currentResponse.selectedAnswer !== null &&
      !(Array.isArray(currentResponse.selectedAnswer) && currentResponse.selectedAnswer.length === 0);

    const newStatus = hasAnswer ? "answered-marked-for-review" : "marked-for-review";

    setResponses((prev) => ({
      ...prev,
      [qId]: { ...currentResponse, status: newStatus },
    }));

    saveAnswerToServer(qId, currentResponse.selectedAnswer, newStatus);
    goToNextQuestion();
  };

  // JEE Action 3: Clear Response
  const handleClearResponse = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion._id;
    const newStatus = "not-answered";

    setResponses((prev) => ({
      ...prev,
      [qId]: { selectedAnswer: null, status: newStatus },
    }));

    saveAnswerToServer(qId, null, newStatus);
    toast.info("Option cleared");
  };

  // JEE Action 4: Mark for Review & Next (without answering)
  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion._id;

    const hasAnswer =
      currentResponse.selectedAnswer !== null &&
      !(Array.isArray(currentResponse.selectedAnswer) && currentResponse.selectedAnswer.length === 0);

    const newStatus = hasAnswer ? "answered-marked-for-review" : "marked-for-review";

    setResponses((prev) => ({
      ...prev,
      [qId]: { ...currentResponse, status: newStatus },
    }));

    saveAnswerToServer(qId, currentResponse.selectedAnswer, newStatus);
    goToNextQuestion();
  };

  // Navigation: Next
  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      const nextQId = questions[nextIdx]._id;

      setResponses((prev) => {
        if (prev[nextQId]?.status === "not-visited") {
          return {
            ...prev,
            [nextQId]: { ...prev[nextQId], status: "not-answered" },
          };
        }
        return prev;
      });

      setCurrentIndex(nextIdx);
    }
  };

  // Navigation: Prev
  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Jump to specific Question
  const handleJumpToQuestion = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < questions.length) {
      const targetQId = questions[targetIndex]._id;
      setResponses((prev) => {
        if (prev[targetQId]?.status === "not-visited") {
          return {
            ...prev,
            [targetQId]: { ...prev[targetQId], status: "not-answered" },
          };
        }
        return prev;
      });
      setCurrentIndex(targetIndex);
      setMobilePaletteOpen(false);
    }
  };

  // Final Submit Handler
  const handleFinalSubmit = async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/exams/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, isAutoSubmit }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          isAutoSubmit
            ? "Time expired! Examination auto-submitted."
            : "Examination submitted successfully!"
        );
        router.push(`/exams/${id}/result`);
      } else {
        toast.error(data.error || "Submission failed");
        setIsSubmitting(false);
      }
    } catch {
      toast.error("Network error submitting exam");
      setIsSubmitting(false);
    }
  };

  // Palette counts
  let answeredCount = 0;
  let notAnsweredCount = 0;
  let markedReviewCount = 0;
  let answeredMarkedCount = 0;
  let notVisitedCount = 0;

  questions.forEach((q) => {
    const stat = responses[q._id]?.status || "not-visited";
    if (stat === "answered") answeredCount++;
    else if (stat === "not-answered") notAnsweredCount++;
    else if (stat === "marked-for-review") markedReviewCount++;
    else if (stat === "answered-marked-for-review") answeredMarkedCount++;
    else notVisitedCount++;
  });

  const minutesRemaining = Math.floor(remainingSeconds / 60);
  const secondsRemaining = remainingSeconds % 60;
  const isUrgentTimer = remainingSeconds < 300; // Less than 5 mins

  const currentSectionName = currentQuestion?.subject || exam?.subject || "General Assessment";
  const availableSections = Array.from(
    new Set(questions.map((q) => q.subject || exam?.subject || "General Assessment"))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm font-medium">Entering Examination Room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col font-sans select-none text-slate-200 overflow-x-hidden">
      {/* ================= TOP CLEAN & RESPONSIVE CBT HEADER ================= */}
      <header className="h-14 sm:h-16 bg-[#0f172a] border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-sm shrink-0">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
            CBT
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm md:text-base font-bold text-white truncate max-w-[140px] sm:max-w-xs md:max-w-md">
                {exam?.title}
              </h1>
              <span className="hidden md:inline px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                Live
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="truncate">Section: <strong className="text-blue-400 font-semibold">{currentSectionName}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 shrink-0">
                {autoSaveStatus === "saved" ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 font-medium">Synced</span>
                  </>
                ) : autoSaveStatus === "saving" ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-amber-400 font-medium">Saving...</span>
                  </>
                ) : (
                  <span className="text-rose-400">Sync issue</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Timer, Mobile Palette Toggle & Submit */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Live Proctoring Status Badge */}
          {enableProctoring && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <ShieldCheck size={13} className="text-emerald-400" />
              <span className="text-slate-300 font-semibold hidden lg:inline">Proctored</span>
              {tabSwitchCount > 0 ? (
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/40">
                  Warns: {tabSwitchCount}/{maxTabSwitches}
                </span>
              ) : (
                <span className="text-[10px] text-emerald-400/90 font-mono hidden xl:inline">Active</span>
              )}
            </div>
          )}

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 size={13} className="text-blue-400" />
            ) : (
              <Maximize2 size={13} className="text-blue-400" />
            )}
            <span className="hidden xl:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>

          {/* Candidate Card (Desktop only) */}
          {candidate && (
            <div className="hidden 2xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                <User size={13} />
              </div>
              <div className="text-left text-[11px] leading-tight">
                <p className="font-semibold text-white truncate max-w-[120px]">
                  {candidate.name}
                </p>
                <p className="text-[9px] text-slate-400">Candidate</p>
              </div>
            </div>
          )}

          {/* Time Remaining Clock */}
          <div
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border flex items-center gap-1.5 sm:gap-2.5 transition-colors ${
              isUrgentTimer
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse"
                : "bg-slate-900 border-slate-700/80 text-white"
            }`}
          >
            <Clock
              size={15}
              className={isUrgentTimer ? "text-rose-400 animate-spin" : "text-blue-400 shrink-0"}
            />
            <div className="text-right leading-none">
              <span className="font-mono font-bold text-xs sm:text-sm md:text-base tracking-wider block">
                {String(minutesRemaining).padStart(2, "0")}:{String(secondsRemaining).padStart(2, "0")}
              </span>
              <span className="text-[8px] sm:text-[9px] font-medium text-slate-400 hidden xs:block mt-0.5">
                Time Left
              </span>
            </div>
          </div>

          {/* Mobile Palette Trigger Pill */}
          <button
            onClick={() => setMobilePaletteOpen(true)}
            className="lg:hidden px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Open Question Palette"
          >
            <Grid3X3 size={15} className="text-blue-400" />
            <span className="font-mono text-[11px] font-bold">{currentIndex + 1}/{questions.length}</span>
          </button>

          {/* Submit Test Button */}
          <button
            onClick={() => setConfirmSubmitModalOpen(true)}
            disabled={isSubmitting}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Send size={13} />
            <span className="hidden sm:inline">Submit Test</span>
            <span className="sm:hidden text-[11px]">Submit</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN SPLIT BODY ================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Area: Question Pane with Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6 md:p-8 max-w-4xl mx-auto w-full space-y-4 sm:space-y-6 pb-12">
            {/* ================= JEE/SSC CBT MULTI-SUBJECT SECTION SELECTOR TABS ================= */}
            {availableSections.length > 1 && (
              <div className="bg-[#0f172a] border border-slate-800 p-2 sm:p-2.5 rounded-2xl flex items-center gap-2 overflow-x-auto shadow-md">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 shrink-0 px-1">
                  SECTIONS:
                </span>
                <div className="flex items-center gap-2 flex-nowrap shrink-0">
                  {availableSections.map((secName) => {
                    const isSecActive = currentSectionName.toLowerCase() === secName.toLowerCase();
                    const countInSec = questions.filter(
                      (q) => (q.subject || exam?.subject || "General Assessment").toLowerCase() === secName.toLowerCase()
                    ).length;
                    const firstIndex = questions.findIndex(
                      (q) => (q.subject || exam?.subject || "General Assessment").toLowerCase() === secName.toLowerCase()
                    );

                    return (
                      <button
                        key={secName}
                        onClick={() => handleJumpToQuestion(firstIndex)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                          isSecActive
                            ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                            : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800/80"
                        }`}
                      >
                        <span>{secName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            isSecActive ? "bg-white/20 text-white font-black" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {countInSec}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentQuestion ? (
              <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                {/* 1. Card Header: Official Meta & Top Navigation Bar */}
                <div className="bg-[#0b1120] px-3.5 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                  {/* Left: Quick Prev/Next + Question Counter */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePrevQuestion}
                        disabled={currentIndex === 0}
                        className="p-1 sm:p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-25 disabled:cursor-not-allowed text-slate-300 transition-all border border-slate-700/60"
                        title="Previous Question"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-black tracking-widest uppercase font-mono shadow-sm">
                        QUESTION {currentIndex + 1}
                      </span>
                      <button
                        onClick={goToNextQuestion}
                        disabled={currentIndex === questions.length - 1}
                        className="p-1 sm:p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-25 disabled:cursor-not-allowed text-slate-300 transition-all border border-slate-700/60"
                        title="Next Question"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <span className="text-xs text-slate-400 font-semibold hidden md:inline border-l border-slate-700/80 pl-2.5">
                      Section: <strong className="text-blue-400 font-bold">{currentSectionName}</strong>
                    </span>
                  </div>

                  {/* Right: Official Marking Scheme */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/25 flex items-center gap-1 shadow-sm">
                      <Check size={12} className="stroke-[3]" />
                      <span>+{currentQuestion.marks}.00</span>
                    </span>
                    {currentQuestion.negativeMarks > 0 ? (
                      <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/25 flex items-center gap-1 shadow-sm">
                        <X size={12} className="stroke-[3]" />
                        <span>-{currentQuestion.negativeMarks}.00</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 hidden xs:inline px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/40">
                        No Negative Mark
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Question Statement Area (Distinct from Options) */}
                <div className="p-5 sm:p-7 bg-[#111827] border-b border-slate-800 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded mt-0.5 shrink-0 uppercase tracking-wider font-mono">
                      Q.{currentIndex + 1}
                    </span>
                    <p className="text-base sm:text-lg md:text-xl font-semibold text-white leading-relaxed tracking-wide break-words flex-1">
                      {currentQuestion.questionText}
                    </p>
                  </div>

                  {currentQuestion.codeSnippet && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#070b14] mt-3">
                      <div className="h-7 bg-slate-900 px-3 flex items-center gap-1.5 border-b border-slate-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        <span className="text-[10px] text-slate-500 font-mono ml-2">source code</span>
                      </div>
                      <pre className="p-4 text-xs text-emerald-300 font-mono overflow-x-auto max-w-full">
                        <code>{currentQuestion.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* 3. Options Section (Interactive Choice Cards with Radio Indicators) */}
                <div className="p-5 sm:p-7 bg-[#0b101d] space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span>Choose One Option:</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Tap an option to select</span>
                  </div>

                  <div className="space-y-2.5">
                    {currentQuestion.options &&
                      currentQuestion.options.map((opt, optIdx) => {
                        const isSelected =
                          currentQuestion.questionType === "multiple-correct"
                            ? Array.isArray(currentResponse.selectedAnswer) &&
                              currentResponse.selectedAnswer.includes(optIdx)
                            : Number(currentResponse.selectedAnswer) === optIdx;

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(optIdx)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 select-none group ${
                              isSelected
                                ? "bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500/50"
                                : "bg-[#141b2d] hover:bg-[#1a233a] border-slate-750 text-slate-200 hover:border-slate-600 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              {/* Option Letter Pill */}
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                  isSelected
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-slate-800 text-slate-300 border border-slate-700 group-hover:border-slate-600"
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </div>

                              {/* Option Statement */}
                              <span className="text-sm sm:text-base font-normal leading-relaxed break-words">
                                {opt}
                              </span>
                            </div>

                            {/* Radio Circle Indicator */}
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                isSelected
                                  ? "border-blue-500 bg-blue-600"
                                  : "border-slate-600 group-hover:border-slate-500 bg-slate-900"
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* 4. Action Buttons Bar (Cleanly Integrated at Base of Question Card) */}
                <div className="bg-[#0b1120] px-4 sm:px-6 py-4 border-t border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    {/* Primary Green Action Button */}
                    <button
                      onClick={handleSaveAndNext}
                      className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check size={18} className="stroke-[3]" />
                      <span>Save &amp; Next Question</span>
                      <ChevronRight size={18} />
                    </button>

                    {/* Secondary Purple Action */}
                    <button
                      onClick={handleSaveAndMarkForReview}
                      className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Bookmark size={14} />
                      <span>Save &amp; Mark for Review</span>
                    </button>
                  </div>

                  {/* Secondary Controls: Clear, Review & Navigation */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleClearResponse}
                        disabled={currentResponse.selectedAnswer === null}
                        className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all"
                        title="Clear selected option"
                      >
                        <RotateCcw size={12} />
                        <span>Clear Selection</span>
                      </button>

                      <button
                        onClick={handleMarkForReviewAndNext}
                        className="py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <span>Review &amp; Next</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevQuestion}
                        disabled={currentIndex === 0}
                        className="py-2 px-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all"
                      >
                        <ChevronLeft size={15} />
                        <span>Previous</span>
                      </button>

                      <button
                        onClick={goToNextQuestion}
                        disabled={currentIndex === questions.length - 1}
                        className="py-2 px-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all"
                      >
                        <span>Skip / Next</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-sm">
                No questions found in this assessment.
              </div>
            )}
          </div>
        </main>

        {/* ================= QUESTION PALETTE (DESKTOP SIDEBAR + MOBILE SLIDE-OVER DRAWER) ================= */}
        {/* Mobile Backdrop Overlay */}
        {mobilePaletteOpen && (
          <div
            onClick={() => setMobilePaletteOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          />
        )}

        <aside
          className={`w-full sm:w-80 xl:w-88 bg-[#0f172a] border-l border-slate-800 p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-y-auto transition-transform duration-300 ease-in-out shrink-0 ${
            mobilePaletteOpen
              ? "fixed right-0 top-0 bottom-0 z-50 shadow-2xl translate-x-0"
              : "hidden lg:flex"
          }`}
        >
          <div className="space-y-4">
            {/* Palette Header with Mobile Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Grid3X3 size={17} className="text-blue-400" />
                <span className="text-sm font-bold text-white tracking-wide">Question Palette</span>
              </div>
              <button
                onClick={() => setMobilePaletteOpen(false)}
                className="lg:hidden p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X size={16} />
              </button>
            </div>

            {/* Candidate Card */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                {candidate?.name ? candidate.name.charAt(0).toUpperCase() : "C"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {candidate?.name || "Student Candidate"}
                </p>
                <p className="text-[10px] text-blue-400 font-semibold truncate">
                  {currentSectionName}
                </p>
              </div>
            </div>

            {/* Helper Buttons: Question Paper & Instructions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQuestionPaperModalOpen(true)}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <FileText size={13} className="text-blue-400" />
                <span>Paper View</span>
              </button>
              <button
                type="button"
                onClick={() => setInstructionsModalOpen(true)}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <HelpCircle size={13} className="text-purple-400" />
                <span>Instructions</span>
              </button>
            </div>

            {/* Clean Legend Summary Cards */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {answeredCount}
                  </div>
                  <span className="text-slate-300">Answered</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {notAnsweredCount}
                  </div>
                  <span className="text-slate-300">Not Answered</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                    {notVisitedCount}
                  </div>
                  <span className="text-slate-300">Not Visited</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {markedReviewCount}
                  </div>
                  <span className="text-slate-300">Review</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px]">
                <div className="w-6 h-6 rounded-md bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 relative shadow-sm">
                  <span className="text-[10px]">{answeredMarkedCount}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 absolute -top-0.5 -right-0.5" />
                </div>
                <span className="text-slate-300 text-[10px] leading-tight">
                  Ans &amp; Review <span className="text-emerald-400 font-semibold">(Evaluated)</span>
                </span>
              </div>
            </div>

            {/* Question Numbers Grid (Responsive 5-Column Tiles) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Select Question</span>
                <span className="text-blue-400 font-mono font-bold">
                  Q {currentIndex + 1} of {questions.length}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-72 sm:max-h-80 overflow-y-auto pr-1 p-0.5">
                {questions.map((q, idx) => {
                  const stat = responses[q._id]?.status || "not-visited";
                  const isCurrent = idx === currentIndex;

                  let styleClass = "bg-slate-800 text-slate-300 border border-slate-700/80"; // Not Visited
                  let showGreenDot = false;

                  if (stat === "answered") {
                    styleClass = "bg-emerald-600 text-white border-emerald-500 font-bold shadow-sm";
                  } else if (stat === "not-answered") {
                    styleClass = "bg-rose-600 text-white border-rose-500 font-bold shadow-sm";
                  } else if (stat === "marked-for-review") {
                    styleClass = "bg-purple-600 text-white border-purple-500 font-bold shadow-sm";
                  } else if (stat === "answered-marked-for-review") {
                    styleClass = "bg-purple-600 text-white border-purple-500 font-bold shadow-sm";
                    showGreenDot = true;
                  }

                  return (
                    <button
                      key={q._id}
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-9 rounded-lg font-bold font-mono text-xs flex items-center justify-center relative transition-all ${styleClass} ${
                        isCurrent
                          ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0f172a] scale-105 z-10 shadow-md font-black"
                          : "hover:opacity-90 active:scale-95"
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {showGreenDot && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 absolute -top-1 -right-1 shadow-sm" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Submit Trigger */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                setMobilePaletteOpen(false);
                setConfirmSubmitModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Send size={14} />
              <span>Submit Examination</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ================= QUESTION PAPER PREVIEW MODAL ================= */}
      {questionPaperModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-400" />
                <h3 className="text-sm font-bold text-white">Question Paper Overview</h3>
              </div>
              <button
                onClick={() => setQuestionPaperModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 divide-y divide-slate-800 flex-1 text-xs">
              {questions.map((q, idx) => (
                <div key={q._id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-400">Question {idx + 1}</span>
                      {q.subject && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold">
                          {q.subject}
                        </span>
                      )}
                    </div>
                    <span>Marks: +{q.marks}</span>
                  </div>
                  <p className="text-white font-medium">{q.questionText}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-slate-300">
                    {q.options?.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <span className="font-bold text-slate-400">({String.fromCharCode(65 + oIdx)})</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setQuestionPaperModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= INSTRUCTIONS MODAL ================= */}
      {instructionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-purple-400" />
                <h3 className="text-sm font-bold text-white">General Examination Instructions</h3>
              </div>
              <button
                onClick={() => setInstructionsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-slate-300 leading-relaxed">
              <p className="font-semibold text-white">Color Codes / Symbols:</p>
              <ul className="space-y-2 list-disc pl-4 text-[11px]">
                <li><strong className="text-slate-400">Grey:</strong> You have not visited the question yet.</li>
                <li><strong className="text-rose-400">Red:</strong> You have visited the question but not answered it.</li>
                <li><strong className="text-emerald-400">Green:</strong> You have answered the question.</li>
                <li><strong className="text-purple-400">Purple:</strong> Marked for Review without answering.</li>
                <li><strong className="text-purple-400">Purple with Green Dot:</strong> Answered and Marked for Review (will be evaluated in results).</li>
              </ul>
              <p className="font-semibold text-white pt-2">Marking Scheme:</p>
              <p className="text-[11px]">
                Each correct answer awards positive marks. Incorrect answers incur configured negative marks (if enabled). Unattempted questions carry zero marks.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInstructionsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRM SUBMISSION MODAL ================= */}
      {confirmSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <AlertTriangle size={20} className="text-amber-400" />
              <h3 className="text-base font-bold text-white">Confirm Final Submission</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Are you sure you want to finish and submit your examination? Once submitted, answers cannot be edited.
              </p>

              {/* Summary Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Questions:</span>
                  <span className="font-bold text-white">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400 font-medium">Answered:</span>
                  <span className="font-bold text-emerald-400">
                    {answeredCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400 font-medium">Answered &amp; Marked for Review:</span>
                  <span className="font-bold text-purple-400">
                    {answeredMarkedCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-400 font-medium">Marked for Review (Unanswered):</span>
                  <span className="font-bold text-amber-400">
                    {markedReviewCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-400 font-medium">Not Answered:</span>
                  <span className="font-bold text-rose-400">
                    {notAnsweredCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Not Visited:</span>
                  <span className="font-bold text-slate-400">
                    {notVisitedCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmSubmitModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Continue Test
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleFinalSubmit(false)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit Final"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CANDIDATE DYNAMIC WATERMARK ================= */}
      <div
        className="pointer-events-none fixed inset-0 z-10 flex flex-wrap items-center justify-around opacity-[0.035] overflow-hidden select-none"
        aria-hidden="true"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="p-8 text-center text-xs font-mono font-black uppercase tracking-widest text-slate-300 transform -rotate-12 whitespace-nowrap"
          >
            <div>{candidate?.name || "CANDIDATE"}</div>
            <div>{candidate?.email || "ONLINE CBT"}</div>
            <div>ATTEMPT: {attemptId ? attemptId.slice(-6).toUpperCase() : "SECURE"}</div>
          </div>
        ))}
      </div>

      {/* ================= FULLSCREEN ENFORCEMENT MODAL ================= */}
      {fullscreenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0f172a] border border-blue-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
              <Maximize2 size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Full-Screen Mode Required</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                To guarantee examination integrity and prevent cheating, this assessment must be completed in full-screen mode.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1 text-left">
              <p>• Minimizing or exiting full screen will be logged as a security alert.</p>
              <p>• Do not switch tabs or access other software during the test.</p>
            </div>
            <button
              onClick={enterFullscreen}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              Enter Full Screen &amp; Resume Test
            </button>
          </div>
        </div>
      )}

      {/* ================= PROCTORING SECURITY WARNING MODAL ================= */}
      {securityWarningModalOpen && securityModalData && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div
            className={`border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl ${
              securityModalData.isAutoSubmitted
                ? "bg-rose-950/90 border-rose-500"
                : "bg-[#0f172a] border-amber-500/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  securityModalData.isAutoSubmitted
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                }`}
              >
                {securityModalData.isAutoSubmitted ? (
                  <AlertOctagon size={26} />
                ) : (
                  <ShieldAlert size={26} />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {securityModalData.title}
                </h3>
                <p className="text-[11px] text-slate-300">
                  {securityModalData.isAutoSubmitted
                    ? "Violation Limit Exceeded"
                    : "Suspicious Activity Detected"}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">{securityModalData.description}</p>

              {/* Warning Count Tracker */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  securityModalData.isAutoSubmitted
                    ? "bg-rose-900/30 border-rose-500/30 text-rose-200"
                    : "bg-slate-900 border-slate-800 text-slate-200"
                }`}
              >
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
                    Tab Switch Violations
                  </span>
                  <span className="text-base font-black font-mono">
                    {securityModalData.tabCount} / {securityModalData.maxAllowed}
                  </span>
                </div>
                {!securityModalData.isAutoSubmitted && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
                      Warnings Remaining
                    </span>
                    <span className="text-base font-black font-mono text-amber-400">
                      {securityModalData.remaining}
                    </span>
                  </div>
                )}
              </div>

              {!securityModalData.isAutoSubmitted && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                  ⚠️ <strong>Notice:</strong> Your screen and active browser state are being proctored in real-time. If you switch tabs {securityModalData.remaining} more time(s), your examination will be terminated immediately.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={handleAcknowledgeSecurityWarning}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                  securityModalData.isAutoSubmitted
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                }`}
              >
                {securityModalData.isAutoSubmitted
                  ? "View Examination Result & Report"
                  : "I Understand & Return to Examination"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
