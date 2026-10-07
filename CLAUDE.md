# CTAG-Website – Relaunch von creative-technologies.de

Übergabe aus einer Claude-Session (Stand 07.10.2026). Diese Datei ist der Einstieg für die lokale Arbeit.

## Ziel

Die Website von Creative Technologies (CTAG, Arbeitsgruppe an der HAW Kiel) neu aufsetzen:
neues Design, **alle Inhalte der Live-Seite übernehmen**, Inhalte künftig über ein Admin-Backend
mit richtigem Login pflegen – wie WordPress, aber ohne Plugins/Themes/Ballast.

## Ausgangslage

- Live-Seite: https://www.creative-technologies.de (WordPress 6.1, SiteOrigin-Theme). **Der WP-Login existiert nicht mehr**,
  Inhalte müssen von außen geholt werden.
- Die WordPress-REST-API ist öffentlich erreichbar: `/wp-json/wp/v2/{pages,posts,media}` (geprüft: `types` antwortet,
  `pages` liefert die Projektseiten). Damit braucht es kein HTML-Scraping.
- Hosting/Domain: wird neu aufgebaut, wenn es so weit ist – keine Vorgabe.
- Struktur der Live-Seite: Home, Projects (Liste mit 43 Links auf 42 Projekt-Unterseiten – Beagle Boom ist doppelt verlinkt + „Opportunities“), Partners (14 Logos mit Links),
  Contact (enthält nur Links zu Impressum und Datenschutzerklärung), dazu Impressum und Datenschutzerklärung.

## Was in diesem Paket liegt

| Pfad | Inhalt |
|---|---|
| `design/*.html` | Die vier abgenommenen Seiten als statisches HTML (Inline-Styles, Google Fonts). Referenz fürs Aussehen, nicht als Code übernehmen. Der Projektfilter ist im Export ohne Funktion. |
| `content/projects.json` | 42 Projekte in Originalreihenfolge mit Titel und Live-URL (der doppelte Beagle-Boom-Eintrag am Listenende ist entfernt) |
| `content/partners.json` | 14 Partner mit Link und Logo-URL. Namen am 07.10.2026 gegen die Logos geprüft. |
| `scripts/scrape.mjs` | Holt Seiten, Beiträge und Medien über die REST-API nach `content/raw/` (nicht im Repository, ~470 MB). Am 07.10.2026 erfolgreich gelaufen: 55 Seiten, 0 Beiträge, 273 Medien, 660 Dateien. |

## Befund aus dem Scrape (07.10.2026)

- **Space Game** (`/procedural-generation`, id 128) gibt beim Rendern ein p5.js-Demo direkt aus. Es steht vor dem JSON der API
  und wird nach `content/raw/leak-pages-p1.html` gesichert. Das Demo existiert **nur dort**, nicht in `content.rendered`.
- **Startseite** ist die WP-Seite `landing` (id 1307, Text DE+EN), zuletzt geändert am 14.04.2026.
- **Nicht verlinkte Seiten** (veröffentlicht, aber kein Link aus Menü/Startseite/Projektliste): ein angefangener Makerspace-Bereich von 2016 –
  `makerspace` → `lasercutter-start` → `lasercutter-basics-von-der-idee-an-die-wand` (Anleitung, 257 Wörter), dazu fast leer `basics`, `service`,
  leer `inspiration`, `calendar` (nur Google-Kalender-iframe). **Entschieden 07.10.2026:** `makerspace`, `lasercutter-start` und die
  Lasercutter-Anleitung werden übernommen; `basics`, `service`, `inspiration`, `calendar` fallen weg (alte URLs per Redirect auf `makerspace`).
- **Space-Game-Demo bleibt erhalten.** Es ist Processing.js-Code (`type="application/processing"`); die Bibliothek hat ein WP-Plugin geladen
  und fehlt im Scrape. Umsetzung: eigene HTML-Datei mit lokaler processing.js, per iframe in die Projektseite.
- **Embeds:** 28 YouTube, 2 Google Docs, 1 Google Calendar. `space-game-refactoring` bettet 4 eigene Seiten per WP-Embed ein → beim Import zu Links machen.
  `midifox` enthält 2 tote `[icon …]`-Shortcodes als Text.
- **Downloads:** 14 PDF, 13 WAV, 6 MP4, 1 MOV, 1 ZIP, 1 RAR.
- Die Startseite (14.04.) und das Impressum (21.04.2026) wurden dieses Jahr noch geändert – also hat noch jemand Zugriff. Wer, ist unbekannt.
  Nicht blockierend. Für den Umzug zählt, wer **Domain/DNS** von creative-technologies.de verwaltet – das muss vor dem Livegang geklärt sein.

## Erster Schritt

```
node scripts/scrape.mjs
```

Danach `content/raw/` sichten: Welche Seiten gibt es wirklich (auch solche, die nicht verlinkt sind), was steckt in den
Projektseiten (Bilder, Videos/Embeds, Downloads, Code), gibt es Beiträge (`posts`)? Erst dann das Inhaltsmodell festlegen.
Embeds (YouTube, Vimeo, SoundCloud, GitHub) stehen als iframes/Links im HTML und müssen beim Import erhalten bleiben.

