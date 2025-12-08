"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Send, Upload, X, Copy, Check } from "lucide-react";

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
        <p>© 2024 Webory Skills. All rights reserved.</p>
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
        <p style="font-size: 16px; color: #333; line-height: 1.6;">Hi there,</p>
        
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
        <p>© 2024 Webory Skills. All rights reserved.</p>
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
            <a href="https://weboryskills.in/live-classes" style="background-color: #9333ea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
                Register Now
            </a>
        </div>
        
        <p style="font-size: 16px; color: #333; margin-top: 20px;">
            Best Regards,<br/>
            <strong>Webory Skills Team</strong>
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© 2024 Webory Skills. All rights reserved.</p>
    </div>
</div>`
    }
];

export default function BroadcastPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("/api/admin/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send broadcast");

            setStatus({ type: "success", message: data.message });
            setSubject("");
            setMessage("");
            setUploadedImages([]);
        } catch (error: any) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (result: any) => {
        const imageUrl = result.info.secure_url;
        setUploadedImages([...uploadedImages, imageUrl]);
        
        // Insert image HTML with email-safe attributes
        const imageHtml = `\n<div style="text-align: center; margin: 20px 0;">\n  <img src="${imageUrl}" alt="Image" style="max-width: 600px; width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px;" />\n</div>\n`;
        setMessage(message + imageHtml);
    };

    const removeImage = (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
    };

    const copyTemplate = (index: number) => {
        const template = EMAIL_TEMPLATES[index];
        setSubject(template.subject);
        setMessage(template.message);
        setCopiedTemplate(index);
        setTimeout(() => setCopiedTemplate(null), 2000);
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-white">Broadcast Emails</h1>
            
            {/* Email Templates */}
            <Card className="bg-gray-900 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>
                        Quick start with pre-designed email templates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {EMAIL_TEMPLATES.map((template, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-white/10">
                                <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                                <p className="text-sm text-gray-400 mb-3">{template.subject}</p>
                                <Button
                                    onClick={() => copyTemplate(index)}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    {copiedTemplate === index ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Use Template
                                        </>
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Broadcast Form */}
            <Card className="bg-gray-900 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Send Email to All Users</CardTitle>
                    <CardDescription>
                        Send announcements, offers, or updates to all registered users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSend} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter email subject"
                                required
                                className="bg-gray-800 border-white/10 text-white"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="message">Message (HTML supported)</Label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="<p>Enter your message here...</p>"
                                required
                                className="w-full min-h-[300px] rounded-md border border-white/10 bg-gray-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white font-mono"
                            />
                            <p className="text-xs text-gray-400">
                                You can use HTML tags for formatting. Inline styles are recommended for email compatibility.
                                <br/>
                                💡 <strong>Tip:</strong> Use <code className="bg-gray-700 px-1 rounded">{"{{name}}"}</code> to personalize with user's first name (e.g., "Hi {"{{name}}"}, ..." becomes "Hi Mohit, ...")
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>Upload Images</Label>
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
                                        } else {
                                            alert("Failed to upload image");
                                        }
                                    } catch (error) {
                                        console.error("Upload error:", error);
                                        alert("Failed to upload image");
                                    }
                                }}
                                className="w-full bg-gray-800 border border-white/10 rounded-md p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                📌 Images are uploaded to Cloudinary and embedded in the email. Recipients will see images when they open the email (some email clients may require "Display Images" to be enabled).
                            </p>
                            
                            {uploadedImages.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                    {uploadedImages.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={img}
                                                alt={`Uploaded ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-md border border-white/10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {status && (
                            <div className={`p-4 rounded-md ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {status.message}
                            </div>
                        )}

                        <Button type="submit" disabled={loading || !subject || !message} className="w-full sm:w-auto">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Broadcast
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
