import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createHash } from "crypto";

const ADJ = [
  "Silent", "Neon", "Ghost", "Timecode", "Retro", "Analog", "Chroma", "Vector",
  "Delta", "Signal", "Muted", "Aperture", "Grain", "Splice", "Cyan", "Vapor",
  "Static", "Frame", "Halo", "Loop",
];
const NOUN = [
  "Editor", "Cutter", "Ghost", "Router", "Signal", "Cursor", "Render", "Scene",
  "Layer", "Buffer", "Reel", "Mask", "Beam", "Node", "Pulse",
];

function extractIp(req: Request): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  const ip =
    h.get("cf-connecting-ip") ||
    (fwd ? fwd.split(",")[0] : null) ||
    h.get("x-real-ip") ||
    h.get("true-client-ip") ||
    "unknown";
  return ip.trim();
}

export const getIpIdentity = createServerFn({ method: "GET" }).handler(async () => {
  const req = getRequest();
  const ip = extractIp(req);
  const salt = process.env.LEADERBOARD_SALT || "matsuo-leaderboard-v1-salt";
  // Hash IP with salt — the raw IP is never stored or returned.
  const hash = createHash("sha256").update(`${salt}|${ip}`).digest("hex");
  const n1 = parseInt(hash.slice(0, 8), 16);
  const n2 = parseInt(hash.slice(8, 16), 16);
  const suffix = hash.slice(16, 20).toUpperCase();
  const alias = `${ADJ[n1 % ADJ.length]}${NOUN[n2 % NOUN.length]}#${suffix}`;
  // Secret authorizes updates to this alias; derived from a separate slice of the hash.
  const secret = createHash("sha256").update(`secret|${hash}`).digest("hex");
  return { alias, secret };
});
