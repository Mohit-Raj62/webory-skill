"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
    Briefcase, 
    Award, 
    CheckCircle2, 
    Linkedin, 
    Mail, 
    HeartHandshake, 
    GraduationCap, 
    UserCheck,
    Building2,
    ShieldCheck,
    Instagram,
    Copy,
    Check,
    Sparkles,
    Target,
    Users
} from "lucide-react";

interface TeamMember {
    name: string;
    role: string;
    department: string;
    badge: string;
    badgeColor: string;
    ringColor: string;
    quote: string;
    image?: string;
    initials?: string;
    avatarGradient?: string;
    bio: string;
    highlights: { title: string; desc: string }[];
    focusPills: string[];
    emailLink: string;
    linkedinLink?: string;
    instagramLink?: string;
}

const teamMembers: TeamMember[] = [
    {
        name: "Ridhima Singh",
        role: "Head of Human Resources (HR)",
        department: "People, Culture & Talent Acquisition",
        badge: "HR & Talent Lead",
        badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        ringColor: "ring-rose-500/20 border-rose-500/30",
        quote: "“Empowering students with ethical workplace practices, interview confidence, and career readiness.”",
        initials: "RS",
        avatarGradient: "from-rose-500/20 via-pink-600/15 to-purple-900/30 text-rose-300",
        bio: "Spearheading people operations, mentor talent acquisition, intern welfare, and corporate recruitment channels. Dedicated to bridging student capability with leading industry hiring benchmarks and workplace culture.",
        highlights: [
            { title: "Talent Acquisition", desc: "Vetting and onboarding elite working software engineers as faculty mentors." },
            { title: "Placement & Hiring Drives", desc: "Partnering with tech startups and corporations for student internships and job roles." },
            { title: "Intern Welfare & Culture", desc: "Nurturing professional communication, mock interviews, and workplace soft skills." }
        ],
        focusPills: ["Talent Acquisition", "Campus Placement", "People & Culture", "Career Readiness"],
        emailLink: "hr@weboryskills.in",
        linkedinLink: "https://www.linkedin.com/in/ridhima-singh-5928b93ba/",
        instagramLink: "https://www.instagram.com/shadesof_ridhima?knvt=Mnp2ejBneXg3dnJs"
    },
    {
        name: "Piyush Kashyap",
        role: "Chief Operating Officer (COO)",
        department: "Executive Management & Operations",
        badge: "Chief Operating Officer",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        ringColor: "ring-amber-500/20 border-amber-500/30",
        quote: "“Operational discipline is what turns ambitious curricula into high-impact engineering careers.”",
        image: "/piyush-kashyap.jpg",
        bio: "Directing day-to-day operations, cohort delivery logistics, campus partnership execution, and platform scalability at Webory Skills. He ensures every student, mentor, and academic partner experiences seamless operational excellence.",
        highlights: [
            { title: "Cohort Operations", desc: "End-to-end program delivery, live session scheduling, and curriculum execution." },
            { title: "Campus Partnerships", desc: "Institutional MoUs, university integration, and on-ground college cohorts." },
            { title: "SLA & Grievance Governance", desc: "Rigorous student support, doubt resolution SLAs, and operational compliance." }
        ],
        focusPills: ["Operations Strategy", "Academic Partnerships", "Cohort Scalability", "Process Excellence"],
        emailLink: "coo.piyush.kashyap@weboryskills.in",
        linkedinLink: "https://www.linkedin.com/in/piyush-kashyap-135b353b2/",
        instagramLink: "https://www.instagram.com/piyusharyan04?bqrl=dnJ0ZG9pbDQ2cHc1"
    },
    {
        name: "Vijay Kumar",
        role: "Director of Education",
        department: "Academic Council & Curriculum Rigor",
        badge: "Alumnus, IIT Mandi",
        badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        ringColor: "ring-blue-500/20 border-blue-500/30",
        quote: "“True engineering demands architectural depth, defensive code, and mastering real production systems.”",
        initials: "VK",
        avatarGradient: "from-blue-500/20 via-cyan-600/15 to-indigo-900/30 text-blue-300",
        bio: "Directing technical curriculum architecture, code review standards, and mentor allocations. Infuses premier Indian Institute of Technology discipline to help learners master production systems, Git workflows, and defensive architecture.",
        highlights: [
            { title: "IIT Mandi Pedagogy", desc: "Architecting rigorous curricula patterned after premier engineering institutions." },
            { title: "Code Quality Audits", desc: "Enforcing production-grade Git review standards and architectural benchmarks." },
            { title: "Certificate Governance", desc: "Official co-signatory ensuring academic integrity across all verified credentials." }
        ],
        focusPills: ["IIT Pedagogy", "Curriculum Rigor", "Code Quality Audits", "Systems Architecture"],
        emailLink: "info@weboryskills.in",
        linkedinLink: "https://www.linkedin.com"
    }
];

