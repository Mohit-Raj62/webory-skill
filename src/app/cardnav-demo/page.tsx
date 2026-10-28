'use client';

import { useState } from 'react';
import Link from 'next/link';
import CardNav, { type CardNavItem } from '@/components/ui/CardNav';
import { Sparkles, Sliders, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/auth/session-provider';

export default function CardNavDemoPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [surface, setSurface] = useState<'glass' | 'solid'>('glass');
  const [cardEffect, setCardEffect] = useState<'rise' | 'unfold' | 'fade'>('rise');
  const [openOn, setOpenOn] = useState<'click' | 'hover'>('click');

  // Complete menu containing ALL links from existing navbar.tsx
  const ALL_NAVBAR_ITEMS: CardNavItem[] = [
    {
      label: '🎓 Courses & Learning',
      description: 'Hands-on production curriculums & verified certificates.',
      bgColor: 'linear-gradient(180deg, #151D42 0%, #0D132D 100%)',
      textColor: '#ffffff',
      links: [
        { label: 'All Courses (Catalog)', href: '/courses' },
        { label: 'Full-Stack Web Systems', href: '/courses' },
        { label: 'AI & Data Engineering', href: '/courses' },
        { label: 'DSA & Core Algorithms', href: '/courses' }
      ]
    },
    {
      label: '💼 Internships & Careers',
      description: 'Real-time industry projects, LOR & credentials.',
      bgColor: 'linear-gradient(180deg, #0D262B 0%, #081B1F 100%)',
      textColor: '#ffffff',
      links: [
        { label: 'Industrial Internships', href: '/internships' },
        { label: 'Verify Certificate (QR)', href: '/verify-certificate' },
        { label: 'Industrial LOR Program', href: '/internships' },
        { label: 'Tech Job Simulator', href: '/simulator' }
      ]
    },
    {
      label: '⚡ AI Copilot & DevLab',
      description: 'Smart AI mentorship, interview prep & cloud IDE.',
      bgColor: 'linear-gradient(180deg, #231640 0%, #150D2A 100%)',
      textColor: '#ffffff',
      links: [
        { label: 'AI Copilot (24/7 Mentor)', href: user ? '/ai-weboryskills' : '/signup' },
        { label: 'AI Nexus (Interview Prep)', href: '/ai-prep' },
        { label: 'DevLab (Cloud IDE)', href: '/playground' },
        { label: '48h Live Hackathons', href: '/hackathons' }
      ]
    },
    {
      label: '🌐 Platform & Account',
      description: 'Career intelligence, explore everything & support.',
      bgColor: 'linear-gradient(180deg, #1A1F38 0%, #0F1326 100%)',
      textColor: '#ffffff',
      links: [
        { label: 'Career Roadmaps', href: '/career-roadmap' },
        { label: 'Explore Everything', href: '/explore' },
        { label: user ? 'Student Profile' : 'Log In / Register', href: user ? (user.role === 'admin' ? '/admin' : '/profile') : '/login' },
        { label: 'Govt. Startup & Mentors', href: '/about' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#06080d] text-white selection:bg-blue-600/30 overflow-x-hidden font-sans relative">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-40 right-10 w-[450px] h-[450px] bg-emerald-600/8 rounded-full blur-[130px]" />
      </div>

      {/* Floating CardNav Container */}
      <header className="sticky top-5 z-50 px-4 w-full">
        <CardNav
          logo={
            <div className="flex items-center space-x-1.5 shrink-0 select-none">
              <span className="text-sm sm:text-base font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400">WEBORY </span>
                <span className="relative">
                  <span className="absolute -top-1.5 left-[30%] -translate-x-1/2 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 font-extrabold">SKILLS</span>
                </span>
              </span>
            </div>
          }
          logoAlt="Webory Skills"
          logoHref="/"
          items={ALL_NAVBAR_ITEMS}
          cta={
            user 
              ? { label: user.firstName || 'Dashboard', href: user.role === 'admin' ? '/admin' : '/profile' }
              : { label: 'Get Started', href: '/signup' }
          }
          theme={theme}
          surface={surface}
          cardEffect={cardEffect}
          openOn={openOn}
          bounce={0.2}
          speed={1.1}
          stagger={0.08}
          maxWidth={920}
        />
      </header>

      {/* Demo Controls & Showcase Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center space-y-10">
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold shadow-sm">
            <Sparkles size={14} />
            <span>React Bits &lt;CardNav /&gt; Live Integration</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            All Navbar Items in CardNav Menu
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            Click <strong className="text-white">&quot;Menu&quot;</strong> in the floating navbar above to explore all 16+ links from your current navbar (Courses, Internships, AI Copilot, DevLab, Hackathons, Certificates, etc.).
          </p>
        </div>

        {/* Live Controller Dashboard */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl max-w-2xl mx-auto text-left space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-200">
              <Sliders size={16} className="text-blue-400" />
              <span>CardNav Controls</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              All Navbar Links Loaded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Card Effect Selector */}
            <div className="space-y-1.5">
              <label className="text-gray-400 font-medium block">Card Animation Effect</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                {(['rise', 'unfold', 'fade'] as const).map(effect => (
                  <button
                    key={effect}
                    onClick={() => setCardEffect(effect)}
                    className={`py-1.5 rounded-lg font-semibold capitalize transition-all ${
                      cardEffect === effect
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {effect}
                  </button>
                ))}
              </div>
            </div>

            {/* Surface Blur Style */}
            <div className="space-y-1.5">
              <label className="text-gray-400 font-medium block">Surface Material</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                {(['glass', 'solid'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSurface(s)}
                    className={`py-1.5 rounded-lg font-semibold capitalize transition-all ${
                      surface === s
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Behavior */}
            <div className="space-y-1.5">
              <label className="text-gray-400 font-medium block">Open Trigger</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                {(['click', 'hover'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setOpenOn(mode)}
                    className={`py-1.5 rounded-lg font-semibold capitalize transition-all ${
                      openOn === mode
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme */}
            <div className="space-y-1.5">
              <label className="text-gray-400 font-medium block">Color Theme</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                {(['dark', 'light'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`py-1.5 rounded-lg font-semibold capitalize transition-all ${
                      theme === t
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back Links */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-semibold text-white transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <span>← Back to Webory Home</span>
          </Link>
        </div>

      </main>
    </div>
  );
}
