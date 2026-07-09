## What I'll build

A single-page portfolio at `/` matching the "Data-driven suite" direction you picked — dark navy base, seafoam-mint accents, Bebas Neue headings + Barlow body, editorial magazine layout with timecode/data details.

## Identity wired in

- Wordmark: **MATSUO // EDIT**
- Hero name: **Matsuo**, role kicker: *Lead Video Editor*
- Tagline: **"Making complex ideas impossible to skip."**
- Contact links in footer: email `visuals.sync@gmail.com`, Discord `matsuo.sync`, Instagram `matsuo.art_`

## Sections (composition matches the chosen direction exactly)

1. **Fixed nav** — wordmark left, `[ REEL_2024 ] / Projects / Archive` right
2. **Hero** — kicker + huge Bebas name + tagline, with a live "Current Timeline Status" ticker (JS-driven timecode) on the right
3. **Showreel frame** — 16:9 with corner brackets and a PLAY pill; opens the 4th link (Google Drive `1E7Jr-VFx5IedqVxJ2ceSmv8ccbodcMTx` embedded in a modal via Drive's `/preview` URL) since that's the standalone reel
4. **Case Studies** — 4 entries in a 2-col editorial grid, each with `01–04` numeral, File ID, real YouTube thumbnail, title, category, retention/views + stack sidebar, click-through to the YouTube URL:
   - 01 · YouTube `g9DVFUj4cAU` — Business / Educational — AE + PR
   - 02 · YouTube `qH44hSe3cso` — Business / Educational — AE + PR
   - 03 · YouTube `9p4A67Q61TI` — Gaming / Entertainment — Davinci + VFX
   - 04 · Google Drive `1E7Jr-…` — Motion Design — AE
   - Thumbnails pulled from `https://img.youtube.com/vi/{id}/maxresdefault.jpg` (no API needed). Titles/retention numbers use tasteful placeholders you can edit inline in the source — I'll leave clear `TODO` comments next to each.
5. **Client strip** — 5 stylized wordmarks, grayscale + low opacity, hover reveals; placeholder names commented for you to swap
6. **Testimonials** — 2 quotes with numeric watermark, placeholder attribution flagged with `TODO`
7. **Footer** — "Start the Render" headline, availability line, `EMAIL / DISCORD / INSTAGRAM` links (real handles wired), oversized `MATSUO` watermark

## Motion

Smooth-scroll reveals via IntersectionObserver + `animate-fade-in` — thumbnails, entry numerals, testimonial quotes fade/translate in on entry. Timecode ticker in hero updates every frame. Hover states scrub-style (grayscale → color on thumbnails, accent glow on nav/footer links). No autoplay video.

## Technical notes

- Update `src/routes/__root.tsx` head: title `Matsuo — Video Editor`, description matches tagline, og/twitter set. Load Bebas Neue + Barlow via `<link>` in `__root.tsx` head (Tailwind v4 rule — no CSS `@import` of remote fonts).
- Update `src/styles.css`: add `--font-heading`, `--font-body`, and semantic tokens for base/surface/accent/bright in `@theme inline` mapped to `:root` oklch values converted from the locked palette (#0d1b2a / #1b4332 / #2dd4a8 / #73ffb8). No hardcoded color classes in components.
- Update `src/routes/index.tsx` head with page-specific title/description + og:image once the reel poster is generated.
- New components (small, single-file each): `SiteNav`, `Hero`, `Showreel`, `CaseStudies`, `ClientStrip`, `Testimonials`, `SiteFooter`, and a `useReveal` hook.
- Reel poster image: generate one dark cinematic still to use as showreel thumbnail + og:image (avoid stock look).
- Google Drive video embed: `https://drive.google.com/file/d/{id}/preview` inside a dialog when the play button is clicked.
- Route: single page `/` — no extra routes needed since it's one-page. Section anchors (`#work`, `#contact`) power the nav links.

## What stays as editable placeholders

Titles, retention %, view counts, client names, and testimonial attributions — since you didn't provide them. Each is marked with a `TODO:` comment so you can swap them without hunting.
