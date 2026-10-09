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

- **Interaktive Demos:** Das eigene WP-Plugin `ctag-processing` gibt auf drei Projektseiten Demos direkt beim Rendern aus
  (`ki-for-space-game`: Raumschiffe mit jQuery; `flock`, `ants`: Processing.js-Sketches mit Bildern). Sie fehlen in `content.rendered`
  und stehen in der API-Antwort vor dem JSON. `scrape.mjs` sichert die gerenderten Seiten, die Plugin-Skripte und die Sketch-Bilder
  nach `content/raw/demos/`; `import.mjs` baut daraus `public/demos/<slug>/`. Alle drei laufen lokal (geprüft 07.10.2026).
- **Startseite** ist die WP-Seite `landing` (id 1307, Text DE+EN), zuletzt geändert am 14.04.2026.
- **Nicht verlinkte Seiten** (veröffentlicht, aber kein Link aus Menü/Startseite/Projektliste): ein angefangener Makerspace-Bereich von 2016 –
  `makerspace` → `lasercutter-start` → `lasercutter-basics-von-der-idee-an-die-wand` (Anleitung, 257 Wörter), dazu fast leer `basics`, `service`,
  leer `inspiration`, `calendar` (nur Google-Kalender-iframe). **Entschieden 07.10.2026:** `makerspace`, `lasercutter-start` und die
  Lasercutter-Anleitung werden übernommen; `basics`, `service`, `inspiration`, `calendar` fallen weg (alte URLs per Redirect auf `makerspace`).
- **Die Demos bleiben erhalten** und werden per iframe oben auf der Projektseite eingebunden (Feld `demo` im Projekt).
- **Embeds:** 28 YouTube, 2 Google Docs, 1 Google Calendar. `space-game-refactoring` bettet 4 eigene Seiten per WP-Embed ein → beim Import zu Links machen.
  `midifox` enthält 2 tote `[icon …]`-Shortcodes als Text.
- **Downloads:** 14 PDF, 13 WAV, 6 MP4, 1 MOV, 1 ZIP, 1 RAR.
- Die Startseite (14.04.) und das Impressum (21.04.2026) wurden dieses Jahr noch geändert – also hat noch jemand Zugriff. Wer, ist unbekannt.
  Nicht blockierend.
- **Domain/DNS** verwaltet ein Professor des Nutzers. Er bekommt **nur das fertige Übergabepaket**, keine Zwischenstände.
  Daraus folgt: Alles muss vorher ohne die Domain laufen und testbar sein (GitHub-Pages-Adresse). Der Schritt auf seiner Seite
  muss eine kurze, vollständige Anleitung sein (genaue DNS-Einträge; MX/Mail-Einträge nicht anfassen). Der GitHub-Login
  fürs CMS darf nicht von etwas abhängen, das nur er einrichten kann.

## Stand der Umsetzung (07.10.2026)

Astro-Grundgerüst steht, alle Inhalte sind importiert, `npm run build` erzeugt 93 Seiten ohne kaputte interne Links.
**Node 22 nötig** (`.nvmrc`; Astro 7 läuft nicht mit Node 20).

```
nvm use                    # Node 22
npm install
npm run scrape             # Live-Seite → content/raw/   (nur nötig, wenn content/raw/ fehlt)
npm run import             # content/raw/ → src/content/, public/uploads/, public/demos/   (überschreibt!)
npm run dev                # http://localhost:4321
```

- **Inhalte:** `src/content/projects/*.md` (42), `pages/**/*.md` (Impressum, Datenschutz, Makerspace + 2 Lasercutter-Seiten),
  `partners/*.json` (14), `settings/home.json` (Texte der Startseite), `settings/projects.json` (Opportunities). Schema: `src/content.config.ts`.
- **Nach dem Livegang wird `import.mjs` nicht mehr ausgeführt** – dann sind `src/content/` und `public/uploads/` die Quelle, gepflegt über das CMS.
- **Einbettungen:** Eine URL allein in einer Zeile wird zum Player (`src/lib/embeds.mjs`, Sätteri-Plugin): YouTube und Google Docs als
  Platzhalter, der erst nach Klick lädt (keine Daten an Google ohne Zustimmung → kein Cookie-Banner nötig), `.wav/.mp3` als Audio, `.mp4/.mov` als Video.
