/* Interaktiv: Wie KI ihre Antworten würfelt
   Alles läuft im Browser, nichts wird gespeichert oder verschickt.
   Die Wahrscheinlichkeiten sind ausgedacht und nur zur Veranschaulichung. */
(function () {
  "use strict";

  var ruhig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(id) { return document.getElementById(id); }
  function el(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text != null) e.textContent = text;
    return e;
  }
  function prozent(p) {
    var w = p * 100;
    var s = w >= 1 || w === 0 ? Math.round(w).toString() : w.toFixed(1);
    return s.replace(".", ",") + " %";
  }
  function zahl(n) { return Math.round(n).toLocaleString("de-DE"); }

  /* ---------- Beispiel ---------- */
  // Führendes Leerzeichen = neues Wort; ohne = Wortstück, das am vorigen hängt
  var START = [
    { t: "Unser", id: 52134 }, { t: " Verein", id: 31877 }, { t: " sucht", id: 48210 },
    { t: " dring", id: 67301 }, { t: "end", id: 437 }, { t: " neue", id: 22918 }
  ];

  /* ---------- Station 1: Zerlegen ---------- */
  function tokenChip(text, i, mitId, id) {
    var anschluss = i > 0 && text.charAt(0) !== " " && /^[\wäöüÄÖÜß*-]/.test(text);
    var chip = el("span", "token" + (anschluss ? " token--anschluss" : ""));
    chip.dataset.farbe = (i % 6) + 1;
    chip.appendChild(el("span", "token-text", text.trim() || "␣"));
    if (mitId) {
      chip.appendChild(el("span", "token-id", "Nr. " + zahl(id)));
    }
    return chip;
  }

  function zeigeTokens(ziel, tokens) {
    ziel.textContent = "";
    tokens.forEach(function (t, i) { ziel.appendChild(tokenChip(t, i)); });
  }

  // Häufige Wortbausteine bleiben ganz – so ähnlich lernt ein echter Tokenizer seine Stücke
  var BAUSTEINE = ["nachbarschaft", "unterstütz", "ehrenamt", "schaften", "schafts", "schaft", "verein", "arbeit",
    "nachbar", "lichen", "liche", "lich", "keit", "heit", "ungen", "ung", "unter", "hilfe", "ehren", "amt",
    "intelligenz", "künstlich", "sprach", "modell", "frage", "antwort", "wort", "satz", "text", "tion", "ieren",
    "ver", "ge", "be", "en", "er"];
  function zerschneide(wort) {
    if (wort.length <= 6) return [wort];
    var teile = [], i = 0, klein = wort.toLowerCase(), stueck = "";
    while (i < wort.length) {
      var treffer = "";
      for (var b = 0; b < BAUSTEINE.length; b++) {
        var bs = BAUSTEINE[b];
        if (bs.length > treffer.length && klein.substr(i, bs.length) === bs && (bs.length > 2 || stueck === "")) treffer = bs;
      }
      if (treffer.length > 2 || (treffer && stueck === "")) {
        if (stueck) { teile.push(stueck); stueck = ""; }
        teile.push(wort.substr(i, treffer.length));
        i += treffer.length;
      } else {
        stueck += wort.charAt(i++);
        if (stueck.length === 5) { teile.push(stueck); stueck = ""; }
      }
    }
    if (stueck) teile.push(stueck);
    // Einzelne Buchstaben am Ende an das vorige Stück hängen
    if (teile.length > 1 && teile[teile.length - 1].length === 1) teile[teile.length - 2] += teile.pop();
    return teile;
  }
  function tokenisiere(text) {
    var stuecke = text.match(/\s*[A-Za-zÄÖÜäöüß*-]+|\s*\d{1,3}|\s*[^\sA-Za-zÄÖÜäöüß\d]/g) || [];
    var tokens = [];
    stuecke.forEach(function (s) {
      var leer = /^\s/.test(s) ? " " : "";
      var kern = s.trim();
      if (/^[A-Za-zÄÖÜäöüß*-]+$/.test(kern)) {
        zerschneide(kern).forEach(function (teil, i) { tokens.push((i === 0 ? leer : "") + teil); });
      } else {
        tokens.push(leer + kern);
      }
    });
    return tokens;
  }

  zeigeTokens($("token-beispiel"), START.map(function (t) { return t.t; }));
  var eingabe = $("eigener-text");
  function eigeneTokens() {
    var tokens = tokenisiere(eingabe.value);
    zeigeTokens($("token-eigen"), tokens);
    var woerter = (eingabe.value.match(/[A-Za-zÄÖÜäöüß\d*-]+/g) || []).length;
    $("token-zaehler").innerHTML = tokens.length
      ? "<strong>" + tokens.length + " Token</strong> für " + woerter + (woerter === 1 ? " Wort" : " Wörter")
      : "Hier erscheinen die Bausteine, sobald du tippst.";
  }
  eingabe.addEventListener("input", eigeneTokens);
  eigeneTokens();

  /* ---------- Station 2: Übersetzen ---------- */
  // Pseudo-Zufall mit festem Startwert (für das Flackern in Station 3)
  function zufallAus(text) {
    var h = 2166136261;
    for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6D2B79F5;
      var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Schritt 1: Nummern
  START.forEach(function (t, i) { $("token-ids").appendChild(tokenChip(t.t, i, true, t.id)); });

  // Schritt 2: Wortwolke. Platz x nach rechts, y nach oben, jeweils 0 bis 1 (ausgedacht)
  var KARTE = [
    ["Ehrenamtliche", 0.12, 0.76], ["Helfer*innen", 0.20, 0.62], ["Mitglieder", 0.08, 0.48],
    ["Spender*innen", 0.22, 0.90], ["Verein", 0.30, 0.34],
    ["Sommerfest", 0.80, 0.86], ["Mittagstisch", 0.76, 0.72], ["Repair-Café", 0.88, 0.58],
    ["Räume", 0.70, 0.20], ["Kita", 0.88, 0.32], ["Stadtteil", 0.54, 0.08]
  ];
  function komma(z) { return z.toFixed(2).replace(".", ","); }
  function abstand(v, w) { return Math.hypot(v[1] - w[1], v[2] - w[2]); }
  function staerke(d) { return d < 0.2 ? "eng" : d < 0.45 ? "mittel" : "lose"; }
  function links(x) { return 10 + x * 80; }      // 10 % Abstand zum Rand, damit kein Wort abgeschnitten wird
  function oben(y) { return 10 + (1 - y) * 80; }

  var karte = $("landkarte"), linien = $("landkarte-linien"), kartenKnoepfe = [];
  KARTE.forEach(function (w, i) {
    var k = el("button", "token token--karte", w[0]);
    k.type = "button";
    k.dataset.farbe = i < 5 ? 1 : i < 8 ? 2 : 4;
    k.style.left = links(w[1]) + "%";
    k.style.top = oben(w[2]) + "%";
    k.setAttribute("aria-pressed", "false");
    k.addEventListener("click", function () { waehleOrt(i); });
    karte.appendChild(k);
    kartenKnoepfe.push(k);
  });

  // Zahlenreihe aus dem Platz in der Wolke: nahe Plätze ergeben ähnliche Muster
  var MUSTER = (function () {
    var r = zufallAus("wortwolke"), m = [];
    for (var d = 0; d < 24; d++) m.push([r() * 9 - 4.5, r() * 9 - 4.5, r() * 6.28]);
    return m;
  })();
  function zahlenreihe(w) {
    var rausch = zufallAus(w[0]);
    return MUSTER.map(function (m) {
      return Math.max(-1, Math.min(1, Math.sin(m[0] * w[1] + m[1] * w[2] + m[2]) * 0.9 + (rausch() - 0.5) * 0.15));
    });
  }
  function zeichneReihe(ziel, werte) {
    werte.forEach(function (wert) {
      var spalte = el("i");
      var balken = el("b", wert >= 0 ? "plus" : "minus");
      balken.style.height = Math.max(4, Math.abs(wert) * 50) + "%";
      spalte.appendChild(balken);
      ziel.appendChild(spalte);
    });
  }

  function waehleOrt(i) {
    var w = KARTE[i];
    kartenKnoepfe.forEach(function (k, j) { k.setAttribute("aria-pressed", j === i ? "true" : "false"); });
    var andere = KARTE.map(function (v, j) { return { v: v, j: j, d: abstand(v, w) }; })
      .filter(function (x) { return x.j !== i; })
      .sort(function (a, b) { return a.d - b.d; });

    // Linien: dick = eng, dünn = mittel, gestrichelt = lose
    linien.textContent = "";
    andere.slice().reverse().forEach(function (x) {
      var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", links(w[1])); l.setAttribute("y1", oben(w[2]));
      l.setAttribute("x2", links(x.v[1])); l.setAttribute("y2", oben(x.v[2]));
      l.setAttribute("class", "linie-" + staerke(x.d));
      linien.appendChild(l);
    });

    var eng = andere.filter(function (x) { return staerke(x.d) === "eng"; }).map(function (x) { return x.v[0]; });
    var lose = andere.filter(function (x) { return staerke(x.d) === "lose"; }).map(function (x) { return x.v[0]; });
    $("landkarte-info").innerHTML = "<strong>„" + w[0] + "“</strong> liegt bei " + komma(w[1]) + " | " + komma(w[2]) + ". " +
      (eng.length ? "Eng verbunden mit: " + eng.join(", ") + ". " : "Eng verbunden: " + andere[0].v[0] + ". ") +
      (lose.length ? "Lose verbunden mit: " + lose.slice(-3).reverse().join(", ") + "." : "");

    // Zahlenreihen: gewähltes Wort, engster Nachbar, fernstes Wort
    var reihen = $("zahlenreihen");
    reihen.textContent = "";
    [[w, "gewählt"], [andere[0].v, "eng verbunden"], [andere[andere.length - 1].v, "lose verbunden"]].forEach(function (paar) {
      var zeile = el("div", "zahlenreihe-zeile");
      var name = el("div", "zahlenreihe-name");
      name.appendChild(el("strong", null, paar[0][0]));
      name.appendChild(el("small", null, paar[1]));
      zeile.appendChild(name);
      var v = el("div", "vektor");
      zeichneReihe(v, zahlenreihe(paar[0]));
      zeile.appendChild(v);
      reihen.appendChild(zeile);
    });
  }
  waehleOrt(0);

  /* ---------- Station 3: Rechnen ---------- */
  // Schritt 1: Zurückschauen. Anteile, die „neue“ von den Token davor übernimmt (ausgedacht, zusammen 100 %)
  var ANTEILE = [5, 35, 30, 10, 10, 10];   // der letzte Wert: was „neue“ von sich selbst behält
  var VORHER = [["Schuhe", 18], ["Wohnung", 15], ["Ideen", 12], ["Mitglieder", 6], ["Räume", 5], ["Helfer*innen", 3], ["Ehrenamtliche", 2]];
  var NACHHER = [["Ehrenamtliche", 38], ["Mitglieder", 27], ["Helfer*innen", 14], ["Räume", 8], ["Ideen", 4], ["Wohnung", 1], ["Schuhe", 0.5]];
  var szeneChips = START.map(function (t, i) {
    var chip = el("span", "token");
    chip.dataset.farbe = (i % 6) + 1;
    chip.appendChild(el("span", "token-text", t.t.trim()));
    if (i > 0 && t.t.charAt(0) !== " ") chip.classList.add("token--anschluss");
    $("aufmerksamkeit").appendChild(chip);
    return chip;
  });
  szeneChips[5].classList.add("token--fokus");
  var szeneSchritt = 0;

  function zeichneBoegen() {
    var boegen = $("boegen"), szene = $("zurueck-szene");
    boegen.textContent = "";
    if (szeneSchritt === 0) return;
    var rahmen = szene.getBoundingClientRect();
    var ns = "http://www.w3.org/2000/svg";
    boegen.setAttribute("viewBox", "0 0 " + rahmen.width + " " + rahmen.height);
    function mitte(chip) { var r = chip.getBoundingClientRect(); return [r.left - rahmen.left + r.width / 2, r.top - rahmen.top]; }
    var ziel = mitte(szeneChips[5]);
    var selbst = document.createElementNS(ns, "text");
    selbst.setAttribute("x", ziel[0]);
    selbst.setAttribute("y", ziel[1] + szeneChips[5].offsetHeight + 16);
    selbst.setAttribute("text-anchor", "middle");
    selbst.setAttribute("class", "bogen-wert bogen-wert--selbst");
    selbst.textContent = ANTEILE[5] + " %";
    boegen.appendChild(selbst);
    for (var i = 0; i < 5; i++) {
      var start = mitte(szeneChips[i]);
      var hoehe = Math.min(ziel[1] - 6, 14 + (ziel[0] - start[0]) * 0.24);
      var spitze = start[1] - hoehe;
      var w = ANTEILE[i];
      var bogen = document.createElementNS(ns, "path");
      bogen.setAttribute("d", "M" + start[0] + " " + start[1] + " C" + start[0] + " " + spitze + " " + ziel[0] + " " + spitze + " " + ziel[0] + " " + ziel[1]);
      bogen.setAttribute("class", w >= 25 ? "linie-eng" : w >= 10 ? "linie-mittel" : "linie-lose");
      bogen.setAttribute("stroke-width", w >= 25 ? 2 + w / 7 : w >= 10 ? 2.5 : 1.5);
      boegen.appendChild(bogen);
      var text = document.createElementNS(ns, "text");
      text.setAttribute("x", start[0]);
      text.setAttribute("y", start[1] + szeneChips[i].offsetHeight + 16);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("class", "bogen-wert");
      text.textContent = w + " %";
      boegen.appendChild(text);
    }
  }
  function zeigeListe(daten) {
    zeichneBalken($("neue-liste"), daten.map(function (d) { return { t: d[0], p: d[1] / 100 }; }));
  }
  function zeigeSzene() {
    var knopf = $("zurueck-weiter");
    $("zurueck-szene").classList.toggle("mit-boegen", szeneSchritt > 0);
    if (szeneSchritt === 0) {
      $("zurueck-text").innerHTML = "<strong>Vorher:</strong> Allein weiß „neue“ nur, dass es „neue“ ist. Danach könnte vieles kommen:";
      zeigeListe(VORHER);
      knopf.textContent = "> Zurückschauen";
    } else if (szeneSchritt === 1) {
      $("zurueck-text").innerHTML = "<strong>Zurückschauen:</strong> „neue“ vergleicht seine Zahlenreihe mit denen davor. Am besten passen „Verein“ (35 %) und „sucht“ (30 %) – davon übernimmt es am meisten. Von „Unser“ übernimmt es kaum etwas, 10 % behält es von sich selbst.";
      knopf.textContent = "> Ergebnis zeigen";
    } else {
      $("zurueck-text").innerHTML = "<strong>Nachher:</strong> Jetzt steckt in „neue“: Hier sucht ein Verein. Wörter für Menschen wie „Ehrenamtliche“ rücken nach oben, „Schuhe“ und „Wohnung“ fallen fast auf null.";
      zeigeListe(NACHHER);
      knopf.textContent = "> Nochmal ansehen";
    }
    zeichneBoegen();
  }
  $("zurueck-weiter").addEventListener("click", function () { szeneSchritt = (szeneSchritt + 1) % 3; zeigeSzene(); });
  $("zurueck-neu").addEventListener("click", function () { szeneSchritt = 0; zeigeSzene(); });
  window.addEventListener("resize", zeichneBoegen);
  // Bögen erst zeichnen, wenn die Station sichtbar ist (vorher hat sie keine Maße)
  document.addEventListener("station-offen", zeichneBoegen);
  zeigeSzene();

  var SCHICHTEN = ["Schicht 1", "Schicht 2", "Schicht 3", "…", "Schicht 31", "Schicht 32"];
  var schichtZeilen = SCHICHTEN.map(function (name) {
    var zeile = el("div", "schicht" + (name === "…" ? " schicht--luecke" : ""));
    zeile.appendChild(el("span", "schicht-name", name === "…" ? "" : name));
    var zahlen = el("div", "schicht-zahlen");
    if (name === "…") zahlen.textContent = "· · · noch 28 Schichten · · ·";
    else for (var i = 0; i < 16; i++) zahlen.appendChild(el("i"));
    zeile.appendChild(zahlen);
    $("schichten").appendChild(zeile);
    return zeile;
  });

  var ZIEL_RECHENSCHRITTE = 16000000000;
  var rechnetGerade = false;
  $("rechnen-starten").addEventListener("click", function () {
    if (rechnetGerade) return;
    rechnetGerade = true;
    var knopf = this;
    knopf.disabled = true;
    schichtZeilen.forEach(function (z) { z.classList.remove("schicht--aktiv", "schicht--fertig"); });
    var dauer = ruhig ? 0 : 3600;
    var start = performance.now();
    var zufall = zufallAus("rechnen" + Date.now());
    function bild(jetzt) {
      var anteil = dauer ? Math.min(1, (jetzt - start) / dauer) : 1;
      var aktiv = Math.min(schichtZeilen.length - 1, Math.floor(anteil * schichtZeilen.length));
      schichtZeilen.forEach(function (z, i) {
        z.classList.toggle("schicht--fertig", i < aktiv || anteil === 1);
        z.classList.toggle("schicht--aktiv", i === aktiv && anteil < 1);
        if (i === aktiv && anteil < 1) {
          z.querySelectorAll("i").forEach(function (f) { f.classList.toggle("an", zufall() > 0.55); });
        }
      });
      // Zähler läuft gegen Ende schneller hoch – so wirkt die Größenordnung
      $("rechenschritte").textContent = zahl(ZIEL_RECHENSCHRITTE * Math.pow(anteil, 3));
      if (anteil < 1) requestAnimationFrame(bild);
      else {
        $("rechenschritte").textContent = "rund " + zahl(ZIEL_RECHENSCHRITTE);
        knopf.disabled = false;
        knopf.textContent = "> Nochmal rechnen lassen";
        rechnetGerade = false;
      }
    }
    requestAnimationFrame(bild);
  });

  /* ---------- Sprachmodell im Kleinformat ---------- */
  // Welche Token können folgen? Schlüssel = letztes Wort. Werte = ausgedachte Wahrscheinlichkeiten (Prozent).
  var NOMEN = [[" für", 45], [".", 33], [" mit", 13], [" aus", 9]];
  var FOLGT = {
    "neue": [[" Ehrenamtliche", 38], [" Mitglieder", 27], [" Helfer*innen", 14], [" Räume", 8], [" Spender*innen", 6], [" Ideen", 4], [" Mitstreiter*innen", 3]],
    "Räume": [[" für", 55], [".", 33], [" in", 12]],
    "Spender*innen": [[".", 45], [" für", 40], [" aus", 15]],
    "Ideen": [[" für", 52], [".", 34], [" aus", 14]],
    "für": [[" die", 35], [" unsere", 33], [" das", 19], [" den", 13]],
    "die": [[" Tafel", 32], [" Jugendarbeit", 28], [" Kleiderkammer", 22], [" Website", 18]],
    "unsere": [[" Projekte", 34], [" Sommerfeste", 24], [" Hausaufgabenhilfe", 24], [" Kita", 18]],
    "das": [[" Sommerfest", 42], [" Repair-Café", 30], [" Nachbarschaftscafé", 28]],
    "den": [[" Vorstand", 46], [" Fahrdienst", 30], [" Mittagstisch", 24]],
    "mit": [[" Zeit", 40], [" Herz", 34], [" Führerschein", 26]],
    "aus": [[" der", 62], [" dem", 38]],
    "in": [[" der", 72], [" unserem", 28]],
    "der": [[" Nachbarschaft", 48], [" Region", 34], [" Umgebung", 18]],
    "dem": [[" Stadtteil", 58], [" Ort", 42]],
    "unserem": [[" Stadtteil", 60], [" Ort", 40]]
  };
  var SCHLUSS = [[".", 80], ["!", 20]];
  var PRAEPOSITION = { "für": 1, "mit": 1, "aus": 1, "in": 1 };

  function kandidaten(satz) {
    var letztes = satz[satz.length - 1].trim();
    if (FOLGT[letztes]) return normiere(FOLGT[letztes]);
    // Nach einem Nomen: Satz fortsetzen oder beenden – war schon eine Präposition dabei, ist Schluss
    var hatteVerbindung = satz.slice(6).some(function (t) { return PRAEPOSITION[t.trim()]; });
    return normiere(hatteVerbindung ? SCHLUSS : NOMEN);
  }
  function normiere(liste) {
    var summe = liste.reduce(function (s, k) { return s + k[1]; }, 0);
    return liste.map(function (k) { return { t: k[0], p: k[1] / summe }; });
  }
  function mitTemperatur(liste, temp) {
    if (temp <= 0.001) {
      var beste = 0;
      liste.forEach(function (k, i) { if (k.p > liste[beste].p) beste = i; });
      return liste.map(function (k, i) { return { t: k.t, p: i === beste ? 1 : 0 }; });
    }
    var gew = liste.map(function (k) { return Math.pow(k.p, 1 / temp); });
    var summe = gew.reduce(function (s, g) { return s + g; }, 0);
    return liste.map(function (k, i) { return { t: k.t, p: gew[i] / summe }; });
  }
  function istEnde(t) { return t === "." || t === "!"; }
  function anzeige(t) { t = t.trim(); return t === "." ? "Punkt" : t === "!" ? "Ausrufezeichen" : t; }

  /* ---------- Station 4: Abwägen ---------- */
  function zeichneBalken(ziel, liste, gewaehlt) {
    ziel.textContent = "";
    var hoechster = Math.max.apply(null, liste.map(function (k) { return k.p; })) || 1;
    liste.forEach(function (k, i) {
      var zeile = el("div", "balken" + (i === gewaehlt ? " balken--gewaehlt" : ""));
      zeile.appendChild(el("span", "balken-wort", k.t.trim()));
      var spur = el("span", "balken-spur");
      var fuellung = el("span", "balken-fuellung");
      fuellung.style.display = "block";
      fuellung.style.width = (k.p / hoechster * 100) + "%";
      spur.appendChild(fuellung);
      zeile.appendChild(spur);
      zeile.appendChild(el("span", "balken-wert", prozent(k.p)));
      ziel.appendChild(zeile);
    });
  }
  zeichneBalken($("wahrscheinlichkeiten"), kandidaten(START.map(function (t) { return t.t; })));

  /* ---------- Station 5: Würfeln mit dem Glücksrad ---------- */
  var SVG = "http://www.w3.org/2000/svg";
  var FARBEN = ["#DDE9A8", "#FDF0A6", "#CFE6D8", "#D6E4F0", "#F4C2D4", "#E3DAEF", "#E8D3B5"];
  var ORANGE = "#E3780C";
  function svg(tag, attr) {
    var e = document.createElementNS(SVG, tag);
    for (var k in attr) e.setAttribute(k, attr[k]);
    return e;
  }
  function punkt(winkel, r) { // 0 Grad = oben, im Uhrzeigersinn
    var b = (winkel - 90) * Math.PI / 180;
    return [Math.cos(b) * r, Math.sin(b) * r];
  }

  var satz, letzterNeu, aktuelle, beschaeftigt = false, drehung = 0, striche = [];
  var tempRegler = $("temperatur");
  var drehteil = $("rad-drehteil");
  function temperatur() { return parseFloat(tempRegler.value); }

  function zeigeSatz() {
    var p = $("satz");
    p.textContent = "";
    satz.forEach(function (t, i) {
      var teil = el("span", i === letzterNeu ? "neu-wort" : "alt", i === letzterNeu ? t.trim() : t);
      if (i === letzterNeu && t.charAt(0) === " ") p.appendChild(document.createTextNode(" "));
      p.appendChild(teil);
    });
    if (!istEnde(satz[satz.length - 1].trim())) p.appendChild(el("span", "cursor"));
  }

  // Zeichnet das Rad: ein Tortenstück pro Wort, Größe = Wahrscheinlichkeit
  function zeichneRad(getroffen) {
    var rad = $("rad");
    rad.textContent = "";
    var start = 0;
    aktuelle.forEach(function (k, i) {
      if (k.p <= 0) { k.von = k.bis = start; return; }
      var ende = start + k.p * 360;
      k.von = start; k.bis = ende;
      var farbe = i === getroffen ? ORANGE : FARBEN[i % FARBEN.length];
      if (k.p >= 0.9999) {
        rad.appendChild(svg("circle", { cx: 0, cy: 0, r: 100, fill: farbe }));
      } else {
        var a = punkt(start, 100), b = punkt(ende, 100);
        rad.appendChild(svg("path", {
          d: "M0 0 L" + a[0] + " " + a[1] + " A100 100 0 " + (ende - start > 180 ? 1 : 0) + " 1 " + b[0] + " " + b[1] + " Z",
          fill: farbe, stroke: "#FFFFFF", "stroke-width": 1.5
        }));
      }
      start = ende;
    });
    // Beschriftung entlang des Radius, nur auf Stücken, die groß genug sind
    aktuelle.forEach(function (k) {
      if (k.p < 0.075) return;
      var mitte = (k.von + k.bis) / 2;
      var links = mitte > 180;
      var drehen = links ? mitte + 90 : mitte - 90;
      var pos = k.p >= 0.9999 ? [0, -50] : punkt(mitte, 58);
      var text = svg("text", {
        x: 0, y: 0, "text-anchor": "middle", "class": "rad-text",
        transform: "translate(" + pos[0] + " " + pos[1] + ") rotate(" + (k.p >= 0.9999 ? 0 : drehen) + ")"
      });
      var wort = svg("tspan", { x: 0, dy: "-0.15em" });
      wort.textContent = anzeige(k.t);
      var wert = svg("tspan", { x: 0, dy: "1.15em", "class": "rad-prozent" });
      wert.textContent = prozent(k.p);
      text.appendChild(wort);
      text.appendChild(wert);
      rad.appendChild(text);
    });
    // Striche am Rand alle 5 Prozent
    for (var s = 0; s < 20; s++) {
      var aussen = punkt(s * 18, 100), innen = punkt(s * 18, s % 5 === 0 ? 90 : 94);
      rad.appendChild(svg("line", { x1: innen[0], y1: innen[1], x2: aussen[0], y2: aussen[1], "class": "rad-strich" }));
    }
    rad.appendChild(svg("circle", { cx: 0, cy: 0, r: 100, fill: "none", "class": "rad-rand" }));
    rad.appendChild(svg("circle", { cx: 0, cy: 0, r: 7, "class": "rad-nabe" }));
  }

  function zeichneLegende(getroffen) {
    var liste = $("rad-legende");
    liste.textContent = "";
    var summe = striche.reduce(function (s, n) { return s + n; }, 0);
    aktuelle.forEach(function (k, i) {
      var li = el("li", i === getroffen ? "gewonnen" : "");
      var farbe = el("i", "rad-farbe");
      farbe.style.background = i === getroffen ? ORANGE : FARBEN[i % FARBEN.length];
      li.appendChild(farbe);
      li.appendChild(el("span", "rad-wort", anzeige(k.t)));
      li.appendChild(el("span", "rad-wert", prozent(k.p)));
      var strichliste = el("span", "strichliste");
      for (var n = 0; n < (striche[i] || 0); n++) strichliste.appendChild(el("b", (n + 1) % 5 === 0 ? "fuenfter" : ""));
      if (summe) strichliste.appendChild(el("small", null, (striche[i] || 0) + "×"));
      li.appendChild(strichliste);
      liste.appendChild(li);
    });
    liste.classList.toggle("mit-strichen", summe > 0);
  }

  function neuesRad() {
    if (istEnde(satz[satz.length - 1].trim())) return;
    aktuelle = mitTemperatur(kandidaten(satz), temperatur());
    striche = aktuelle.map(function () { return 0; });
    zeichneRad();
    zeichneLegende();
  }

  function neuStart() {
    satz = START.map(function (t) { return t.t; });
    letzterNeu = -1;
    $("wurf-ergebnis").textContent = "Das Rad steht noch.";
    $("wurf-erklaerung").textContent = "Drück auf „Glücksrad drehen“.";
    zeigeSatz();
    neuesRad();
    setzeKnoepfe();
  }

  function setzeKnoepfe() {
    var fertig = istEnde(satz[satz.length - 1].trim());
    ["einmal-wuerfeln", "zwanzig-drehen", "satz-wuerfeln"].forEach(function (id) { $(id).disabled = fertig || beschaeftigt; });
    $("neu-starten").disabled = beschaeftigt;
    tempRegler.disabled = beschaeftigt;
  }

  function warte(ms) { return new Promise(function (r) { setTimeout(r, ruhig ? 0 : ms); }); }

  // Kreislauf kurz durchleuchten: dieselbe Kette läuft für jedes Wort
  function kreislauf(schnell) {
    var schritte = $("kreislauf").querySelectorAll("li");
    var takt = schnell ? 90 : 220;
    var kette = Promise.resolve();
    schritte.forEach(function (s, i) {
      kette = kette.then(function () {
        schritte.forEach(function (x) { x.classList.remove("an"); });
        s.classList.add("an");
        return warte(i === schritte.length - 1 ? 0 : takt);
      });
    });
    return kette;
  }

  // Dreht das Rad und liefert das gewonnene Stück. Der Zufall: eine Stelle auf dem Rand, jede gleich wahrscheinlich.
  function drehe(dauer, runden) {
    var stelle = Math.random() * 360;
    var treffer = aktuelle.length - 1;
    for (var i = 0; i < aktuelle.length; i++) {
      if (aktuelle[i].p > 0 && stelle >= aktuelle[i].von && stelle < aktuelle[i].bis) { treffer = i; break; }
    }
    // Die Stelle soll unter dem Zeiger oben landen
    var ziel = ((360 - stelle) % 360);
    var bisher = ((drehung % 360) + 360) % 360;
    drehung += runden * 360 + ((ziel - bisher + 360) % 360);
    dauer = ruhig ? 0 : dauer;
    drehteil.style.transition = dauer ? "transform " + dauer + "ms cubic-bezier(.12,.6,.15,1)" : "none";
    drehteil.style.transform = "rotate(" + drehung + "deg)";
    return new Promise(function (fertig) { setTimeout(function () { fertig(treffer); }, dauer + 30); });
  }

  function beschreibe(treffer) {
    var gewaehlt = aktuelle[treffer];
    var rang = aktuelle.slice().sort(function (a, b) { return b.p - a.p; }).indexOf(gewaehlt) + 1;
    $("wurf-ergebnis").textContent = "Gewonnen: „" + anzeige(gewaehlt.t) + "“ (" + prozent(gewaehlt.p) + ")";
    $("wurf-erklaerung").textContent = rang === 1
      ? "Das größte Stück hat gewonnen."
      : "Diesmal hat nicht das größte Stück gewonnen, sondern Platz " + rang + ".";
  }

  function einWurf(schnell) {
    if (istEnde(satz[satz.length - 1].trim())) return Promise.resolve(true);
    return kreislauf(schnell).then(function () { return drehe(schnell ? 1400 : 3600, schnell ? 2 : 4); }).then(function (treffer) {
      striche[treffer] = (striche[treffer] || 0) + 1;
      zeichneRad(treffer);
      zeichneLegende(treffer);
      beschreibe(treffer);
      return warte(schnell ? 600 : 1200).then(function () {
        var gewaehlt = aktuelle[treffer];
        satz.push(gewaehlt.t);
        letzterNeu = satz.length - 1;
        zeigeSatz();
        var fertig = istEnde(gewaehlt.t);
        if (fertig) satzFertig();
        else neuesRad();
        return fertig;
      });
    });
  }

  function zwanzigMal() {
    var runde = 0;
    function naechste() {
      if (runde++ >= 20) {
        var oft = aktuelle.map(function (k, i) { return { t: anzeige(k.t), n: striche[i] }; })
          .filter(function (x) { return x.n; }).sort(function (a, b) { return b.n - a.n; })
          .map(function (x) { return x.t + " " + x.n + "×"; });
        $("wurf-ergebnis").textContent = "20-mal gedreht: " + oft.join(", ");
        $("wurf-erklaerung").textContent = "Große Stücke gewinnen oft, kleine selten – aber nicht nie. Genau so entstehen unterschiedliche Antworten.";
        return Promise.resolve();
      }
      return drehe(380, 1).then(function (treffer) {
        striche[treffer] = (striche[treffer] || 0) + 1;
        zeichneRad(treffer);
        zeichneLegende(treffer);
        $("wurf-ergebnis").textContent = "Drehung " + runde + " von 20: „" + anzeige(aktuelle[treffer].t) + "“";
        $("wurf-erklaerung").textContent = "";
        return warte(120).then(naechste);
      });
    }
    // Strichliste beginnt bei null
    striche = aktuelle.map(function () { return 0; });
    zeichneLegende();
    return naechste();
  }

  function satzFertig() {
    var box = $("verlauf-box"), liste = $("verlauf");
    box.hidden = false;
    var li = el("li");
    li.appendChild(document.createTextNode(satz.join("") + " "));
    li.appendChild(el("small", null, "(Temperatur " + tempRegler.value.replace(".", ",") + ")"));
    liste.insertBefore(li, liste.firstChild);
    while (liste.children.length > 8) liste.removeChild(liste.lastChild);
    $("wurf-erklaerung").textContent = "Satz fertig. Drück auf „Von vorn“ und dreh noch einmal.";
  }

  function sperren(fn) {
    if (beschaeftigt) return;
    beschaeftigt = true;
    setzeKnoepfe();
    fn().then(function () { beschaeftigt = false; setzeKnoepfe(); });
  }

  $("einmal-wuerfeln").addEventListener("click", function () { sperren(function () { return einWurf(false); }); });
  $("zwanzig-drehen").addEventListener("click", function () { sperren(zwanzigMal); });
  $("satz-wuerfeln").addEventListener("click", function () {
    sperren(function () {
      function schleife(runde) {
        return einWurf(true).then(function (fertig) { return fertig || runde > 12 ? null : schleife(runde + 1); });
      }
      return schleife(0);
    });
  });
  $("neu-starten").addEventListener("click", neuStart);

  var TEMP_TEXTE = [[0, "kein Zufall: immer das wahrscheinlichste Wort"], [0.5, "vorsichtig"], [0.9, "üblich"], [1.3, "kreativ"], [2.01, "wild"]];
  function tempAnzeige() {
    var t = temperatur(), text = "";
    for (var i = 0; i < TEMP_TEXTE.length; i++) { if (t <= TEMP_TEXTE[i][0]) { text = TEMP_TEXTE[i][1]; break; } }
    $("temperatur-wert").textContent = t.toFixed(1).replace(".", ",");
    $("temperatur-text").textContent = "· " + text;
    if (satz) neuesRad();
  }
  tempRegler.addEventListener("input", tempAnzeige);
  tempAnzeige();
  neuStart();

  /* ---------- Aufdecken ---------- */
  var fahrplan = document.querySelectorAll(".fahrplan li[data-ziel]");
  function oeffne(nr, scrollen) {
    var station = $("station-" + nr);
    if (!station) return;
    if (station.hidden) {
      station.hidden = false;
      station.classList.add("neu");
    }
    document.dispatchEvent(new Event("station-offen"));
    var vorher = $("station-" + (nr - 1));
    if (vorher) { var k = vorher.querySelector(".weiter"); if (k) k.hidden = true; }
    fahrplan.forEach(function (li) {
      if (parseInt(li.dataset.ziel, 10) <= nr) {
        li.classList.add("offen");
        li.tabIndex = 0;
        li.setAttribute("role", "link");
      }
    });
    if (scrollen) station.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
  }
  document.querySelectorAll(".weiter").forEach(function (knopf) {
    knopf.addEventListener("click", function () { oeffne(parseInt(knopf.dataset.oeffnet, 10), true); });
  });
  fahrplan.forEach(function (li) {
    function springe() {
      if (!li.classList.contains("offen")) return;
      $("station-" + li.dataset.ziel).scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
    }
    li.addEventListener("click", springe);
    li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); springe(); } });
  });
  oeffne(1, false);
  $("alles-aufdecken").addEventListener("click", function () {
    for (var n = 2; n <= 6; n++) oeffne(n, false);
    this.hidden = true;
  });
})();
