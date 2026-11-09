import { IExamQuestion } from "@/models/Examination";
import { IStudentResponse, IQuestionEvaluationBreakdown } from "@/models/ExaminationAttempt";

export interface EvaluationInput {
  questions: IExamQuestion[];
  responses: IStudentResponse[];
  startTime: Date;
  submittedAt: Date;
  negativeMarking: boolean;
  negativeMarksPerQuestion: number;
  passingPercentage: number;
  passingMarks?: number;
}

export function evaluateStudentSubmission(input: EvaluationInput) {
  const {
    questions,
    responses,
    startTime,
    submittedAt,
    negativeMarking,
    negativeMarksPerQuestion,
    passingPercentage = 40,
    passingMarks,
  } = input;

  const responseMap = new Map<string, any>();
  responses.forEach((r) => {
    responseMap.set(r.questionId, r.selectedAnswer);
  });

  let totalMarks = 0;
  let obtainedMarks = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unattemptedQuestions = 0;
  let attemptedQuestions = 0;

  const questionBreakdown: IQuestionEvaluationBreakdown[] = [];

  questions.forEach((q: any) => {
    const qId = q._id?.toString() || q.id;
    const qMarks = Number(q.marks) || 1;
    const qNeg = negativeMarking
      ? Number(q.negativeMarks) || Number(negativeMarksPerQuestion) || 0
      : 0;

    totalMarks += qMarks;

    const selectedAnswer = responseMap.has(qId) ? responseMap.get(qId) : null;
    const isAttempted =
      selectedAnswer !== null &&
      selectedAnswer !== undefined &&
      selectedAnswer !== "" &&
      !(Array.isArray(selectedAnswer) && selectedAnswer.length === 0);

    let isCorrect = false;
    let awarded = 0;

    if (!isAttempted) {
      unattemptedQuestions++;
      awarded = 0;
    } else {
      attemptedQuestions++;

      if (q.questionType === "mcq" || q.questionType === "true-false") {
        isCorrect = Number(selectedAnswer) === Number(q.correctAnswer);
      } else if (q.questionType === "multiple-correct") {
        const studentAnsArray = Array.isArray(selectedAnswer)
          ? [...selectedAnswer].map(Number).sort()
          : [Number(selectedAnswer)];
        const correctAnsArray = Array.isArray(q.correctAnswer)
          ? [...q.correctAnswer].map(Number).sort()
          : [Number(q.correctAnswer)];

        isCorrect =
          studentAnsArray.length === correctAnsArray.length &&
          studentAnsArray.every((val, index) => val === correctAnsArray[index]);
      } else if (
        q.questionType === "fill-in-the-blanks" ||
        q.questionType === "short-answer"
      ) {
        const sClean = String(selectedAnswer).trim().toLowerCase();
        const cClean = String(q.correctAnswer).trim().toLowerCase();
        isCorrect = sClean === cClean;
      } else {
        // Descriptive or coding fallback
        isCorrect = String(selectedAnswer).trim() === String(q.correctAnswer).trim();
      }

      if (isCorrect) {
        correctAnswers++;
        awarded = qMarks;
      } else {
        incorrectAnswers++;
        awarded = -qNeg;
      }
    }

    obtainedMarks += awarded;

    questionBreakdown.push({
      questionId: qId,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options || [],
      selectedAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      marksAwarded: awarded,
      explanation: q.explanation || "",
      difficulty: q.difficulty || "medium",
      topic: q.topic || "",
    });
  });

  // Ensure marks don't go below 0 unless negative marks strictly allow
  obtainedMarks = Math.max(0, Math.round(obtainedMarks * 100) / 100);
  const percentage = totalMarks > 0
    ? Math.round((obtainedMarks / totalMarks) * 10000) / 100
    : 0;

  const passCriteria = passingMarks !== undefined && passingMarks > 0
    ? passingMarks
    : Math.round((totalMarks * passingPercentage) / 100);

  const passed = obtainedMarks >= passCriteria;

  const timeTakenSeconds = Math.max(
    0,
    Math.floor((new Date(submittedAt).getTime() - new Date(startTime).getTime()) / 1000)
  );

  return {
    totalQuestions: questions.length,
    attemptedQuestions,
    correctAnswers,
    incorrectAnswers,
    unattemptedQuestions,
    totalMarks,
    obtainedMarks,
    percentage,
    passed,
    timeTakenSeconds,
    evaluatedAt: new Date(),
    questionBreakdown,
  };
}

