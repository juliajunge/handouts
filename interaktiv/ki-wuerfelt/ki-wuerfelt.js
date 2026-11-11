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
  var AUFMERKSAMKEIT = [1, 3, 3, 2, 2, 3];

  /* ---------- Station 1: Zerlegen ---------- */
  function tokenChip(text, i, mitId, id) {
    var anschluss = i > 0 && text.charAt(0) !== " " && /^[\wäöüÄÖÜß*-]/.test(text);
    var chip = el(mitId ? "button" : "span", "token" + (anschluss ? " token--anschluss" : ""));
    chip.dataset.farbe = (i % 6) + 1;
    chip.appendChild(el("span", "token-text", text.trim() || "␣"));
    if (mitId) {
      chip.type = "button";
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
    $("token-zaehler").innerHTML = "<strong>" + tokens.length + " Token</strong> für " + woerter + (woerter === 1 ? " Wort" : " Wörter");
  }
  eingabe.addEventListener("input", eigeneTokens);
  eigeneTokens();

  /* ---------- Station 2: Übersetzen ---------- */
  // Pseudo-Zufall mit festem Startwert: jedes Token hat immer dieselbe Zahlenreihe
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
  function vektorAus(text, n) {
    var r = zufallAus(text), v = [];
    for (var i = 0; i < n; i++) v.push(r() * 2 - 1);
    return v;
  }
  function zeichneVektor(ziel, werte) {
    ziel.textContent = "";
    werte.forEach(function (w) {
      var spalte = el("i");
      var balken = el("b", w >= 0 ? "plus" : "minus");
      balken.style.height = Math.max(4, Math.abs(w) * 50) + "%";
      spalte.appendChild(balken);
      ziel.appendChild(spalte);
    });
  }

  var idReihe = $("token-ids");
  START.forEach(function (t, i) {
    var chip = tokenChip(t.t, i, true, t.id);
    chip.classList.add("token--wahl");
    chip.setAttribute("aria-pressed", i === 1 ? "true" : "false");
    chip.addEventListener("click", function () {
      idReihe.querySelectorAll(".token").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      waehleVektor(t);
    });
    idReihe.appendChild(chip);
  });
  function waehleVektor(t) {
    $("vektor-titel").textContent = "„" + t.t.trim() + "“ (Nr. " + zahl(t.id) + ")";
    zeichneVektor($("vektor-gewaehlt"), vektorAus(t.t, 24));
  }
  waehleVektor(START[1]);

  // Vergleich: ähnliche Wörter bekommen ähnliche Muster
  var basis = vektorAus("Ehrenamt", 24);
  var helfer = basis.map(function (w, i) { var r = vektorAus("Helfer", 24)[i]; return Math.max(-1, Math.min(1, w * 0.85 + r * 0.2)); });
  [["Ehrenamtliche", basis], ["Helfer*innen", helfer], ["Räume", vektorAus("Raum", 24)]].forEach(function (paar) {
    var zeile = el("div", "vergleich-zeile");
    zeile.appendChild(el("strong", null, paar[0]));
    var v = el("div", "vektor vektor--klein");
    zeichneVektor(v, paar[1]);
    zeile.appendChild(v);
    $("vergleich").appendChild(zeile);
  });

  /* ---------- Station 3: Rechnen ---------- */
  START.forEach(function (t, i) {
    var chip = el("span", "token stufe-" + AUFMERKSAMKEIT[i]);
    chip.appendChild(el("span", "token-text", t.t.trim()));
    if (i > 0 && t.t.charAt(0) !== " ") chip.classList.add("token--anschluss");
    $("aufmerksamkeit").appendChild(chip);
  });
  var naechstes = el("span", "token token--naechstes", "?");
  naechstes.setAttribute("aria-label", "nächstes Wort");
  $("aufmerksamkeit").appendChild(naechstes);

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
        knopf.textContent = "> Nochmal rechnen";
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

  /* ---------- Station 5: Würfeln ---------- */
  var AUGEN = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  var wuerfel = $("wuerfel");
  for (var w = 0; w < 9; w++) wuerfel.appendChild(el("i"));
  function zeigeAugen(n) {
    wuerfel.querySelectorAll("i").forEach(function (punkt, i) { punkt.classList.toggle("auge", AUGEN[n].indexOf(i) >= 0); });
  }
  zeigeAugen(5);

  var satz, letzterNeu, aktuelle, beschaeftigt = false;
  var tempRegler = $("temperatur");
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

  function zeigeKandidaten(getroffen) {
    var fertig = istEnde(satz[satz.length - 1].trim());
    if (fertig) return;
    aktuelle = mitTemperatur(kandidaten(satz), temperatur());
    zeichneBalken($("kandidaten"), aktuelle, getroffen);
    var streifen = $("streifen");
    streifen.textContent = "";
    aktuelle.forEach(function (k, i) {
      var teil = el("div", "streifen-teil", k.p > 0.07 ? k.t.trim() : "");
      teil.dataset.farbe = (i % 6) + 1;
      teil.style.flexGrow = k.p;
      teil.style.flexBasis = "0";
      teil.style.display = k.p === 0 ? "none" : "";
      if (i === getroffen) teil.classList.add("getroffen");
      teil.title = k.t.trim() + ": " + prozent(k.p);
      streifen.appendChild(teil);
    });
  }

  function neuStart() {
    satz = START.map(function (t) { return t.t; });
    letzterNeu = -1;
    $("zeiger").hidden = true;
    $("wurf-ergebnis").textContent = "Noch nicht gewürfelt.";
    $("wurf-erklaerung").textContent = "Drück auf „Ein Wort würfeln“.";
    zeigeSatz();
    zeigeKandidaten();
    setzeKnoepfe();
  }

  function setzeKnoepfe() {
    var fertig = istEnde(satz[satz.length - 1].trim());
    $("einmal-wuerfeln").disabled = fertig || beschaeftigt;
    $("satz-wuerfeln").disabled = fertig || beschaeftigt;
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

  function rolle(schnell) {
    wuerfel.classList.add("rollt");
    var runden = schnell ? 4 : 9, n = 0;
    return new Promise(function (fertig) {
      (function weiter() {
        zeigeAugen(1 + Math.floor(Math.random() * 6));
        if (++n >= runden || ruhig) { wuerfel.classList.remove("rollt"); fertig(); }
        else setTimeout(weiter, 70);
      })();
    });
  }

  function einWurf(schnell) {
    if (istEnde(satz[satz.length - 1].trim())) return Promise.resolve(true);
    zeigeKandidaten();
    $("zeiger").hidden = true;
    return kreislauf(schnell).then(function () { return rolle(schnell); }).then(function () {
      var r = Math.random(), summe = 0, treffer = aktuelle.length - 1;
      for (var i = 0; i < aktuelle.length; i++) {
        summe += aktuelle[i].p;
        if (r < summe) { treffer = i; break; }
      }
      var zeiger = $("zeiger");
      zeiger.hidden = false;
      zeiger.dataset.zahl = r.toFixed(2).replace(".", ",");
      zeiger.style.left = (r * 100) + "%";
      zeigeKandidaten(treffer);
      var gewaehlt = aktuelle[treffer];
      var rang = aktuelle.slice().sort(function (a, b) { return b.p - a.p; }).indexOf(gewaehlt) + 1;
      $("wurf-ergebnis").textContent = "Gewürfelt: „" + gewaehlt.t.trim() + "“ (" + prozent(gewaehlt.p) + ")";
      $("wurf-erklaerung").textContent = "Zufallszahl " + zeiger.dataset.zahl + (rang === 1
        ? " – das wahrscheinlichste Wort hat gewonnen."
        : " – diesmal hat Platz " + rang + " gewonnen, nicht das wahrscheinlichste Wort.");
      return warte(schnell ? 450 : 700).then(function () {
        satz.push(gewaehlt.t);
        letzterNeu = satz.length - 1;
        zeigeSatz();
        var fertig = istEnde(gewaehlt.t);
        if (fertig) satzFertig();
        else zeigeKandidaten();
        return fertig;
      });
    });
  }

  function satzFertig() {
    var box = $("verlauf-box"), liste = $("verlauf");
    box.hidden = false;
    var li = el("li");
    li.appendChild(document.createTextNode(satz.join("") + " "));
    li.appendChild(el("small", null, "(Temperatur " + tempRegler.value.replace(".", ",") + ")"));
    liste.insertBefore(li, liste.firstChild);
    while (liste.children.length > 8) liste.removeChild(liste.lastChild);
    $("wurf-erklaerung").textContent = "Satz fertig. Drück auf „Von vorn“ und würfle noch einmal.";
  }

  function sperren(fn) {
    if (beschaeftigt) return;
    beschaeftigt = true;
    setzeKnoepfe();
    fn().then(function () { beschaeftigt = false; setzeKnoepfe(); });
  }

  $("einmal-wuerfeln").addEventListener("click", function () { sperren(function () { return einWurf(false); }); });
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
    if (satz) { $("zeiger").hidden = true; zeigeKandidaten(); }
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
