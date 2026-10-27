---
titel: KI-Arbeitsprofile bauen
label: Handout
stand: 27. Oktober 2026
bild: drache-laptop.png
bild_alt: Drache springt mit Zauberstab aus einem Laptop
pdf_name: ki-arbeitsprofile-bauen
beschreibung: Assistenzen, Skills und Co. – was KI-Arbeitsprofile sind und wie du sie für wiederkehrende Aufgaben baust.
---

## Was sind KI-Arbeitsprofile?

:::: karten

::: karte
**Assistenzen** sind strukturierte, längere “Unterbots” mit Rollenbeschreibung, Infos, Abläufen und Rückfragen, die dir wiederkehrende Aufgaben abnehmen.

z.B.: *„Du bist Veranstaltungsplaner und hilfst, eine Checkliste zu erstellen. Frage zuerst…“*
:::

::: karte
**Projekte** sind meist als Ordner angelegte Bereiche in KI-Tools, in denen Dateien hochgeladen und Instruktionen gespeichert werden können.

Beispiel: Mein Projekt KI-Lernreise enthält Info-Sheets und Präsentationen und kann darauf basierend kleine Anfragen, wie Mails, Linkedin-Posts oder Konzeptfragen beantworten.
:::

::: karte
**Skills** sind konkrete, eher kleine Instruktionen, die für viele Arbeitsprozesse gelten (z.B. Genderregel oder Design einer Vorlage). Sie aktivieren sich selbstständig, wenn Triggerworte auftauchen. Sie werden aktuell Tool-übergreifend ausgerollt.
:::

::: rahmenkarte
**Agenten** sind komplexe Systeme, die selber Strategien entwickeln und Tools eigenständig aktiv einsetzen. NUR für Fortgeschrittene und bezahlpflichtig.

