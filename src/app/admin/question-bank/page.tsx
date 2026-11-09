"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Plus,
  Search,
  Sparkles,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle,
  HelpCircle,
  X,
  Sliders,
  Check,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminQuestionBankPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [subjectsList, setSubjectsList] = useState<string[]>([]);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);

  // AI Generator state
  const [aiSubject, setAiSubject] = useState("Web Development");
  const [aiTopic, setAiTopic] = useState("JavaScript & TypeScript");
  const [aiCount, setAiCount] = useState(5);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Manual Question state
  const [formText, setFormText] = useState("");
  const [formType, setFormType] = useState("mcq");
  const [formSubject, setFormSubject] = useState("General");
  const [formTopic, setFormTopic] = useState("");
  const [formDifficulty, setFormDifficulty] = useState("medium");
  const [formMarks, setFormMarks] = useState(1);
  const [formOptions, setFormOptions] = useState<string[]>([
    "Option A",
    "Option B",
    "Option C",
    "Option D",
  ]);
  const [formCorrectAns, setFormCorrectAns] = useState<any>(0);
  const [formExplanation, setFormExplanation] = useState("");
  const [formSaving, setFormSaving] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (subjectFilter !== "all") params.append("subject", subjectFilter);
      if (difficultyFilter !== "all") params.append("difficulty", difficultyFilter);
      if (typeFilter !== "all") params.append("questionType", typeFilter);

      const res = await fetch(`/api/admin/question-bank?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions || []);
        if (data.subjects) setSubjectsList(data.subjects);
      } else {
        toast.error(data.error || "Failed to load question bank");
      }
    } catch {
      toast.error("Error fetching question bank");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [subjectFilter, difficultyFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this question from the bank?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/question-bank/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Question deleted");
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSaveQuestion = async () => {
    if (!formText.trim()) {
      toast.error("Question text is required");
      return;
    }

    try {
      setFormSaving(true);
      const payload = {
        questionText: formText.trim(),
        questionType: formType,
        subject: formSubject.trim(),
        topic: formTopic.trim(),
        difficulty: formDifficulty,
        marks: Number(formMarks) || 1,
        options: formType === "true-false" ? ["True", "False"] : formOptions,
        correctAnswer: formCorrectAns,
        explanation: formExplanation.trim(),
        source: "manual",
      };

      const url = editingQuestion
        ? `/api/admin/question-bank/${editingQuestion._id}`
        : "/api/admin/question-bank";
      const method = editingQuestion ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingQuestion ? "Question updated" : "Question created");
        setIsCreateModalOpen(false);
        setEditingQuestion(null);
        fetchQuestions();
      } else {
        toast.error(data.error || "Failed to save question");
      }
    } catch {
      toast.error("Error saving question");
    } finally {
      setFormSaving(false);
    }
  };

  const handleOpenEdit = (q: any) => {
    setEditingQuestion(q);
    setFormText(q.questionText);
    setFormType(q.questionType);
    setFormSubject(q.subject || "General");
    setFormTopic(q.topic || "");
    setFormDifficulty(q.difficulty || "medium");
    setFormMarks(q.marks || 1);
    setFormOptions(q.options && q.options.length ? q.options : ["Option A", "Option B"]);
    setFormCorrectAns(q.correctAnswer);
    setFormExplanation(q.explanation || "");
    setIsCreateModalOpen(true);
  };

  // Quick Load Standard Basic Questions to Bank
  const handleQuickLoadBasicQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/exams/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Web Development",
          topic: "HTML, CSS & JS Basics",
          count: 10,
          basicOnly: true,
          marksPerQuestion: 1,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        await fetch("/api/admin/question-bank/bulk-save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: data.questions }),
        });
        toast.success(`Loaded ${data.questions.length} Basic Questions into Bank!`);
        fetchQuestions();
      }
    } catch {
      toast.error("Failed to load basic questions");
    } finally {
      setLoading(false);
    }
  };

  // AI Bulk Generate directly into Bank
  const handleAiBulkGenerate = async () => {
    try {
      setAiGenerating(true);
      const res = await fetch("/api/admin/exams/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: aiSubject,
          topic: aiTopic,
          count: aiCount,
          difficultyDistribution: {
            easy: Math.floor(aiCount / 3),
            medium: Math.floor(aiCount / 3),
            hard: aiCount - Math.floor(aiCount / 3) * 2,
          },
          questionTypes: ["mcq", "true-false"],
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        // Bulk save into bank
        const saveRes = await fetch("/api/admin/question-bank/bulk-save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: data.questions }),
        });
        const saveData = await saveRes.json();
        if (saveData.success) {
          toast.success(`Generated and saved ${data.questions.length} questions to bank!`);
          setIsAiModalOpen(false);
          fetchQuestions();
        }
      } else {
        toast.error(data.error || "Failed to generate questions");
      }
    } catch {
      toast.error("AI bulk generation failed");
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BrainCircuit size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Centralized Question Bank
            </h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Permanent repository of verified examination questions categorized by subject, topic, and difficulty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickLoadBasicQuestions}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Add 10 standard easy basic questions into the Question Bank"
          >
            <Zap size={15} className="text-emerald-400" />
            <span>⚡ Seed Basic Questions</span>
          </button>

          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-purple-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>AI Bulk Generate</span>
          </button>

          <button
            onClick={() => {
              setEditingQuestion(null);
              setFormText("");
              setFormType("mcq");
              setFormOptions(["Option A", "Option B", "Option C", "Option D"]);
              setFormCorrectAns(0);
              setFormExplanation("");
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Create Question</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white/[0.02] border border-white/10 p-3.5 rounded-2xl">
        <form onSubmit={handleSearchSubmit} className="relative md:col-span-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </form>

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
        >
          <option value="all">All Subjects</option>
          {subjectsList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
        >
          <option value="all">All Question Types</option>
          <option value="mcq">MCQs</option>
          <option value="true-false">True/False</option>
          <option value="fill-in-the-blanks">Fill in Blanks</option>
        </select>
      </div>

      {/* Questions Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">
          Loading question bank...
        </div>
      ) : questions.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8 space-y-3">
          <BookOpen size={32} className="text-gray-500 mx-auto" />
          <h3 className="text-white font-semibold text-base">No questions found</h3>
          <p className="text-gray-400 text-xs max-w-sm mx-auto">
            Use AI Bulk Generate to automatically create questions with verified answer keys, or add one manually.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {questions.map((q) => (
            <div
              key={q._id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase">
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
                      {q.subject} • {q.marks} Mark(s)
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white pt-1">{q.questionText}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Options */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isCorrect =
                      Array.isArray(q.correctAnswer)
                        ? q.correctAnswer.includes(optIdx)
                        : Number(q.correctAnswer) === optIdx;

                    return (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border flex items-center justify-between ${
                          isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium"
                            : "bg-black/20 border-white/5 text-gray-400"
                        }`}
                      >
                        <span>
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </span>
                        {isCorrect && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {q.explanation && (
                <div className="p-2.5 rounded-lg bg-white/[0.01] border border-white/5 text-[11px] text-gray-400">
                  <strong className="text-gray-300">Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= AI BULK GENERATE MODAL ================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                <h3 className="text-base font-bold text-white">AI Bulk Question Generator</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Topic / Chapter</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  Number of Questions to Generate & Store
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={aiCount}
                  onChange={(e) => setAiCount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={aiGenerating}
                onClick={handleAiBulkGenerate}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                {aiGenerating ? "Generating & Storing..." : "Generate & Store in Bank"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MANUAL CREATE / EDIT MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <h3 className="text-base font-bold text-white">
                {editingQuestion ? "Edit Bank Question" : "Add Bank Question"}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-gray-300">Question Text</label>
                  <span className="text-[10px] text-emerald-400 font-medium">Keep short (1-2 lines max)</span>
                </div>
                <textarea
                  rows={2}
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Enter concise question text (1-2 lines)..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-300">Subject</label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-300">Topic</label>
                  <input
                    type="text"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-gray-300">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="true-false">True/False</option>
                    <option value="fill-in-the-blanks">Fill in Blanks</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-300">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-300">Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={formMarks}
                    onChange={(e) => setFormMarks(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              {/* Options */}
              {formType === "mcq" && (
                <div className="space-y-2">
                  <label className="font-semibold text-gray-300">Options & Correct Answer</label>
                  {formOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="bankCorrectRadio"
                        checked={Number(formCorrectAns) === i}
                        onChange={() => setFormCorrectAns(i)}
                      />
                      <span className="font-bold text-gray-400">
                        {String.fromCharCode(65 + i)}:
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[i] = e.target.value;
                          setFormOptions(updated);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="font-semibold text-gray-300">Explanation</label>
                <textarea
                  rows={2}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end gap-2 bg-black/40">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={formSaving}
                onClick={handleSaveQuestion}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                {formSaving ? "Saving..." : "Save Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

