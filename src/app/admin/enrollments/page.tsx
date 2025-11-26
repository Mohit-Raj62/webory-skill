"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Enrollment {
    _id: string;
    student: {
        firstName: string;
        lastName: string;
        email: string;
    };
    course: {
        title: string;
    };
    progress: number;
    completed: boolean;
    enrolledAt: string;
}

export default function AdminEnrollmentsPage() {
    const [enrollments, setEnrollments] = useState < Enrollment[] > ([]);
    const [loading, setLoading] = useState(true);
    const [editingEnrollment, setEditingEnrollment] = useState < Enrollment | null > (null);
    const [editForm, setEditForm] = useState({
        progress: 0,
        completed: false,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const res = await fetch("/api/admin/enrollments");
            if (res.ok) {
                const data = await res.json();
                setEnrollments(data.enrollments);
            } else {
                toast.error("Failed to fetch enrollments");
            }
        } catch (error) {
            console.error("Error fetching enrollments:", error);
            toast.error("Error fetching enrollments");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (enrollment: Enrollment) => {
        setEditingEnrollment(enrollment);
        setEditForm({
            progress: enrollment.progress,
            completed: enrollment.completed,
        });
    };

    const handleSave = async () => {
        if (!editingEnrollment) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/enrollments/${editingEnrollment._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (res.ok) {
                toast.success("Enrollment updated successfully");
                setEditingEnrollment(null);
                fetchEnrollments(); // Refresh list
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update enrollment");
            }
        } catch (error) {
            console.error("Error updating enrollment:", error);
            toast.error("Error updating enrollment");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Course Enrollments</h1>
            </div>

            <div className="rounded-md border border-gray-800 bg-gray-900/50 overflow-x-auto">
                <div className="min-w-[800px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800 hover:bg-gray-900/50">
                                <TableHead className="text-gray-400">Student</TableHead>
                                <TableHead className="text-gray-400">Course</TableHead>
                                <TableHead className="text-gray-400">Video Progress</TableHead>
                                <TableHead className="text-gray-400">Status</TableHead>
                                <TableHead className="text-gray-400">Enrolled Date</TableHead>
                                <TableHead className="text-gray-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrollments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-500 h-24">
                                        No enrollments found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                enrollments.map((enrollment) => (
                                    <TableRow key={enrollment._id} className="border-gray-800 hover:bg-gray-800/50">
                                        <TableCell className="font-medium text-gray-200">
                                            <div>
                                                {enrollment.student?.firstName} {enrollment.student?.lastName}
                                            </div>
                                            <div className="text-xs text-gray-500">{enrollment.student?.email}</div>
                                        </TableCell>
                                        <TableCell className="text-gray-300">{enrollment.course?.title}</TableCell>
                                        <TableCell className="text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-700 rounded-full h-2.5 max-w-[100px]">
                                                    <div
                                                        className="bg-blue-600 h-2.5 rounded-full"
                                                        style={{ width: `${enrollment.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs">{enrollment.progress}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {enrollment.completed ? (
                                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                                    Completed
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
                                                    Ongoing
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-400">
                                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditClick(enrollment)}
                                                className="text-gray-400 hover:text-white hover:bg-gray-800"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={!!editingEnrollment} onOpenChange={(open) => !open && setEditingEnrollment(null)}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit Enrollment</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Student</Label>
                            <div className="text-sm text-gray-400">
                                {editingEnrollment?.student?.firstName} {editingEnrollment?.student?.lastName}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Course</Label>
                            <div className="text-sm text-gray-400">
                                {editingEnrollment?.course?.title}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="progress">Video Progress (%)</Label>
                            <Input
                                id="progress"
                                type="number"
                                min="0"
                                max="100"
                                value={editForm.progress}
                                onChange={(e) => setEditForm({ ...editForm, progress: parseInt(e.target.value) || 0 })}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            <p className="text-xs text-gray-500">Set to 100% to unlock certificate (if Overall Score ≥ 90%)</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={editForm.completed ? "completed" : "ongoing"}
                                onValueChange={(value) => setEditForm({ ...editForm, completed: value === "completed" })}
                            >
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditingEnrollment(null)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
