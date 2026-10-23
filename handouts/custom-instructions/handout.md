---
titel: Custom Instructions – damit die KI dich versteht
label: Handout
stand: 23. Oktober 2026
bild: drache-tuete.jpg
bild_alt: Drache mit Papiertüte über dem Kopf am Laptop, auf einem Schild steht „Ich sehe nichts. Ich weiß nichts.“
pdf_name: custom-instructions
mehrseitig: ja
beschreibung: Stell dich der KI einmal vor und spar dir die Wiederholung – mit Leitfragen, einem Beispiel und einem Interview-Prompt, der deine Custom Instruction für dich schreibt.
---

KI-Tools sind freundlich und hilfsbereit und zugleich ahnungslos. Sie wissen nicht, wer du bist, wo du arbeitest oder was sie für dich tun sollen. Ohne diese Infos bekommst du generischen Marketing-Sprech zurück.

==Deshalb der wichtigste Tipp für bessere Prompts: Gib dem Bot Kontext, bevor du die erste Frage stellst.==

## Stell dich vor

Sag dem Bot, wer du bist, wo du arbeitest, was eure Mission ist, wer eure Zielgruppen sind und was euch wichtig ist. Fünf bis zehn Sätze reichen.

::: tipp
**Beispiel für die erfundene NGO „Ein Drache für alle“:**
„Ich arbeite als Freiwilligenmanagerin für die NGO ‚Ein Drache für alle‘. Wir sind ein kleiner Verein in Deutschland mit 20 Mitarbeitenden. Unsere Mission ist es, die letzten Drachen der Erde zu schützen. Wir tun das mit Kampagnenarbeit, politischem Lobbying, Bildungs- und Informationsarbeit und durch unsere Freiwilligen, die Drachensichtungen erfassen. Wir arbeiten vernetzt mit der Wissenschaft. Ehrenamtliches Engagement zu ermöglichen und zu fördern, ist der Kern unserer Arbeit. Wichtig sind uns Kommunikation auf Augenhöhe, Gemeinschaft und gemeinsames Lernen.“
:::

## Was sind Custom Instructions?

Custom Instructions sind Informationen, die du **dauerhaft** im KI-Tool hinterlegst. Das Tool schickt sie zu Beginn jedes Chats mit. Das geht meist auch gratis, etwa bei ChatGPT, Claude und Mistral: Suche in den Einstellungen nach „Personalisierung“ oder „Anweisungen“. Manche Tools haben zwei Felder wie unten, andere nur eines. Dann schreibst du beides hinein: Infos über dich und Anweisungen an die KI.

:::: karten

::: karte Feld 1 · Über dich
- Wer bist du? Position und Organisation
- Wer sind deine Zielgruppen?
- Was ist eure Mission?
- Wie arbeitet ihr? Bildung, Beratung, Kampagnen …
- Was ist euch wichtig?
:::

::: karte Feld 2 · Wie die KI antworten soll
- Sprache und Art zu gendern
- Struktur: Fließtext, Listen, Markdown
- Länge: kurz oder ausführlich
- Mit oder ohne Quellen
- Tonfall und Sprachstil
:::

::::

::: schritte
1. ### Schreib strukturiert
   Kurze, ganze Sätze, Absätze oder Aufzählungen.

2. ### Bleib allgemein
   Keine zu genauen Vorgaben. Details zur Aufgabe gehören in den Chat oder in ein Projekt.

3. ### Keine sensiblen Daten
   Nichts Sensibles, nichts Personenbezogenes.
:::

<!--seitenumbruch-->

## Lass dich von der KI interviewen

Du weißt nicht, was du schreiben sollst? Kopiere diesen Prompt in einen neuen Chat. Die KI stellt dir fünf Fragen und schreibt daraus deine Custom Instruction.

```
# Aufgabe
Interviewe mich mit 5 Fragen nacheinander (nur ein Thema pro Frage), um eine Custom Instruction für mein KI-Tool zu erstellen. Formuliere die Fragen so, dass ich schnell antworten kann. Bei Unklarheit: einmal kurz nachfragen. Nennst du eine Website, rufe sie auf und fasse das Mission Statement zusammen, bevor du weitermachst.

# Die 5 Fragen
1. Organisation: Welche Organisation, wofür setzt ihr euch ein? (Website gern statt Beschreibung)
2. Rolle: Deine Rolle, wichtigste Themen, Projekte, Zielgruppen?
3. Arbeitsweise: Wie soll die KI mit dir arbeiten – unterstützend/kritisch, kurz/ausführlich, sachlich / freundlich / motivierend / humorvoll / direkt? 3 Stichworte.
4. Sprache & Stil: Gendergerechte Sprache (wie?), bevorzugte/vermiedene Wörter, Fließtext oder Listen, Schreibstil? Beispiele willkommen.
5. Arbeitsprinzipien: Welche davon soll die KI beachten (Buchstaben nennen)?
   a) Unsicherheit transparent machen
   b) bei unklaren Aufträgen nachfragen
   c) Antworten begründen
   d) Komplexes mit Beispielen erklären
   e) anderes

# Abschluss
Frage final, ob etwas Wichtiges fehlt.

Erstelle danach eine fertige Custom Instruction (max. 1000 Zeichen), passend zu Person, Rolle und Organisation, mit genannten Beispielen. Nur das Endergebnis, in kopierfähigem Raw Markdown, ohne Vor- oder Nachbemerkung. Struktur:
- Über mich und meine Organisation: Mission Statement
- Meine Rolle, Themen und Zielgruppen
- So soll die KI mit mir arbeiten
- Sprache, Stil und Formulierungen
```

> Dein Tool kann keine Custom Instructions? Speicher deinen Text in einem Dokument auf dem Desktop und kopiere ihn in jeden neuen Chat. Wo du die Einstellung in ChatGPT, Claude und Mistral findest, zeigen dir die > [Registrierungs-Handouts](https://juliajunge.github.io/handouts/#starten).

## Und die Memory-Funktion?

Viele Tools bieten zusätzlich eine „Erinnerung“ an. Ist sie eingeschaltet, merkt sich das Tool Schnipsel aus deinen Gesprächen, manche durchsuchen sogar alte Chats. Die Schnipsel kannst du ansehen und löschen. Mach das regelmäßig, sonst sammelt sich Müll an.

<img src="drache-interview.jpg" alt="Ein Mensch interviewt einen Drachen mit einem Mikrofon" style="max-height: 36mm; width: auto; border-radius: 12px; float: right; margin: 0 0 4mm 6mm;">

::: tipp
**Mein Tipp:** Memory-Funktionen machen den Bot tendenziell zum Schleimer (Sycophancy) und erschweren kritisches Feedback. Bei mir sind sie deshalb abgeschaltet. Probier selbst aus, was für dich passt.
:::

::: nurdruck
Video und mehr zum Thema: > [juliajunge.de/custom-instructions](https://www.juliajunge.de/custom-instructions/)
:::

<div class="nur-web mehr-links">

## Weiterlesen

- [Blogbeitrag mit Video: Custom Instructions Schritt für Schritt](https://www.juliajunge.de/custom-instructions/)
- [Handout: Bessere Prompts mit KLARO](https://juliajunge.github.io/handouts/bessere-prompts-mit-klaro/)
- [Handout: KI-Arbeitsprofile bauen](https://juliajunge.github.io/handouts/ki-arbeitsprofile/)

</div>
