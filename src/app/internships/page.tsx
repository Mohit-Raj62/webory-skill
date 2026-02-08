import { getUser } from "@/lib/get-user";
import dbConnect from "@/lib/db";
import Internship from "@/models/Internship";
import Application from "@/models/Application";
import { InternshipsView } from "@/components/internships/internships-view";
import { unstable_cache } from "next/cache";

// Remove force-dynamic to allow caching
// export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache for 5 minutes

const fallbackInternships = [
    {
        _id: "1",
        title: "Frontend Developer Intern",
        company: "Webory Tech",
        location: "Remote",
        type: "Full-time",
        stipend: "₹15,000 - ₹30,000 / month",
        tags: ["React", "Tailwind", "TypeScript"],
        price: 999 
    },
    {
        _id: "2",
        title: "UI/UX Design Intern",
        company: "Creative Studio",
        location: "Remote",
        type: "Part-time",
        stipend: "₹10,000 - ₹20,000 / month",
        tags: ["Figma", "Prototyping", "User Research"],
        price: 999
    },
];

const getCachedInternshipsData = unstable_cache(
    async () => {
        try {
            await dbConnect();
            // Optimize query with selection, sort, and lean()
            const internships = await Internship.find({})
                .select("title company location type stipend tags price")
                .sort({ createdAt: -1 })
                .lean();
            // Serialize to plain objects
            return JSON.parse(JSON.stringify(internships));
        } catch (error) {
            console.error("Failed to fetch internships:", error);
            return null;
        }
    },
    ['internships-list'],
    { revalidate: 300, tags: ['internships'] }
);

async function getUserApplications(userId: string) {
    try {
        await dbConnect();
        const applications = await Application.find({ student: userId, status: { $ne: 'rejected' } }).select("internship status").lean();
        return applications.map((a: any) => ({
            internshipId: a.internship.toString(),
            status: a.status
        }));
    } catch (error) {
        console.error("Failed to fetch applications:", error);
        return [];
    }
}

export default async function InternshipsPage() {
    const user = await getUser();
    const internshipsData = await getCachedInternshipsData();
    let userApplications: { internshipId: string; status: string }[] = [];

    if (user) {
        userApplications = await getUserApplications(user._id);
    }

    const internships = (internshipsData && internshipsData.length > 0) ? internshipsData : fallbackInternships;

    return <InternshipsView internships={internships} user={user} userApplications={userApplications} />;
}
