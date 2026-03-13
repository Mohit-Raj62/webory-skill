"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Send, Upload, X, Copy, Check, Bell } from "lucide-react";

const EMAIL_TEMPLATES = [
    {
        name: "Special Offer",
        subject: "🎉 Special Offer - Limited Time Only!",
        message: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Special Offer Just For You!</h1>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
        <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi {{name}},</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            We're excited to announce a <strong>limited-time offer</strong> exclusively for our valued students!
        </p>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; font-size: 18px; color: #92400e; font-weight: bold;">
                Get 30% OFF on all courses!
            </p>
            <p style="margin: 10px 0 0 0; color: #78350f;">
                Use code: <strong>SPECIAL30</strong>
            </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://weboryskills.in/courses" style="background-color: #2563eb; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
                Browse Courses
            </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Hurry! This offer expires in 48 hours.
        </p>
        <p style="font-size: 16px; color: #333; margin-top: 20px;">
            Best Regards,<br/>
            <strong>Webory Skills Team</strong>
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© 2025 Webory Skills. All rights reserved.</p>
    </div>
</div>`
    },
    {
        name: "New Course Announcement",
        subject: "📚 New Course Alert - Start Learning Today!",
        message: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
    <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">📚 New Course Available!</h1>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
        <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi {{name}},</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            We're thrilled to announce our latest course that will help you master new skills!
        </p>
        
        <div style="background: #f0fdf4; border: 2px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 10px;">
            <h2 style="color: #16a34a; margin: 0 0 10px 0; font-size: 22px;">Advanced Web Development</h2>
            <p style="color: #333; margin: 0; line-height: 1.6;">
                Learn modern web development with React, Next.js, and TypeScript. Build production-ready applications.
            </p>
            <ul style="color: #333; line-height: 1.8; margin-top: 15px;">
                <li>40+ hours of video content</li>
                <li>Hands-on projects</li>
                <li>Certificate upon completion</li>
                <li>Lifetime access</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://weboryskills.in/courses" style="background-color: #16a34a; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
                Enroll Now
            </a>
         </div>
         <p style="font-size: 16px; color: #333; margin-top: 20px;">
            Best Regards,<br/>
            <strong>Webory Skills Team</strong>
         </p>
         </div>
        
         <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
         <p>© 2025 Webory Skills. All rights reserved.</p>
         </div>
    </div>`
    },
    {
    name: "Account Welcome",
    subject: "👋 Welcome to Webory Skills",
    message: `<div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; padding:20px; background:#f9fafb;">
    <div style="background:linear-gradient(135deg,#0284c7 0%,#0369a1 100%); padding:30px; border-radius:10px; text-align:center;">
        <h1 style="color:white; margin:0; font-size:26px;">👋 Welcome Webory Skills</h1>
    </div>

    <div style="background:white; padding:30px; border-radius:10px; margin-top:20px;">
        <p style="font-size:16px; color:#333;">Hi {{name}},</p>

        <p style="font-size:16px; color:#333; line-height:1.6;">
            Welcome to Webory Skills. Your learning journey starts here.
        </p>

        <ul style="color:#333; line-height:1.8;">
            <li>Access skill-based courses</li>
            <li>Join internships and live sessions</li>
            <li>Earn verifiable certificates</li>
        </ul>

        <div style="text-align:center; margin:30px 0;">
            <a href="https://weboryskills.in/" style="background:#0284c7; color:#fff; padding:14px 36px; text-decoration:none; border-radius:5px; font-weight:bold;">
                Go to Dashboard
            </a>
        </div>

        <p style="color:#333;">Let’s get started,<br/><strong>Webory Skills Team</strong></p>
    </div>

    <div style="text-align:center; padding:20px; color:#999; font-size:12px;">
        © 2025 Webory Skills. All rights reserved.
    </div>
</div>`
},
{
        name: "Event Invitation",
        subject: "🎯 You're Invited - Live Webinar This Weekend!",
        message: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
    <div style="background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎯 You're Invited!</h1>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
        <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi there,</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Join us for an exclusive live webinar this weekend!
        </p>
        
        <div style="background: #faf5ff; border-left: 4px solid #9333ea; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #9333ea; margin: 0 0 10px 0; font-size: 20px;">Career Growth in Tech - 2024</h2>
            <p style="color: #333; margin: 5px 0;"><strong>📅 Date:</strong> Saturday, 10:00 AM IST</p>
            <p style="color: #333; margin: 5px 0;"><strong>⏱️ Duration:</strong> 2 hours</p>
            <p style="color: #333; margin: 5px 0;"><strong>🎤 Speaker:</strong> Industry Expert</p>
        </div>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            <strong>What you'll learn:</strong>
        </p>
        <ul style="color: #333; line-height: 1.8;">
            <li>Latest industry trends</li>
            <li>Career advancement strategies</li>
            <li>Q&A session with experts</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://weboryskills.in/" style="background-color: #9333ea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
                Register Now
            </a>
        </div>
        
        <p style="font-size: 16px; color: #333; margin-top: 20px;">
            Best Regards,<br/>
            <strong>Webory Skills Team</strong>
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© 2025 Webory Skills. All rights reserved.</p>
    </div>
</div>`
    },
    {
    name: "Internship Opportunity",
    subject: "💼 Apply Now – Internship Opportunities at Webory",
    message: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
    <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">💼 Internship Openings</h1>
    </div>

    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
        <p style="font-size: 16px; color: #333;">Hello,</p>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Kickstart your career with real-world internship experience at Webory.
        </p>

        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #16a34a; margin-bottom: 10px;">Available Roles</h2>
            <p style="margin: 5px 0;">• Web Development</p>
            <p style="margin: 5px 0;">• UI/UX Design</p>
            <p style="margin: 5px 0;">• Digital Marketing</p>
        </div>

        <ul style="color: #333; line-height: 1.8;">
            <li>Live projects</li>
            <li>Mentorship from experts</li>
            <li>Internship certificate</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://weboryskills.in/" style="background-color: #16a34a; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Apply Now
            </a>
        </div>

        <p style="font-size: 16px; color: #333;">
            Warm regards,<br/>
            <strong>Webory Skills Team</strong>
        </p>
    </div>

    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© 2025 Webory Skills. All rights reserved.</p>
    </div>
</div>`
},
{
    name: "Workshop Reminder",
    subject: "⏰ Reminder – Hands-on Workshop Starts Tomorrow",
    message: `<div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px; background:#f9fafb;">
    <div style="background:linear-gradient(135deg,#0f766e 0%,#115e59 100%); padding:30px; border-radius:10px; text-align:center;">
        <h1 style="color:#fff; margin:0; font-size:26px;">⏰ Workshop Reminder</h1>
    </div>

    <div style="background:#fff; padding:30px; border-radius:10px; margin-top:20px;">
        <p style="font-size:16px; color:#333;">Hi {{name}},</p>

        <p style="font-size:16px; color:#333; line-height:1.6;">
            This is a quick reminder for the hands-on workshop you registered for.
        </p>

        <div style="background:#f0fdfa; border-left:4px solid #0f766e; padding:20px; margin:20px 0; border-radius:5px;">
            <h2 style="color:#0f766e; margin-bottom:10px;">Build Your First Web App</h2>
            <p><strong>📅 Date:</strong> Tomorrow</p>
            <p><strong>⏰ Time:</strong> 7:00 PM IST</p>
            <p><strong>💻 Mode:</strong> Live Online</p>
        </div>

        <div style="text-align:center; margin:30px 0;">
            <a href="https://weboryskills.in/" style="background:#0f766e; color:#fff; padding:14px 36px; text-decoration:none; border-radius:5px; font-weight:bold;">
                Join Workshop
            </a>
        </div>

        <p style="color:#333;">See you live,<br/><strong>Webory Skills Team</strong></p>
    </div>

    <div style="text-align:center; padding:20px; color:#999; font-size:12px;">
        © 2025 Webory Skills. All rights reserved.
    </div>
</div>`
},
{
    name: "Placement Drive",
    subject: "🎓 Placement Drive Alert – Get Job Ready with Webory",
    message: `<div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px; background:#f9fafb;">
    <div style="background:linear-gradient(135deg,#0f766e,#115e59); padding:30px; border-radius:10px; text-align:center;">
        <h1 style="color:#fff; margin:0;">🎓 Placement Drive</h1>
    </div>

    <div style="background:#fff; padding:30px; border-radius:10px; margin-top:20px;">
        <p style="font-size:16px; color:#333;">Hi {{name}},</p>
        <p style="font-size:16px; color:#333; line-height:1.6;">
            We’re excited to announce an upcoming placement drive exclusively for Webory learners.
        </p>

        <div style="background:#ecfeff; border-left:4px solid #0f766e; padding:20px; margin:20px 0; border-radius:5px;">
            <p><strong>📍 Mode:</strong> Online</p>
            <p><strong>🏢 Companies:</strong> Startups & Tech Firms</p>
            <p><strong>📄 Eligibility:</strong> Skill Course Completed</p>
        </div>

        <div style="text-align:center; margin:30px 0;">
            <a href="https://weboryskills.in/" style="background:#0f766e; color:#fff; padding:15px 40px; text-decoration:none; border-radius:5px; font-weight:bold;">
                Register Now
            </a>
        </div>

        <p>Regards,<br/><strong>Webory Skills Team</strong></p>
    </div>
    </div>`
},
{
    name: "Product + Content Newsletter",
    subject: "✨ New Skills, New Internships, New You",
    message: `<div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #f3f4f6; padding: 20px;">
    
    <div style="background-color: #1f2933; padding: 25px; border-radius: 8px;">
        <h1 style="color: #ffffff; margin: 0;">Webory Update</h1>
        <p style="color: #d1d5db; margin-top: 8px;">What's new this week</p>
    </div>

    <div style="background-color: #ffffff; padding: 30px; margin-top: 20px; border-radius: 8px;">
        <h2 style="color: #111827;">📌 Top Stories</h2>

        <p style="color: #374151;">
            <strong>New Internship Tracks</strong><br/>
            Apply for Web Dev, AI Tools, and Digital Marketing internships.
        </p>

        <p style="color: #374151;">
            <strong>Skill Tip of the Week</strong><br/>
            Build small projects regularly. Consistency beats intensity.
        </p>

        <p style="color: #374151;">
            <strong>Upcoming Live Class</strong><br/>
            Resume + Portfolio Review with mentors this Saturday.
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://weboryskills.in/" style="background-color: #7c3aed; color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Join Live Session
            </a>
        </div>

        <p style="color: #374151;">
            Learn something new today,<br/>
            <strong>Webory Skills Team</strong>
        </p>
    </div>

    <div style="text-align: center; padding: 15px; font-size: 12px; color: #9ca3af;">
        © 2025 Webory Skills · Manage preferences
    </div>
</div>`
},
{
    name: "Free Workshop Reminder",
    subject: "🎓 Don’t Miss It – Free Skill Workshop Tomorrow",
    message: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
    <div style="background: linear-gradient(135deg, #0f766e 0%, #115e59 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎓 Free Workshop</h1>
    </div>

    <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
        <p style="font-size: 16px; color: #333;">Hi {{name}},</p>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            A quick reminder about our free live workshop happening tomorrow.
        </p>

        <div style="background: #f0fdfa; border-left: 4px solid #0f766e; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #0f766e; margin-bottom: 10px;">Build Your First Web App</h2>
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> Tomorrow</p>
            <p style="margin: 5px 0;"><strong>⏰ Time:</strong> 7:00 PM IST</p>
            <p style="margin: 5px 0;"><strong>💻 Mode:</strong> Live Online</p>
        </div>

        <ul style="color: #333; line-height: 1.8;">
            <li>No prior experience needed</li>
            <li>Live coding session</li>
            <li>Free participation certificate</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://weboryskills.in/" style="background-color: #0f766e; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Join Workshop
            </a>
        </div>

        <p style="font-size: 16px; color: #333;">
            See you live,<br/>
            <strong>Webory Skills Team</strong>
        </p>
    </div>
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© 2025 Webory Skills. All rights reserved.</p>
    </div>
</div>`
}

];

const PUSH_TEMPLATES = [
    {
        name: "New Course Alert",
        subject: "📚 New Course Available!",
        message: "Check out our latest course: Advanced Web Development. Start learning today!"
    },
    {
        name: "Special Discount",
        subject: "🔥 30% Discount for YOU",
        message: "Unlock 30% off on all courses today! Use code: SPECIAL30. Explore now."
    },
    {
        name: "Workshop Session",
        subject: "⏰ Workshop Starting Soon",
        message: "Our live workshop starts in 1 hour. Don't miss out, join the session now!"
    },
    {
        name: "Internship Opening",
        subject: "💼 New Internship Live",
        message: "Apply for our New Web Development Internship. Real projects, real experience."
    }
];

export default function BroadcastPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [pushImage, setPushImage] = useState("");
    const [isPushImageAuto, setIsPushImageAuto] = useState(true);
    const [loading, setLoading] = useState<string | null>(null); // 'email', 'push', 'both' or null
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [copiedEmailTemplate, setCopiedEmailTemplate] = useState<number | null>(null);
    const [copiedPushTemplate, setCopiedPushTemplate] = useState<number | null>(null);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSend = async (mode: "email" | "push" | "both") => {
        setLoading(mode);
        setStatus(null);

        const finalPushImage = pushImage || (isPushImageAuto && uploadedImages.length > 0 ? uploadedImages[0] : "");

        try {
            const res = await fetch("/api/admin/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message, mode, pushImage: finalPushImage }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send broadcast");

            setStatus({ type: "success", message: data.message });
            setSubject("");
            setMessage("");
            setUploadedImages([]);
            setPushImage("");
        } catch (error: any) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setLoading(null);
        }
    };

    const handleImageUpload = (result: any) => {
        const imageUrl = result.info.secure_url;
        setUploadedImages([...uploadedImages, imageUrl]);
        
        if (uploadedImages.length === 0 && isPushImageAuto) {
            setPushImage(imageUrl);
        }

        // Insert image HTML with email-safe attributes
        const imageHtml = `\n<div style="text-align: center; margin: 20px 0;">\n  <img src="${imageUrl}" alt="Image" style="max-width: 600px; width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px;" />\n</div>\n`;
        setMessage(message + imageHtml);
    };

    const removeImage = (index: number) => {
        const removedImage = uploadedImages[index];
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        if (pushImage === removedImage) {
            setPushImage("");
        }
    };

    const copyEmailTemplate = (index: number) => {
        const template = EMAIL_TEMPLATES[index];
        setSubject(template.subject);
        setMessage(template.message);
        setCopiedEmailTemplate(index);
        setTimeout(() => setCopiedEmailTemplate(null), 2000);
    };

    const copyPushTemplate = (index: number) => {
        const template = PUSH_TEMPLATES[index];
        setSubject(template.subject);
        setMessage(template.message);
        setCopiedPushTemplate(index);
        setTimeout(() => setCopiedPushTemplate(null), 2000);
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-white">Broadcast Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Templates */}
                <Card className="bg-gray-900 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="w-5 h-5 text-blue-400" />
                            Email Templates (HTML)
                        </CardTitle>
                        <CardDescription>
                            Rich templates for email announcements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {EMAIL_TEMPLATES.map((template, index) => (
                                <div key={index} className="bg-gray-800 p-3 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors">
                                    <h3 className="font-semibold text-xs text-white mb-1">{template.name}</h3>
                                    <Button
                                        onClick={() => copyEmailTemplate(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-[10px] h-8 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                                    >
                                        {copiedEmailTemplate === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3 mr-1" />}
                                        {copiedEmailTemplate === index ? "Copied" : "Use Email Template"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Push Templates */}
                <Card className="bg-gray-900 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <Bell className="w-5 h-5 text-purple-400" />
                            Push Message Templates (Text)
                        </CardTitle>
                        <CardDescription>
                            Short, catchy text notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {PUSH_TEMPLATES.map((template, index) => (
                                <div key={index} className="bg-gray-800 p-3 rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors">
                                    <h3 className="font-semibold text-xs text-white mb-1">{template.name}</h3>
                                    <p className="text-[10px] text-gray-500 line-clamp-1 mb-2">{template.message}</p>
                                    <Button
                                        onClick={() => copyPushTemplate(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-[10px] h-8 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
                                    >
                                        {copiedPushTemplate === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3 mr-1" />}
                                        {copiedPushTemplate === index ? "Copied" : "Use Push Template"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Broadcast Form */}
            <Card className="bg-gray-900 border-white/10 text-white shadow-xl">
                <CardHeader>
                    <CardTitle>Compose Message</CardTitle>
                    <CardDescription>
                        Customise your message and choose how to send it.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-gray-300">Subject / Title</Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter subject for email or title for push"
                                required
                                className="bg-gray-800 border-white/10 text-white focus:ring-blue-500 h-11"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="message" className="text-gray-300">Message Content</Label>
                                <span className="text-[10px] text-gray-500">HTML supported for Email</span>
                            </div>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your message here..."
                                required
                                className="w-full min-h-[250px] rounded-md border border-white/10 bg-gray-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 text-white font-mono"
                            />
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                <p className="text-[10px] text-blue-400 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Use {"{{name}}"} for personalization
                                </p>
                                <p className="text-[10px] text-purple-400 flex items-center gap-1">
                                    <Bell className="w-3 h-3" /> Push will use first 200 chars (text only)
                                </p>
                            </div>
                        </div>

                        {/* Push Notification Image Support */}
                        <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
                            <Label className="text-purple-400 mb-2 flex items-center gap-2">
                                <Bell className="w-4 h-4" />
                                Push Notification Image (Large View)
                            </Label>
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-3">
                                    {uploadedImages.map((img, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => {
                                                setPushImage(img);
                                                setIsPushImageAuto(false);
                                            }}
                                            className={`relative cursor-pointer group rounded-lg overflow-hidden border-2 transition-all ${pushImage === img ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-white/5 hover:border-white/20'}`}
                                        >
                                            <img src={img} className="w-16 h-16 object-cover" />
                                            {pushImage === img && (
                                                <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                                                    <Check className="w-6 h-6 text-white drop-shadow-md" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    <div className="flex flex-col justify-center gap-2">
                                        <Button
                                            onClick={() => {
                                                setPushImage("");
                                                setIsPushImageAuto(false);
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className={`text-[10px] h-7 ${!pushImage ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500'}`}
                                        >
                                            No Image
                                        </Button>
                                        <div className="flex items-center gap-2 px-2">
                                            <input 
                                                type="checkbox" 
                                                id="auto-push" 
                                                checked={isPushImageAuto} 
                                                onChange={(e) => setIsPushImageAuto(e.target.checked)}
                                                className="w-3 h-3 accent-purple-600"
                                            />
                                            <label htmlFor="auto-push" className="text-[10px] text-gray-400 cursor-pointer">Auto Use 1st Image</label>
                                        </div>
                                    </div>
                                </div>
                                {pushImage && (
                                    <div className="bg-gray-900/50 p-2 rounded-lg border border-white/5 flex items-center gap-3">
                                        <img src={pushImage} className="w-12 h-12 rounded object-cover" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[10px] text-gray-300 font-medium truncate">Selected for Push</p>
                                            <p className="text-[8px] text-gray-500 truncate">{pushImage}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setPushImage("")} className="text-red-400 hover:text-red-300">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Upload for Email Assets */}
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
                            <Label className="text-amber-400 mb-2 flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Email & Push Assets (Images)
                            </Label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    try {
                                        const res = await fetch("/api/upload/image", {
                                            method: "POST",
                                            body: formData,
                                        });
                                        if (res.ok) {
                                            const data = await res.json();
                                            handleImageUpload({ info: { secure_url: data.url } });
                                        }
                                    } catch (error) {
                                        console.error("Upload error:", error);
                                    }
                                }}
                                className="w-full bg-gray-900 border border-white/10 rounded-lg p-2 text-xs text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-amber-600 file:text-white cursor-pointer"
                            />
                            
                            {uploadedImages.length > 0 && (
                                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                    {uploadedImages.map((img, index) => (
                                        <div key={index} className="relative flex-shrink-0">
                                            <img src={img} className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                                            <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"><X className="h-2 w-2 text-white" /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {status && (
                        <div className={`p-3 rounded-lg text-xs font-medium ${status.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                            onClick={() => handleSend("email")}
                            disabled={!!loading || !subject || !message} 
                            className="bg-blue-600 hover:bg-blue-700 flex-1 h-12 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20"
                        >
                            {loading === "email" ? <Loader2 className="animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Send Email Only
                        </Button>
                        <Button 
                            onClick={() => handleSend("push")}
                            disabled={!!loading || !subject || !message} 
                            className="bg-purple-600 hover:bg-purple-700 flex-1 h-12 rounded-xl text-xs font-bold shadow-lg shadow-purple-900/20"
                        >
                            {loading === "push" ? <Loader2 className="animate-spin" /> : <Bell className="mr-2 h-4 w-4" />}
                            Send Push Only
                        </Button>
                        <Button 
                            onClick={() => handleSend("both")}
                            disabled={!!loading || !subject || !message} 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 flex-1 h-12 rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/20"
                        >
                            {loading === "both" ? <Loader2 className="animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            Send Both (Email + Push)
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
