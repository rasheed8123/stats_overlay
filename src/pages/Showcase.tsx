import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import CountUp from "react-countup";
import type { PlayerData } from "@/components/StatsOverlay";

const API_URL = "https://stats-server-sr17.onrender.com/api/current-player-stats";

// Custom hook for staggered animation
const useStaggerAnimation = (items: number, baseDelay = 0) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    refs.current.forEach((ref, idx) => {
      if (!ref) return;
      gsap.fromTo(
        ref,
        { opacity: 0, y: 40, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: baseDelay + idx * 0.12,
          ease: "elastic.out(1.2, 0.5)",
        }
      );
    });
  }, [baseDelay]);

  return refs;
};

const toNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^\d.-]/g, ""));
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

/* ====================================================
   PREMIUM STAT CARD WITH ADVANCED ANIMATIONS
==================================================== */
const StatCard = ({
  label,
  value,
  decimals = 0,
  suffix = "",
  align = "left",
  delay = 0,
  icon,
}: {
  label: string;
  value: number | string;
  decimals?: number;
  suffix?: string;
  align?: "left" | "right";
  delay?: number;
  icon?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const isNumeric = typeof value === "number";

  useEffect(() => {
    if (!ref.current) return;

    // Set initial state
    gsap.set(ref.current, {
      opacity: 0,
      x: align === "left" ? -100 : 100,
      rotateY: align === "left" ? -35 : 35,
      rotateX: 15,
      filter: "blur(15px)",
      scale: 0.7,
    });

    // Entrance animation with perspective
    gsap.to(
      ref.current,
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        rotateX: 0,
        filter: "blur(0px)",
        scale: 1,
        duration: 1.2,
        delay,
        ease: "back.out(1.3)",
        force3D: true,
      }
    );

    // Subtle glow pulse on hover only
    if (bgRef.current) {
      const originalShadow = bgRef.current.style.boxShadow;
      bgRef.current.addEventListener('mouseenter', () => {
        gsap.to(bgRef.current, {
          boxShadow: "0 8px 48px rgba(217, 119, 6, 0.35), inset 0 0 32px rgba(251, 191, 36, 0.12)",
          duration: 0.4,
          ease: "power2.out",
        });
      });
      bgRef.current.addEventListener('mouseleave', () => {
        gsap.to(bgRef.current, {
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2), inset 0 0 32px rgba(255, 255, 255, 0.04)",
          duration: 0.4,
          ease: "power2.out",
        });
      });
    }
  }, [align, delay]);

  return (
    <div
      ref={ref}
      style={{ perspective: "1200px" }}
      className={`group relative min-w-[140px]`}
    >
      <div
        ref={bgRef}
        className={`relative backdrop-blur-lg bg-gradient-to-br from-yellow-900/30 to-yellow-950/20 
          rounded-2xl px-3 py-2.5 border-2 border-yellow-400/50
          ${align === "right" ? "text-right" : "text-left"}
          hover:scale-115 hover:border-yellow-300/80 transition-all duration-300 cursor-default
          shadow-2xl overflow-hidden group`}
        style={{
          boxShadow: "0 10px 50px rgba(217, 119, 6, 0.4), inset 0 0 40px rgba(217, 119, 6, 0.15), 0 0 30px rgba(217, 119, 6, 0.25)"
        }}
      >
        {/* Premium shimmer and glow */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute -inset-x-full -inset-y-1/2 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent 
            skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
        </div>
        
        {/* Enhanced glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(250, 204, 21, 0.25), transparent 50%)",
          }} />
        {/* Premium gold shine effect */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute -inset-x-full -inset-y-1/2 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent 
            skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Gold glow on hover */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(217, 119, 6, 0.15), transparent 50%)",
          }} />

        {/* Content */}
        <div className="relative z-10">
          <div className={`flex items-center gap-1.5 mb-2 ${align === "right" ? "justify-end" : ""}`}>
            {icon && <span className="text-lg">{icon}</span>}
            <span className="text-yellow-200 uppercase text-[7px] tracking-[0.2em] font-black letter-spacing">
              {label}
            </span>
          </div>
          <div className="text-yellow-100 text-2xl font-black tabular-nums leading-tight mb-2"
            style={{ 
              textShadow: "0 0 25px rgba(217, 119, 6, 0.7), 0 0 50px rgba(217, 119, 6, 0.3)",
              filter: "drop-shadow(0 2px 10px rgba(0, 0, 0, 0.7))"
            }}>
            {isNumeric ? (
              <CountUp end={value as number} duration={2.5} decimals={decimals} separator="," />
            ) : (
              value
            )}
            {suffix && <span className="text-white/50 text-2xl ml-1">{suffix}</span>}
          </div>
          <div className={`h-0.5 w-5 bg-gradient-to-r 
            ${align === "right" ? "ml-auto from-transparent to-yellow-300" : "from-yellow-300 to-transparent"}
            rounded-full`} />
        </div>
      </div>
    </div>
  );
};