Die bekanntesten sind **ChatGPT Work** und **Claude Cowork**. Mehr dazu in meinem Blog-Artikel: [www.juliajunge.de/agentische-ki](https://www.juliajunge.de/agentische-ki)
:::

::::

Wie die Funktionen in ChatGPT, Copilot, Langdock, Claude und Mistral Vibe heißen und was davon gratis ist, zeigt die ==Tabelle ganz hinten==.

## Schritt für Schritt zu eigenen Arbeitsprofilen

::: schritte untereinander
1. ### Entdecke Use Cases im Alltag
   Welche Aufgabe wiederholt sich? Was fragen Kolleg*innen dich ständig? Wo denkst du: „Das müsste mir doch KI abnehmen können…“?

2. ### Plane deine Assistenz mit dem Canvas
   Kläre Aufgabe und Ziel, wer sie nutzt, welchen Input sie bekommt, welche Zwischenschritte sie macht, was herauskommen soll und welche Regeln gelten. ==Das Canvas findest du weiter hinten.==

3. ### Lass dir von der KI den Prompt schreiben
   So konkret wie nötig, so kurz wie möglich. Die KI schlägt dir auch vor, welches Wissen und welche Beispiele du hinterlegen solltest und wo die Assistenz nachfragen soll. Speichere das Ergebnis in deinem KI-Tool als Assistenz, Projekt oder Skill. ==Die passenden Prompts findest du im Prompt-Baukasten.==

4. ### Testen, teilen, verbessern
   Teste deine Assistenz im Alltag. Verbessere sie. Teile sie mit anderen. Hattest du eine richtig gute Arbeitssession, lass dir daraus mit Start-Baustein C eine bessere Version schreiben.
:::

<!--seitenumbruch-->

## Prompt-Baukasten: Lass dir von der KI helfen

<div class="prompt-tipps"><div><h3>3 Tipps, damit es schneller geht</h3><ul><li><strong>Reden statt schreiben:</strong> Beantworte die Fragen der KI per Spracheingabe. So erzählst du von selbst mehr Details, als du tippen würdest.</li><li><strong>Frag, was fehlt:</strong> Lass dir von der KI sagen, welche 3 Infos sie braucht, um die Aufgabe zu erledigen.</li><li><strong>Nach guten Arbeitssessions zusammenfassen:</strong> Lass dir eine ausführliche Instruktion zusammenfassen. Damit kannst du neue Chats beginnen oder eine Assistenz, ein Projekt oder einen Skill einrichten.</li></ul></div><img src="drache-spirale.png" alt="Drachen steigen auf einer Spirale nach oben, vom ersten Entwurf bis zum fertigen Ergebnis"></div>

So geht's: Kopiere **einen Start-Baustein** und **einen Ziel-Baustein** untereinander in einen neuen Chat.

### Start A: Ich fange neu an

```
# Aufgabe
Hilf mir zu klären, was meine KI-Assistenz tun soll und welche Infos sie braucht oder erfragen soll.

# Regeln
Stelle immer nur eine Frage auf einmal, höchstens 5. Erfrage auch nötiges Fachwissen oder biete eine Recherche an. Die letzte Frage ist, ob die KI noch etwas Besonderes wissen soll.
```

### Start B: Ich habe das Canvas ausgefüllt

```
# Aufgabe
Hier ist mein ausgefülltes Canvas für eine KI-Assistenz: [Text einfügen oder Foto hochladen]

# Regeln
Prüfe es auf Lücken und Widersprüche. Stelle höchstens 3 Rückfragen, immer nur eine auf einmal.
```

### Start C: Ich hatte einen guten Chat (Baustein am Ende des Chats einfügen)

```
# Aufgabe
Fasse den Arbeitsprozess in diesem Chat zusammen: Ziel, Schritte, nötige Infos und Rückfragen, meine Korrekturen, Ergebnis.

# Regeln
Übernimm nur, was sich bewährt hat. Mach aus meinen Korrekturen Regeln. Stelle höchstens 3 Rückfragen, immer nur eine auf einmal.
```

### Ziel 1: Instruktion für CustomGPT, Projekt oder Agent

```
# Output
Recherchiere zuerst im Internet aktuelle Infos dazu, was gute Assistenz-Prompts ausmacht. Erzeuge dann eine kopierfähige Instruktion in Raw Markdown mit höchstens 7.500 Zeichen. Schlage vor, welche Dokumente ich als Wissensbasis oder Beispiele hinterlegen sollte.
```

### Ziel 2: Skill-Datei

```
# Output
Recherchiere zuerst im Internet aktuelle Infos dazu, wie gute Skills aufgebaut sind. Erzeuge dann eine Skill-Datei SKILL.md zum Herunterladen: oben name und description (wann der Skill sich aktivieren soll, mit Triggerwörtern), darunter knappe Anweisungen. Schlage vor, welche Vorlagen oder Beispiele ich als zusätzliche Dateien beilegen sollte.
```

::: tipp
**Viele gute Beispiele für Assistenz-Prompts** findest du bei Felix Schlenther unter [ai-first.ai/ai-assistenten](https://ai-first.ai/ai-assistenten) (Gratis-Registrierung erforderlich)
:::

::: canvas
## Canvas: So planst du deine Assistenz

![Canvas mit sechs Feldern: 1 Aufgabe & Ziel, 2 Nutzer*in, 3 Input, 4 Zwischenschritte, 5 Output, 6 Regeln](canvas-assistenz.png)
:::

::: canvas
## So heißen die Funktionen in den gängigen Tools

<div class="funktionen">
<div class="funktionen-rahmen"><table class="funktionen-tabelle"><thead><tr><th scope="col">Tool</th><th scope="col">Persönliche Anweisungen <span class="kopf-zusatz">(überall gratis)</span></th><th scope="col">Projekt</th><th scope="col">Assistenz</th><th scope="col">Skills</th></tr></thead><tbody><tr><th scope="row">ChatGPT</th><td><strong>Einstellungen &gt; Personalisierung</strong></td><td><strong>Projekte</strong> <span class="kapsel kapsel--gratis">auch gratis</span><span class="info">Gratis: höchstens 5 Dateien pro Projekt</span></td><td><strong>CustomGPTs</strong><span class="info">In privaten Konten nicht mehr neu anlegbar, wird am 11.12.2026 abgeschaltet</span></td><td><strong>Skills</strong> <span class="kapsel kapsel--bezahlt">nur bezahlt</span><span class="info">Nur Business, Enterprise und Edu</span></td></tr><tr><th scope="row">Microsoft 365 Copilot (Basic) <span class="kapsel kapsel--gratis">ohne Copilot-Zusatzlizenz</span><span class="info">Was freigeschaltet ist, entscheidet die IT-Administration. Fehlt etwas, frag dort nach.</span></th><td><strong>Einstellungen &gt; Personalisierung &gt; Anpassen von Copilot</strong></td><td><strong>Notizbücher</strong></td><td><strong>Agents</strong><span class="info">Einfache Agents mit Anweisungen und Webseiten. Mit Firmendaten nur mit Lizenz oder gegen Gebühr</span></td><td><strong>Skills</strong> <span class="kapsel kapsel--angekuendigt">angekündigt</span></td></tr><tr><th scope="row">Langdock <span class="kapsel kapsel--bezahlt">nur bezahlt</span><span class="info">7 Tage Testzugang</span></th><td><strong>Kontoeinstellungen &gt; Custom Instructions</strong></td><td><strong>Projekte</strong></td><td><strong>Agenten</strong></td><td><strong>Skills</strong></td></tr><tr><th scope="row">Claude</th><td><strong>Einstellungen &gt; Konto &gt; Anweisungen</strong></td><td><strong>Projekte</strong> <span class="kapsel kapsel--gratis">auch gratis</span><span class="info">Gratis: höchstens 5 Projekte</span></td><td></td><td><strong>Skills</strong> <span class="kapsel kapsel--gratis">auch gratis</span><span class="info">Unter Anpassen &gt; Skills</span></td></tr><tr><th scope="row">Mistral Vibe</th><td><strong>Kontext &gt; Anweisungen</strong><span class="info">Memory unter Datenschutz</span></td><td><strong>Projekte</strong> <span class="kapsel kapsel--gratis">auch gratis</span><span class="info">Gratis: höchstens 2 Projekte</span></td><td></td><td><strong>Skills</strong> <span class="kapsel kapsel--gratis">auch gratis</span></td></tr></tbody></table></div>
<p class="funktionen-hinweis">Stand: Oktober 2026. Die Anbieter ändern ihre Angebote häufig.</p>
</div>
:::
