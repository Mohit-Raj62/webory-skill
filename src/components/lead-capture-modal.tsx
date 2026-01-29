"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";

interface LeadCaptureModalProps {
  courseId: string;
  courseName?: string;
}

export function LeadCaptureModal({ courseId, courseName }: LeadCaptureModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const pathname = usePathname();

  useEffect(() => {
    // If user is already logged in, do not show this modal
    if (user) return;

    // Check if we have already captured a lead or dismissed recently
    const leadCaptured = localStorage.getItem("lead_captured");
    const dismissedTime = localStorage.getItem("lead_dismissed_time");
    
    // 24 hours cooldown for dismissed modal
    const isDismissedRecently = dismissedTime && 
      (Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000);

    if (!leadCaptured && !isDismissedRecently) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 15000); // 15 seconds delay

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          courseId,
          pageUrl: window.location.href,
        }),
      });

      if (res.ok) {
        localStorage.setItem("lead_captured", "true");
        setOpen(false);
        // Could show a toast here "Thanks! We'll call you shortly."
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // If closed without submitting, set a temporary dismissal
      localStorage.setItem("lead_dismissed_time", Date.now().toString());
    }
  };

  if (user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Need Help with {courseName || "this Course"}?</DialogTitle>
          <DialogDescription>
            Get the full syllabus, fee details, and career guidance from our expert counselors.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter mobile number"
                type="tel"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Get Free Consultation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
