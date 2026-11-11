"use client";

import { Video, Code2, Users, FileCheck, CheckCircle2 } from "lucide-react";

export function MentorshipSection() {
    const features = [
        {
            title: "Senior Developer Code Reviews",
            desc: "Submit pull requests and receive constructive architectural reviews and line-by-line feedback from senior working software engineers.",
            icon: Code2
        },
        {
            title: "Live Interactive Architecture Sessions",
            desc: "Weekly discussions covering system design, database indexing, API security, and real-world scalability patterns.",
            icon: Video
        },
        {
            title: "Industry Mock Technical Interviews",
            desc: "One-on-one coding interviews and behavioral evaluations patterned after leading tech company interview loops.",
            icon: Users
        },
        {
            title: "Resume & Portfolio Curation",
            desc: "Detailed review of your GitHub projects, live demo links, and resume targeting top tech internship and junior role listings.",
            icon: FileCheck
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        Expert Guidance
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        Real Mentorship, Not Pre-Recorded Videos
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Transitioning into a software developer requires feedback on real code. Our faculty and working mentors provide personal, actionable guidance throughout your cohort.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {features.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-slate-800 bg-[#0b101b] p-6 sm:p-7 flex items-start gap-4 hover:border-slate-700 transition-colors shadow-md"
                        >
                            <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center shrink-0">
                                <item.icon size={22} />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-bold text-white">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

