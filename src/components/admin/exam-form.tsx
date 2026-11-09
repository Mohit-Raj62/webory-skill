"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Clock,
  ShieldAlert,
  Sliders,
  Eye,
  EyeOff,
  Save,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileQuestion,
  Code,
  Layers,
  Zap,
  Shuffle,
} from "lucide-react";
import { toast } from "sonner";

interface QuestionItem {
  _id?: string;
  questionText: string;
  questionType: "mcq" | "multiple-correct" | "true-false" | "fill-in-the-blanks" | "short-answer" | "descriptive" | "coding";
  options: string[];
  correctAnswer: any;
  explanation: string;
  marks: number;
  negativeMarks?: number;
  difficulty: "easy" | "medium" | "hard";
  subject?: string;
  topic?: string;
  codeSnippet?: string;
  language?: string;
}

interface ExamFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ExamForm({ initialData, isEdit = false }: ExamFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description ||
      "Please read all questions carefully before answering. Do not switch tabs or refresh the browser during the examination."
  );
  const [subject, setSubject] = useState(initialData?.subject || "General");
  const [topic, setTopic] = useState(initialData?.topic || "");
  const [chapter, setChapter] = useState(initialData?.chapter || "");
  const [syllabus, setSyllabus] = useState(initialData?.syllabus || "");

  // Parameters
  const [duration, setDuration] = useState<number>(initialData?.duration || 60);
  const [passingPercentage, setPassingPercentage] = useState<number>(
    initialData?.passingPercentage || 40
  );
  const [negativeMarking, setNegativeMarking] = useState<boolean>(
    initialData?.negativeMarking || false
  );
  const [negativeMarksPerQuestion, setNegativeMarksPerQuestion] = useState<number>(
    initialData?.negativeMarksPerQuestion || 0.25
  );
  const [maxAttempts, setMaxAttempts] = useState<number>(initialData?.maxAttempts || 1);
  const [randomizeQuestions, setRandomizeQuestions] = useState<boolean>(
    initialData?.randomizeQuestions !== undefined ? initialData.randomizeQuestions : true
  );
  const [randomizeOptions, setRandomizeOptions] = useState<boolean>(
    initialData?.randomizeOptions || false
  );
  const [questionNavigation, setQuestionNavigation] = useState<boolean>(
    initialData?.questionNavigation !== undefined ? initialData.questionNavigation : true
  );
  const [autoSubmission, setAutoSubmission] = useState<boolean>(
    initialData?.autoSubmission !== undefined ? initialData.autoSubmission : true
  );

  // Status & Visibility
  const [status, setStatus] = useState<string>(initialData?.status || "hidden");
  const [resultVisibility, setResultVisibility] = useState<string>(
    initialData?.resultVisibility || "manual"
  );
  const [answerKeyVisibility, setAnswerKeyVisibility] = useState<string>(
    initialData?.answerKeyVisibility || "manual"
  );
  const [explanationVisibility, setExplanationVisibility] = useState<boolean>(
    initialData?.explanationVisibility !== undefined ? initialData.explanationVisibility : true
  );

  // Questions
  const [questions, setQuestions] = useState<QuestionItem[]>(
    initialData?.questions || []
  );

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isManualQuestionModalOpen, setIsManualQuestionModalOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);

  // AI & Generator Modal state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiCount, setAiCount] = useState(5);
  const [aiDifficultyPreset, setAiDifficultyPreset] = useState<"easy" | "medium" | "hard" | "custom">("easy");
  const [aiEasy, setAiEasy] = useState(5);
  const [aiMedium, setAiMedium] = useState(0);
  const [aiHard, setAiHard] = useState(0);
  const [aiGeneratorMode, setAiGeneratorMode] = useState<"basic" | "ai">("basic");
  const [aiSelectedTypes, setAiSelectedTypes] = useState<string[]>(["mcq"]);
  const [aiGeneratedList, setAiGeneratedList] = useState<QuestionItem[]>([]);
  const [selectedAiIndices, setSelectedAiIndices] = useState<number[]>([]);
  const [saveToBankOnAccept, setSaveToBankOnAccept] = useState(true);

  const applyDifficultyPreset = (preset: "easy" | "medium" | "hard" | "custom", total = aiCount) => {
    setAiDifficultyPreset(preset);
    if (preset === "easy") {
      setAiEasy(total);
      setAiMedium(0);
      setAiHard(0);
    } else if (preset === "medium") {
      const e = Math.floor(total * 0.4);
      setAiEasy(e);
      setAiMedium(total - e);
      setAiHard(0); // Still no hard unless explicitly requested!
    } else if (preset === "hard") {
      const e = Math.floor(total * 0.3);
      const m = Math.floor(total * 0.4);
      setAiEasy(e);
      setAiMedium(m);
      setAiHard(total - e - m);
    }
  };

  // Quick Add Basic Questions without AI wait (Supports choosing Easy, Medium, or Hard)
  const handleQuickAddBasicQuestions = async (level: "easy" | "medium" | "hard" = "easy") => {
    try {
      setAiGenerating(true);
      const res = await fetch("/api/admin/exams/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject || "Web Development",
          topic: topic || title || "Fundamentals",
          count: 5,
          selectedLevel: level,
          basicOnly: true,
          marksPerQuestion: 1,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        setQuestions((prev) => [...prev, ...data.questions]);
        toast.success(`Added ${data.questions.length} ${level.toUpperCase()} questions (Short & Concise)!`);
      } else {
        toast.error(data.error || "Failed to add questions");
      }
    } catch {
      toast.error("Error adding questions");
    } finally {
      setAiGenerating(false);
    }
  };

  // Manual Question Modal state
  const [manualQText, setManualQText] = useState("");
  const [manualQType, setManualQType] = useState<QuestionItem["questionType"]>("mcq");
  const [manualOptions, setManualOptions] = useState<string[]>([
    "Option A",
    "Option B",
    "Option C",
    "Option D",
  ]);
  const [manualCorrectAns, setManualCorrectAns] = useState<any>(0);
  const [manualExplanation, setManualExplanation] = useState("");
  const [manualMarks, setManualMarks] = useState(1);
  const [manualDifficulty, setManualDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  // Question Bank picker state
  const [bankQuestions, setBankQuestions] = useState<any[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([]);

  // Calculate totals
  const totalQuestions = questions.length;
  const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);
  const passingMarks = Math.round((totalMarks * passingPercentage) / 100);

  const difficultyCounts = {
    easy: questions.filter((q) => q.difficulty === "easy").length,
    medium: questions.filter((q) => q.difficulty === "medium").length,
    hard: questions.filter((q) => q.difficulty === "hard").length,
  };

  // AI Generation Handler
  const handleGenerateAi = async () => {
    try {
      setAiGenerating(true);
      const res = await fetch("/api/admin/exams/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic: topic || title,
          chapter,
          syllabus,
          count: aiCount,
          basicOnly: aiGeneratorMode === "basic",
          selectedLevel: aiDifficultyPreset,
          difficultyDistribution: {
            easy: aiEasy,
            medium: aiMedium,
            hard: aiHard,
          },
          questionTypes: aiSelectedTypes,
          marksPerQuestion: 1,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        setAiGeneratedList(data.questions);
        setSelectedAiIndices(data.questions.map((_: any, i: number) => i));
        toast.success(`Generated ${data.questions.length} questions successfully`);
      } else {
        toast.error(data.error || "Failed to generate AI questions");
      }
    } catch (err: any) {
      toast.error("AI question generation failed");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAcceptAiQuestions = async () => {
    const accepted = aiGeneratedList.filter((_, idx) =>
      selectedAiIndices.includes(idx)
    );
    if (accepted.length === 0) {
      toast.error("Please select at least one question to add");
      return;
    }

    setQuestions((prev) => [...prev, ...accepted]);

    if (saveToBankOnAccept) {
      try {
        await fetch("/api/admin/question-bank/bulk-save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: accepted }),
        });
      } catch (e) {
        console.error("Failed to auto-save to bank", e);
      }
    }

    toast.success(`Added ${accepted.length} questions to examination`);
    setIsAiModalOpen(false);
    setAiGeneratedList([]);
  };

  // Open Question Bank Modal
  const handleOpenQuestionBank = async () => {
    setIsQuestionBankModalOpen(true);
    setBankLoading(true);
    try {
      const res = await fetch(
        `/api/admin/question-bank?search=${encodeURIComponent(bankSearch)}&limit=100`
      );
      const data = await res.json();
      if (data.success) {
        setBankQuestions(data.questions || []);
      }
    } catch {
      toast.error("Failed to load question bank");
    } finally {
      setBankLoading(false);
    }
  };

  const handleAddFromQuestionBank = () => {
    const toAdd = bankQuestions
      .filter((q) => selectedBankIds.includes(q._id))
      .map((q) => ({
        questionBankId: q._id,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "",
        marks: q.marks || 1,
        negativeMarks: q.negativeMarks || 0,
        difficulty: q.difficulty || "medium",
        subject: q.subject,
        topic: q.topic,
      }));

    setQuestions((prev) => [...prev, ...toAdd]);
    toast.success(`Added ${toAdd.length} questions from Question Bank`);
    setIsQuestionBankModalOpen(false);
    setSelectedBankIds([]);
  };

  // Shuffle and distribute options so correct answers are spread across A, B, C, D
  const handleShuffleAllOptions = () => {
    if (questions.length === 0) {
      toast.info("Add some questions first to shuffle options");
      return;
    }

    let lastSlot = -1;
    const updated = questions.map((q) => {
      if (!q.options || q.options.length < 2 || (q.questionType && q.questionType !== "mcq")) {
        return q;
      }

      const originalOptions = [...q.options];
      const totalOpts = originalOptions.length;
      const currentCorrectIdx = Number(q.correctAnswer);

      if (isNaN(currentCorrectIdx) || currentCorrectIdx < 0 || currentCorrectIdx >= totalOpts) {
        return q;
      }

      const correctOptionText = originalOptions[currentCorrectIdx];
      const distractors = originalOptions.filter((_, idx) => idx !== currentCorrectIdx);

      // Shuffle distractors with Fisher-Yates
      for (let i = distractors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
      }

      // Candidate slots different from previous question's slot
      const candidateSlots: number[] = [];
      for (let s = 0; s < totalOpts; s++) {
        if (s !== lastSlot) candidateSlots.push(s);
      }

      const chosenSlot =
        candidateSlots[Math.floor(Math.random() * candidateSlots.length)] ??
        (lastSlot + 1) % totalOpts;

      lastSlot = chosenSlot;

      const newOptions: string[] = new Array(totalOpts);
      newOptions[chosenSlot] = correctOptionText;

      let dIdx = 0;
      for (let s = 0; s < totalOpts; s++) {
        if (s !== chosenSlot) {
          newOptions[s] = distractors[dIdx++];
        }
      }

      return {
        ...q,
        options: newOptions,
        correctAnswer: chosenSlot,
      };
    });

    setQuestions(updated);
    toast.success("Options shuffled! Correct answers distributed across A, B, C, D");
  };

  // Manual Question Save
  const handleSaveManualQuestion = () => {
    if (!manualQText.trim()) {
      toast.error("Question text is required");
      return;
    }

    const questionItem: QuestionItem = {
      questionText: manualQText.trim(),
      questionType: manualQType,
      options: manualQType === "true-false" ? ["True", "False"] : manualOptions,
      correctAnswer: manualCorrectAns,
      explanation: manualExplanation.trim(),
      marks: Number(manualMarks) || 1,
      difficulty: manualDifficulty,
      subject,
      topic,
    };

    if (editingQuestionIndex !== null) {
      setQuestions((prev) => {
        const next = [...prev];
        next[editingQuestionIndex] = questionItem;
        return next;
      });
      toast.success("Question updated");
    } else {
      setQuestions((prev) => [...prev, questionItem]);
      toast.success("Question added");
    }

    setIsManualQuestionModalOpen(false);
    setEditingQuestionIndex(null);
    resetManualForm();
  };

  const resetManualForm = () => {
    setManualQText("");
    setManualQType("mcq");
    setManualOptions(["Option A", "Option B", "Option C", "Option D"]);
    setManualCorrectAns(0);
    setManualExplanation("");
    setManualMarks(1);
    setManualDifficulty("medium");
  };

  const handleEditQuestion = (index: number) => {
    const q = questions[index];
    setEditingQuestionIndex(index);
    setManualQText(q.questionText);
    setManualQType(q.questionType);
    setManualOptions(q.options && q.options.length ? q.options : ["Option A", "Option B"]);
    setManualCorrectAns(q.correctAnswer);
    setManualExplanation(q.explanation || "");
    setManualMarks(q.marks || 1);
    setManualDifficulty(q.difficulty || "medium");
    setIsManualQuestionModalOpen(true);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    toast.success("Question removed");
  };

  // Form Submission
  const handleSubmit = async (submitStatus: string) => {
    if (!title.trim()) {
      toast.error("Examination title is required");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least 1 question to the examination");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        subject: subject.trim(),
        topic: topic.trim(),
        chapter: chapter.trim(),
        syllabus: syllabus.trim(),
        duration: Number(duration),
        totalQuestions,
        totalMarks,
        passingPercentage: Number(passingPercentage),
        passingMarks,
        negativeMarking,
        negativeMarksPerQuestion: Number(negativeMarksPerQuestion),
        maxAttempts: Number(maxAttempts),
        randomizeQuestions,
        randomizeOptions,
        questionNavigation,
        autoSubmission,
        status: submitStatus,
        resultVisibility,
        answerKeyVisibility,
        explanationVisibility,
        difficultyDistribution: difficultyCounts,
        questions,
      };

      const url = isEdit
        ? `/api/admin/exams/${initialData._id}`
        : "/api/admin/exams";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          isEdit
            ? "Examination updated successfully"
            : `Examination created in ${submitStatus.toUpperCase()} mode`
        );
        router.push("/admin/exams");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to save examination");
      }
    } catch {
      toast.error("An error occurred while saving the examination");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* 1. Basic Information */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <FileQuestion size={18} className="text-blue-400" />
          <h2 className="text-base font-bold text-white">General Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-gray-300">
              Examination Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Full-Stack JavaScript Midterm Assessment 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Subject / Category</label>
            <input
              type="text"
              placeholder="e.g. Computer Science, Web Development, Python"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Topic / Focus Area</label>
            <input
              type="text"
              placeholder="e.g. React.js, Asynchronous Programming, Node.js"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-gray-300">
              Exam Instructions & Guidelines (Visible to student prior to starting)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Parameters & Marking Scheme */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Clock size={18} className="text-emerald-400" />
          <h2 className="text-base font-bold text-white">Timing & Evaluation Scheme</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Duration (Minutes)</label>
            <input
              type="number"
              min={1}
              max={360}
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Passing Criteria (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={passingPercentage}
              onChange={(e) => setPassingPercentage(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-gray-500">
              Passing marks: {passingMarks} / {totalMarks}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Max Attempts</label>
            <input
              type="number"
              min={1}
              max={10}
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(Math.max(1, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-gray-500">1 = Single attempt only</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Negative Marking</label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="negMark"
                checked={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-0"
              />
              <label htmlFor="negMark" className="text-xs text-gray-300 cursor-pointer">
                Enable Deduction
              </label>
            </div>
            {negativeMarking && (
              <input
                type="number"
                step="0.25"
                min="0"
                placeholder="Deduction per wrong"
                value={negativeMarksPerQuestion}
                onChange={(e) => setNegativeMarksPerQuestion(Number(e.target.value))}
                className="w-full mt-1 px-2.5 py-1 rounded-lg bg-black/40 border border-red-500/30 text-white text-xs focus:outline-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* 3. Visibility & Publishing Controls */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-purple-400" />
            <h2 className="text-base font-bold text-white">Publishing & Visibility Controls</h2>
          </div>
          <span className="text-xs text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Admin Controlled Lifecycle
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Current Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="hidden">🔒 Hidden (Not visible to students)</option>
              <option value="draft">📝 Draft (Work in progress)</option>
              <option value="scheduled">⏳ Scheduled</option>
              <option value="live">🟢 Live (Available to students)</option>
              <option value="completed">🏁 Completed</option>
              <option value="archived">📦 Archived</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Student Scorecard Visibility</label>
            <select
              value={resultVisibility}
              onChange={(e) => setResultVisibility(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="manual">Manual (Admin must click Publish)</option>
              <option value="immediate">Immediate (Show score upon submit)</option>
            </select>
            <p className="text-[11px] text-gray-500">
              When manual, score stays hidden until you publish.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Answer Key & Review Visibility</label>
            <select
              value={answerKeyVisibility}
              onChange={(e) => setAnswerKeyVisibility(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="manual">Manual (Publish later from results)</option>
              <option value="immediate">Immediate (Show answers upon submit)</option>
              <option value="hidden">Permanently Hidden</option>
            </select>
            <p className="text-[11px] text-gray-500">
              Controls when students can see correct answer keys.
            </p>
          </div>
        </div>

        {/* Checkbox Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/5">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
            <input
              type="checkbox"
              checked={explanationVisibility}
              onChange={(e) => setExplanationVisibility(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 text-blue-600"
            />
            <span>Show Explanations</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
            <input
              type="checkbox"
              checked={randomizeQuestions}
              onChange={(e) => setRandomizeQuestions(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 text-blue-600"
            />
            <span>Randomize Questions</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
            <input
              type="checkbox"
              checked={questionNavigation}
              onChange={(e) => setQuestionNavigation(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 text-blue-600"
            />
            <span>Free Navigation</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
            <input
              type="checkbox"
              checked={autoSubmission}
              onChange={(e) => setAutoSubmission(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 text-blue-600"
            />
            <span>Auto Submit on 00:00</span>
          </label>
        </div>
      </div>

      {/* 4. Questions Manager Section */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare size={18} className="text-blue-400" />
              <h2 className="text-base font-bold text-white">
                Examination Questions ({totalQuestions})
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Total Marks: <strong className="text-white">{totalMarks}</strong> | Difficulty:{" "}
              <span className="text-emerald-400 font-semibold">{difficultyCounts.easy} Easy</span>,{" "}
              <span className="text-amber-400 font-semibold">{difficultyCounts.medium} Medium</span>,{" "}
              <span className="text-red-400 font-semibold">{difficultyCounts.hard} Hard</span>
            </p>
          </div>

          {/* Question Add Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Level Buttons */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                disabled={aiGenerating}
                onClick={() => handleQuickAddBasicQuestions("easy")}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                title="Add 5 Easy short basic questions"
              >
                <Zap size={13} className="text-emerald-400" />
                <span>+5 Easy</span>
              </button>
              <button
                type="button"
                disabled={aiGenerating}
                onClick={() => handleQuickAddBasicQuestions("medium")}
                className="px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                title="Add 5 Medium practical questions"
              >
                <span>+5 Medium</span>
              </button>
              <button
                type="button"
                disabled={aiGenerating}
                onClick={() => handleQuickAddBasicQuestions("hard")}
                className="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                title="Add 5 Moderate Hard questions (Not overly difficult)"
              >
                <span>+5 Hard</span>
              </button>
            </div>

            {questions.length > 0 && (
              <button
                type="button"
                onClick={handleShuffleAllOptions}
                className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Shuffle option positions so answers are varied across A, B, C, D"
              >
                <Shuffle size={14} />
                <span>Shuffle Options</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
            >
              <Sparkles size={14} />
              <span>Generate with AI</span>
            </button>

            <button
              type="button"
              onClick={handleOpenQuestionBank}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <BookOpen size={14} />
              <span>From Question Bank</span>
            </button>

            <button
              type="button"
              onClick={() => {
                resetManualForm();
                setEditingQuestionIndex(null);
                setIsManualQuestionModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              <span>Add Manually</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-dashed border-white/15 p-6 space-y-3">
            <FileQuestion size={32} className="text-gray-500 mx-auto" />
            <p className="text-gray-300 font-medium text-sm">No questions added yet</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Click &quot;Generate with AI&quot; to automatically create questions with answer keys and explanations, or pick from the Question Bank.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
                        Q{idx + 1}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                        {q.questionType}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          q.difficulty === "easy"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : q.difficulty === "hard"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({q.marks} {q.marks === 1 ? "Mark" : "Marks"})
                      </span>
                    </div>

                    <p className="text-sm font-medium text-white pt-1">{q.questionText}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditQuestion(idx)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      title="Edit question"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(idx)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Remove question"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Options display */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect =
                        Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.includes(optIdx)
                          : Number(q.correctAnswer) === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                            isCorrect
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium"
                              : "bg-black/20 border-white/5 text-gray-400"
                          }`}
                        >
                          <span>
                            <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </span>
                          {isCorrect && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                              Answer Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <div className="text-[11px] text-gray-400 bg-white/[0.01] p-2.5 rounded-lg border border-white/5">
                    <strong className="text-gray-300">Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Save Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900 border border-white/15 sticky bottom-4 z-20 backdrop-blur-md shadow-2xl">
        <div className="text-xs text-gray-400">
          Status will be saved as:{" "}
          <strong className="text-white uppercase font-bold">{status}</strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/exams")}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("hidden")}
            className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <EyeOff size={14} />
            <span>Save as Hidden</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("live")}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Eye size={14} />
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* ================= AI QUESTION GENERATOR MODAL ================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    AI-Powered Automatic Question Generator
                  </h3>
                  <p className="text-xs text-gray-400">
                    Generates questions, options, answer keys, and explanations automatically.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Question Generation Mode Switch */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                <button
                  type="button"
                  onClick={() => setAiGeneratorMode("basic")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    aiGeneratorMode === "basic"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Zap size={14} className={aiGeneratorMode === "basic" ? "text-white" : "text-emerald-400"} />
                  <span>Basic &amp; Easy Questions (Direct)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAiGeneratorMode("ai")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    aiGeneratorMode === "ai"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Sparkles size={14} className={aiGeneratorMode === "ai" ? "text-white" : "text-purple-400"} />
                  <span>Custom AI Generator</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-400 bg-white/[0.02] p-2 rounded-lg border border-white/5">
                💡 {aiGeneratorMode === "basic"
                  ? "Loads fundamental, beginner-friendly standard questions for the subject (HTML, CSS, JS, Python, Computer basics). No complicated theory!"
                  : "AI will generate clear, simple, introductory questions with options and answer keys."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Topic / Syllabus</label>
                  <input
                    type="text"
                    value={topic}
                    placeholder="e.g. HTML, CSS, JavaScript Basics"
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              {/* Difficulty Level Selection */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sliders size={14} className="text-purple-400" />
                    <span>Select Question Difficulty Level</span>
                  </label>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                    Short Questions (1-2 Lines Max)
                  </span>
                </div>

                {/* Level Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => applyDifficultyPreset("easy")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                      aiDifficultyPreset === "easy"
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500"
                        : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>🟢 Easy (सरल)</span>
                    <span className="text-[10px] font-normal text-gray-400">100% Basic, No Hard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyDifficultyPreset("medium")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                      aiDifficultyPreset === "medium"
                        ? "bg-amber-600/20 border-amber-500 text-amber-300 ring-1 ring-amber-500"
                        : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>🟡 Medium (मध्यम)</span>
                    <span className="text-[10px] font-normal text-gray-400">Practical &amp; Core</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyDifficultyPreset("hard")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                      aiDifficultyPreset === "hard"
                        ? "bg-red-600/20 border-red-500 text-red-300 ring-1 ring-red-500"
                        : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>🔴 Hard Included</span>
                    <span className="text-[10px] font-normal text-gray-400">Moderate Logic Only</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyDifficultyPreset("custom")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                      aiDifficultyPreset === "custom"
                        ? "bg-purple-600/20 border-purple-500 text-purple-300 ring-1 ring-purple-500"
                        : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>⚙️ Custom</span>
                    <span className="text-[10px] font-normal text-gray-400">Enter Numbers</span>
                  </button>
                </div>

                {/* Difficulty distribution breakdown counts */}
                <div className="grid grid-cols-4 gap-2 text-xs pt-1 border-t border-white/5">
                  <div>
                    <label className="text-[11px] text-gray-400">Total Count</label>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={aiCount}
                      onChange={(e) => {
                        const val = Math.max(1, Number(e.target.value));
                        setAiCount(val);
                        applyDifficultyPreset(aiDifficultyPreset, val);
                      }}
                      className="w-full mt-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/15 text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-emerald-400 font-semibold">Easy Qs</label>
                    <input
                      type="number"
                      min={0}
                      value={aiEasy}
                      disabled={aiDifficultyPreset !== "custom"}
                      onChange={(e) => setAiEasy(Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-500/30 text-white text-xs disabled:opacity-75 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-amber-400 font-semibold">Medium Qs</label>
                    <input
                      type="number"
                      min={0}
                      value={aiMedium}
                      disabled={aiDifficultyPreset !== "custom"}
                      onChange={(e) => setAiMedium(Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1 rounded-lg bg-black/40 border border-amber-500/30 text-white text-xs disabled:opacity-75 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-red-400 font-semibold">Hard Qs</label>
                    <input
                      type="number"
                      min={0}
                      value={aiHard}
                      disabled={aiDifficultyPreset !== "custom"}
                      onChange={(e) => setAiHard(Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1 rounded-lg bg-black/40 border border-red-500/30 text-white text-xs disabled:opacity-75 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Supported Question Types */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Question Types</label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    { id: "mcq", label: "MCQs (Single Correct)" },
                    { id: "multiple-correct", label: "Multiple Correct" },
                    { id: "true-false", label: "True / False" },
                    { id: "fill-in-the-blanks", label: "Fill in Blanks" },
                    { id: "coding", label: "Coding / Debugging" },
                  ].map((t) => {
                    const isSelected = aiSelectedTypes.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setAiSelectedTypes((prev) =>
                            isSelected
                              ? prev.filter((item) => item !== t.id)
                              : [...prev, t.id]
                          );
                        }}
                        className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                            : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Trigger Button */}
              <button
                type="button"
                disabled={aiGenerating}
                onClick={handleGenerateAi}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                {aiGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI Engine Generating Questions & Answer Keys...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate {aiCount} Questions with AI</span>
                  </>
                )}
              </button>

              {/* Generated Questions Review */}
              {aiGeneratedList.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span className="font-semibold text-white">
                      Review Generated Questions ({aiGeneratedList.length})
                    </span>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveToBankOnAccept}
                        onChange={(e) => setSaveToBankOnAccept(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-purple-600"
                      />
                      <span className="text-gray-400">Also save to Question Bank</span>
                    </label>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {aiGeneratedList.map((q, idx) => {
                      const isChecked = selectedAiIndices.includes(idx);
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                            isChecked
                              ? "bg-purple-500/5 border-purple-500/30"
                              : "bg-white/[0.01] border-white/5 opacity-60"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                setSelectedAiIndices((prev) =>
                                  e.target.checked
                                    ? [...prev, idx]
                                    : prev.filter((i) => i !== idx)
                                );
                              }}
                              className="mt-0.5 rounded text-purple-600"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-white">{q.questionText}</p>
                              {q.options && q.options.length > 0 && (
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                  <strong>Answer Key:</strong> Option{" "}
                                  {String.fromCharCode(65 + Number(q.correctAnswer))} (
                                  {q.options[Number(q.correctAnswer)]})
                                </p>
                              )}
                              <p className="text-[10px] text-gray-500 italic mt-0.5">
                                {q.explanation}
                              </p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 uppercase text-gray-300">
                              {q.difficulty}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2 bg-black/40">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
              >
                Close
              </button>
              {aiGeneratedList.length > 0 && (
                <button
                  type="button"
                  onClick={handleAcceptAiQuestions}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20"
                >
                  Add Selected ({selectedAiIndices.length}) to Exam
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= QUESTION BANK PICKER MODAL ================= */}
      {isQuestionBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-blue-400" />
                <h3 className="text-base font-bold text-white">Central Question Bank</h3>
              </div>
              <button
                onClick={() => setIsQuestionBankModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {bankLoading ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  Loading Question Bank...
                </div>
              ) : bankQuestions.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  No questions in bank yet. Use AI generator to create and store them!
                </div>
              ) : (
                <div className="space-y-2">
                  {bankQuestions.map((bq) => {
                    const isSelected = selectedBankIds.includes(bq._id);
                    return (
                      <div
                        key={bq._id}
                        onClick={() => {
                          setSelectedBankIds((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== bq._id)
                              : [...prev, bq._id]
                          );
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-blue-500/10 border-blue-500/40 text-white"
                            : "bg-white/[0.02] border-white/5 text-gray-300 hover:border-white/15"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-blue-600"
                        />
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold text-white">{bq.questionText}</p>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400">
                            <span>{bq.subject}</span>
                            <span>•</span>
                            <span className="capitalize text-emerald-400">{bq.difficulty}</span>
                            <span>•</span>
                            <span>{bq.marks} Mark</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2 bg-black/40">
              <button
                type="button"
                onClick={() => setIsQuestionBankModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedBankIds.length === 0}
                onClick={handleAddFromQuestionBank}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold"
              >
                Add Selected ({selectedBankIds.length}) to Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MANUAL QUESTION BUILDER MODAL ================= */}
      {isManualQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <h3 className="text-base font-bold text-white">
                {editingQuestionIndex !== null ? "Edit Question" : "Add Manual Question"}
              </h3>
              <button
                onClick={() => setIsManualQuestionModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-300">Question Text</label>
                  <span className="text-[10px] text-emerald-400 font-medium">Keep short (1-2 lines max)</span>
                </div>
                <textarea
                  rows={2}
                  value={manualQText}
                  onChange={(e) => setManualQText(e.target.value)}
                  placeholder="e.g. Which HTML tag is used for the largest heading?"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300">Type</label>
                  <select
                    value={manualQType}
                    onChange={(e) => setManualQType(e.target.value as any)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  >
                    <option value="mcq">MCQ (Single Correct)</option>
                    <option value="true-false">True / False</option>
                    <option value="fill-in-the-blanks">Fill in the Blanks</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={manualMarks}
                    onChange={(e) => setManualMarks(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Difficulty</label>
                  <select
                    value={manualDifficulty}
                    onChange={(e) => setManualDifficulty(e.target.value as any)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Options */}
              {manualQType === "mcq" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300">
                    Answer Options (Select the Radio button for the Correct Answer Key)
                  </label>
                  <div className="space-y-2">
                    {manualOptions.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOptionRadio"
                          checked={Number(manualCorrectAns) === optIdx}
                          onChange={() => setManualCorrectAns(optIdx)}
                          className="w-4 h-4 text-emerald-500"
                        />
                        <span className="text-xs font-bold text-gray-400">
                          {String.fromCharCode(65 + optIdx)}:
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...manualOptions];
                            updated[optIdx] = e.target.value;
                            setManualOptions(updated);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {manualQType === "true-false" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300">Correct Answer Key</label>
                  <div className="flex items-center gap-4 text-xs text-white">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="tfRadio"
                        checked={Number(manualCorrectAns) === 0}
                        onChange={() => setManualCorrectAns(0)}
                      />
                      <span>True</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="tfRadio"
                        checked={Number(manualCorrectAns) === 1}
                        onChange={() => setManualCorrectAns(1)}
                      />
                      <span>False</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">
                  Explanation (Shown when answer key is released)
                </label>
                <textarea
                  rows={2}
                  value={manualExplanation}
                  onChange={(e) => setManualExplanation(e.target.value)}
                  placeholder="Detailed explanation of the solution..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2 bg-black/40">
              <button
                type="button"
                onClick={() => setIsManualQuestionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveManualQuestion}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

