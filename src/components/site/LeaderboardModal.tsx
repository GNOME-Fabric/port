import { useEffect, useState } from "react";
import { X, Trophy } from "lucide-react";
import {
  fetchLeaderboard,
  formatDuration,
  getIdentity,
  recordSession,
  type LeaderboardEntry,
} from "@/lib/leaderboard";
import { getSessionSeconds } from "@/hooks/use-session-recorder";
import { useI18n } from "@/lib/i18n";
import { openVideoModal, closeVideoModal } from "@/lib/modal-state";

type Props = { open: boolean; onClose: () => void };

export function LeaderboardModal({ open, onClose }: Props) {
  const { t } = useI18n();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(() => getSessionSeconds());
  const [alias, setAlias] = useState("");
  const [nextRefresh, setNextRefresh] = useState(60);

  useEffect(() => {
    if (!open) return;
    openVideoModal();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    setLoading(true);
    getIdentity().then((id) => setAlias(id.alias)).catch(() => {});

    const refresh = () => {
      setNextRefresh(60);
      return recordSession(getSessionSeconds())
        .catch(() => {})
        .finally(() => {
          fetchLeaderboard(20)
            .then(setEntries)
            .catch(() => {})
            .finally(() => setLoading(false));
        });
    };

    refresh();

    const tick = window.setInterval(() => {
      setNow(getSessionSeconds());
      setNextRefresh((n) => (n <= 1 ? 60 : n - 1));
    }, 1000);
    const poll = window.setInterval(refresh, 60000);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearInterval(tick);
      window.clearInterval(poll);
      closeVideoModal();
    };
  }, [open, onClose]);

  if (!open) return null;

  // Keep the current user's row in sync with the live "this session" counter,
  // so the ranking never lags behind the ticker the user is watching.
  const liveEntries = (() => {
    if (!alias) return entries;
    const idx = entries.findIndex((e) => e.alias === alias);
    if (idx >= 0) {
      const boosted = Math.max(entries[idx].longest_seconds, now);
      const next = entries.map((e, i) =>
        i === idx ? { ...e, longest_seconds: boosted } : e
      );
      next.sort((a, b) => b.longest_seconds - a.longest_seconds);
      return next;
    }
    // Not in the fetched top N yet — inject a provisional row so the user sees themselves.
    const provisional: LeaderboardEntry = {
      alias,
      longest_seconds: now,
      updated_at: new Date().toISOString(),
    };
    return [...entries, provisional].sort((a, b) => b.longest_seconds - a.longest_seconds);
  })();

  const myIndex = liveEntries.findIndex((e) => e.alias === alias);

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

        <div className="max-h-[50vh] overflow-y-auto px-5 py-3">
          {loading && entries.length === 0 ? (
            <div className="text-xs text-muted-foreground py-6 text-center">{t("lb.loading")}</div>
          ) : entries.length === 0 ? (
            <div className="text-xs text-muted-foreground py-6 text-center">{t("lb.empty")}</div>
          ) : (
            <ol className="space-y-1">
              {liveEntries.map((e, i) => {
                const isMe = e.alias === alias;
                return (
                  <li
                    key={e.alias}
                    className={`flex items-center justify-between font-mono text-sm py-2 px-3 rounded ${
                      isMe ? "bg-accent/10 text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[10px] w-6 text-right opacity-60">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <span className={isMe ? "text-accent" : ""}>{e.alias}</span>
                      {isMe && (
                        <span className="text-[9px] uppercase tracking-widest text-accent/70">
                          {t("lb.youTag")}
                        </span>
                      )}
                    </span>
                    <span className="tabular-nums text-foreground">
                      {formatDuration(e.longest_seconds)}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border/60 text-[10px] tracking-widest uppercase text-muted-foreground flex items-center justify-between">
          <span>
            {myIndex >= 0 ? `${t("lb.rank")} #${(myIndex + 1).toString().padStart(2, "0")}` : t("lb.unranked")}
          </span>
          <span className="flex items-center gap-2" title={`Next update in ${nextRefresh}s`}>
            <svg width="14" height="14" viewBox="0 0 20 20" className="-rotate-90">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-20" />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray={2 * Math.PI * 8}
                strokeDashoffset={2 * Math.PI * 8 * (1 - nextRefresh / 60)}
                className="text-accent transition-[stroke-dashoffset] duration-1000 ease-linear"
                style={{ stroke: "currentColor" }}
              />
            </svg>
            <span className="tabular-nums">{nextRefresh.toString().padStart(2, "0")}s</span>
          </span>
        </div>
      </div>
    </div>
  );
}
