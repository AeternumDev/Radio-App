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

  // IU Hochschule Radio Network Stations
  const stations: RadioStation[] = [
    {
      id: 'iu-main',
      name: 'IU Radio',
      description: 'Das Hauptprogramm der IU Hochschule',
      frequency: '100.1 FM',
      logo: coverA,
      genre: 'Campus Mix',
      streamUrl: 'https://stream.iu-radio.de/main',
    },
    {
      id: 'iu-study',
      name: 'IU Study',
      description: 'Konzentrierte Musik zum Lernen',
      frequency: '100.2 FM',
      logo: coverB,
      genre: 'Focus & Ambient',
      streamUrl: 'https://stream.iu-radio.de/study',
    },
    {
      id: 'iu-beats',
      name: 'IU Beats',
      description: 'Elektronische Musik und aktuelle Hits',
      frequency: '100.3 FM',
      logo: coverC,
      genre: 'Electronic & Pop',
      streamUrl: 'https://stream.iu-radio.de/beats',
    },
  ];

  // Track history for recap statistics
  const history: Record<string, Track[]> = {
    'iu-main': [
      makeTrack('Campus Morning', 'Study Sounds', 212, 35, 'Daily Focus', coverA),
      makeTrack('Lecture Breaks', 'Ambient Works', 198, 62, 'Concentration', coverB),
      makeTrack('Library Sessions', 'Study Sounds', 224, 93, 'Daily Focus', coverA),
      makeTrack('Exam Prep', 'Focus Collective', 205, 127, 'Deep Work', coverC),
      makeTrack('Campus Walk', 'Study Sounds', 238, 170, 'Daily Focus', coverA),
      makeTrack('Coffee Break', 'Lofi Dreams', 201, 210, 'Chill Sessions', coverB),
      makeTrack('Night Study', 'Study Sounds', 195, 250, 'Daily Focus', coverA),
      makeTrack('Group Work', 'Ambient Works', 218, 290, 'Concentration', coverB),
      makeTrack('Final Review', 'Study Sounds', 232, 340, 'Daily Focus', coverA),
      makeTrack('Success Vibes', 'Focus Collective', 189, 380, 'Deep Work', coverC),
    ],
    'iu-study': [
      makeTrack('Deep Focus', 'Concentration FM', 189, 22, 'Study Mode', coverB),
      makeTrack('Mind Clear', 'Concentration FM', 204, 58, 'Study Mode', coverB),
      makeTrack('Brain Waves', 'Study Sounds', 196, 88, 'Alpha State', coverC),
      makeTrack('Flow State', 'Productivity Lab', 214, 120, 'Work Music', coverA),
      makeTrack('Calm Mind', 'Concentration FM', 221, 155, 'Study Mode', coverB),
      makeTrack('Focus Zone', 'Productivity Lab', 207, 200, 'Work Music', coverA),
      makeTrack('Study Loop', 'Study Sounds', 193, 245, 'Alpha State', coverC),
      makeTrack('Peak Hours', 'Concentration FM', 245, 300, 'Study Mode', coverB),
      makeTrack('Deadline Push', 'Productivity Lab', 198, 350, 'Work Music', coverA),
    ],
    'iu-beats': [
      makeTrack('Campus Party', 'IU DJs', 230, 30, 'Weekend Vibes', coverC),
      makeTrack('Study Break', 'Study Sounds', 215, 72, 'Daily Focus', coverA),
      makeTrack('Night Drive', 'IU DJs', 203, 118, 'Weekend Vibes', coverC),
      makeTrack('Semester End', 'Celebration Mix', 226, 168, 'Party Time', coverB),
      makeTrack('Festival Mode', 'IU DJs', 219, 260, 'Weekend Vibes', coverC),
      makeTrack('Victory Lap', 'Celebration Mix', 241, 320, 'Party Time', coverB),
      makeTrack('Future Sounds', 'IU DJs', 208, 375, 'Weekend Vibes', coverC),
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

// Slide 1: Hero Intro - Clean, professional design
const SlideIntro = ({ data, isActive }: { data: RecapData; isActive: boolean }) => (
  <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0014]">
    {/* Subtle gradient background */}
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent" />
    
    {/* Minimal accent */}
    <FloatingOrb delay={0} size={500} color="rgba(99,102,241,0.15)" position={{ top: '-20%', right: '-20%' }} />
    
    <div className={`flex-1 flex flex-col items-center justify-center z-10 px-6 py-8 transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Badge */}
      <div className="mb-6">
        <span className="inline-block px-4 py-2 rounded-md bg-white/5 text-white/70 text-xs font-medium tracking-[0.2em] uppercase border border-white/10">
          Dein Jahresrückblick
        </span>
      </div>
      
      {/* Main title */}
      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl font-semibold text-white mb-2 tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Radio
        </h1>
        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight" style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Recap
        </h1>
        <p className="text-lg text-white/40 mt-3 font-light tracking-wide">2026</p>
      </div>
      
      {/* Stats row */}
      <div className="flex items-center justify-center gap-3 mt-auto pt-8 max-w-full">
        {[
          { value: data.totalTracks, label: 'Songs', icon: musicalNotesOutline },
          { value: Math.round(data.totalMinutes / 60), label: 'Stunden', icon: timeOutline, suffix: 'h' },
          { value: data.uniqueArtists, label: 'Künstler', icon: micOutline },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/10 min-w-[90px] text-center">
            <IonIcon icon={stat.icon} className="text-xl text-indigo-400/80 mb-2" />
            <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-white/50 text-xs font-normal mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      
      {/* Swipe indicator */}
      <div className="mt-auto pt-8 pb-4">
        <div className="flex items-center gap-2 px-4 py-2 text-white/30 text-xs tracking-wider">
          <span>Weiter</span>
          <IonIcon icon={chevronForwardOutline} className="text-sm" />
        </div>
      </div>
    </div>
  </div>
);

// Slide 2: Top Artist Feature - Clean professional design
const SlideTopArtist = ({ data, isActive }: { data: RecapData; isActive: boolean }) => {
  const topArtist = data.topArtists[0];
  const artistTrackCount = topArtist?.count || 0;
  const percentage = Math.round((artistTrackCount / data.totalTracks) * 100);
  
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-slate-950">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent" />
      
      <FloatingOrb delay={0.5} size={400} color="rgba(244,63,94,0.12)" position={{ top: '-10%', left: '-20%' }} />
      
      <div className={`flex-1 flex flex-col justify-center px-6 py-8 z-10 transition-all duration-700 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
        {/* Category label */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1.5 rounded-md bg-rose-500/10 text-rose-300 text-xs font-medium tracking-wider uppercase border border-rose-500/20">
            Top Künstler
          </span>
        </div>
        
        {/* Artist name */}
        <h2 className="text-4xl sm:text-5xl font-semibold text-white leading-tight mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {topArtist?.key || 'Luna Vale'}
        </h2>
        
        {/* Stats card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 mb-6">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <ProgressRing percent={percentage} size={80} strokeWidth={6} color="url(#pinkGradient)" />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#fb7185" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-semibold text-white">{percentage}%</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-sm mb-1">Anteil an allen Wiedergaben</p>
              <p className="text-3xl font-semibold text-white">{artistTrackCount}</p>
              <p className="text-rose-400/80 text-sm">Songs gehört</p>
            </div>
          </div>
        </div>
        
        {/* Other artists list */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <p className="text-white/40 text-xs font-medium tracking-wider uppercase mb-3">Weitere Top-Künstler</p>
          <div className="space-y-2">
            {data.topArtists.slice(1, 4).map((artist, i) => (
              <div key={artist.key} className={`flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/5 transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`} style={{ transitionDelay: `${(i + 1) * 100}ms` }}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                  i === 0 ? 'bg-slate-600/50 text-slate-200' :
                  i === 1 ? 'bg-amber-800/50 text-amber-200' :
                  'bg-white/10 text-white/50'
                }`}>
                  {i + 2}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{artist.key}</p>
                  <p className="text-white/40 text-xs">{artist.count} Wiedergaben</p>
                </div>
                <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                  <div 
                    className="h-full bg-rose-500/70 rounded-full transition-all duration-700"
                    style={{ width: isActive ? `${(artist.count / artistTrackCount) * 100}%` : '0%', transitionDelay: `${(i + 1) * 150}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
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
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
      
      <FloatingOrb delay={0} size={350} color="rgba(20,184,166,0.12)" position={{ top: '-10%', right: '-10%' }} />
      
      <div className={`flex-1 flex flex-col justify-center px-6 py-8 z-10 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1.5 rounded-md bg-teal-500/10 text-teal-300 text-xs font-medium tracking-wider uppercase border border-teal-500/20">
            Hörverhalten
          </span>
        </div>
        
        {/* Main headline */}
        <h2 className="text-2xl font-medium text-white/80 leading-tight mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Du bist ein
        </h2>
        <h2 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6" style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(135deg, #2dd4bf 0%, #22d3ee 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {timeOfDay}-Hörer
        </h2>
        
        {/* Activity chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 mb-5">
          <p className="text-white/40 text-xs font-medium tracking-wider uppercase mb-4">Aktivität über 24 Stunden</p>
          <div className="flex items-end justify-between h-20 gap-0.5 mb-2">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all duration-500 ${
                  i === data.peakHour 
                    ? 'bg-teal-500' 
                    : 'bg-white/15'
                }`}
                style={{ 
                  height: isActive ? `${h * 10}%` : '0%',
                  transitionDelay: isActive ? `${i * 20}ms` : '0ms'
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-white/30 text-xs">
            {hourLabels.map(l => <span key={l}>{l}h</span>)}
          </div>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <p className="text-3xl font-semibold text-white mb-1">{data.listenStreak}</p>
            <p className="text-teal-400/80 text-sm flex items-center justify-center gap-1.5">
              <IonIcon icon={flameOutline} className="text-sm" />
              Tage am Stück
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <p className="text-3xl font-semibold text-white mb-1">{data.avgTracksPerDay}</p>
            <p className="text-cyan-400/80 text-sm flex items-center justify-center gap-1.5">
              <IonIcon icon={flashOutline} className="text-sm" />
              Songs pro Tag
            </p>
          </div>
        </div>
        
        {/* Session info */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <IonIcon icon={headsetOutline} className="text-xl text-teal-400/70 flex-shrink-0" />
            <p className="text-white/70 text-sm leading-relaxed">
              Längste Session: <span className="text-teal-400 font-medium">{formatDuration(data.longestSession)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Slide 4: Top Station & Genre - Clean professional design
const SlideStation = ({ data, isActive }: { data: RecapData; isActive: boolean }) => {
  const station = data.topStation.station;
  
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
      
      <FloatingOrb delay={0.3} size={400} color="rgba(99,102,241,0.12)" position={{ top: '-5%', left: '-15%' }} />
      
      <div className={`flex-1 flex flex-col justify-center px-6 py-8 z-10 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1.5 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-wider uppercase border border-indigo-500/20">
            Meistgehörter Sender
          </span>
        </div>
        
        {/* Station hero card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 mb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 flex-shrink-0">
              {station.logo && (
                <Image src={station.logo} alt="" fill className="object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-tight truncate" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{station.name}</h2>
              <p className="text-white/50 text-sm mt-0.5">{station.frequency}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1.5 bg-indigo-500/15 rounded-lg text-indigo-200 text-xs font-medium border border-indigo-500/20">
              {station.genre}
            </span>
            <span className="px-3 py-1.5 bg-violet-500/15 rounded-lg text-violet-200 text-xs font-medium border border-violet-500/20">
              {data.topStation.tracks.length} Wiedergaben
            </span>
          </div>
          
          <p className="text-white/40 text-sm">{station.description}</p>
        </div>
        
        {/* Top tracks list */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 flex-1 min-h-0 overflow-y-auto">
          <p className="text-white/40 text-xs font-medium tracking-wider uppercase mb-4">Top Songs auf diesem Sender</p>
          <div className="space-y-3">
            {data.topTracks.slice(0, 3).map((track, i) => (
              <div key={track.key} className={`flex items-center gap-3 transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`} style={{ transitionDelay: `${(i + 1) * 100}ms` }}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-sm ${
                  i === 0 ? 'bg-amber-500/20 text-amber-300' :
                  i === 1 ? 'bg-slate-500/20 text-slate-300' :
                  'bg-amber-700/20 text-amber-400'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{track.key}</p>
                  <p className="text-white/40 text-xs">{track.count} Mal gespielt</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Slide 5: Summary & Personality - Clean finale
const SlideSummary = ({ data, isActive }: { data: RecapData; isActive: boolean }) => (
  <div className="h-full w-full flex flex-col relative overflow-hidden bg-slate-950">
    {/* Subtle background */}
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/15 via-transparent to-transparent" />
    
    <FloatingOrb delay={0} size={350} color="rgba(245,158,11,0.1)" position={{ top: '-5%', right: '-10%' }} />
    
    <div className={`flex-1 flex flex-col justify-center px-6 py-8 z-10 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Personality reveal */}
      <div className="text-center mb-6">
        <div className="mb-3">
          <span className="inline-block px-3 py-1.5 rounded-md bg-amber-500/10 text-amber-300 text-xs font-medium tracking-wider uppercase border border-amber-500/20">
            Dein Musikprofil
          </span>
        </div>
        <h2 className="text-2xl font-medium text-white/80 mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Du bist ein</h2>
        <h2 className="text-4xl sm:text-5xl font-semibold" style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {data.moodProfile}
        </h2>
      </div>
      
      {/* Percentile card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 mb-5">
        <div className="flex items-center justify-center gap-4">
          <div className="relative flex-shrink-0">
            <ProgressRing percent={100 - data.percentile} size={70} strokeWidth={5} color="url(#goldGradient)" />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <IonIcon icon={trophyOutline} className="text-lg text-amber-400" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-semibold" style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Top {data.percentile}%</p>
            <p className="text-white/50 text-sm">aller Hörer in diesem Jahr</p>
          </div>
        </div>
      </div>
      
      {/* Final stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { icon: musicalNotesOutline, value: data.totalTracks, label: 'Songs', color: 'bg-rose-500/10 border-rose-500/20' },
          { icon: micOutline, value: data.uniqueArtists, label: 'Künstler', color: 'bg-purple-500/10 border-purple-500/20' },
          { icon: radioOutline, value: 3, label: 'Sender', color: 'bg-blue-500/10 border-blue-500/20' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-3 text-center border backdrop-blur-sm`}>
            <IonIcon icon={stat.icon} className="text-lg text-white/60 mb-1" />
            <p className="text-white font-semibold text-xl">{stat.value}</p>
            <p className="text-white/50 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
      
      {/* Outro */}
      <div className="text-center mt-auto">
        <p className="text-white/40 text-sm mb-4">Danke für ein großartiges Musikjahr</p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white font-medium text-sm">
          Auf 2027
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
      
      const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Campus Mix';

      const topAlbum = getTopItems(allTracks.filter(t => t.album).map(t => t.album!), 1)[0]?.key || 'Daily Focus';

      // Simulierte erweiterte Statistiken
      const longestSession = 4200; // 70 min
      const avgTracksPerDay = Math.round(allTracks.length / 7);
      const listenStreak = 12;
      const percentile = 8; // Top 8%
      
      // Mood basierend auf Genre - IU themed
      const moodMap: Record<string, string> = {
        'Campus Mix': 'Studymaster',
        'Focus & Ambient': 'Fokussiert',
        'Electronic & Pop': 'Trendsetter',
        'Lofi & Chillout': 'Entspannt',
        'Talk & Podcast': 'Wissbegierig',
        'Klassik': 'Kultiviert',
        'World Music': 'Weltgewandt',
        'Top 40 & Charts': 'Trendsetter',
      };
      const moodProfile = moodMap[topGenre] || 'Vielseitig';

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
        <IonContent className="bg-slate-950" fullscreen scrollY={false}>
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
              </div>
              <p className="text-white/50 text-sm">Recap wird geladen...</p>
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
