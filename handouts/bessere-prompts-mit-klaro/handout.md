---
titel: Bessere Prompts mit KLARO
label: Handout
stand: 8. Oktober 2026
bild: dragon-zielscheibe.png
bild_alt: Drache mit Zielscheibe
pdf_name: bessere-prompts-mit-klaro
beschreibung: Das KLARO-Schema in fünf Elementen für klare, strukturierte Prompts, mit Tipps zu Regeln, Stil und zwei Experimenten.
---

## KI-Modelle lieben Struktur

- Schreibe in vollständigen Sätzen statt in Stichworten.
- Nutze Absätze für logische Trennung (Umschalten + Enter).
- Nutze Listen und Nummerierungen für Aufzählungen.
- Formatiere mit Markdown, zum Beispiel `#` für Überschriften.

## Das KLARO-Schema

KLARO steht für fünf Elemente eines strukturierten Prompts. Je komplexer deine Aufgabe, desto wichtiger wird es, alle fünf einzusetzen. Deine Instruktionen verschieben die Wahrscheinlichkeiten in den Antworten hin zu dem Ergebnis, das du dir wünschst. Mehr kann ein Prompt nicht. Jede Antwort der KI ist generiert, deshalb kann sie nie ganz ohne Halluzinationen sein.

:::: karten

::: karte K – Kontext
Was sollte der Bot über dich und die Aufgabe wissen?
:::

::: karte L – Leitziel
Was willst du am Ende erreichen?
:::

::: karte A – Aufgabe
Was genau soll der Bot liefern?
:::

::: karte R – Regeln
Wie soll der Bot arbeiten?
:::

::: karte O – Output
Welches Format, welchen Stil und welchen Umfang soll das Ergebnis haben?
:::

::::

## Kontext (K)

Erkläre dem Bot, wer du bist, für wen du arbeitest und was ihr tut. Gib Beispiele für deine Arbeit, nenne deine Werte oder teile deine Mission. Tools mit Webzugang kannst du zum Recherchieren kurz auf deine Website schicken.

::: tipp
**Bonus-Tipp:** Speichere diese Infos in den Custom Instructions deines Tools. Dann musst du sie nicht jedes Mal neu schreiben.
:::

## Leitziel (L)

Was willst du mit der Aufgabe erreichen? Ein Social-Media-Post kann zum Beispiel informieren, emotionalisieren oder Gemeinschaft stiften.

## Aufgabe (A)

Beschreibe, was der Bot tun soll, und formuliere positiv: Sag, was du willst, statt was er lassen soll. Erwarte nicht, dass dir ein Bot die ganze Arbeit abnimmt. KI ist stark in der Ko-Kreation.

- Hilf mir, auf ungewöhnliche Ideen zu kommen, um …
- Generiere einen Post zu xy, der …

Für mehr Steuerung kommen Regeln (R) und Output (O) dazu.

## Regeln (R)

Mit Regeln sagst du dem Bot, **wie** er die Aufgabe erledigen soll.

::: schritte
1. ### Langsamer denken lassen
   „Nimm dir Zeit, die Aufgabe gründlich zu durchdenken. Führe jeden Schritt einzeln aus und erkläre deine Gedankengänge."

2. ### Kritischer denken lassen
   „Gib an, welche deiner Antworten auf gesicherten Fakten basieren und welche eher Vermutungen sind."

3. ### Grenzen setzen
   Nenne, was der Bot vermeiden soll, zum Beispiel Floskeln, Fachjargon oder erfundene Quellen.
:::

## Output (O)

Bei der Ideenfindung ist der Schreibstil des Bots nebensächlich, du nutzt nur die hilfreichen Gedanken. Willst du generierte Texte weiterverwenden, statt sie komplett neu zu schreiben, muss die KI deinen Stil treffen. Ohne Stilanweisungen landest du schnell beim generischen Marketing-Sprech.

So bekommst du passende Ergebnisse:

- Beschreibe deinen Stil präzise („kollegial für Ehrenamtliche um die 40").
- Lege Format und gewünschte Länge fest.
- Teile Beispiele guter Texte (alte Mails, Newsletter, Blogbeiträge) und bitte die KI, diesen Stil zu imitieren (Few-Shot-Prompting).
- Weise dem Bot eine Rolle zu, um die Tonalität zu steuern: Ein Lehrer formuliert anders als ein Jurist. Genaue Stilvorgaben sind aber präziser.

## Probier es aus

::: schritte
1. ### Mit und ohne KLARO
   Stelle dieselbe Aufgabe einmal ohne und einmal mit KLARO-Schema und vergleiche die Antworten.

2. ### Die KI fragen lassen
   Du bist unsicher, welche Infos die KI braucht? Beschreibe die Aufgabe gut und frag, welche 3 bis 5 Infos sie noch benötigt. Entscheide dann, welche du liefern kannst und welche relevant sind.
:::

==Ein guter Prompt ist wie eine klare Wegbeschreibung: Je präziser, desto höher die Wahrscheinlichkeit, gut anzukommen.==
