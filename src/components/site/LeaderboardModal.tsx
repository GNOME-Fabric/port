import { useEffect, useMemo, useState } from "react";
import { X, Trophy, Radio } from "lucide-react";
import {
  formatDuration,
  getIdentity,
  recordSession,
  type LeaderboardEntry,
} from "@/lib/leaderboard";
import { getSessionSeconds } from "@/hooks/use-session-recorder";
import { useLeaderboardStore } from "@/lib/leaderboard-store";
import { useLivePresence } from "@/lib/presence";
import { useFlip } from "@/hooks/use-flip";
import { useI18n } from "@/lib/i18n";
import { openVideoModal, closeVideoModal } from "@/lib/modal-state";

const TOP_N = 10;

function capWithSelf<T>(list: T[], isSelf: (item: T) => boolean, n = TOP_N) {
  if (list.length <= n) return { visible: list, selfBelow: false, selfIdx: list.findIndex(isSelf) };
  const top = list.slice(0, n);
  const selfIdx = list.findIndex(isSelf);
  if (selfIdx < 0 || selfIdx < n) {
    return { visible: top, selfBelow: false, selfIdx };
  }
  return { visible: [...top, list[selfIdx]], selfBelow: true, selfIdx };
}

type Props = { open: boolean; onClose: () => void };

export function LeaderboardModal({ open, onClose }: Props) {
  const { t } = useI18n();
  const { entries, loading } = useLeaderboardStore();
  const liveMap = useLivePresence();
  const [now, setNow] = useState(() => getSessionSeconds());
  const [alias, setAlias] = useState("");

  useEffect(() => {
    if (!open) return;
    openVideoModal();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    getIdentity().then((id) => setAlias(id.alias)).catch(() => {});
    recordSession(getSessionSeconds()).catch(() => {});

    const tick = window.setInterval(() => setNow(getSessionSeconds()), 1000);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearInterval(tick);
      closeVideoModal();
    };
  }, [open, onClose]);

  // Live list: everyone currently connected via presence, sorted by seconds desc.
  // Force the current user's row to always reflect the local ticker (avoids any
  // lag between our 2s presence push and the 1s ticker).
  const liveList = useMemo(() => {
    const list = Object.values(liveMap).map((p) =>
      p.alias === alias ? { ...p, seconds: Math.max(p.seconds, now) } : p
    );
    // Ensure self appears even before the first presence sync round-trip.
    if (alias && !list.some((p) => p.alias === alias)) {
      list.push({ alias, seconds: now });
    }
    list.sort((a, b) => b.seconds - a.seconds);
    return list;
  }, [liveMap, alias, now]);

  const myLiveRank = liveList.findIndex((p) => p.alias === alias);

  const liveCapped = useMemo(
    () => capWithSelf(liveList, (p) => p.alias === alias),
    [liveList, alias]
  );
  const recordsCapped = useMemo(
    () => capWithSelf(entries, (e) => e.alias === alias),
    [entries, alias]
  );

  const liveFlipRef = useFlip<HTMLOListElement>(liveCapped.visible.map((p) => p.alias));

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-lg border border-border bg-card/95 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="font-heading text-2xl tracking-widest text-foreground">
              {t("lb.title")}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label={t("lb.close")}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pt-4 pb-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
          {t("lb.subtitle")}
        </div>

        <div className="px-5 pb-4 flex items-baseline justify-between border-b border-border/60">
          <div>
            <div className="text-[10px] tracking-widest uppercase text-muted-foreground">
              {t("lb.you")}
            </div>
            <div className="font-mono text-sm text-foreground">{alias}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-widest uppercase text-muted-foreground">
              {t("lb.session")}
            </div>
            <div className="font-heading text-2xl text-accent tabular-nums text-glow">
              {formatDuration(now)}
            </div>
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {/* LIVE NOW */}
          <div className="px-5 pt-3 pb-1 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
                <span className="relative rounded-full h-2 w-2 bg-accent" />
              </span>
              {t("lb.liveNow")}
            </div>
            <div className="text-[10px] tracking-widest uppercase text-muted-foreground tabular-nums">
              {liveList.length.toString().padStart(2, "0")} {t("lb.liveCount")}
            </div>
          </div>
          <div className="px-3 pb-3">
            {liveList.length === 0 ? (
              <div className="text-xs text-muted-foreground py-4 text-center">
                {t("lb.noLive")}
              </div>
            ) : (
              <ol className="space-y-1">
                {liveList.map((p, i) => {
                  const isMe = p.alias === alias;
                  return (
                    <li
                      key={`live-${p.alias}`}
                      className={`flex items-center justify-between font-mono text-sm py-2 px-3 rounded ${
                        isMe ? "bg-accent/10 text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-[10px] w-6 text-right opacity-60">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
                          <span className="relative rounded-full h-1.5 w-1.5 bg-accent" />
                        </span>
                        <span className={isMe ? "text-accent" : ""}>{p.alias}</span>
                        {isMe && (
                          <span className="text-[9px] uppercase tracking-widest text-accent/70">
                            {t("lb.youTag")}
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums text-foreground">
                        {formatDuration(p.seconds)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* RECORDS */}
          <div className="px-5 pt-3 pb-1 flex items-center gap-2 border-t border-border/60">
            <Radio className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              {t("lb.records")}
            </span>
          </div>
          <div className="px-3 pb-3">
            {loading && entries.length === 0 ? (
              <div className="text-xs text-muted-foreground py-4 text-center">
                {t("lb.loading")}
              </div>
            ) : entries.length === 0 ? (
              <div className="text-xs text-muted-foreground py-4 text-center">
                {t("lb.empty")}
              </div>
            ) : (
              <ol className="space-y-1">
                {entries.map((e: LeaderboardEntry, i) => {
                  const isMe = e.alias === alias;
                  return (
                    <li
                      key={`rec-${e.alias}`}
                      className={`flex items-center justify-between font-mono text-sm py-2 px-3 rounded ${
                        isMe ? "bg-accent/5 text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-[10px] w-6 text-right opacity-60">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <span className={isMe ? "text-accent" : ""}>{e.alias}</span>
                      </span>
                      <span className="tabular-nums text-foreground/80">
                        {formatDuration(e.longest_seconds)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border/60 text-[10px] tracking-widest uppercase text-muted-foreground">
          {myLiveRank >= 0
            ? `${t("lb.rank")} #${(myLiveRank + 1).toString().padStart(2, "0")} · ${t("lb.liveNow")}`
            : t("lb.unranked")}
        </div>
      </div>
    </div>
  );
}
