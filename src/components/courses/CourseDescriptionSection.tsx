"use client";

import React, { useMemo } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  Users,
  Clock,
  Laptop,
  CheckSquare,
  BarChart3,
  Terminal,
  Zap,
} from "lucide-react";

interface CourseDescriptionSectionProps {
  description: string;
  title?: string;
}

interface ParsedSection {
  heading: string;
  items: string[];
}

export function parseCourseDescription(raw: string, title?: string) {
  if (!raw) return { leadText: "", sections: [], closingNote: "" };
  let text = raw.trim();

  // Strip duplicate course title if text begins with it
  if (title && text.toLowerCase().startsWith(title.toLowerCase().trim())) {
    text = text.substring(title.trim().length).trim();
  }

  const sectionKeywords = [
    "What This Program Covers",
    "What You Will Learn",
    "What You’ll Learn",
    "What You'll Learn",
    "Why Choose Webory Skills",
    "Why Choose Us",
    "Program Details",
    "Course Details",
    "Who Can Enroll",
    "Who Should Enroll",
    "Eligibility",
    "Key Highlights",
  ];

  const firstMatch = text.search(
    new RegExp("(?:^|\\s+)(" + sectionKeywords.join("|") + ")", "i")
  );

  let leadText = "";
  let restOfText = "";

  if (firstMatch !== -1) {
    leadText = text.substring(0, firstMatch).trim();
    restOfText = text.substring(firstMatch).trim();
  } else {
    leadText = text;
    return { leadText, sections: [], closingNote: "" };
  }

  const splitRegex = new RegExp(
    "(?=(?:^|\\s+)(" + sectionKeywords.join("|") + "))",
    "i"
  );
  const rawSections = restOfText
    .split(splitRegex)
    .map((s) => s.trim())
    .filter((s) => {
      if (!s) return false;
      // Filter out single matching keywords that split() might produce
      return s.length > 3 && !sectionKeywords.some((k) => k.toLowerCase() === s.toLowerCase());
    });

  const sections: ParsedSection[] = [];
  let closingNote = "";

  rawSections.forEach((sec) => {
    const headerMatch = sec.match(/^([^?:\n-]+(?:\?|:)?)(.*)/s);
    if (!headerMatch) return;

    const heading = headerMatch[1].trim();
    let body = headerMatch[2].trim();

    // Check for closing motivational notes
    const closingMatch = body.match(
      /(Start your [^.]+journey[^.]*\..*|\*\*\s*Learn\s*\|\s*Build\s*\|\s*Grow\s*\*|Learn\s*\|\s*Build\s*\|\s*Grow)/is
    );
    if (closingMatch) {
      closingNote = closingMatch[0].replace(/\*\*/g, "").trim();
      body = body.replace(closingMatch[0], "").trim();
    }

    const items = body
      .split(/(?:^|\s+)[-–•]\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    sections.push({
      heading,
      items: items.length > 0 ? items : [body],
    });
  });

  return { leadText, sections, closingNote };
}

export const CourseDescriptionSection: React.FC<CourseDescriptionSectionProps> = ({
  description,
  title,
}) => {
  const { leadText, sections, closingNote } = useMemo(
    () => parseCourseDescription(description, title),
    [description, title]
  );

  // Fallback if description is standard plain text / markdown without special sections
  if (!sections || sections.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 backdrop-blur-sm p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5 text-blue-400">
          <BookOpen size={18} />
          <h2 className="text-lg font-bold text-white tracking-tight">About This Course</h2>
        </div>
        <div className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3 font-normal">
          {leadText || description}
        </div>
      </div>
    );
  }

  // Find specific sections
  const coversSection = sections.find((s) =>
    /what this program covers|what you will learn|what you'll learn|curriculum/i.test(
      s.heading
    )
  );
  const whyChooseSection = sections.find((s) =>
    /why choose/i.test(s.heading)
  );
  const detailsSection = sections.find((s) =>
    /program details|course details/i.test(s.heading)
  );
  const eligibilitySection = sections.find((s) =>
    /who can enroll|who should enroll|eligibility/i.test(s.heading)
  );

  // Other remaining sections
  const otherSections = sections.filter(
    (s) =>
      s !== coversSection &&
      s !== whyChooseSection &&
      s !== detailsSection &&
      s !== eligibilitySection
  );

  return (
    <div className="space-y-6">
      {/* 1. Lead / Overview Card */}
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-[#0B0F19]/90 to-[#0B0F19]/50 backdrop-blur-md p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-sm">
                <Sparkles size={16} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Program Overview
              </h2>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Industry Aligned
            </span>
          </div>

          <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-normal">
            {leadText}
          </p>
        </div>
      </div>

      {/* 2. Program Details / Specs Strip (if available) */}
      {detailsSection && detailsSection.items.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/70 backdrop-blur-md p-6 shadow-lg">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {detailsSection.heading}
              </h2>
              <p className="text-xs text-gray-400">Key training format & parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {detailsSection.items.map((item, idx) => {
              const [rawKey, ...valParts] = item.includes(":")
                ? item.split(":")
                : [item, ""];
              const key = rawKey.trim();
              const val = valParts.join(":").trim();

              const getSpecIcon = (label: string) => {
                const lower = label.toLowerCase();
                if (lower.includes("duration") || lower.includes("hour"))
                  return <Clock size={16} className="text-orange-400" />;
                if (lower.includes("level"))
                  return <BarChart3 size={16} className="text-emerald-400" />;
                if (lower.includes("module"))
                  return <BookOpen size={16} className="text-blue-400" />;
                if (lower.includes("mode") || lower.includes("learning"))
                  return <Laptop size={16} className="text-cyan-400" />;
                return <CheckSquare size={16} className="text-purple-400" />;
              };

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5 font-medium">
                    {getSpecIcon(key)}
                    <span className="truncate">{key}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">
                    {val || key}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. What This Program Covers Grid */}
      {coversSection && coversSection.items.length > 0 && (
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/10 to-[#0B0F19]/80 backdrop-blur-md p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-sm">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {coversSection.heading}
                </h2>
                <p className="text-xs text-cyan-300/70">
                  {coversSection.items.length} hands-on modules and practical competencies
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-cyan-400/90 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              Full Syllabus Topics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {coversSection.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] hover:border-cyan-500/30 transition-all group"
              >
                <div className="mt-0.5 w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Terminal size={12} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Why Choose Webory Skills? */}
      {whyChooseSection && whyChooseSection.items.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/10 to-[#0B0F19]/80 backdrop-blur-md p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm">
              <Award size={18} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {whyChooseSection.heading}
              </h2>
              <p className="text-xs text-amber-300/70">
                Industry-focused advantages designed for student success
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {whyChooseSection.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/[0.02] hover:bg-amber-500/[0.06] border border-amber-500/15 hover:border-amber-500/30 transition-all group"
              >
                <CheckCircle2
                  size={16}
                  className="text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs sm:text-sm text-gray-200 leading-snug font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Who Can Enroll? (Eligibility) */}
      {eligibilitySection && eligibilitySection.items.length > 0 && (
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/10 to-[#0B0F19]/80 backdrop-blur-md p-6 sm:p-7 shadow-lg">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users size={16} />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {eligibilitySection.heading}
            </h2>
          </div>
          <div className="space-y-2">
            {eligibilitySection.items.map((item, idx) => (
              <p key={idx} className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                {item}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 6. Any other custom parsed sections */}
      {otherSections.map((sec, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 backdrop-blur-md p-6 shadow-lg space-y-4"
        >
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full" />
            {sec.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sec.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-gray-300"
              >
                <CheckCircle2 size={15} className="text-blue-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 7. Closing Motto Banner */}
      {closingNote && (
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-blue-900/10 p-6 sm:p-7 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
              <Zap size={14} />
              <span>Career Ready Mission</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              {closingNote}
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wide shadow-inner">
              🚀 Learn • Build • Grow
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