- **Schriften** lokal über `@fontsource-variable` (Archivo mit Breitenachse, Source Sans 3) – keine Google Fonts mehr.
- **Bilder:** Der Import nimmt das Original statt der WP-Verkleinerung und verkleinert Fotos über 2000 px Breite. `public/uploads/` hat 271 MB
  (größte Dateien: `Appendix.zip` 61 MB, `final_ki_visualisierung.mp4` 46 MB) – unter den GitHub-Grenzen (100 MB je Datei), aber spürbar.
- **Partner:** Karten zeigen jetzt zusätzlich das echte Logo (Abweichung vom Entwurf, der dafür Platzhalter hatte).
- **Projekt-Detailseite, freie Seiten:** eigener Entwurf im Stil der vier Hauptseiten (Hellblau-Titel mit Nummer/Jahr, Fließtext max. 820 px,
  vorheriges/nächstes Projekt). Nicht abgenommen.
- **Projektfeld `year`** stammt aus dem WP-Veröffentlichungsdatum, nicht aus dem Projekt selbst. `semester` ist leer und kann im CMS gesetzt werden.
- 77 Bilder haben keinen Alternativtext (schon im Original), 3 Projekte enthalten HTML-Tabellen (Layout-Tabellen ohne Kopfzeile).
- **Vorschau auf GitHub Pages** unter `https://gwisniewski0206.github.io/ctag-website/` (Repository `gwisniewski0206/ctag-website`, öffentlich,
  angelegt 07.10.2026; später in die CTAG-Organisation übertragen). `.github/workflows/deploy.yml` baut bei jedem Push auf `main`.
  Vorlagen und Inhalte verlinken absolut (`/projects/…`); `src/lib/rebase.mjs` setzt nach dem Build den Unterpfad davor (`BASE_PATH`).
  Mit eigener Domain liefert `configure-pages` einen leeren Unterpfad, dann greift das nicht mehr.

**Effekte und Spielzeuge** (alle mit `prefers-reduced-motion` berücksichtigt, Ziehen über `src/lib/drag.ts`):
- Startseite: Patchkabel mit Seilphysik zum Umstecken, Potis/Fader ziehbar und beim Scrollen bewegt, weiße Potis steuern das Oszilloskop (`synth.ts`); Kartensymbole laufen mit.
- Unterseiten: Wellen im Titel laufen und modulieren beim Scrollen (`waves.ts`, Antrieb `scroll-motion.ts`).
- Projects: spielbarer 16-Step-Drumcomputer nach 24 Projekten (`Sequencer.astro`, `sequencer.ts`).
- Partners: Mini-Synth mit Klaviatur nach 8 Partnern – OSC → Filter (mit LFO → Cutoff) → VCA/Hüllkurve (mit Arpeggiator: An/Aus, Hold, Hoch/Runter/Hoch-runter/Zufall, Rate, 1–3 Oktaven) → Out mit Spektrum-Analyzer (24 Bänder, 40 Hz–16 kHz; im Ruhezustand Obertöne der Wellenform) und Oszilloskop; Scrollen würfelt einen neuen Patch (`PlaySynth.astro`, `playsynth.ts`). Ein Mischpult wurde ausprobiert und verworfen.
- Alle Spielereien stehen in einem Streifen über die volle Breite (Hellblau mit Punktraster, Etikett „Zum Ausprobieren“, Gerät max. 860 px), damit sie nicht als Projekt/Partner gelesen werden (`Playground.astro`).
- Contact: Lissajous-Oszilloskop mit zwei Frequenz-Potis (`Lissajous.astro`, `lissajous.ts`).
- Klang nur nach Klick/Tastendruck (Web Audio, keine Dateien). Gemeinsamer AudioContext in `src/lib/audio.ts` mit iOS-Kniffen:
  Freigabe bei jeder Berührung (touchend/click), `navigator.audioSession.type = 'playback'` gegen den Lautlos-Schalter (Safari ≥ 17),
  stummes `<audio>` für ältere iOS. Am echten iPhone noch nicht bestätigt (Stand 08.10.2026).

**Redaktion (08.10.2026):** Sveltia CMS 0.220.0 unter `/admin` (`public/admin/index.html`, `config.yml`) – gewählt statt Decap
(106 vs. 4 Releases in 60 Tagen, gleiches Config-Format). Anmeldung derzeit per Zugriffstoken (klassischer Token mit `repo`,
solange das Repo persönlich ist). **Offen:** GitHub-Knopf braucht `sveltia-cms-auth` als Cloudflare Worker + OAuth App der Organisation
→ dann `base_url` in `config.yml`. Ohne `base_url` führt „Mit GitHub anmelden“ ins Leere.

