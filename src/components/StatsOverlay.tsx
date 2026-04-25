import { useEffect, useState } from "react";

export interface PlayerData {
  playerName?: string;
  playerId?: string;
  batting?: Record<string, number | string | undefined>;
  bowling?: Record<string, number | string | undefined>;
  fielding?: Record<string, number | string | undefined>;
  meta?: { source?: string; lastUpdated?: string };
}

const StatRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number | undefined;
  highlight?: boolean;
}) => {
  const display =
    value === undefined || value === null || value === "" ? "—" : value;
  const [flash, setFlash] = useState(false);
  const [prev, setPrev] = useState(display);

  useEffect(() => {
    if (display !== prev) {
      setFlash(true);
      setPrev(display);
      const t = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [display, prev]);

  return (
    <div className="flex items-baseline justify-between gap-6 py-1.5 border-b border-overlay-border/10 last:border-b-0">
      <span className="text-overlay-label uppercase tracking-[0.16em] text-[11px] font-medium">
        {label}
      </span>
      <span
        className={`tabular-nums font-bold transition-all duration-500 ${
          highlight ? "text-overlay-accent text-2xl" : "text-overlay-value text-lg"
        } ${flash ? "scale-110 drop-shadow-[0_0_8px_hsl(var(--overlay-accent))]" : "scale-100"}`}
      >
        {display}
      </span>
    </div>
  );
};

const Panel = ({
  title,
  accentSide,
  children,
}: {
  title: string;
  accentSide: "left" | "right";
  children: React.ReactNode;
}) => (
  <div className="overlay-glass rounded-2xl px-6 py-4 min-w-[260px] relative overflow-hidden">
    <div
      className={`absolute top-0 ${accentSide === "left" ? "left-0" : "right-0"} h-full w-1 bg-overlay-accent shadow-[0_0_18px_hsl(var(--overlay-accent))]`}
    />
    <div className="mb-2 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-overlay-accent shadow-[0_0_8px_hsl(var(--overlay-accent))]" />
      <h2 className="text-overlay-accent text-xs font-semibold uppercase tracking-[0.28em]">
        {title}
      </h2>
    </div>
    <div className="flex flex-col">{children}</div>
  </div>
);

const StatsOverlay = ({ data }: { data: PlayerData | null }) => {
  const batting = data?.batting ?? {};
  const bowling = data?.bowling ?? {};
  const fielding = data?.fielding ?? {};

  const lastUpdated = data?.meta?.lastUpdated
    ? new Date(data.meta.lastUpdated).toLocaleTimeString()
    : null;

  return (
    <main className="fixed inset-0 flex items-center justify-between p-6 bg-transparent overflow-hidden">
      {/* Left Side - Bowling */}
      <Panel title="Bowling" accentSide="left">
        <StatRow label="Wickets" value={bowling.wickets} highlight />
        <StatRow label="Matches" value={bowling.matches} />
        <StatRow label="Innings" value={bowling.innings} />
        <StatRow label="Overs" value={bowling.overs} />
        <StatRow label="Economy" value={bowling.economy} />
        <StatRow label="Average" value={bowling.avg} />
        <StatRow label="Best" value={bowling.bestbowling} />
        <StatRow label="Dot Balls" value={bowling.dotballs} />
      </Panel>

      {/* Center - Name, Image, and Fielding */}
      <div className="flex flex-col items-center justify-center gap-4 flex-1">
        {/* Player Name */}
        {data?.playerName && (
          <div className="overlay-glass rounded-full px-7 py-2 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-overlay-accent animate-pulse shadow-[0_0_10px_hsl(var(--overlay-accent))]" />
            <h1 className="text-overlay-value text-2xl font-bold tracking-wide">
              {data.playerName}
            </h1>
            {data.playerId && (
              <span className="text-overlay-label text-[10px] uppercase tracking-[0.2em]">
                #{data.playerId}
              </span>
            )}
          </div>
        )}

        {/* Player Image Box */}
        <div 
          className="rounded-2xl overflow-hidden border-2 shadow-lg"
          style={{
            borderColor: "#0ea5e9",
            boxShadow: "0 0 30px rgba(14, 165, 233, 0.4), inset 0 0 20px rgba(14, 165, 233, 0.1)",
            width: "260px",
            height: "346px",
          }}
        >
          <img 
            src={`/assets/players/${data?.playerId}.png`}
            alt={data?.playerName || "Player"} 
            className="w-full h-full object-contain bg-black/20"
          />
        </div>

        {/* Fielding Stats */}
        {(fielding.catches !== undefined || fielding.runouts !== undefined) && (
          <div className="overlay-glass rounded-full px-6 py-2 flex items-center gap-6 text-sm">
            <span className="text-overlay-label uppercase tracking-[0.2em] text-[10px] font-semibold">
              Fielding
            </span>
            <span className="text-overlay-value font-bold tabular-nums">
              <span className="text-overlay-label text-[10px] uppercase tracking-wider mr-1.5">Catches</span>
              {fielding.catches ?? "—"}
            </span>
            <span className="text-overlay-value font-bold tabular-nums">
              <span className="text-overlay-label text-[10px] uppercase tracking-wider mr-1.5">Run Outs</span>
              {fielding.runouts ?? "—"}
            </span>
            <span className="text-overlay-value font-bold tabular-nums">
              <span className="text-overlay-label text-[10px] uppercase tracking-wider mr-1.5">Stumpings</span>
              {fielding.stumpings ?? "—"}
            </span>
          </div>
        )}

        {/* Timestamp */}
        {lastUpdated && (
          <div className="text-overlay-label/60 text-[10px] uppercase tracking-[0.25em]">
            Live · Updated {lastUpdated}
          </div>
        )}
      </div>

      {/* Right Side - Batting */}
      <Panel title="Batting" accentSide="right">
        <StatRow label="Runs" value={batting.runs} highlight />
        <StatRow label="Matches" value={batting.matches} />
        <StatRow label="Innings" value={batting.innings} />
        <StatRow label="Highest" value={batting.highestruns} />
        <StatRow label="Average" value={batting.avg} />
        <StatRow label="Strike Rate" value={batting.sr} />
        <StatRow label="Fours" value={batting["4s"]} />
        <StatRow label="Sixes" value={batting["6s"]} />
      </Panel>
    </main>
  );
};

export default StatsOverlay;
