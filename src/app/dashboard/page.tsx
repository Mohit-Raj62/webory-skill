import { getUser } from "@/lib/get-user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await getUser();

    if (!user) {
        redirect("/login?redirect=/profile");
    }

    if (user.role === "admin") {
        redirect("/admin");
    }

    if (user.role === "teacher") {
        redirect("/teacher");
    }

    redirect("/profile");
}
