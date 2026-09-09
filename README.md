# Starlog

A searchable, filterable gallery of astrophotography captured with a SeeStar telescope, published via GitHub Pages.

## Enabling GitHub Pages (one-time)

1. Push this repo to GitHub (`git push -u origin main`).
2. On GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, branch **main**, folder **/ (root)**.
3. Your gallery will be live at `https://mrugenmike.github.io/starlog/` within a minute or two.

## Adding a new photo

1. Drop the image file into `images/` (e.g. `images/m51.jpg`).
2. Add an entry for it in [`data/photos.json`](data/photos.json):

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
     "distance": "23 million light-years",
     "coordinates": "RA 13h 29m 52.7s, Dec +47° 11′ 43″",
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
   - `distance` — optional, pre-formatted distance string (e.g. `"1,200 light-years"`), shown in the detail view. Not meaningful for the Moon/planets as a fixed light-year figure, so those use an average-distance-in-km/mi string instead.
   - `coordinates` — optional, pre-formatted RA/Dec string (e.g. `"RA 19h 59m 36.3s, Dec +22° 43′ 16.1″"`), shown in the detail view. Skip this for the Moon/planets since their position changes daily, unlike deep-sky objects and stars.
   - `description` — optional facts about the object itself, shown in the detail view.
   - `notes` — optional free-text about your imaging session, shown in italics in the detail view.
   - `wikipedia` — optional direct link. If omitted, the detail view links to a Wikipedia search for the photo's first designation/title instead.
   - `hidden` — optional; set to `true` to keep the entry in `photos.json` but exclude it from the published gallery (e.g. while you're not happy with a shot yet, without deleting its metadata).

3. Commit and push:

   ```bash
   git add images/m51.jpg data/photos.json
   git commit -m "Add M51"
   git push
   ```

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
