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

  useEffect(() => {
    if (!open) return;
    openVideoModal();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    setLoading(true);
    getIdentity().then((id) => setAlias(id.alias)).catch(() => {});
    // Push our latest score first, then fetch, so we appear immediately.
    recordSession(getSessionSeconds())
      .catch(() => {})
      .finally(() => {
        fetchLeaderboard(20)
          .then(setEntries)
          .catch(() => {})
          .finally(() => setLoading(false));
      });

    const tick = window.setInterval(() => setNow(getSessionSeconds()), 1000);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearInterval(tick);
      closeVideoModal();
    };
  }, [open, onClose]);

  if (!open) return null;

  const myIndex = entries.findIndex((e) => e.alias === alias);

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
              {entries.map((e, i) => {
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

        <div className="px-5 py-3 border-t border-border/60 text-[10px] tracking-widest uppercase text-muted-foreground flex justify-between">
          <span>
            {myIndex >= 0 ? `${t("lb.rank")} #${(myIndex + 1).toString().padStart(2, "0")}` : t("lb.unranked")}
          </span>
          <span>{t("lb.hint")}</span>
        </div>
      </div>
    </div>
  );
}
