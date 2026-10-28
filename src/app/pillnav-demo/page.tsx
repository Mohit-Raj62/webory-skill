'use client';

import { useState } from 'react';
import Link from 'next/link';
import PillNav, { type PillNavItem } from '@/components/ui/PillNav';
import { 
  Sparkles, 
  Sliders, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Briefcase, 
  Code2, 
  Trophy, 
  Milestone,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/components/auth/session-provider';

export default function PillNavDemoPage() {
  const { user } = useAuth();
  
  // Interactive control states
  const [layout, setLayout] = useState<'split' | 'joined'>('split');
  const [itemStyle, setItemStyle] = useState<'pill' | 'plain'>('pill');
  const [hoverEffect, setHoverEffect] = useState<'fill' | 'glide' | 'none'>('fill');
  const [indicator, setIndicator] = useState<'dot' | 'pill' | 'none'>('dot');
  const [surface, setSurface] = useState<'glass' | 'solid' | 'none'>('glass');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeHref, setActiveHref] = useState<string>('/pillnav-demo');

  // Navigation items for Webory Skills
  const NAV_ITEMS: PillNavItem[] = [
    { label: 'Home', href: '/', icon: <Compass className="w-3.5 h-3.5" /> },
    { label: 'Courses', href: '/courses', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'Internships', href: '/internships', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { label: 'DevLab', href: '/playground', icon: <Code2 className="w-3.5 h-3.5" /> },
    { label: 'Hackathons', href: '/hackathons', icon: <Trophy className="w-3.5 h-3.5" /> },
    { label: 'Roadmap', href: '/career-roadmap', icon: <Milestone className="w-3.5 h-3.5" /> },
    { label: 'Explore', href: '/explore' }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#06080d] text-white' : 'bg-[#f6f7fb] text-slate-900'} selection:bg-blue-600/30 overflow-x-hidden font-sans relative transition-colors duration-300`}>
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-48 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Floating PillNav Container */}
      <header className="sticky top-5 z-50 px-4 w-full flex justify-center">
        <PillNav
          logo={
            <div className="flex items-center justify-center w-full h-full">
              <span className="font-extrabold text-base bg-clip-text text-transparent bg-gradient-to-tr from-blue-400 via-indigo-300 to-purple-400">
                W
              </span>
            </div>
          }
          logoAlt="Webory Skills"
          logoHref="/"
          items={NAV_ITEMS}
          activeHref={activeHref}
          onItemClick={(item) => {
            if (item.href) setActiveHref(item.href);
          }}
          theme={theme}
          layout={layout}
          itemStyle={itemStyle}
          hoverEffect={hoverEffect}
          indicator={indicator}
          surface={surface}
          size={size}
          className="shadow-2xl"
        />
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-28">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>React Bits Component Showcase</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Interactive <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">PillNav</span> Live Demo
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400">
            A liquid spring-animated floating pill navigation with magnetic glides, rollover fills, and responsive mobile drawer.
          </p>

          {/* Quick Links / Comparison */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link 
              href="/cardnav-demo"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <span>Compare with <strong className="text-blue-400">&lt;CardNav /&gt;</strong></span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <span>Back to Webory Homepage</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Control Customizer Grid */}
        <section className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl mb-12">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800 text-sm font-semibold text-slate-300">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Live Interactive Controls (Test Props in Real-Time)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            
            {/* 1. Layout */}
            <div className="space-y-2">
              <label className="text-slate-400 font-medium block">
                Layout (<code className="text-blue-400 font-mono">layout</code>):
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['split', 'joined'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setLayout(mode)}
                    className={`py-2 px-3 rounded-lg border text-center font-medium capitalize transition-all ${
                      layout === mode 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30' 
                        : 'bg-slate-800/70 border-slate-700/70 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {mode} {mode === 'split' ? '(Separate bubble)' : '(One capsule)'}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Hover Effect */}
            <div className="space-y-2">
              <label className="text-slate-400 font-medium block">
                Hover Effect (<code className="text-blue-400 font-mono">hoverEffect</code>):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['fill', 'glide', 'none'] as const).map(effect => (
                  <button
                    key={effect}
                    onClick={() => setHoverEffect(effect)}
                    className={`py-2 px-2 rounded-lg border text-center font-medium capitalize transition-all ${
                      hoverEffect === effect 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30' 
                        : 'bg-slate-800/70 border-slate-700/70 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {effect}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Indicator */}
            <div className="space-y-2">
              <label className="text-slate-400 font-medium block">
                Active Indicator (<code className="text-blue-400 font-mono">indicator</code>):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['dot', 'pill', 'none'] as const).map(ind => (
                  <button
                    key={ind}
                    onClick={() => setIndicator(ind)}
                    className={`py-2 px-2 rounded-lg border text-center font-medium capitalize transition-all ${
                      indicator === ind 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30' 
                        : 'bg-slate-800/70 border-slate-700/70 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Item Style */}
            <div className="space-y-2">
              <label className="text-slate-400 font-medium block">
                Item Style (<code className="text-blue-400 font-mono">itemStyle</code>):
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['pill', 'plain'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setItemStyle(style)}
                    className={`py-2 px-3 rounded-lg border text-center font-medium capitalize transition-all ${
                      itemStyle === style 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30' 
                        : 'bg-slate-800/70 border-slate-700/70 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Surface */}
            <div className="space-y-2">
              <label className="text-slate-400 font-medium block">
                Surface (<code className="text-blue-400 font-mono">surface</code>):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['glass', 'solid', 'none'] as const).map(surf => (
                  <button
                    key={surf}
                    onClick={() => setSurface(surf)}
                    className={`py-2 px-2 rounded-lg border text-center font-medium capitalize transition-all ${
                      surface === surf 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30' 
                        : 'bg-slate-800/70 border-slate-700/70 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {surf}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Size */}
            <div className="space-y-2">
              <label className="text-slate-400 font-medium block">
                Size (<code className="text-blue-400 font-mono">size</code>):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['sm', 'md', 'lg'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSize(sz)}
                    className={`py-2 px-2 rounded-lg border text-center font-medium uppercase transition-all ${
                      size === sz 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30' 
                        : 'bg-slate-800/70 border-slate-700/70 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Preset Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-xs font-semibold mr-2">Quick Presets:</span>
            
            <button
              onClick={() => {
                setLayout('split');
                setItemStyle('pill');
                setHoverEffect('fill');
                setIndicator('dot');
                setSurface('glass');
                setSize('md');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-all"
            >
              ✨ Default Liquid Fill
            </button>

            <button
              onClick={() => {
                setLayout('joined');
                setItemStyle('plain');
                setHoverEffect('glide');
                setIndicator('pill');
                setSurface('glass');
                setSize('md');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-all"
            >
              🚀 Modern Gliding Capsule
            </button>

            <button
              onClick={() => {
                setLayout('joined');
                setItemStyle('plain');
                setHoverEffect('fill');
                setIndicator('dot');
                setSurface('solid');
                setSize('sm');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-all"
            >
              ⚡ Compact Minimalist (Solid)
            </button>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">Liquid Physics Animation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Physics-based mass-spring simulation with customizable bounce and stretch factors. Rollovers smoothly animate with sub-pixel precision.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">Responsive Auto Collapse</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically measures parent container width and folds links smoothly into an animated hamburger morphing drawer on smaller screens.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">Full Next.js Link Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrated with Next.js client-side prefetching, custom router navigation, and keyboard accessibility (`focus-visible` & `ESC` key).
            </p>
          </div>
        </section>

        {/* Comparison: CardNav vs PillNav */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/20 via-slate-900/40 to-purple-950/20 border border-blue-500/20">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Comparison: &lt;CardNav /&gt; vs &lt;PillNav /&gt;
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 mt-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-blue-400 text-sm block mb-1">CardNav (Rich Mega-Menu)</strong>
              <p className="text-slate-400 mb-2">Great for deep websites with many categories, links, sub-items, and descriptions.</p>
              <ul className="space-y-1 list-disc list-inside text-slate-300">
                <li>Expands into big colorful category cards</li>
                <li>Displays 15–20+ links with descriptions</li>
                <li>Built-in CTA button on the right</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-purple-400 text-sm block mb-1">PillNav (Minimalist Floating Capsule)</strong>
              <p className="text-slate-400 mb-2">Great for ultra-clean, modern, minimalist SaaS or product landing pages.</p>
              <ul className="space-y-1 list-disc list-inside text-slate-300">
                <li>Ultra compact floating capsule</li>
                <li>High-end liquid spring rollover & gliding dot</li>
                <li>Puts logo in spinning bubble or joined capsule</li>
              </ul>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
}
