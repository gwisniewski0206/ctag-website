# CTAG-Website

Website der Arbeitsgruppe **Creative Technologies (CTAG)** an der HAW Kiel.
Statische Seite (Astro), Inhalte als Dateien in diesem Repository, Pflege über die Redaktion unter **`/admin`**.

- Vorschau: https://gwisniewski0206.github.io/ctag-website/
- Redaktion: https://gwisniewski0206.github.io/ctag-website/admin/

---

## Für Redakteurinnen und Redakteure

Ihr braucht kein Git und keinen Code. Jede Änderung in der Redaktion wird gespeichert und ist **nach 1–2 Minuten live**.

### Anmelden

1. Ein GitHub-Konto anlegen (kostenlos) und sich von einer verantwortlichen Person in das Repository einladen lassen.
2. `/admin` öffnen und **„Mit Zugriffstoken anmelden“** wählen.
3. Einen Token erzeugen: GitHub → *Settings → Developer settings → Personal access tokens*.
   - **Repository in einer Organisation** (Zielzustand): *Fine-grained tokens → Generate new token*, *Resource owner* =
     die Organisation, *Repository access* = nur dieses Repository, *Permissions → Contents* = **Read and write**.
   - **Repository in einem persönlichen Konto** (aktuelle Vorschau): *Tokens (classic) → Generate new token*, Haken bei **repo**.
     (Fine-grained Tokens erreichen fremde persönliche Repositories nicht.)
   - Ablaufdatum nach Wunsch (z. B. 1 Jahr)
4. Den Token in das Feld kopieren. Der Browser merkt sich die Anmeldung.

> Sobald der Anmeldedienst eingerichtet ist (siehe [Anmeldung per GitHub-Knopf](#anmeldung-per-github-knopf-einmalig-einrichten)),
> reicht ein Klick auf **„Mit GitHub anmelden“** – ohne Token.

### Neues Projekt anlegen

1. *Projekte → Neues Projekt*.
2. Felder ausfüllen – die Erklärungen stehen unter jedem Feld. Für die Beschreibung ist eine Gliederung vorausgefüllt
   (siehe [Projekt-Blueprint](#projekt-blueprint)).
3. **Position in der Liste:** die nächste freie Nummer (sie steht in der Liste hinter jedem Projekt).
4. Wer noch nicht fertig ist: **Entwurf** anhaken – dann ist das Projekt gespeichert, aber nicht auf der Seite.
5. *Speichern*. Nach 1–2 Minuten ist die Seite unter `/projects/<titel>/` erreichbar.

Bilder einfach in die Beschreibung ziehen oder über das Bild-Symbol einfügen; sie landen in `public/uploads/`.

---

## Projekt-Blueprint

So sollte ein Projektbeitrag aufgebaut sein, damit er sich gut in die Seite einfügt. Die Seite baut aus den Feldern die
Infobox und aus den Überschriften das Inhaltsverzeichnis in der Seitenleiste.

### Felder

| Feld | Pflicht | Wofür | Beispiel |
|---|---|---|---|
| **Titel** | ja | Überschrift, Kachel in der Liste | „MidiFox Eurorack Module“ |
| **Kurzfassung** | empfohlen | 1–2 Sätze oben auf der Seite und in Suchmaschinen | „Ein Eurorack-Modul, das MIDI über USB in Gate- und CV-Signale wandelt.“ |
| **Semester** / **Jahr** | empfohlen | Infobox | „WiSe 2025/26“ |
| **Team** | empfohlen | Infobox – statt eines Abschnitts „Author“ im Text | eine Person pro Eintrag |
| **Betreuung** | optional | Infobox | |
| **Themen** | empfohlen | Infobox (später Filter) | Eurorack, DSP, Embedded, Game, KI, Web |
| **Titelbild** | empfohlen | Vorschau (später in der Liste) | Querformat, ≥ 1600 px breit |
| **Links** | empfohlen | Infobox – Code, Video, Bericht | „Code auf GitHub“ → `https://github.com/…` |
| **Beschreibung** | ja | der eigentliche Beitrag | siehe Gliederung |

### Gliederung der Beschreibung

Abschnitte mit **Überschrift 2**, Unterabschnitte mit **Überschrift 3**. Keine Überschrift 1 – die setzt die Seite selbst.

```markdown
## Idee
Worum geht es, und warum? Welches Problem löst das Projekt?

## Umsetzung
### Hardware
Aufbau, Bauteile, Schaltplan als Bild.
### Software
Sprachen, Frameworks, Architektur – kurz, Details im verlinkten Code.

## Ergebnis
Fotos und Demo-Video. Ein YouTube-Link allein in einer Zeile wird zum Player:

https://www.youtube.com/watch?v=…

## Ausblick
Was fehlt noch, was wäre der nächste Schritt?
```

Abschnitte, die nicht passen, einfach weglassen oder umbenennen (z. B. nur „Software“ bei reinen Software-Projekten).

### Gut zu wissen

- **Sprache:** Deutsch oder Englisch – dann aber durchgehend, auch die Überschriften.
- **Länge:** lieber 400–1000 Wörter mit Bildern als eine komplette Abschlussarbeit. Den ausführlichen Bericht als PDF
  hochladen und unter *Links* verlinken.
- **Bilder:** JPG für Fotos, PNG für Schaltpläne und Screenshots; nicht größer als nötig (≈ 2000 px Breite reicht).
- **Videos:** auf YouTube hochladen und verlinken, nicht als Datei hochladen. Sie laden auf der Seite erst nach einem Klick
  (Datenschutz).
- **Audio:** kurze `.wav`/`.mp3` hochladen und den Link allein in eine Zeile setzen – dann erscheint ein Player.
- **Code:** gehört in ein Repository (GitHub/GitLab), nicht in den Text. Kurze Ausschnitte als Codeblock sind in Ordnung.

---

## Anmeldung per GitHub-Knopf (einmalig einrichten)

Für den Knopf „Mit GitHub anmelden“ braucht die Redaktion einen kleinen Anmeldedienst, weil GitHub den Login nur mit
einem geheimen Schlüssel abschließt, der nicht in eine öffentliche Seite gehört. Kostenlos und ohne eigenen Server:

1. [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) als Cloudflare Worker anlegen (Anleitung dort,
   ca. 10 Minuten, kostenloses Cloudflare-Konto der Organisation).
2. In der GitHub-Organisation eine **OAuth App** registrieren; *Callback URL* = Adresse des Workers + `/callback`.
3. Client-ID und Secret im Worker hinterlegen.
4. In `public/admin/config.yml` bei `backend` die Zeile `base_url:` mit der Worker-Adresse eintragen.

Der Dienst hängt nicht von der Domain der Website ab und läuft nach dem Domainwechsel unverändert weiter.

---

## Entwicklung

```
nvm use          # Node 22
npm install
npm run dev      # http://localhost:4321
npm run build
```

Aufbau, Entscheidungen und offene Punkte: **`CLAUDE.md`**.
