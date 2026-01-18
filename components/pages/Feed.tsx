'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  IonPage,
  IonContent,
  IonIcon,
} from '@ionic/react';
import {
  musicalNotesOutline,
  timeOutline,
  micOutline,
  flameOutline,
  flashOutline,
  headsetOutline,
  trophyOutline,
  sparklesOutline,
  radioOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import type { RadioStation, Track } from '../../lib/models';
import {
  NowPlayingAPIStub,
  RadioStationAPIStub,
} from '../../lib/api/radio-api-stubs';

/* ─────────────────────────────────────────────────────────────────────────────
   STUB DATA - Simulierte Hördaten für den Recap
   ───────────────────────────────────────────────────────────────────────────── */

const recapStubData = (() => {
  const coverA = '/img/c1.avif';
  const coverB = '/img/c2.avif';
  const coverC = '/img/c3.avif';
  const now = new Date();

  const minutesAgo = (minutes: number) =>
    new Date(now.getTime() - minutes * 60 * 1000);

  const makeTrack = (
    title: string,
    artist: string,
    duration: number,
    minutes: number,
    album: string,
    coverArt: string,
  ): Track => ({
    title,
    artist,
    duration,
    startTime: minutesAgo(minutes),
    album,
    coverArt,
  });

  const stations: RadioStation[] = [
    {
      id: 'aurora-101',
      name: 'Aurora 101',
      description: 'Indie, Synth & Dream Pop',
      frequency: '101.2 FM',
      logo: coverA,
      genre: 'Indie Pop',
      streamUrl: 'https://stream.aurora.example',
    },
    {
      id: 'pulse-909',
      name: 'Pulse 909',
      description: 'Club, House & Electro',
      frequency: '90.9 FM',
      logo: coverB,
      genre: 'House',
      streamUrl: 'https://stream.pulse.example',
    },
    {
      id: 'nova-hiphop',
      name: 'Nova Hiphop',
      description: 'Rap, Beats & Neo-Soul',
      frequency: '98.6 FM',
      logo: coverC,
      genre: 'Hip-Hop',
      streamUrl: 'https://stream.nova.example',
    },
  ];

  // Erweiterte History mit mehr Tracks für bessere Statistiken
  const history: Record<string, Track[]> = {
    'aurora-101': [
      makeTrack('Moonlit Drive', 'Luna Vale', 212, 35, 'Velvet Skies', coverA),
      makeTrack('Soft Signals', 'Nova Bloom', 198, 62, 'Frequencies', coverB),
      makeTrack('Echo Hearts', 'Luna Vale', 224, 93, 'Velvet Skies', coverA),
      makeTrack('Neon Bloom', 'Kite Harbor', 205, 127, 'Bloomline', coverC),
      makeTrack('Midnight Coast', 'Luna Vale', 238, 170, 'Velvet Skies', coverA),
      makeTrack('Afterglow', 'The Paper Comets', 201, 210, 'Afterglow', coverB),
      makeTrack('Starfall', 'Luna Vale', 195, 250, 'Velvet Skies', coverA),
      makeTrack('Glass Ocean', 'Nova Bloom', 218, 290, 'Frequencies', coverB),
      makeTrack('Dreamstate', 'Luna Vale', 232, 340, 'Velvet Skies', coverA),
      makeTrack('Cascade', 'Kite Harbor', 189, 380, 'Bloomline', coverC),
    ],
    'pulse-909': [
      makeTrack('Chrome Steps', 'Cityphase', 189, 22, 'Analog Heat', coverB),
      makeTrack('Gravity Loop', 'Cityphase', 204, 58, 'Analog Heat', coverB),
      makeTrack('Static Rush', 'Luna Vale', 196, 88, 'Remix Vault', coverC),
      makeTrack('Circuit Kiss', 'Electra Lane', 214, 120, 'Midnight Club', coverA),
      makeTrack('Night Drifter', 'Cityphase', 221, 155, 'Analog Heat', coverB),
      makeTrack('Voltage Rain', 'Electra Lane', 207, 200, 'Midnight Club', coverA),
      makeTrack('Bassline Bloom', 'Luna Vale', 193, 245, 'Remix Vault', coverC),
      makeTrack('Synth Horizon', 'Cityphase', 245, 300, 'Analog Heat', coverB),
      makeTrack('Pulse Width', 'Electra Lane', 198, 350, 'Midnight Club', coverA),
    ],
    'nova-hiphop': [
      makeTrack('Blueprints', 'Juno Rex', 230, 30, 'Frameworks', coverC),
      makeTrack('Lowkey Lights', 'Luna Vale', 215, 72, 'Velvet Skies', coverA),
      makeTrack('Streetglass', 'Juno Rex', 203, 118, 'Frameworks', coverC),
      makeTrack('Golden Hours', 'Maya Flux', 226, 168, 'Golden Hours', coverB),
      makeTrack('Headnod Theory', 'Juno Rex', 219, 260, 'Frameworks', coverC),
      makeTrack('Concrete Dreams', 'Maya Flux', 241, 320, 'Golden Hours', coverB),
      makeTrack('Vinyl Soul', 'Juno Rex', 208, 375, 'Frameworks', coverC),
    ],
  };

  return { stations, history };
})();

/* ─────────────────────────────────────────────────────────────────────────────
   UTILITIES
   ───────────────────────────────────────────────────────────────────────────── */

const getTopItems = (items: string[], count: number = 3) => {
  const counter = new Map<string, number>();
  items.forEach(item => counter.set(item, (counter.get(item) || 0) + 1));
  return Array.from(counter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key, cnt]) => ({ key, count: cnt }));
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins} Min`;
};

const formatHour = (hour: number) => {
  if (hour >= 5 && hour < 12) return 'Morgens';
  if (hour >= 12 && hour < 17) return 'Nachmittags';
  if (hour >= 17 && hour < 21) return 'Abends';
  return 'Nachts';
};

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED COMPONENTS
   ───────────────────────────────────────────────────────────────────────────── */

const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  
  return <>{display.toLocaleString('de-DE')}{suffix}</>;
};

const ProgressRing = ({ 
  percent, 
  size = 120, 
  strokeWidth = 8,
  color = '#fff'
}: { 
  percent: number; 
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percent), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
      />
    </svg>
  );
};

const FloatingOrb = ({ delay, size, color, position }: { 
  delay: number; 
  size: number; 
  color: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}) => (
  <div
    className="absolute rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none"
    style={{
      width: size,
      height: size,
      background: color,
      animationDelay: `${delay}s`,
      animationDuration: '4s',
      ...position,
    }}
  />
);

/* ─────────────────────────────────────────────────────────────────────────────
   RECAP DATA TYPE
   ───────────────────────────────────────────────────────────────────────────── */

type RecapData = {
  totalMinutes: number;
  totalTracks: number;
  uniqueArtists: number;
  topArtists: { key: string; count: number }[];
  topTracks: { key: string; count: number }[];
  topStation: { station: RadioStation; tracks: Track[] };
  topGenre: string;
  peakHour: number;
  longestSession: number;
  avgTracksPerDay: number;
  topAlbum: string;
  moodProfile: string;
  listenStreak: number;
  percentile: number;
};

/* ─────────────────────────────────────────────────────────────────────────────
   SLIDE COMPONENTS - Jede Seite hat ein einzigartiges Layout
   ───────────────────────────────────────────────────────────────────────────── */

// Slide 1: Hero Intro - Immersive fullscreen experience
const SlideIntro = ({ data, isActive }: { data: RecapData; isActive: boolean }) => (
  <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0014]">
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-purple-900/60 to-fuchsia-900/80" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
    
    {/* Floating orbs */}
    <FloatingOrb delay={0} size={400} color="rgba(168,85,247,0.4)" position={{ top: '-15%', right: '-15%' }} />
    <FloatingOrb delay={1.5} size={300} color="rgba(236,72,153,0.3)" position={{ bottom: '5%', left: '-10%' }} />
    <FloatingOrb delay={0.8} size={200} color="rgba(99,102,241,0.35)" position={{ top: '35%', left: '50%' }} />
    
    {/* Subtle grid pattern */}
    <div className="absolute inset-0 opacity-5" style={{ 
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '50px 50px'
    }} />
    
    <div className={`text-center z-10 px-6 transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      {/* Glowing badge */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 blur-xl bg-purple-500/30 rounded-full scale-150" />
        <span className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold tracking-[0.25em] border border-white/10">
          <IonIcon icon={sparklesOutline} className="text-sm" />
          DEIN PERSÖNLICHER
        </span>
      </div>
      
      {/* Main title with glow effect */}
      <div className="relative">
        <h1 className="recap-title text-7xl font-black text-white mb-1 tracking-tighter" style={{ textShadow: '0 0 80px rgba(168,85,247,0.5)' }}>
          RADIO
        </h1>
        <h1 className="recap-title text-8xl font-black tracking-tighter leading-none" style={{ 
          background: 'linear-gradient(135deg, #f472b6 0%, #c084fc 25%, #818cf8 50%, #c084fc 75%, #f472b6 100%)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradient 4s ease infinite',
          textShadow: '0 0 100px rgba(196,132,252,0.4)'
        }}>
          RECAP
        </h1>
        <p className="text-2xl font-light text-white/50 mt-2 tracking-widest">2 0 2 6</p>
      </div>
      
      {/* Stats row with glassmorphism */}
      <div className="flex items-center justify-center gap-4 mt-16">
        {[
          { value: data.totalTracks, label: 'Songs', icon: musicalNotesOutline },
          { value: Math.round(data.totalMinutes / 60), label: 'Stunden', icon: timeOutline, suffix: 'h' },
          { value: data.uniqueArtists, label: 'Artists', icon: micOutline },
        ].map((stat, i) => (
          <div key={stat.label} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl px-6 py-5 border border-white/10 min-w-[100px]">
              <IonIcon icon={stat.icon} className="text-3xl text-white/70 mb-1" />
              <p className="text-3xl font-black text-white">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-white/50 text-xs font-medium tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Swipe indicator - horizontal arrow pointing right */}
      <div className="mt-20 flex flex-col items-center">
        <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
          <p className="text-white/40 text-xs tracking-widest">WISCHEN</p>
          <IonIcon icon={chevronForwardOutline} className="text-white/50 text-lg animate-pulse" />
        </div>
      </div>
    </div>
    
    <style jsx>{`
      @keyframes gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `}</style>
  </div>
);

// Slide 2: Top Artist Feature - Dramatic reveal
const SlideTopArtist = ({ data, isActive }: { data: RecapData; isActive: boolean }) => {
  const topArtist = data.topArtists[0];
  const artistTrackCount = topArtist?.count || 0;
  const percentage = Math.round((artistTrackCount / data.totalTracks) * 100);
  
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-[#0f0515]">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-950/90 via-pink-900/70 to-orange-900/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-rose-500/30 via-transparent to-transparent" />
      
      <FloatingOrb delay={0.5} size={350} color="rgba(244,63,94,0.4)" position={{ top: '-5%', left: '-15%' }} />
      <FloatingOrb delay={1.5} size={250} color="rgba(251,146,60,0.3)" position={{ bottom: '10%', right: '-10%' }} />
      
      <div className={`flex-1 flex flex-col justify-center px-8 z-10 transition-all duration-1000 delay-200 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
        {/* Category label */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 backdrop-blur-sm border border-rose-500/20 text-rose-300 text-xs font-semibold tracking-[0.2em]">
            <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
            DEIN #1 ARTIST
          </span>
        </div>
        
        {/* Artist name with dramatic styling */}
        <h2 className="text-6xl font-black text-white leading-none mb-8" style={{ textShadow: '0 0 60px rgba(244,63,94,0.4)' }}>
          {topArtist?.key || 'Luna Vale'}
        </h2>
        
        {/* Stats card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <ProgressRing percent={percentage} size={110} strokeWidth={8} color="url(#pinkGradient)" />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-black text-white">{percentage}</span>
                <span className="text-xs text-white/50">Prozent</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white/50 text-sm mb-1">Deiner gesamten Plays</p>
              <p className="text-4xl font-black text-white">{artistTrackCount}</p>
              <p className="text-pink-400 text-sm font-medium">Songs gehört</p>
            </div>
          </div>
        </div>
        
        {/* Other artists list */}
        <div className="space-y-3">
          <p className="text-white/40 text-xs font-semibold tracking-[0.2em] mb-4">DEINE TOP ARTISTS</p>
          {data.topArtists.slice(1, 4).map((artist, i) => (
            <div key={artist.key} className={`flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/5 transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDelay: `${(i + 1) * 150}ms` }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                i === 0 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-700' :
                i === 1 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100' :
                'bg-white/10 text-white/50'
              }`}>
                {i + 2}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{artist.key}</p>
                <p className="text-white/40 text-sm">{artist.count} Plays</p>
              </div>
              <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: isActive ? `${(artist.count / artistTrackCount) * 100}%` : '0%', transitionDelay: `${(i + 1) * 200}ms` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Slide 3: Listening Habits - Data visualization
const SlideListeningHabits = ({ data, isActive }: { data: RecapData; isActive: boolean }) => {
  const timeOfDay = formatHour(data.peakHour);
  const hourLabels = ['00', '06', '12', '18', '24'];
  const barHeights = [2, 1, 1, 2, 4, 7, 5, 3, 4, 6, 8, 9, 7, 5, 4, 6, 8, 10, 9, 6, 4, 3, 2, 2];
  
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-[#051010]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-teal-900/70 to-cyan-900/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
      
      <FloatingOrb delay={0} size={300} color="rgba(20,184,166,0.35)" position={{ top: '-10%', right: '5%' }} />
      <FloatingOrb delay={2} size={220} color="rgba(6,182,212,0.3)" position={{ bottom: '5%', left: '-5%' }} />
      
      <div className={`flex-1 flex flex-col justify-center px-8 z-10 transition-all duration-1000 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 backdrop-blur-sm border border-teal-500/20 text-teal-300 text-xs font-semibold tracking-[0.2em]">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            DEIN HÖRVERHALTEN
          </span>
        </div>
        
        {/* Main headline */}
        <h2 className="text-4xl font-black text-white leading-tight mb-1">
          Du bist ein
        </h2>
        <h2 className="text-6xl font-black leading-none mb-10" style={{ 
          background: 'linear-gradient(135deg, #34d399 0%, #22d3d1 50%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 80px rgba(34,211,209,0.4)'
        }}>
          {timeOfDay}-Hörer
        </h2>
        
        {/* Activity chart */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-6">
          <p className="text-white/40 text-xs font-semibold tracking-[0.15em] mb-4">DEINE AKTIVITÄT ÜBER 24H</p>
          <div className="flex items-end justify-between h-28 gap-0.5 mb-3">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all duration-700 ${
                  i === data.peakHour 
                    ? 'bg-gradient-to-t from-emerald-500 via-teal-400 to-cyan-300' 
                    : 'bg-white/15 hover:bg-white/25'
                }`}
                style={{ 
                  height: isActive ? `${h * 10}%` : '0%',
                  transitionDelay: isActive ? `${i * 25}ms` : '0ms'
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-white/30 text-xs font-medium">
            {hourLabels.map(l => <span key={l}>{l}h</span>)}
          </div>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 text-center">
            <p className="text-4xl font-black text-white mb-1">{data.listenStreak}</p>
            <p className="text-teal-400/80 text-sm font-medium flex items-center justify-center gap-1">
              Tage Streak <IonIcon icon={flameOutline} className="text-base" />
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 text-center">
            <p className="text-4xl font-black text-white mb-1">{data.avgTracksPerDay}</p>
            <p className="text-cyan-400/80 text-sm font-medium flex items-center justify-center gap-1">
              Songs/Tag <IonIcon icon={flashOutline} className="text-base" />
            </p>
          </div>
        </div>
        
        {/* Fun fact */}
        <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-white/10 backdrop-blur-xl">
          <p className="text-white/90 text-sm leading-relaxed flex items-start gap-3">
            <IonIcon icon={headsetOutline} className="text-2xl text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Deine längste Session dauerte <span className="text-emerald-400 font-bold">{formatDuration(data.longestSession)}</span> – 
            da hat sich jemand im Sound verloren!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Slide 4: Top Station & Genre - Premium card design
const SlideStation = ({ data, isActive }: { data: RecapData; isActive: boolean }) => {
  const station = data.topStation.station;
  
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-[#050a15]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-blue-900/70 to-violet-900/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_var(--tw-gradient-stops))] from-indigo-500/25 via-transparent to-transparent" />
      
      <FloatingOrb delay={0.3} size={350} color="rgba(99,102,241,0.35)" position={{ top: '5%', left: '-15%' }} />
      <FloatingOrb delay={1.8} size={280} color="rgba(139,92,246,0.3)" position={{ bottom: '-5%', right: '-10%' }} />
      
      <div className={`flex-1 flex flex-col justify-center px-8 z-10 transition-all duration-1000 delay-200 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Category badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-[0.2em]">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            DEIN HEIMATSENDER
          </span>
        </div>
        
        {/* Station hero card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
              {station.logo && (
                <Image src={station.logo} alt="" fill className="object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white leading-none">{station.name}</h2>
              <p className="text-white/50 mt-1">{station.frequency}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-200 text-sm font-medium border border-indigo-500/20">
              🎸 {station.genre}
            </span>
            <span className="px-4 py-2 bg-violet-500/20 rounded-full text-violet-200 text-sm font-medium border border-violet-500/20">
              ▶️ {data.topStation.tracks.length} Plays
            </span>
          </div>
          
          <p className="text-white/40 text-sm italic">"{station.description}"</p>
        </div>
        
        {/* Top tracks list */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <p className="text-white/40 text-xs font-semibold tracking-[0.15em] mb-5">🏆 DEINE TOP SONGS HIER</p>
          <div className="space-y-4">
            {data.topTracks.slice(0, 3).map((track, i) => (
              <div key={track.key} className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDelay: `${(i + 1) * 150}ms` }}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-lg ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-900' :
                  i === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-700' :
                  'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{track.key}</p>
                  <p className="text-white/40 text-sm">{track.count}× gespielt</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Slide 5: Summary & Personality - Grand finale
const SlideSummary = ({ data, isActive }: { data: RecapData; isActive: boolean }) => (
  <div className="h-full w-full flex flex-col relative overflow-hidden bg-[#0a0a0f]">
    {/* Epic background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-zinc-900/70 to-neutral-900/80" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
    
    <FloatingOrb delay={0} size={250} color="rgba(245,158,11,0.3)" position={{ top: '0%', right: '0%' }} />
    <FloatingOrb delay={1} size={200} color="rgba(239,68,68,0.25)" position={{ bottom: '15%', left: '5%' }} />
    <FloatingOrb delay={2} size={180} color="rgba(168,85,247,0.3)" position={{ top: '45%', right: '15%' }} />
    
    <div className={`flex-1 flex flex-col justify-center px-8 z-10 transition-all duration-1000 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Personality reveal */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-[0.2em]">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            DEIN MUSIK-PROFIL
          </span>
        </div>
        <h2 className="text-4xl font-black text-white mb-2">Du bist ein</h2>
        <h2 className="text-6xl font-black leading-none" style={{ 
          background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 33%, #ef4444 66%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 80px rgba(249,115,22,0.4)'
        }}>
          {data.moodProfile}
        </h2>
      </div>
      
      {/* Percentile card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-6">
        <div className="flex items-center justify-center gap-5">
          <div className="relative">
            <ProgressRing percent={100 - data.percentile} size={90} strokeWidth={6} color="url(#goldGradient)" />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <IonIcon icon={trophyOutline} className="text-2xl text-amber-400" />
            </div>
          </div>
          <div>
            <p className="text-5xl font-black" style={{ 
              background: 'linear-gradient(135deg, #fbbf24, #f97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Top {data.percentile}%</p>
            <p className="text-white/50 text-sm">aller Hörer dieses Jahr</p>
          </div>
        </div>
      </div>
      
      {/* Final stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: musicalNotesOutline, value: data.totalTracks, label: 'Songs', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/20' },
          { icon: micOutline, value: data.uniqueArtists, label: 'Artists', color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/20' },
          { icon: radioOutline, value: 3, label: 'Sender', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/20' },
        ].map(stat => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-center border backdrop-blur-xl`}>
            <IonIcon icon={stat.icon} className="text-2xl text-white/70 mb-1" />
            <p className="text-white font-black text-2xl">{stat.value}</p>
            <p className="text-white/50 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
      
      {/* Outro */}
      <div className="text-center">
        <p className="text-white/40 text-sm mb-5">Danke für ein großartiges Musikjahr!</p>
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow cursor-pointer">
          <IonIcon icon={sparklesOutline} className="text-2xl" />
          <span>Auf ein episches 2027!</span>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN FEED COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */

const Feed = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [recapData, setRecapData] = useState<RecapData | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const stationApi = useMemo(
    () => new RadioStationAPIStub(recapStubData.stations),
    [],
  );
  const nowPlayingApi = useMemo(() => new NowPlayingAPIStub(), []);

  useEffect(() => {
    Object.entries(recapStubData.history).forEach(([stationId, tracks]) => {
      if (tracks.length > 0) {
        nowPlayingApi.setMockTrack(stationId, tracks[0]);
      }
      nowPlayingApi.setMockHistory(stationId, tracks);
    });
  }, [nowPlayingApi]);

  useEffect(() => {
    const loadRecap = async () => {
      const stations = await stationApi.getAllStations();
      const stationHistories = await Promise.all(
        stations.map(async station => ({
          station,
          tracks: await nowPlayingApi.getTrackHistory(station.id, 100),
        })),
      );

      const allTracks = stationHistories.flatMap(item => item.tracks);
      const totalSeconds = allTracks.reduce((sum, track) => sum + (track.duration || 0), 0);
      const totalMinutes = Math.round(totalSeconds / 60);
      const uniqueArtists = new Set(allTracks.map(track => track.artist)).size;
      const topArtists = getTopItems(allTracks.map(track => track.artist), 5);
      const topTracks = getTopItems(allTracks.map(track => track.title), 5);
      
      const topStation = stationHistories.reduce(
        (max, item) => item.tracks.length > max.tracks.length ? item : max,
        stationHistories[0],
      );

      const hourCounts = allTracks.reduce((acc, track) => {
        const hour = track.startTime ? track.startTime.getHours() : 12;
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      const peakHour = Number(
        Object.keys(hourCounts).sort((a, b) => hourCounts[Number(b)] - hourCounts[Number(a)])[0] || 18,
      );

      const genreCounts = stationHistories.reduce((acc, item) => {
        acc[item.station.genre] = (acc[item.station.genre] || 0) + item.tracks.length;
        return acc;
      }, {} as Record<string, number>);
      
      const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Indie Pop';

      const topAlbum = getTopItems(allTracks.filter(t => t.album).map(t => t.album!), 1)[0]?.key || 'Velvet Skies';

      // Simulierte erweiterte Statistiken
      const longestSession = 4200; // 70 min
      const avgTracksPerDay = Math.round(allTracks.length / 7);
      const listenStreak = 12;
      const percentile = 8; // Top 8%
      
      // Mood basierend auf Genre
      const moodMap: Record<string, string> = {
        'Indie Pop': 'Dreamweaver',
        'House': 'Nightowl',
        'Hip-Hop': 'Beatmaster',
      };
      const moodProfile = moodMap[topGenre] || 'Soundexplorer';

      setRecapData({
        totalMinutes,
        totalTracks: allTracks.length,
        uniqueArtists,
        topArtists,
        topTracks,
        topStation,
        topGenre,
        peakHour,
        longestSession,
        avgTracksPerDay,
        topAlbum,
        moodProfile,
        listenStreak,
        percentile,
      });
    };

    loadRecap();
  }, [nowPlayingApi, stationApi]);

  const totalSlides = 5;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < totalSlides - 1) {
        setActiveIndex(prev => prev + 1);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
      }
    }
    setTouchStart(null);
  }, [touchStart, activeIndex]);

  const handlePrev = () => setActiveIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setActiveIndex(prev => Math.min(totalSlides - 1, prev + 1));

  if (!recapData) {
    return (
      <IonPage>
        <IonContent className="bg-[#0a0014]" fullscreen scrollY={false}>
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/30" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
                <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
              </div>
              <p className="text-white/60 text-sm tracking-widest">DEIN RECAP WIRD GELADEN...</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent scrollY={false} fullscreen>
        <div 
          className="h-full w-full relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides Container */}
          <div
            className="h-full flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            <div className="min-w-full h-full">
              <SlideIntro data={recapData} isActive={activeIndex === 0} />
            </div>
            <div className="min-w-full h-full">
              <SlideTopArtist data={recapData} isActive={activeIndex === 1} />
            </div>
            <div className="min-w-full h-full">
              <SlideListeningHabits data={recapData} isActive={activeIndex === 2} />
            </div>
            <div className="min-w-full h-full">
              <SlideStation data={recapData} isActive={activeIndex === 3} />
            </div>
            <div className="min-w-full h-full">
              <SlideSummary data={recapData} isActive={activeIndex === 4} />
            </div>
          </div>

          {/* Progress indicator */}
          <div className="absolute top-4 left-0 right-0 px-6 z-20 safe-area-top">
            <div className="flex gap-1.5">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === activeIndex 
                      ? 'flex-[3] bg-white' 
                      : i < activeIndex
                        ? 'flex-1 bg-white/60'
                        : 'flex-1 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation dots (bottom) */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20 safe-area-bottom">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex 
                    ? 'w-8 h-2.5 bg-white shadow-lg shadow-white/30' 
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Edge Navigation Areas (invisible touch targets) */}
          <button
            type="button"
            aria-label="Vorherige Slide"
            onClick={handlePrev}
            className="absolute left-0 top-0 bottom-0 w-20 z-10 opacity-0"
          />
          <button
            type="button"
            aria-label="Nächste Slide"
            onClick={handleNext}
            className="absolute right-0 top-0 bottom-0 w-20 z-10 opacity-0"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Feed;
