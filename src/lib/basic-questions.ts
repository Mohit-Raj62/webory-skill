export interface BasicQuestionTemplate {
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  marks: number;
}

export const BASIC_SUBJECT_QUESTIONS: BasicQuestionTemplate[] = [
  // --- EASY (सरल - 1 line fundamental questions) ---
  {
    subject: "Web Development",
    topic: "HTML",
    difficulty: "easy",
    questionText: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Link", "Home Tool Markup"],
    correctAnswer: 0,
    explanation: "HTML stands for Hyper Text Markup Language.",
    marks: 1,
  },
  {
    subject: "Web Development",
    topic: "HTML",
    difficulty: "easy",
    questionText: "Which HTML tag is used for the largest heading?",
    options: ["<h1>", "<h6>", "<heading>", "<head>"],
    correctAnswer: 0,
    explanation: "<h1> defines the largest heading.",
    marks: 1,
  },
  {
    subject: "Web Development",
    topic: "HTML",
    difficulty: "easy",
    questionText: "Which HTML tag is used to create a hyperlink?",
    options: ["<a>", "<link>", "<href>", "<url>"],
    correctAnswer: 0,
    explanation: "<a> tag creates hyperlinks.",
    marks: 1,
  },
  {
    subject: "Web Development",
    topic: "CSS",
    difficulty: "easy",
    questionText: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Creative Style System", "Computer Styling Sheets", "Color Style Sheet"],
    correctAnswer: 0,
    explanation: "CSS stands for Cascading Style Sheets.",
    marks: 1,
  },
  {
    subject: "Web Development",
    topic: "CSS",
    difficulty: "easy",
    questionText: "Which CSS property changes text color?",
    options: ["color", "text-color", "font-color", "text-style"],
    correctAnswer: 0,
    explanation: "'color' property sets text color.",
    marks: 1,
  },
  {
    subject: "Web Development",
    topic: "JavaScript",
    difficulty: "easy",
    questionText: "Which keyword declares a variable in modern JavaScript?",
    options: ["let", "var", "dim", "val"],
    correctAnswer: 0,
    explanation: "'let' and 'const' declare block-scoped variables.",
    marks: 1,
  },
  {
    subject: "Web Development",
    topic: "JavaScript",
    difficulty: "easy",
    questionText: "Which function prints messages in the browser console?",
    options: ["console.log()", "print()", "echo()", "display()"],
    correctAnswer: 0,
    explanation: "console.log() writes output to the console.",
    marks: 1,
  },
  {
    subject: "Python Programming",
    topic: "Python",
    difficulty: "easy",
    questionText: "Which function displays output in Python?",
    options: ["print()", "echo()", "write()", "console.log()"],
    correctAnswer: 0,
    explanation: "print() outputs text to the screen in Python.",
    marks: 1,
  },
  {
    subject: "Python Programming",
    topic: "Python",
    difficulty: "easy",
    questionText: "Which symbol is used for single-line comments in Python?",
    options: ["#", "//", "/*", "--"],
    correctAnswer: 0,
    explanation: "# symbol is used for single-line comments in Python.",
    marks: 1,
  },
  {
    subject: "Computer Fundamentals",
    topic: "Basics",
    difficulty: "easy",
    questionText: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Program Unit", "Central Power Unit", "Core Processing Utility"],
    correctAnswer: 0,
    explanation: "CPU stands for Central Processing Unit.",
    marks: 1,
  },
  {
    subject: "Computer Fundamentals",
    topic: "Basics",
    difficulty: "easy",
    questionText: "What does RAM stand for?",
    options: ["Random Access Memory", "Read Access Module", "Rapid Action Memory", "Run Auto Memory"],
    correctAnswer: 0,
    explanation: "RAM stands for Random Access Memory.",
    marks: 1,
  },

  // --- MEDIUM (मध्यम - Simple practical concepts, not too hard) ---
  {
    subject: "Web Development",
    topic: "CSS",
    difficulty: "medium",
    questionText: "How do you select an element with ID 'navbar' in CSS?",
    options: ["#navbar", ".navbar", "navbar", "*navbar"],
    correctAnswer: 0,
    explanation: "'#' is the ID selector in CSS.",
    marks: 1,
  },
  {
    subject: "Web Development",
    topic: "JavaScript",
    difficulty: "medium",
    questionText: "What does the '===' operator do in JavaScript?",
    options: ["Compares both value and type strictly", "Assigns a variable value", "Checks only value with conversion", "Checks if undefined"],
    correctAnswer: 0,
    explanation: "=== checks equality without type coercion.",
    marks: 1,
  },
  {
    subject: "Web Development",
    topic: "JavaScript",
    difficulty: "medium",
    questionText: "What is the result of typeof [1, 2, 3] in JavaScript?",
    options: ["object", "array", "list", "undefined"],
    correctAnswer: 0,
    explanation: "Arrays in JavaScript are of type 'object'.",
    marks: 1,
  },
  {
    subject: "Python Programming",
    topic: "Python",
    difficulty: "medium",
    questionText: "Which of the following is an immutable data type in Python?",
    options: ["Tuple", "List", "Dictionary", "Set"],
    correctAnswer: 0,
    explanation: "Tuples cannot be altered once created.",
    marks: 1,
  },
  {
    subject: "Python Programming",
    topic: "Python",
    difficulty: "medium",
    questionText: "Which keyword defines a function in Python?",
    options: ["def", "function", "fn", "define"],
    correctAnswer: 0,
    explanation: "'def' keyword is used to define functions.",
    marks: 1,
  },
  {
    subject: "Database & SQL",
    topic: "SQL",
    difficulty: "medium",
    questionText: "Which SQL clause is used to filter records?",
    options: ["WHERE", "FILTER", "HAVING", "LIMIT"],
    correctAnswer: 0,
    explanation: "WHERE clause filters rows based on condition.",
    marks: 1,
  },
  {
    subject: "Web Development",
    topic: "HTTP",
    difficulty: "medium",
    questionText: "Which HTTP status code indicates 'Not Found'?",
    options: ["404", "200", "500", "403"],
    correctAnswer: 0,
    explanation: "404 indicates resource was not found.",
    marks: 1,
  },

  // --- HARD (कठिन लेकिन संतुलित - Moderate challenge, short & clear, NOT overly difficult) ---
  {
    subject: "Web Development",
    topic: "JavaScript",
    difficulty: "hard",
    questionText: "What will Boolean('') return in JavaScript?",
    options: ["false", "true", "undefined", "null"],
    correctAnswer: 0,
    explanation: "An empty string is a falsy value in JavaScript.",
    marks: 1,
  },
  {
    subject: "Web Development",
    topic: "JavaScript",
    difficulty: "hard",
    questionText: "What is the output of: 2 + '2' in JavaScript?",
    options: ["'22'", "4", "NaN", "Error"],
    correctAnswer: 0,
    explanation: "Number + String results in string concatenation ('22').",
    marks: 1,
  },
  {
    subject: "Python Programming",
    topic: "Python",
    difficulty: "hard",
    questionText: "What is the output of: len(set([1, 2, 2, 3])) in Python?",
    options: ["3", "4", "2", "Error"],
    correctAnswer: 0,
    explanation: "Set removes duplicate values, leaving {1, 2, 3} of length 3.",
    marks: 1,
  },
  {
    subject: "Database & SQL",
    topic: "SQL",
    difficulty: "hard",
    questionText: "Which SQL constraint uniquely identifies each record in a table?",
    options: ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE ONLY", "INDEX"],
    correctAnswer: 0,
    explanation: "PRIMARY KEY uniquely identifies each table record and cannot be null.",
    marks: 1,
  },
  {
    subject: "Programming",
    topic: "Logic",
    difficulty: "hard",
    questionText: "Which loop runs its body at least once even if the condition is false?",
    options: ["do-while loop", "while loop", "for loop", "for-each loop"],
    correctAnswer: 0,
    explanation: "A do-while loop evaluates its condition after executing once.",
    marks: 1,
  },
];

