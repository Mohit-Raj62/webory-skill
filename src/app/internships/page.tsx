import { getUser } from "@/lib/get-user";
import dbConnect from "@/lib/db";
import Internship from "@/models/Internship";
import Application from "@/models/Application";
import { InternshipsView } from "@/components/internships/internships-view";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

async function getCachedInternshipsData() {
    try {
        await dbConnect();
        const internships = await Internship.find({ isActive: { $ne: false } })
            .select("title slug company location type stipend tags price originalPrice gstPercentage requirements responsibilities isFree description duration deadline perks tagline totalSeats filledSeats benefits hasTiers tiers modules")
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(internships));
    } catch (error) {
        console.error("Failed to fetch internships:", error);
        return [];
    }
}

const getCachedUserApplications = unstable_cache(
    async (userId: string) => {
        try {
            await dbConnect();
            const applications = await Application.find({ student: userId, status: { $ne: 'rejected' } })
                .select("internship status transactionId amountPaid appliedAt")
                .lean();
            return applications.map((a: any) => ({
                internshipId: a.internship.toString(),
                status: a.status,
                transactionId: a.transactionId,
                amountPaid: a.amountPaid,
                appliedAt: a.appliedAt
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

    const internships = Array.isArray(internshipsData) ? internshipsData : [];

    return <InternshipsView internships={internships} user={user} userApplications={userApplications as any} />;
}