**Master-Kennwort (08.10.2026):** `/admin` fragt ein Kennwort ab, wenn `public/admin/vault.json` existiert. Darin liegt ein GitHub-Token
(Fine-grained, nur dieses Repo, Contents RW) verschlüsselt (PBKDF2-SHA256 600k → AES-256-GCM); das Kennwort entschlüsselt ihn im Browser,
danach wird er als Sveltia-Token-Anmeldung gespeichert (`localStorage['sveltia-cms.user']`). Einrichten: `npm run admin:kennwort` im
eigenen Terminal. **Eingerichtet am 08.10.2026** (Fine-grained Token von gwisniewski0206, nur ctag-website). Mechanik mit Test-Tresor geprüft
(falsches Kennwort abgelehnt, richtiges → Sveltia ruft GET /user mit dem Token). Ohne vault.json startet /admin wie bisher.

**Projektbeiträge (Analyse 08.10.2026):** kein einheitliches Format – 14 von 42 ohne Überschrift, Ebenen wild gemischt (h1–h5),
Länge 26–4001 Wörter (Median 503), 32 Englisch / 10 Deutsch, „Author“ als Abschnitt in 7 Beiträgen. Daraus:
- Neue optionale Felder `summary`, `team`, `supervisor`, `tags`, `cover`, `links` (Schema + CMS). **Für die 42 Altbeiträge nachgepflegt**
  (08.10.2026) in `content/project-meta.json`, das `import.mjs` ins Frontmatter übernimmt – Haupttexte bytegleich geprüft.
  Kurzfassung/Themen von Hand geschrieben, Team nur aus Namen im Beitrag, Titelbild nur Fotos (15 von 42), Links automatisch
  (eigene Repos + PDFs; fremde Bibliotheken ausgeschlossen, Liste `FOREIGN_REPOS`). Betreuung überall leer (steht nirgends).
- Projektliste: Kacheln mit Titelbild (sonst gezeichnete Welle in der Akzentfarbe), Themen, Themenfilter (ab 2 Projekten je Thema),
  Suche auch in Kurzfassung/Themen/Team. Vorschaubilder erzeugt `src/lib/thumbs.mjs` beim Build (WebP 640 px unter /thumbs/).
- Startseite: Projekt-Slider „Aus den Projekten“ unter dem roten Hinweis (`ProjectSlider.astro`), wischbar + Pfeilknöpfe, kein Autoplay.
  Auswahl über das Feld `featured` („Auf der Startseite zeigen“); ist keins gesetzt, die ersten 12 Projekte mit Titelbild.
- Projektseite mit Seitenleiste: Infobox aus den Feldern + Inhaltsverzeichnis aus den zwei obersten vorhandenen Überschriftsebenen,
  aktueller Abschnitt markiert; auf dem Handy zugeklappt oben.
- **Projekt-Blueprint** für Studierende im `README.md`; dieselbe Gliederung ist im CMS als Vorlage für neue Projekte vorausgefüllt.

**Team-Seite (09.10.2026):** `/team/` im Menü zwischen Projects und Partners, Titel dunkelblau. Gepflegte Personen in `src/content/team/*.json`
(Bereiche Ansprechpartner/Team/Ehemalige; angelegt nur Prof. Dr. Robert Manzke als Ansprechpartner laut Impressum – wer sonst zum Team gehört,
weiß nur der Nutzer). Darunter automatisch „Aus den Projekten“: alle Namen aus dem Projektfeld `team` mit Links zu ihren Projekten.

**Nächste Schritte:** Anmeldedienst (Cloudflare-Konto noch offen, Nutzer: „erstmal nicht“), nachgepflegte Felder durchsehen.

## Erster Schritt (erledigt)

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
  **Entschieden 07.10.2026:** Alle Projekte liegen neu einheitlich unter `/projects/<slug>/`. Jede alte Adresse bekommt eine
  Umleitungsseite, die der Build automatisch aus den Importdaten erzeugt (GitHub Pages kann keine Server-Redirects).
  `/?p=128` per kleinem JavaScript auf der Startseite. Weggefallene Seiten (`basics`, `service`, `inspiration`, `calendar`) → `/makerspace/`.

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
