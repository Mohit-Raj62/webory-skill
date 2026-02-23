import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Loader2, UserPlus, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  instructor?: string; // ID of the primary instructor
  coInstructors?: string[]; // IDs of co-instructors
}

interface ManageCourseTeachersModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSuccess: () => void;
}

export function ManageCourseTeachersModal({
  isOpen,
  onClose,
  course,
  onSuccess,
}: ManageCourseTeachersModalProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State to hold the current selection of co-instructor IDs
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  
  // Primary instructor cannot be removed from here, just displayed
  const primaryInstructorId = course?.instructor;

  useEffect(() => {
    if (isOpen && course) {
      fetchTeachers();
      setSelectedTeacherIds(course.coInstructors || []);
      setSearchTerm("");
    }
  }, [isOpen, course]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Fetch all users with role 'teacher'
      // Use a high limit to get all for now, or implement pagination within modal if > 100 teachers
      const res = await fetch("/api/admin/users?role=teacher&limit=100");
      if (res.ok) {
        const data = await res.json();
        setTeachers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTeacher = (teacherId: string) => {
    // Cannot toggle the primary instructor from the co-instructors list
    if (teacherId === primaryInstructorId) return;

    setSelectedTeacherIds((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSave = async () => {
    if (!course) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coInstructors: selectedTeacherIds }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert("Failed to update teachers list");
      }
    } catch (error) {
      console.error("Error saving teachers:", error);
      alert("Error saving teachers");
    } finally {
      setSaving(false);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] bg-[#111] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="text-blue-400" />
            Manage Teachers
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-1">
            Assign or remove teachers for <span className="text-white font-semibold">{course.title}</span>.
          </p>
        </DialogHeader>

        <div className="py-2">
          {/* Search box */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search teachers by name or email..."
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Teacher List */}
          <div className="border border-white/10 rounded-lg overflow-hidden flex flex-col h-[300px] bg-black/20">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                <p>No teachers found.</p>
                {searchTerm && <p className="text-sm mt-1">Try a different search term.</p>}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredTeachers.map((teacher) => {
                  const isPrimary = teacher._id === primaryInstructorId;
                  const isSelected = selectedTeacherIds.includes(teacher._id);

                  return (
                    <div
                      key={teacher._id}
                      onClick={() => handleToggleTeacher(teacher._id)}
                      className={`flex items-center justify-between p-3 rounded-md transition-all ${
                        isPrimary
                          ? "bg-blue-900/10 border border-blue-500/20 cursor-not-allowed opacity-80"
                          : "hover:bg-white/5 cursor-pointer border border-transparent"
                      } ${isSelected && !isPrimary ? "bg-white/5 border-white/10" : ""}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-white flex items-center gap-2">
                          {teacher.firstName} {teacher.lastName}
                          {isPrimary && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] px-1.5 py-0 h-4">
                              Primary
                            </Badge>
                          )}
                          {isSelected && !isPrimary && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-1.5 py-0 h-4">
                              Co-Instructor
                            </Badge>
                          )}
                        </span>
                        <span className="text-xs text-gray-400">{teacher.email}</span>
                      </div>
                      
                      <div className="ml-4">
                        {isPrimary ? (
                           <Check className="w-5 h-5 text-blue-500 opacity-50" />
                        ) : (
                          <div className={`w-5 h-5 rounded-sm flex items-center justify-center border transition-all ${
                            isSelected 
                              ? "bg-blue-600 border-blue-600" 
                              : "border-gray-600 bg-black/50"
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="mt-3 text-xs text-gray-500 flex justify-between items-center px-1">
             <span>{selectedTeacherIds.length} co-instructor(s) selected</span>
             <span>Primary instructor cannot be removed here.</span>
          </div>
        </div>

        <DialogFooter className="border-t border-white/10 pt-4 mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={saving}
            className="hover:bg-white/5 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
