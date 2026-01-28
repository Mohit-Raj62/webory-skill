"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, MessageSquare, User, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Message sent successfully!");
                setForm({ name: "", email: "", subject: "", message: "" });
            } else {
                toast.error(data.error || "Failed to send message");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] selection:bg-blue-500/30">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10 pt-32 pb-20 px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
                        <MessageSquare size={12} />
                        CONTACT SUPPORT
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Touch</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Have a question about our courses or need technical support? We're here to help you on your coding journey.
                    </p>
                </motion.div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Contact Info Column */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                                Contact Info
                                <div className="h-px bg-white/10 flex-1 ml-4"></div>
                            </h2>

                            <div className="space-y-8 relative z-10">
                                <ContactItem 
                                    icon={<Mail size={20} />} 
                                    title="Email Us"
                                    content={
                                        <div className="flex flex-col gap-1">
                                            <a href="mailto:weboryinfo@gmail.com" className="hover:text-blue-400 transition-colors">weboryinfo@gmail.com</a>
                                            <a href="mailto:supportskillwebory@gmail.com" className="hover:text-blue-400 transition-colors">supportskillwebory@gmail.com</a>
                                        </div>
                                    }
                                    color="text-blue-400"
                                    bg="bg-blue-500/10"
                                    borderColor="border-blue-500/20"
                                />
                                <ContactItem 
                                    icon={<Phone size={20} />} 
                                    title="Call Us"
                                    content={
                                        <div className="flex flex-col gap-1">
                                            <p className="text-white font-medium">+91 62059 47359</p>
                                            <p className="text-xs text-gray-500">Mon - Sat, 10am - 6pm</p>
                                        </div>
                                    }
                                    color="text-green-400"
                                    bg="bg-green-500/10"
                                    borderColor="border-green-500/20"
                                />
                                <ContactItem 
                                    icon={<MapPin size={20} />} 
                                    title="Visit Us"
                                    content={
                                        <div className="flex flex-col gap-1 text-sm">
                                            <p>Main Branch: Dehradun, Uttarakhand</p>
                                            <p className="text-gray-500">Near Jbit College, 248197</p>
                                            <div className="my-1 border-t border-dashed border-gray-700 w-1/2"></div>
                                            <p>Branch: Janpara, Patna</p>
                                            <p className="text-gray-500">Bihar, 801112</p>
                                        </div>
                                    }
                                    color="text-purple-400"
                                    bg="bg-purple-500/10"
                                    borderColor="border-purple-500/20"
                                />
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Registered Entity</span>
                                        <span className="text-xs text-orange-400 font-mono font-medium">UDYAM-BR-26-0208472</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: 0.2 }}
                             className="h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group"
                        >
                            <iframe 
                                src="https://maps.google.com/maps?q=Janpara%20Bihar%20patna%20801112&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(80%)" }} 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                className="group-hover:scale-105 transition-transform duration-700"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-3xl"></div>
                        </motion.div>
                    </div>

                    {/* Contact Form Column */}
                    <div className="lg:col-span-7">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl relative overflow-hidden"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">Send Message</h2>
                            <p className="text-gray-400 mb-8 text-sm">Fill out the form below and we'll get back to you shortly.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 group-focus-within:text-blue-400 transition-colors ml-1">Name</label>
                                        <div className={`relative transition-all duration-300 rounded-xl bg-black/20 border ${focusedField === 'name' ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={form.name}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:ring-0 text-sm"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="group space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 group-focus-within:text-blue-400 transition-colors ml-1">Email</label>
                                        <div className={`relative transition-all duration-300 rounded-xl bg-black/20 border ${focusedField === 'email' ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:ring-0 text-sm"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="group space-y-1.5">
                                    <label className="text-xs font-medium text-gray-400 group-focus-within:text-blue-400 transition-colors ml-1">Subject</label>
                                    <div className={`relative transition-all duration-300 rounded-xl bg-black/20 border ${focusedField === 'subject' ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Tag size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={form.subject}
                                            onFocus={() => setFocusedField('subject')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:ring-0 text-sm"
                                            placeholder="Question about..."
                                        />
                                    </div>
                                </div>

                                <div className="group space-y-1.5">
                                    <label className="text-xs font-medium text-gray-400 group-focus-within:text-blue-400 transition-colors ml-1">Message</label>
                                    <div className={`relative transition-all duration-300 rounded-xl bg-black/20 border ${focusedField === 'message' ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                                        <div className="absolute left-4 top-4 text-gray-500">
                                            <MessageSquare size={18} />
                                        </div>
                                        <textarea
                                            required
                                            rows={5}
                                            value={form.message}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:ring-0 text-sm resize-none leading-relaxed"
                                            placeholder="How can we help you today?"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-7 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Send Message 
                                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

function ContactItem({ icon, title, content, color, bg, borderColor }: any) {
    return (
        <div className="flex items-start gap-5">
            <div className={`w-12 h-12 ${bg} border ${borderColor} rounded-xl flex items-center justify-center ${color} shrink-0`}>
                {icon}
            </div>
            <div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <div className="text-gray-400 text-sm leading-relaxed">
                    {content}
                </div>
            </div>
        </div>
    );
}
