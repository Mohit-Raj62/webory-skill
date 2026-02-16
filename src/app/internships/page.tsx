import { getUser } from "@/lib/get-user";
import dbConnect from "@/lib/db";
import Internship from "@/models/Internship";
import Application from "@/models/Application";
import { InternshipsView } from "@/components/internships/internships-view";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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
            const internships = await Internship.find({})
                .select("title company location type stipend tags price requirements responsibilities")
                .sort({ createdAt: -1 })
                .lean();
            return JSON.parse(JSON.stringify(internships));
        } catch (error) {
            console.error("Failed to fetch internships:", error);
            return null;
        }
    },
    ['internships-list'],
    { revalidate: 300, tags: ['internships'] }
);

const getCachedUserApplications = unstable_cache(
    async (userId: string) => {
        try {
            await dbConnect();
            const applications = await Application.find({ student: userId, status: { $ne: 'rejected' } })
                .select("internship status")
                .lean();
            return applications.map((a: any) => ({
                internshipId: a.internship.toString(),
                status: a.status
            }));
        } catch (error) {
            console.error("Failed to fetch applications:", error);
            return [];
        }
    },
    ['user-applications'],
    { revalidate: 3600, tags: ['user-applications'] }
);

export default async function InternshipsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let userId: string | null = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
            userId = decoded.userId;
        } catch (e) {}
    }

    const [user, internshipsData, userApplications] = await Promise.all([
        getUser(),
        getCachedInternshipsData(),
        userId ? getCachedUserApplications(userId) : Promise.resolve([])
    ]);

    const internships = (internshipsData && internshipsData.length > 0) ? internshipsData : fallbackInternships;

    return <InternshipsView internships={internships} user={user} userApplications={userApplications as any} />;
}
