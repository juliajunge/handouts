# Handouts von Julia Junge

Jedes Handout gibt es zweimal: als **Webseite** zum Lesen am Handy oder Laptop und als **druckoptimiertes PDF** (A4) zum Herunterladen.
Beides wird bei jeder Änderung automatisch neu gebaut und veröffentlicht.

- Übersicht: https://juliajunge.github.io/handouts/
- Beispiel: https://juliajunge.github.io/handouts/ki-arbeitsprofile/
- PDF dazu: https://juliajunge.github.io/handouts/ki-arbeitsprofile/ki-arbeitsprofile-bauen.pdf

Die Adressen bleiben gleich, auch wenn sich der Inhalt ändert. Kurz-URLs musst du deshalb nur einmal einrichten.

## Ein Handout ändern

1. Auf github.com die Datei `handouts/<name>/handout.md` öffnen.
2. Auf den Stift (Bearbeiten) klicken, Text ändern.
3. **Commit changes** klicken.
4. Nach 1–2 Minuten sind Webseite und PDF aktualisiert (Fortschritt unter dem Reiter **Actions**).

Datum unter `stand:` mit ändern, damit es im Fuß stimmt.

## Ein neues Handout anlegen

1. Einen neuen Ordner unter `handouts/` anlegen, z. B. `handouts/prompting-grundlagen/`. Der Ordnername wird Teil der Adresse – kleine Buchstaben, Bindestriche, keine Umlaute.
2. Darin eine Datei `handout.md` anlegen (am einfachsten: eine bestehende kopieren).
3. Bilder in denselben Ordner hochladen.

## Aufbau einer `handout.md`

Oben steht der Kopfbereich zwischen zwei `---`-Zeilen:

```yaml
---
titel: KI-Arbeitsprofile bauen
label: Handout                 # kleines Etikett über dem Titel (optional)
stand: 28. September 2026
bild: drache-laptop.png        # Bild rechts neben dem Titel (optional)
bild_alt: Drache springt aus einem Laptop
pdf_name: ki-arbeitsprofile-bauen   # Dateiname des PDFs (optional)
kurzlink: kurz.link/profile    # erscheint im Druck in der Fußzeile (optional)
---
```

Danach folgt der Text in Markdown:

| Schreibweise | Ergebnis |
| --- | --- |
| `## Überschrift` | grüne Kapitelüberschrift |
| `**fett**`, `*kursiv*` | fett, kursiv |
| `==Text==` | gelbe Marker-Hervorhebung |
| `[Linktext](https://…)` | Link – im Druck wird die Adresse dahinter ausgeschrieben |
| `![Beschreibung](bild.png)` | Bild aus dem Handout-Ordner |

### Bausteine

**Karten** (Raster aus Kästen) – außen vier Doppelpunkte, innen drei:

```markdown
:::: karten

::: karte Assistenzen
Text der Karte …

> Kleingedruckter Hinweis am Ende der Karte
:::

::: rahmenkarte Agenten
Karte nur mit Rahmen statt Hintergrundfarbe
:::

::::
```

**Nummerierte Schritte** (orange Kreise):

```markdown
::: schritte
1. ### Erster Schritt
   Erklärung …

2. ### Zweiter Schritt
   Erklärung …
:::
```

**Tipp-Kasten** (grüner Rahmen mit Sternchen):

```markdown
::: tipp
**Tipp:** Text …
:::
```

**Ganzseitiges Bild im Querformat** (kommt im PDF auf eine eigene Seite hinter die Fußzeile):

```markdown
::: canvas
## Canvas: So planst du deine Assistenz

![Beschreibung](canvas.png)
:::
```

## Technik

- `vorlage/` – Layout (`handout.css`), Seitengerüst, Schriften (Baloo 2, Open Sans – lokal eingebunden, keine Google-Verbindung) und Logo
- `build.py` – baut alles nach `site/`
- `.github/workflows/veroeffentlichen.yml` – baut bei jeder Änderung auf `main` und veröffentlicht über GitHub Pages

Lokal testen:

```bash
pip install -r requirements.txt
python -m playwright install chromium
python build.py            # Webseiten + PDFs
python build.py --ohne-pdf # nur Webseiten
```

Einmalig nötig: unter **Settings → Pages → Build and deployment → Source** „GitHub Actions“ auswählen.