export function distributeAndShuffleOptions<
  T extends {
    options?: string[];
    correctAnswer?: any;
    questionType?: string;
  }
>(questions: T[]): T[] {
  let lastAssignedSlot = -1;

  return questions.map((q) => {
    // Only shuffle single-choice MCQ with >= 2 options
    if (
      !q.options ||
      q.options.length < 2 ||
      (q.questionType && q.questionType !== "mcq" && q.questionType !== "single-correct")
    ) {
      return q;
    }

    const originalOptions = [...q.options];
    const totalOpts = originalOptions.length;
    const currentCorrectIdx = Number(q.correctAnswer);

    // If invalid index, keep original
    if (
      isNaN(currentCorrectIdx) ||
      currentCorrectIdx < 0 ||
      currentCorrectIdx >= totalOpts
    ) {
      return q;
    }

    const correctOptionText = originalOptions[currentCorrectIdx];
    const distractors = originalOptions.filter((_, idx) => idx !== currentCorrectIdx);

    // Shuffle distractors with Fisher-Yates
    for (let i = distractors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
    }

    // Choose target slot: must be different from lastAssignedSlot
    const candidateSlots: number[] = [];
    for (let s = 0; s < totalOpts; s++) {
      if (s !== lastAssignedSlot) {
        candidateSlots.push(s);
      }
    }

    const chosenSlot =
      candidateSlots[Math.floor(Math.random() * candidateSlots.length)] ??
      (lastAssignedSlot + 1) % totalOpts;

    lastAssignedSlot = chosenSlot;

    // Place correct option in chosenSlot, distractors in remaining slots
    const newOptions: string[] = new Array(totalOpts);
    newOptions[chosenSlot] = correctOptionText;

    let distractorIdx = 0;
    for (let s = 0; s < totalOpts; s++) {
      if (s !== chosenSlot) {
        newOptions[s] = distractors[distractorIdx++];
      }
    }

    return {
      ...q,
      options: newOptions,
      correctAnswer: chosenSlot,
    };
  });
}

export function getCuratedQuestionsByLevel(
  subject: string,
  level: "easy" | "medium" | "hard" | "all" = "all",
  count = 5
): BasicQuestionTemplate[] {
  let pool = BASIC_SUBJECT_QUESTIONS;

  if (level !== "all") {
    pool = pool.filter((q) => q.difficulty === level);
    if (pool.length === 0) pool = BASIC_SUBJECT_QUESTIONS;
  }

  // Filter by subject if specified
  const s = (subject || "").toLowerCase();
  const subjectMatches = pool.filter((q) =>
    q.subject.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s)
  );
  if (subjectMatches.length > 0) {
    pool = subjectMatches;
  }

  // Randomize pool order so questions don't always appear in the same sequence
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);

  const results: BasicQuestionTemplate[] = [];
  for (let i = 0; i < count; i++) {
    results.push(shuffledPool[i % shuffledPool.length]);
  }

  // Distribute options so correct answers are varied across A, B, C, D with no consecutive repeats
  return distributeAndShuffleOptions(results);
}
