// Using built-in fetch (Node 18+)

const internships = [
    {
        title: "Frontend Developer Intern",
        company: "Webory Tech",
        location: "Remote",
        type: "Full-time",
        stipend: "$500 - $1000 / month",
        price: 99,
        tags: ["React", "Tailwind", "TypeScript"],
        description: "Join our frontend team to build modern web applications."
    },
    {
        title: "UI/UX Design Intern",
        company: "Creative Studio",
        location: "Remote",
        type: "Part-time",
        stipend: "$300 - $600 / month",
        price: 49,
        tags: ["Figma", "Prototyping", "User Research"],
        description: "Design beautiful interfaces and user experiences."
    },
    {
        title: "Backend Developer Intern",
        company: "DataSystems Inc",
        location: "Bangalore, India",
        type: "Full-time",
        stipend: "₹15,000 - ₹25,000 / month",
        price: 149,
        tags: ["Node.js", "MongoDB", "API Design"],
        description: "Build robust backend systems and APIs."
    }
];

async function seed() {
    console.log("Seeding internships...");
    for (const internship of internships) {
        try {
            const res = await fetch('http://localhost:3000/api/internships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(internship)
            });
            const data = await res.json();
            console.log(`Created: ${data.internship?.title}`);
        } catch (e) {
            console.error(`Failed to create ${internship.title}`, e);
        }
    }
    console.log("Done!");
}

seed();