/* ====================================================
   ANIMATED STAT SECTION CONTAINER
==================================================== */
const StatsSection = ({
  title,
  icon,
  stats,
  align = "left",
  delay = 0,
}: {
  title: string;
  icon: string;
  stats: Array<{ label: string; value: number | string; decimals?: number }>;
  align?: "left" | "right";
  delay?: number;
}) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, x: align === "left" ? -80 : 80, scale: 0.8 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.9,
        delay,
        ease: "power3.out",
      }
    );
  }, [align, delay]);

  return (
    <div ref={containerRef} className={`flex flex-col gap-6 ${align === "right" ? "items-end" : ""}`}>
      <div ref={titleRef} className="relative mb-4">
        <div className="flex items-center gap-3" style={{ flexDirection: align === "right" ? "row-reverse" : "row" }}>
          <div className="h-[2px] w-12 bg-gradient-to-r from-white/40 to-transparent rounded-full" />
          <h2 className="text-white text-xl font-black uppercase tracking-[0.25em]" style={{
            textShadow: "0 0 15px rgba(251, 191, 36, 0.3)"
          }}>
            {icon} {title}
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-5 w-full">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            decimals={stat.decimals || 0}
            align={align}
            delay={delay + 0.15 + idx * 0.08}
          />
        ))}
      </div>
    </div>
  );
};

