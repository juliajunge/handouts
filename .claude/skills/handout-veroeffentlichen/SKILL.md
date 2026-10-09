---
name: handout-veroeffentlichen
description: Neues Handout anlegen oder bestehendes ändern und als Webseite + PDF über GitHub Pages veröffentlichen (Repo juliajunge/handouts). Immer verwenden, wenn Julia ein Handout, einen Leitfaden, ein Arbeitsblatt oder eine Übersicht zum Teilen/Ausdrucken möchte – auch wenn sie eine Word-Datei schickt und nur „mach daraus ein Handout“ sagt.
---

# Handout veröffentlichen

Jedes Handout ist ein Ordner `handouts/<name>/` mit einer `handout.md` und den Bildern daneben. `build.py` macht daraus Webseite und A4-PDF, der Workflow `.github/workflows/veroeffentlichen.yml` veröffentlicht bei jedem Push auf `main`. **Nie** ein eigenständiges HTML/PDF außerhalb dieses Systems bauen.

Gestaltungsregeln (Ton, Farben, Drachen) kommen aus dem Skill `julia-junge-design` (Repo juliajunge/Claude_allgemein). Hier steht nur, wie sie in diesem Repo umgesetzt werden.

## Ablauf

1. **Inhalt klären:** Quelle lesen (z. B. Word: `pandoc datei.docx -t markdown`). Titel, Hoch- oder Querformat, Quellenangabe bei adaptierten Inhalten.
2. **Ordner anlegen:** `handouts/<name>/` – kleine Buchstaben, Bindestriche, keine Umlaute. Der Name wird Teil der Adresse und bleibt danach gleich.
3. **`handout.md` schreiben** (Aufbau unten), passende Drachen aus `julia-junge-design/assets/` in den Ordner kopieren (Pose nach Anlass). Die Regel heißt ein Drache **pro Seite, nicht pro Handout**: In mehrseitigen Handouts darf jede Seite ihren eigenen Drachen haben.
4. **Lokal bauen und ansehen:**
   ```bash
   pip install -r requirements.txt
   CHROMIUM_PATH=/opt/pw-browsers/chromium python build.py   # ohne CHROMIUM_PATH: python -m playwright install chromium
   pdfinfo site/<name>/<pdf>.pdf | grep Pages
   pdftoppm -r 60 -png site/<name>/<pdf>.pdf vorschau        # Seiten als Bild prüfen
   ```
   Prüfen: Seitenzahl wie geplant, nichts abgeschnitten, Fuß mit Drachenlinie unten. Bei Änderungen an `vorlage/` auch die anderen Handouts neu prüfen – ihre Seitenzahl darf sich nicht ändern.
5. **Veröffentlichen:** auf `main` committen und pushen (Julia arbeitet direkt auf `main`). Danach den Lauf „Handouts bauen und veröffentlichen“ unter Actions abwarten.
6. **Links nennen:**
   - Webseite: `https://juliajunge.github.io/handouts/<name>/` (mit Knopf „> PDF herunterladen“)
   - PDF: `https://juliajunge.github.io/handouts/<name>/<pdf_name>.pdf`
   - Übersicht: `https://juliajunge.github.io/handouts/`

## Kopfbereich

```yaml
---
titel: KI-Reifegradmodell für den zivilgesellschaftlichen Sektor
label: Handout                  # Etikett über dem Titel
stand: 7. Oktober 2026          # Pflicht
bild: dragon-kompass.png        # Drache rechts neben dem Titel
bild_alt: Drache mit Kompass
pdf_name: ki-reifegradmodell    # Dateiname des PDFs
beschreibung: Ein Satz für Übersicht und Suchmaschinen.
kurzlink: kurz.link/xy          # optional, erscheint im Druck im Fuß
format: quer                    # optional: ganzes Handout im Querformat
quelle: 2025, adaptiert nach …, erstellt von Julia Junge, CC-BY-SA 2.0   # optional: ersetzt „Autorin … Stand …“ im Fuß
newsletter: nein                # optional: keine Newsletter-Anmeldung unter der Webseite
---
```

## Inhalt

Markdown-Bausteine (Karten, Schritte, Tipp, Canvas, Marker `==…==`) stehen in der `README.md`. Reicht das nicht (Matrix, Leitfaden mit Phasen), eigenes HTML in die `handout.md` schreiben:

- Alles in einen Wrapper mit eigener Klasse (`<div class="reifegrad">`, `<div class="leitfaden">`), die Stile dazu am Ende von `vorlage/handout.css` in einem eigenen Abschnitt, Druckwerte in `@media print`.
- **Keine Leerzeilen innerhalb des HTML** – sonst behandelt Markdown den Rest als Text.
- Für wiederkehrende Strukturen (Tabellen, Zeilen) die HTML-Zeilen per kleinem Python-Skript erzeugen statt von Hand.

## Gestaltung in diesem Repo

- Du-Ansprache, keine Emojis, Chevron „>“ vor Links und Knöpfen.
- **Drachen:** höchstens einer pro Seite, jede Seite darf einen haben – auch Folgeseiten mehrseitiger Handouts.
- **Newsletter:** Unter jeder Handout-Webseite steht automatisch die Newsletter-Anmeldung (Brevo, `vorlage/newsletter.html.j2`), oben ein Knopf „> Newsletter abonnieren“. Beides nur im Web, nie im PDF. Abschalten pro Handout mit `newsletter: nein`, z. B. bei Auftragsarbeiten. Ändert sich das Formular in Brevo, Formular-Adresse (`action`) und Feldnamen dort anpassen.
- **Fuß:** Drachenlinie, links „> juliajunge.de“, rechts Autorin/Stand oder `quelle:` plus CC-Logo. Den Namen nicht doppelt nennen.
- **Tabellen:** grüne Kopfzeile in Versalien, Zeilen abwechselnd #EDEDDF/#F7F7F1, erste Spalte fett. Normal max. 4 Spalten; eine Matrix (z. B. Reifegrade) darf mehr haben, dann `format: quer`.
- **Schriftgrößen im Druck:** Text 10–11 pt, dichte Matrix 9,5 pt, nichts unter 7,5 pt (Etiketten, Fußzeile).
- **Ränder im Druck:** Hochformat 14 mm oben/unten, 20 mm links/rechts; Querformat 10 mm. Drache neben dem Titel 32 mm (Querformat 18 mm).
- **Ankreuzfelder:** Kreis `<i class="ankreuzen"></i>` links oben in der Zelle.
- Soll eine Zeile nicht über zwei Seiten laufen: `break-inside: avoid`; neue Seite: `break-before: page`.

## Beispiele im Repo

- `handouts/ki-arbeitsprofile/` – reines Markdown mit Karten und Schritten, eine Seite
- `handouts/leitfaden-ki-einfuehrung/` – langes Dokument mit eigenem HTML (`.leitfaden`)
- `handouts/ki-reifegradmodell/` – Querformat, sechsspaltige Matrix zum Ankreuzen (`.reifegrad`)
