import Link from "next/link";
import { ArrowLeft, CheckSquare } from "lucide-react";
import { ExamForm } from "@/components/admin/exam-form";

export default function NewExamPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Link
          href="/admin/exams"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Create New Examination
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure examination rules, generate AI questions, or pick from Question Bank.
          </p>
        </div>
      </div>

      <ExamForm isEdit={false} />
    </div>
  );
}

