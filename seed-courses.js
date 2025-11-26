// Using built-in fetch (Node 18+)

const courses = [
    {
        title: "Full Stack Development",
        icon: "Globe",
        level: "Advanced",
        studentsCount: "2.5k+",
        color: "from-blue-500 to-cyan-500",
        description: "Master the MERN stack and build scalable web applications.",
        price: 4999,
        curriculum: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB"]
    },
    {
        title: "UI/UX Design",
        icon: "Palette",
        level: "Intermediate",
        studentsCount: "1.8k+",
        color: "from-purple-500 to-pink-500",
        description: "Learn design principles, Figma, and create stunning interfaces.",
        price: 3999,
        curriculum: ["Design Theory", "Figma", "Prototyping", "User Research"]
    },
    {
        title: "Data Science Fundamentals",
        icon: "Database",
        level: "Beginner",
        studentsCount: "1.2k+",
        color: "from-green-500 to-emerald-500",
        description: "Introduction to Python, Pandas, and Machine Learning basics.",
        price: 2999,
        curriculum: ["Python", "Pandas", "NumPy", "Scikit-learn"]
    }
];

async function seed() {
    console.log("Seeding courses...");
    for (const course of courses) {
        try {
            const res = await fetch('http://localhost:3000/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(course)
            });
            const data = await res.json();
            console.log(`Created: ${data.course?.title}`);
        } catch (e) {
            console.error(`Failed to create ${course.title}`, e);
        }
    }
    console.log("Done!");
}

seed();
