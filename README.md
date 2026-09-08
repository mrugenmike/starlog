# Starlog

A searchable, filterable gallery of astrophotography captured with a SeeStar telescope, published via GitHub Pages.

## Enabling GitHub Pages (one-time)

1. Push this repo to GitHub (`git push -u origin main`).
2. On GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, branch **main**, folder **/ (root)**.
3. Your gallery will be live at `https://mrugenmike.github.io/starlog/` within a minute or two.

## Adding a new photo

1. Drop the image file into `images/` (e.g. `images/m51.jpg`).
2. Watermark it (see [Watermarking](#watermarking) below) before committing.
3. Add an entry for it in [`data/photos.json`](data/photos.json):

   ```json
   {
     "id": "m51",
     "file": "images/m51.jpg",
     "title": "Whirlpool Galaxy",
     "designations": ["M51", "NGC 5194"],
     "catalog": "Messier",
     "type": "Galaxy",
     "tags": ["galaxy", "interacting galaxies"],
     "date": "2026-09-01",
     "equipment": "SeeStar S30",
     "description": "A couple of sentences about the object itself — what it is, where it is, why it's notable.",
     "notes": "Optional free-text notes about the session, exposure, conditions, etc.",
     "wikipedia": "https://en.wikipedia.org/wiki/Whirlpool_Galaxy"
   }
   ```

   Field notes:
   - `catalog` — one of `Messier`, `Caldwell`, `NGC`, `IC`, `Other` (drives the catalog filter chips; add new values freely, they'll show up automatically — and a value with no photos won't show at all).
   - `type` — one of `Galaxy`, `Nebula`, `Cluster`, `Star`, `Planet`, `Moon` (drives the second row of filter chips, same auto-show/hide behavior as catalog).
   - `designations` — any catalog IDs you want shown as badges and made searchable (M-numbers, NGC/IC numbers, common names, etc.).
   - `tags` — free-form keywords for search (constellation, nebula/cluster subtype, whatever's useful).
   - `date`, `equipment` — optional, shown in the detail view.
   - `description` — optional facts about the object itself, shown in the detail view.
   - `notes` — optional free-text about your imaging session, shown in italics in the detail view.
   - `wikipedia` — optional direct link. If omitted, the detail view links to a Wikipedia search for the photo's first designation/title instead.

4. Commit and push:

   ```bash
   git add images/m51.jpg data/photos.json
   git commit -m "Add M51"
   git push
   ```

## Watermarking

Images are watermarked with "© Mrugen Deshmukh" in the bottom-right corner before being committed, so the credit stays even if a photo is downloaded or linked directly (not just viewed through the gallery UI).

One-time setup:

```bash
python3 -m venv .venv
./.venv/bin/pip install Pillow
```

Then, whenever you add new photos to `images/`:

```bash
./.venv/bin/python scripts/watermark.py
```

With no arguments it watermarks every `.jpg` in `images/` that isn't already recorded as done in `scripts/.watermarked` (tracked in git, so reruns and fresh clones won't double-stamp anything). Pass explicit paths to force-watermark specific files instead.

## Previewing locally

Because the page fetches `data/photos.json` via `fetch()`, opening `index.html` directly (`file://`) won't load the data — serve it over HTTP instead:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Structure

- `index.html`, `style.css`, `app.js` — the static gallery (no build step, no dependencies).
- `data/photos.json` — all photo metadata.
- `images/` — the actual image files.