const Showcase = () => {
  const [params] = useSearchParams();
  const [data, setData] = useState<PlayerData | null>(null);
  const previousDataRef = useRef<PlayerData | null>(null);

  // Import premium Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  /* ============= FETCH DATA ============= */
  useEffect(() => {
    let cancelled = false;
    const playerId = params.get("playerId");
    
    const fetchData = async () => {
      try {
        const url = playerId ? `${API_URL}?playerId=${playerId}` : API_URL;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && json?.status === "success") {
          setData(json.data);
        }
      } catch (err) {
        console.error("Error fetching player data:", err);
      }
    };

    fetchData();
    const id = setInterval(fetchData, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [params]);

  /* ============= MOUSE PARALLAX ============= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 25;

      gsap.to(heroRef.current, {
        x,
        y,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  /* ============= MAIN TIMELINE ANIMATION ============= */
  useEffect(() => {
    if (!data) return;
    
    // Only animate if data has actually changed
    const dataChanged = JSON.stringify(previousDataRef.current) !== JSON.stringify(data);
    if (!dataChanged) return;
    previousDataRef.current = data;

    // Initialize all elements that will be animated
    gsap.set(leftSectionRef.current, { opacity: 0, x: -100 });
    gsap.set(rightSectionRef.current, { opacity: 0, x: 100 });
    gsap.set(nameRef.current, { opacity: 0, y: 50 });
    gsap.set(heroRef.current, { opacity: 0, scale: 1.3 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Background fade in
    gsap.set(backgroundRef.current, { opacity: 1 });

    // Hero image with zoom and blur entrance
    if (heroRef.current) {
      tl.fromTo(
        heroRef.current,
        {
          scale: 1.3,
          opacity: 0,
          filter: "blur(25px)",
        },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
        },
        0.2
      );
    }

    // Player name with clip animation
    if (nameRef.current) {
      tl.fromTo(
        nameRef.current,
        {
          opacity: 0,
          y: 50,
          letterSpacing: "0.3em",
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.05em",
          scale: 1,
          duration: 1,
        },
        0.6
      );
    }

    // Left section (batting stats)
    if (leftSectionRef.current) {
      tl.fromTo(
        leftSectionRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1, ease: "back.out(1.2)" },
        0.8
      );
    }

    // Right section (bowling stats)
    if (rightSectionRef.current) {
      tl.fromTo(
        rightSectionRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 1, ease: "back.out(1.2)" },
        0.8
      );
    }

    // Floating particles
    const particles = particlesRef.current?.querySelectorAll(".particle");
    if (particles) {
      particles.forEach((particle, idx) => {
        tl.fromTo(
          particle,
          { opacity: 0, scale: 0 },
          { opacity: 0.8, scale: 1, duration: 0.6, delay: idx * 0.05 },
          0.3
        );
      });
    }
  }, [data]);

  /* ============= RENDER ============= */
  const batting = data?.batting ?? {};
  const bowling = data?.bowling ?? {};
  const fielding = data?.fielding ?? {};
  const captain = (data as any)?.captain ?? {};
  const rawData = (data as any)?.raw ?? {};

  // Build stats from raw data
  const allBattingStats = (rawData.batting || []).map((item: any) => ({
    label: item.title,
    value: isNaN(item.value) ? item.value : toNum(item.value),
    decimals: typeof item.value === "string" && item.value.includes(".") ? 2 : 0,
  }));

  const allBowlingStats = (rawData.bowling || []).map((item: any) => ({
    label: item.title,
    value: isNaN(item.value) ? item.value : toNum(item.value),
    decimals: typeof item.value === "string" && item.value.includes(".") ? 2 : 0,
  }));

  // Filter to most useful stats (3 columns × 4 rows = 12 items)
  const usefulBattingLabels = ["Matches", "Innings", "Runs", "Highest Runs", "Average", "SR", "4s", "6s", "50s", "100s", "Not out", "Ducks"];
  const usefulBowlingLabels = ["Matches", "Innings", "Overs", "Wickets", "Runs", "Best Bowling", "Economy", "Average", "SR", "Maidens", "Dot Balls", "3 Wickets"];

  const battingStats = allBattingStats.filter(stat => usefulBattingLabels.includes(stat.label)).slice(0, 12);
  const bowlingStats = allBowlingStats.filter(stat => usefulBowlingLabels.includes(stat.label)).slice(0, 12);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-black"
      style={{ perspective: "1200px" }}
    >
      {/* ===== BACKGROUND LAYERS - ROBOTIC CYAN & PURPLE ===== */}
      <div ref={backgroundRef} className="absolute inset-0">
        {/* Primary gradient - dark blue to deep purple */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #000000 0%, #0a0e1a 20%, #0d1628 40%, #1a0f2e 60%, #0d1628 80%, #000000 100%)"
        }} />

        {/* Cyan overlay */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(0, 0, 0, 0.95), transparent 50%, rgba(10, 14, 26, 0.9))",
        }} />

        {/* Neon cyan accent glow */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 1200px 800px at 50% 50%, rgba(0, 212, 255, 0.15), transparent 70%)",
        }} />

        {/* Purple accent glow */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 1400px 900px at 60% 40%, rgba(217, 31, 239, 0.1), transparent 70%)",
        }} />

        {/* Cyan blob */}
        <div className="absolute -top-80 left-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
        
        {/* Cyan accent blob */}
        <div className="absolute top-1/4 -left-40 w-72 h-72 rounded-full bg-cyan-400/5 blur-3xl" />
        
        {/* Purple accent */}
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-purple-500/8 blur-3xl" />
        
        {/* Cyan glow blob */}
        <div className="absolute bottom-32 -right-20 w-64 h-64 rounded-full bg-cyan-400/8 blur-3xl" />
      </div>



      {/* ===== FLOATING PARTICLES - GOLD THEME ===== */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => {
          const colors = [
            { glow: "rgba(251, 191, 36, 0.8)", shadow: "rgba(251, 191, 36, 0.6)" }, // Gold
            { glow: "rgba(217, 119, 6, 0.8)", shadow: "rgba(217, 119, 6, 0.6)" }, // Dark Gold
            { glow: "rgba(245, 158, 11, 0.8)", shadow: "rgba(245, 158, 11, 0.6)" }, // Amber
          ];
          const color = colors[i % colors.length];
          return (
            <div
              key={i}
              className="particle absolute w-2 h-2 rounded-full blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: color.glow,
                boxShadow: `0 0 12px ${color.shadow}, 0 0 24px ${color.glow}`,
                animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          );
        })}
      </div>

      {/* ===== MAIN LAYOUT - ROBOTIC CENTERED DESIGN ===== */}
      <div className="absolute inset-0 flex flex-col p-3 md:p-6 lg:p-8 overflow-hidden">
        {/* TOP SECTION - BBL LOGO & PLAYER NAME */}
        <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-8">
          {/* BBL LOGO */}
          <div style={{
            fontSize: "17px",
            fontFamily: "'Orbitron', sans-serif",
            color: "#00d4ff",
            textShadow: "0 0 20px rgba(0, 212, 255, 0.8)",
            letterSpacing: "0.3em",
            fontWeight: 900,
          }}>
            ⚡ BBL BROADCAST ⚡
          </div>

          {/* PLAYER NAME */}
          {data?.playerName && (
            <div className="text-center">
              <h1
                ref={nameRef}
                style={{
                  fontSize: "clamp(28px, 8vw, 56px)",
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #00d4ff, #d946ef)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 40px rgba(0, 212, 255, 0.5), 0 0 60px rgba(217, 31, 239, 0.3)",
                  lineHeight: 1.1,
                  letterSpacing: "0.05em",
                }}
              >
                {data.playerName}
              </h1>
              <div className="flex items-center justify-center gap-3 mt-2">
                <div style={{
                  width: "40px",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #d946ef, transparent)",
                }} />
                <span style={{
                  fontSize: "9px",
                  color: "#00d4ff",
                  textShadow: "0 0 10px rgba(0, 212, 255, 0.6)",
                  letterSpacing: "0.2em",
                }}>
                  ID: {data?.playerId || "---"}
                </span>
                <div style={{
                  width: "40px",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #00d4ff, transparent)",
                }} />
              </div>
            </div>
          )}
        </div>

        {/* MAIN CONTENT - CENTER IMAGE + SIDE STATS */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 min-h-0 items-stretch">
          {/* LEFT SECTION - BATTING STATS */}
          <div ref={leftSectionRef} className="w-full md:w-1/4 flex flex-col gap-3 overflow-y-auto min-h-0">
            <div style={{
              fontSize: "16px",
              fontFamily: "'Orbitron', sans-serif",
              color: "#00d4ff",
              textShadow: "0 0 15px rgba(0, 212, 255, 0.8)",
              letterSpacing: "0.2em",
              fontWeight: 900,
              paddingBottom: "8px",
              borderBottom: "2px solid rgba(0, 212, 255, 0.4)",
            }}>
              🏏 BATTING
            </div>
            <div className="space-y-1.5 flex-shrink-0">
              {battingStats.slice(0, 16).map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2 py-1 rounded-sm group hover:bg-cyan-500/5 transition-all"
                  style={{
                    opacity: 0,
                    animation: `slideIn 0.6s ease-out ${0.3 + idx * 0.08}s forwards`,
                    borderLeft: "2px solid transparent",
                    borderLeftColor: "rgba(0, 212, 255, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "rgba(0, 212, 255, 0.8)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 15px rgba(0, 212, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "rgba(0, 212, 255, 0.3)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <span style={{
                  fontSize: "15px",
                  color: "#00d4ff",
                  textShadow: "0 0 8px rgba(0, 212, 255, 0.6)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                }}>
                  {stat.label}
                </span>
                  <span style={{
                    fontSize: "18px",
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 900,
                    color: "#d946ef",
                    textShadow: "0 0 10px rgba(217, 31, 239, 0.8)",
                  }}>
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER SECTION - PLAYER IMAGE */}
          <div className="w-full md:w-1/2 flex items-center justify-center min-h-0 px-0 md:px-4">
            <div
              ref={heroRef}
              className="relative w-3/5 md:w-1/2 aspect-[3/4] rounded-2xl overflow-hidden group"
              style={{
                border: "3px solid #00d4ff",
                borderRight: "3px solid #d946ef",
                borderBottom: "3px solid #d946ef",
                background: "linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(217, 31, 239, 0.05))",
                boxShadow: `
                  0 0 40px rgba(0, 212, 255, 0.6),
                  0 0 60px rgba(217, 31, 239, 0.4),
                  0 20px 60px rgba(0, 0, 0, 0.8),
                  inset 0 0 40px rgba(0, 212, 255, 0.15),
                  inset 0 0 30px rgba(217, 31, 239, 0.1)
                `,
              }}
            >
              <img
                src={`/assets/players/${data?.playerId}.png`}
                alt="Player"
                className="w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-1000"
              />
              
              {/* Neon overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 via-transparent to-purple-900/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

              {/* Cyber corner markers */}
              <div className="absolute top-2 left-2 w-4 h-4 border-2 border-cyan-400" style={{boxShadow: "0 0 10px rgba(0, 212, 255, 0.8)"}} />
              <div className="absolute top-2 right-2 w-4 h-4 border-2 border-purple-400" style={{boxShadow: "0 0 10px rgba(217, 31, 239, 0.8)"}} />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-2 border-purple-400" style={{boxShadow: "0 0 10px rgba(217, 31, 239, 0.8)"}} />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-2 border-cyan-400" style={{boxShadow: "0 0 10px rgba(0, 212, 255, 0.8)"}} />

              {/* Glowing accent blobs */}
              <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-gradient-to-br from-cyan-500/30 to-transparent blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-gradient-to-tr from-purple-500/25 to-transparent blur-3xl" />
            </div>
          </div>

          {/* RIGHT SECTION - BOWLING STATS */}
          <div ref={rightSectionRef} className="w-full md:w-1/4 flex flex-col gap-3 overflow-y-auto min-h-0">
            <div style={{
              fontSize: "16px",
              fontFamily: "'Orbitron', sans-serif",
              color: "#d946ef",
              textShadow: "0 0 15px rgba(217, 31, 239, 0.8)",
              letterSpacing: "0.2em",
              fontWeight: 900,
              paddingBottom: "8px",
              borderBottom: "2px solid rgba(217, 31, 239, 0.4)",
            }}>
              🎯 BOWLING
            </div>
            <div className="space-y-1.5 flex-shrink-0">
              {bowlingStats.slice(0, 16).map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2 py-1 rounded-sm group hover:bg-purple-500/5 transition-all"
                  style={{
                    opacity: 0,
                    animation: `slideIn 0.6s ease-out ${0.3 + idx * 0.08}s forwards`,
                    borderRight: "2px solid transparent",
                    borderRightColor: "rgba(217, 31, 239, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderRightColor = "rgba(217, 31, 239, 0.8)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 15px rgba(217, 31, 239, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderRightColor = "rgba(217, 31, 239, 0.3)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <span style={{
                    fontSize: "18px",
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 900,
                    color: "#00d4ff",
                    textShadow: "0 0 10px rgba(0, 212, 255, 0.8)",
                  }}>
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </span>
                  <span style={{
                    fontSize: "15px",
                    color: "#d946ef",
                    textShadow: "0 0 8px rgba(217, 31, 239, 0.6)",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                  }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== VIGNETTE - ROBOTIC CYAN & PURPLE ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/60 to-transparent" />
        
        {/* Neon edge glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent blur-xl" />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent blur-xl" />
      </div>

      {/* ===== GLOBAL ANIMATIONS ===== */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-100vh) translateX(var(--tx, 0px)); opacity: 0; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(80px, 80px); }
        }

        .particle {
          --tx: ${Math.random() * 200 - 100}px;
        }

        /* Smooth font rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Enable 3D transforms */
        html {
          perspective: 1200px;
        }
      `}</style>
    </div>
  );
};

export default Showcase;