## Technik-Entscheidung (entschieden am 07.10.2026, noch nicht umgesetzt)

**Statische Seite, Inhalte als Dateien im GitHub-Repository, Pflege über eine Eingabemaske mit GitHub-Login.**
Ein CMS mit eigenem Server (Directus, Payload) wurde verworfen, weil es dauerhaft einen Server mit Node/Docker bräuchte.

- **Frontend:** Astro, statisch gebaut. Inhalte als Markdown mit Frontmatter in Content Collections.
- **Redaktion:** git-basiertes CMS unter `/admin` (Sveltia CMS oder Decap CMS – beim Aufsetzen prüfen, welches aktuell besser gepflegt ist).
  **Noch zu klären:** Wie die GitHub-Anmeldung auf der eigenen Domain läuft (beide brauchen dafür einen kleinen OAuth-Dienst oder ein Token-Login) –
  das ist die einzige bewegliche Stelle im Aufbau und wurde noch nicht geprüft.
- **Bauen und Hosting:** GitHub Actions baut bei jeder Änderung, Auslieferung über GitHub Pages (oder vergleichbar). Eigene Domain später aufschalten.
- **Besitz:** Repository in einer **GitHub-Organisation mit mindestens zwei dauerhaften Verantwortlichen** (z. B. Lehrende), nicht in einem
  Studierenden-Konto – sonst wiederholt sich das Problem mit dem verlorenen WordPress-Login.
- **Zielbild für Mitarbeitende in ein paar Jahren:** GitHub-Konto → Einladung in die Organisation → `/admin` öffnen → „Neues Projekt“ →
  Felder ausfüllen (Titel, Semester, Beschreibung, Bilder, Links/Videos) → speichern → nach 1–2 Minuten live. Kein Git, kein Code.
  Optional Entwurf/Freigabe durch eine verantwortliche Person. Eine kurze Anleitung dafür gehört ins Repository (README).
- **Inhaltsmodell (vorläufig):** `projects` (Titel, Slug, Semester/Jahr, Reihenfolge, Inhalt, Bilder, Embeds), `partners` (Name, Link, Logo, Reihenfolge),
  `pages` (Home, Contact, Impressum, Datenschutz), `opportunities` (Text, Reihenfolge), `settings` (Motto, Header-Bilder, Logo).
- **Import:** Skript, das `content/raw/` in die Markdown-Dateien überführt. Alte URLs als Redirects erhalten (Projektseiten liegen teils unter
  `/slug/`, teils unter `/projects/slug/`, eine unter `/?p=128`).

## Design

Richtung nach mehreren Runden: **grafisch und farbig, aber erwachsen** – flache Farbflächen, keine Schräglagen, keine harten Schatten,
gezeichnete Synth-Grafiken statt Fotos-Platzhaltern. Abgelehnt wurden: dunkles Neon-Design („vibegecoded“), rein sachlicher Hochschul-Look
(„zu sachlich“), verspielte Sticker-Optik („zu kindlich“).

- Farben: Dunkelblau `#00305D` (HAW-Blau, Linien/Text/Flächen), Bernstein `#F5B700`, Zinnober `#E8452C`, Hellblau `#DCE8F5`,
  Mittelblau `#1D5AA8`, Fließtext `#0E2238`, Grund weiß.
- Schrift: Überschriften Archivo 800 mit Breite 125 %, Text Source Sans 3 (400/600/700).
- Formen: 2 px dunkelblaue Rahmen, Radius 8 px (Karten) / 4 px (Etiketten, Menü), Inhaltsbreite 1240 px mit 24 px Rand.
- Kontrast beachten: Dunkelblau auf Zinnober nur für große Schrift; kleiner Text dort weiß und ≥ 20 px fett.
- Titelbereich je Seite in eigener Farbe (Home Bernstein + Zeichnung, Projects Hellblau, Partners Zinnober, Contact Bernstein).

## Offen

- **Echtes Logo, die vier Header-Fotos und die Partnerlogos** sind noch nicht eingebaut (kommen über das Scrape-Skript). Im Design stehen
  ein gezeichnetes Ersatzlogo und Namenskacheln. Ob der Foto-Slider der alten Startseite zurückkommt, ist nicht entschieden.
- Design für **Projekt-Detailseiten**, Impressum und Datenschutz fehlt noch (bisher nur die vier Hauptseiten).
- Auf Home stammen die Kartentitel „Im Fokus“, „Mitmachen“, „Klanglabor“ und das Etikett „Arbeitsgruppe an der HAW Kiel“ nicht aus dem Original.
- Der Tippfehler „komerziellen“ im Originaltext ist bewusst unverändert.
- Wer sind die dauerhaften Verantwortlichen der GitHub-Organisation, und soll es eine Freigabe vor dem Veröffentlichen geben?
- Cookie-Banner: Die neue Seite lädt Google Fonts – Schriften lokal einbinden, dann ist voraussichtlich kein Banner nötig.