export function TeamSection() {
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    const handleCopy = (email: string) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-6 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#060a12]">
            {/* Subtle background ambient lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.06),rgba(255,255,255,0))] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-16">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full mb-3 sm:mb-4">
                        <Users size={13} className="text-blue-400 shrink-0" />
                        <span>Core Operational & Academic Leadership</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 sm:mb-4 px-2">
                        The Minds Behind Webory Skills
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto px-2">
                        Meet our executive officers, talent coordinators, and academic mentors driving operational excellence and student success across India.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                    {teamMembers.map((member, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl sm:rounded-3xl border border-slate-800/90 bg-gradient-to-b from-[#0e1626]/90 via-[#0a101d]/90 to-[#070b13] p-4 sm:p-6 md:p-8 flex flex-col justify-between hover:border-slate-700/80 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 group hover:-translate-y-1.5 relative overflow-hidden"
                        >
                            {/* Ambient Top Glow in Card */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent group-hover:via-blue-500/50 transition-all duration-500"></div>

                            <div className="space-y-4 sm:space-y-6">
                                {/* Top Profile Presentation Banner */}
                                <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                                    {member.image ? (
                                        <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl sm:rounded-2xl overflow-hidden border-2 bg-slate-900 shadow-xl shrink-0 group-hover:scale-102 transition-transform duration-500 ring-2 sm:ring-4 ring-amber-500/10 border-amber-500/30">
                                            <Image
                                                src={member.image}
                                                alt={`${member.name} - ${member.role}`}
                                                fill
                                                className="object-cover object-top"
                                                sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
                                                priority={idx === 0}
                                            />
                                        </div>
                                    ) : (
                                        <div className={`w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl sm:rounded-2xl border-2 bg-gradient-to-br ${member.avatarGradient} flex flex-col items-center justify-center text-center shadow-xl ring-2 sm:ring-4 ${member.ringColor} shrink-0`}>
                                            <span className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tight drop-shadow-sm">
                                                {member.initials}
                                            </span>
                                            <span className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-300 mt-0.5 sm:mt-1 tracking-wider px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded bg-black/30 border border-white/10">
                                                Executive
                                            </span>
                                        </div>
                                    )}

                                    {/* Header Meta: Badge + Organization */}
                                    <div className="flex-1 flex flex-col justify-between self-stretch min-w-0">
                                        <div>
                                            <span className={`inline-block text-[10px] sm:text-[11px] font-bold border px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wide leading-tight ${member.badgeColor}`}>
                                                {member.badge}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-medium mt-1.5 sm:mt-2">
                                                <Building2 size={13} className="text-slate-500 shrink-0" />
                                                <span className="truncate">Webory Skills Platform</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md w-fit mt-1.5 sm:mt-2">
                                            <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
                                            <span className="truncate">Govt. Verified EdTech</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Name, Designation & Department */}
                                <div className="border-b border-slate-800/80 pb-3 sm:pb-4">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight break-words group-hover:text-blue-400 transition-colors">
                                            {member.name}
                                        </h3>
                                        <CheckCircle2 size={16} className="text-blue-400 fill-blue-500/10 shrink-0" />
                                    </div>
                                    <p className="text-blue-400 text-xs sm:text-sm font-semibold mt-0.5 sm:mt-1">
                                        {member.role}
                                    </p>
                                    <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5 font-medium leading-relaxed">
                                        {member.department}
                                    </p>
                                </div>

                                {/* Officer Quote */}
                                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90 text-slate-300 text-[11px] sm:text-xs italic font-serif leading-relaxed border-l-2 border-l-blue-400/80">
                                    {member.quote}
                                </div>

                                {/* Biography */}
                                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                                    {member.bio}
                                </p>

                                {/* Structured Highlights */}
                                <div className="space-y-2 pt-1">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Key Executive Directives:
                                    </span>
                                    {member.highlights.map((item, hIdx) => (
                                        <div key={hIdx} className="p-2 sm:p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/70 text-xs text-slate-300 space-y-0.5">
                                            <div className="font-semibold text-white flex items-center gap-1.5 text-[11px] sm:text-xs">
                                                <Target size={12} className="text-blue-400 shrink-0" />
                                                <span>{item.title}</span>
                                            </div>
                                            <p className="text-slate-400 text-[10px] sm:text-[11px] leading-relaxed pl-3.5 sm:pl-4">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Focus Pills */}
                                <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1">
                                    {member.focusPills.map((pill, pIdx) => (
                                        <span
                                            key={pIdx}
                                            className="text-[9px] sm:text-[10px] font-medium text-slate-300 bg-slate-900/90 border border-slate-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg"
                                        >
                                            {pill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card Footer: Direct Email Capsule + Social Connect */}
                            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-800/80 space-y-2.5 sm:space-y-3">
                                {/* Official Email Capsule */}
                                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors">
                                    <a
                                        href={`mailto:${member.emailLink}`}
                                        className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-300 hover:text-blue-400 font-mono truncate transition-colors min-w-0"
                                        title={`Email ${member.emailLink}`}
                                    >
                                        <Mail size={13} className="text-blue-400 shrink-0" />
                                        <span className="truncate">{member.emailLink}</span>
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => handleCopy(member.emailLink)}
                                        className="shrink-0 px-2 py-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-medium active:scale-95"
                                        title="Copy Email Address"
                                    >
                                        {copiedEmail === member.emailLink ? (
                                            <>
                                                <Check size={11} className="text-emerald-400" />
                                                <span className="text-emerald-400 font-semibold">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={11} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Social Links Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                                        Direct Connect:
                                    </span>
                                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                        {member.linkedinLink && (
                                            <Link
                                                href={member.linkedinLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${member.name} LinkedIn Profile`}
                                                title={`${member.name} LinkedIn Profile`}
                                                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0077B5] hover:text-white text-slate-300 border border-slate-800 text-[11px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-all shadow-sm active:scale-95"
                                            >
                                                <Linkedin size={12} className="text-[#0077B5] group-hover:text-white" />
                                                <span>LinkedIn</span>
                                            </Link>
                                        )}
                                        {member.instagramLink && (
                                            <Link
                                                href={member.instagramLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${member.name} Instagram Profile`}
                                                title={`${member.name} Instagram Profile`}
                                                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white text-slate-300 border border-slate-800 text-[11px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-all shadow-sm active:scale-95"
                                            >
                                                <Instagram size={12} className="text-rose-400 group-hover:text-white" />
                                                <span>Instagram</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Trust Note */}
                <div className="mt-8 sm:mt-12 md:mt-14 p-4 sm:p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0b101b] via-[#0f172a] to-[#0b101b] flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                            <HeartHandshake size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h4 className="text-white text-sm sm:text-base font-bold">Join the Webory Skills Executive & Mentorship Network</h4>
                            <p className="text-slate-400 text-xs sm:text-sm mt-0.5 leading-relaxed">
                                We partner with passionate educators, working engineers, and campus leaders across all Indian universities.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto text-center px-4 py-2 sm:py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                        >
                            Contact Leadership
                        </Link>
                        <Link
                            href="/careers"
                            className="w-full sm:w-auto text-center px-5 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-blue-600/20"
                        >
                            View Open Roles
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
