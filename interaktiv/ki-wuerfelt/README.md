# Wie KI ihre Antworten würfelt

Interaktive Seite für Kurse und Workshops: In fünf Stationen deckst du auf, wie ein Sprachmodell das nächste Wort findet – und dass dabei jedes Wort gewürfelt wird.

- Adresse: https://juliajunge.github.io/handouts/ki-wuerfelt/
- Auf der Übersicht: Bereich „KI verstehen“ (Eintrag in `werkzeuge.yml` und `bereiche.yml`)

## Aufbau

1. **Zerlegen** – Text wird zu Token (mit Eingabefeld für eigene Sätze)
2. **Übersetzen** – Schritt 1: jedes Token hat eine Nummer (Wörterbuch). Schritt 2: Platz in einer Wortwolke, beim Antippen Linien für enge und lose Verbindungen. Darunter die echte Darstellung als Zahlenreihen: gewähltes Wort, engster Nachbar, fernstes Wort
3. **Rechnen** – Zurückschauen (Attention): Bögen mit Anteilen von „neue“ zu den Token davor; dann Anreichern und Wiederholen mit Schichten und Zähler
4. **Abwägen** – Wahrscheinlichkeiten für das nächste Wort
5. **Würfeln** – Einstieg mit dem gezinkten Würfel, dann Glücksrad: ein Tortenstück pro Wort, Striche alle 5 %, Temperatur-Regler verändert die Stücke live, „20-mal drehen“ mit Strichliste, Satz zu Ende drehen, Verlauf der Sätze

Danach: „Was heißt das für dich?“ mit vier Karten. Mit „> Alles aufdecken“ (oben rechts) zeigst du alle Stationen auf einmal, z. B. am Beamer.

Angelehnt an die Visualisierung „Wie ein KI-Modell das nächste Wort findet“ (dsn group, Llama 3.1 8B), aber stark verdichtet: Embedding-Tabelle, Feed-Forward, KV-Cache, Batching usw. sind in Station 2 und 3 zusammengefasst.

## Dateien

- `index.html` – Texte der Seite. Hier änderst du Formulierungen.
- `ki-wuerfelt.js` – Beispielsatz, Wortwolke (`KARTE`, Zahlenreihen aus dem Platz berechnet), ausgedachte Wahrscheinlichkeiten (`FOLGT`), Glücksrad und Aufdecken.
- `ki-wuerfelt.css` – Gestaltung; Schriften, Farben, Kopf und Fuß kommen aus `vorlage/handout.css`.

Kein PDF, keine Newsletter-Anmeldung, nichts wird gespeichert oder verschickt. `build.py` kopiert den Ordner unverändert nach `site/ki-wuerfelt/`.
