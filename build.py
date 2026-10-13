"""Baut alle Handouts als Webseite und druckoptimiertes PDF nach site/.

Aufruf:  python build.py            (Webseiten + PDFs)
         python build.py --ohne-pdf (nur Webseiten, schneller zum Testen)
"""

import os
import re
import shutil
import sys
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup
from markdown_it import MarkdownIt
from mdit_py_plugins.container import container_plugin

from word import schreibe_word

ROOT = Path(__file__).parent
HANDOUTS = ROOT / "handouts"
VORLAGE = ROOT / "vorlage"
SITE = ROOT / "site"


def container(md, name, oeffnen, schliessen="</div>\n"):
    """Registriert einen ::: name ... ::: Block. oeffnen(info) liefert das öffnende HTML."""

    def render(self, tokens, idx, _options, _env):
        token = tokens[idx]
        if token.nesting == 1:
            info = token.info.strip()[len(name):].strip()
            return oeffnen(md.utils.escapeHtml(info))
        return schliessen

    md.use(container_plugin, name, render=render)


def karten_label(titel):
    """Etikett über der Karte; ohne Titel (nur ::: karte) gibt es keins."""
    return f'<div class="karte-label">{titel}</div>\n' if titel else ""


def markdown():
    md = MarkdownIt("commonmark", {"typographer": False})
    container(md, "karten", lambda _: '<div class="karten">\n')
    container(md, "karte", lambda t: f'<div class="karte">\n{karten_label(t)}')
    container(md, "rahmenkarte", lambda t: f'<div class="karte karte--rahmen">\n{karten_label(t)}')
    container(md, "schritte", lambda t: '<div class="schritte schritte--untereinander">\n' if t == "untereinander" else '<div class="schritte">\n')
    container(
        md, "tipp",
        lambda _: '<aside class="tipp"><img class="tipp-icon" src="../vorlage/bilder/icon-tipp.svg" alt="">\n<div class="tipp-text">\n',
        "</div></aside>\n",
    )
    container(md, "canvas", lambda _: '<section class="canvas">\n', "</section>\n")
    # Auswahl: Leser*innen entscheiden sich für genau eine Variante (z. B. bei Leitlinien)
    container(
        md, "wahl",
        lambda t: f'<div class="wahl">\n<div class="wahl-kopf"><span class="wahl-label">Entscheide dich</span><span class="wahl-titel">{t}</span></div>\n<div class="wahl-inhalt">\n',
        "</div>\n</div>\n",
    )
    container(
        md, "variante",
        lambda t: f'<div class="variante"><i class="ankreuzen"></i>\n<div class="variante-text">\n<div class="variante-label">{t}</div>\n',
        "</div>\n</div>\n",
    )
    # Hervorgehobene Ergänzung (z. B. "Neu in Version 5") mitten in einem Listeneintrag
    container(md, "ergaenzung", lambda t: f'<div class="ergaenzung">\n<div class="ergaenzung-label">{t}</div>\n')
    # nur Webansicht (z. B. Linksammlung) bzw. nur PDF (z. B. Verweis auf die Webansicht)
    container(md, "weiterlesen", lambda _: '<section class="weiterlesen nur-web" id="weiterlesen">\n', "</section>\n")
    container(md, "nurdruck", lambda _: '<div class="nur-druck">\n')
    return md


def ohne_protokoll(url):
    return re.sub(r"^(https?://)?(www\.)?", "", url).rstrip("/")


def link_markieren(m):
    """Links, deren Text schon die Adresse ist, bekommen im Druck keine zweite Adresse dahinter."""
    href, text = m.group(1), m.group(2)
    if ohne_protokoll(href) == ohne_protokoll(text):
        return f'<a class="url-sichtbar" href="{href}">{text}</a>'
    return m.group(0)


def lies_handout(ordner):
    text = (ordner / "handout.md").read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        sys.exit(f"{ordner}/handout.md: Kopfbereich zwischen --- fehlt")
    daten = yaml.safe_load(m.group(1)) or {}
    for pflicht in ("titel", "stand"):
        if not daten.get(pflicht):
            sys.exit(f"{ordner}/handout.md: Angabe '{pflicht}' fehlt im Kopfbereich")
    daten = {k: str(v) if v is not None else "" for k, v in daten.items()}
    daten.setdefault("label", "Handout")
    daten.setdefault("bild", "")
    daten.setdefault("bild_alt", "")
    daten.setdefault("kurzlink", "")
    daten.setdefault("beschreibung", "")
    daten.setdefault("format", "")
    daten.setdefault("quelle", "")
    daten.setdefault("lizenz", "")
    daten.setdefault("stil", "")
    daten.setdefault("word", "")
    daten.setdefault("kurztitel", daten["titel"])
    # Newsletter-Anmeldung unten auf der Webseite, abschaltbar mit "newsletter: nein"
    daten["newsletter"] = daten.get("newsletter", "ja").lower() not in ("nein", "false", "no", "aus")
    daten["slug"] = ordner.relative_to(HANDOUTS).as_posix()
    daten["pdf_datei"] = (daten.get("pdf_name") or ordner.name) + ".pdf"
    # Word-Download zum Weiterbearbeiten, einschaltbar mit "word: ja"
    ist_word = daten["word"].lower() in ("ja", "true", "yes", "an")
    daten["word_datei"] = (daten.get("pdf_name") or ordner.name) + ".docx" if ist_word else ""
    return daten, m.group(2)


def baue_seiten():
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir()
    shutil.copytree(VORLAGE, SITE / "vorlage", ignore=shutil.ignore_patterns("*.j2"))

    env = Environment(loader=FileSystemLoader(VORLAGE), autoescape=True)
    seite = env.get_template("handout.html.j2")
    md = markdown()
    alle = []

    # Handouts dürfen in Unterordnern liegen, z. B. handouts/registrierung/claude/
    for ordner in sorted(p.parent for p in HANDOUTS.rglob("handout.md")):
        daten, text = lies_handout(ordner)
        # Weg zurück zur Übersicht und zu vorlage/: "../" je Ordnerebene
        daten["wurzel"] = "../" * len(Path(daten["slug"]).parts)
        html = md.render(text)
        html = html.replace('src="../vorlage/', f'src="{daten["wurzel"]}vorlage/')
        # ==Text== wird zur Marker-Hervorhebung
        html = re.sub(r"==(.+?)==", r"<mark>\1</mark>", html)
        html = re.sub(r'<a href="([^"]+)">([^<]+)</a>', link_markieren, html)
        # Querformat-Anhänge (::: canvas) kommen hinter die Fußzeile der ersten Seiten
        anhang = "".join(re.findall(r'<section class="canvas">.*?</section>\n', html, re.S))
        html = re.sub(r'<section class="canvas">.*?</section>\n', "", html, flags=re.S)

        ziel = SITE / daten["slug"]
        shutil.copytree(ordner, ziel, ignore=shutil.ignore_patterns("*.md"))
        (ziel / "index.html").write_text(
            seite.render(**daten, inhalt=Markup(html), anhang=Markup(anhang)), encoding="utf-8"
        )
        if daten["word_datei"]:
            schreibe_word(md.parse(text), daten, ziel / daten["word_datei"])
            print(f"Word:  {ziel / daten['word_datei']}")
        alle.append(daten)
        print(f"Seite: {ziel / 'index.html'}")

    werkzeuge_datei = ROOT / "werkzeuge.yml"
    # Handouts in Unterordnern (z. B. registrierung/claude) teilen sich auf der Übersicht eine Karte.
    # Titel und Beschreibung der Karte stehen in gruppe.yml im übergeordneten Ordner.
    eintraege, gruppen = [], {}
    for h in alle:
        if "/" not in h["slug"]:
            eintraege.append(h)
            continue
        name = h["slug"].rsplit("/", 1)[0]
        if name not in gruppen:
            gruppe_datei = HANDOUTS / name / "gruppe.yml"
            gruppe = yaml.safe_load(gruppe_datei.read_text(encoding="utf-8")) if gruppe_datei.exists() else {}
            gruppen[name] = {"titel": name, "beschreibung": "", **(gruppe or {}), "slug": name, "handouts": []}
            eintraege.append(gruppen[name])
        gruppen[name]["handouts"].append(h)
    werkzeuge = (yaml.safe_load(werkzeuge_datei.read_text(encoding="utf-8")) if werkzeuge_datei.exists() else None) or []
    bereiche, rest_handouts, rest_werkzeuge = ordne_bereiche(eintraege, werkzeuge)
    (SITE / "index.html").write_text(
        env.get_template("index.html.j2").render(bereiche=bereiche, handouts=rest_handouts, werkzeuge=rest_werkzeuge),
        encoding="utf-8",
    )
    (SITE / ".nojekyll").write_text("")
    return alle


def ordne_bereiche(eintraege, werkzeuge):
    """Verteilt Handouts, Gruppen und Werkzeuge auf die Bereiche aus bereiche.yml.
    Was dort nicht genannt ist, bleibt übrig und erscheint unten auf der Übersicht."""
    datei = ROOT / "bereiche.yml"
    bereiche = (yaml.safe_load(datei.read_text(encoding="utf-8")) if datei.exists() else None) or []
    nach_slug = {h["slug"]: h for h in eintraege}
    nach_titel = {w["titel"]: w for w in werkzeuge}
    vergeben = set()
    for b in bereiche:
        b["karten"] = []
        for eintrag in b.get("inhalte") or []:
            if "handout" in eintrag:
                ziel = nach_slug.get(eintrag["handout"])
                if ziel is None:
                    sys.exit(f"bereiche.yml: Handout '{eintrag['handout']}' gibt es nicht unter handouts/")
                karte = {"art": "gruppe" if "handouts" in ziel else "handout", **ziel}
                vergeben.add(("handout", eintrag["handout"]))
            elif "werkzeug" in eintrag:
                ziel = nach_titel.get(eintrag["werkzeug"])
                if ziel is None:
                    sys.exit(f"bereiche.yml: Werkzeug '{eintrag['werkzeug']}' steht nicht in werkzeuge.yml")
                karte = {"art": "werkzeug", **ziel}
                vergeben.add(("werkzeug", eintrag["werkzeug"]))
            elif "extern" in eintrag:
                if not eintrag.get("link"):
                    sys.exit(f"bereiche.yml: '{eintrag['extern']}' braucht eine Angabe 'link'")
                karte = {"art": "extern", "titel": eintrag["extern"], "link": eintrag["link"],
                         "knopf": eintrag.get("knopf", "Zur Seite"), "etikett": eintrag.get("etikett", ""), "beschreibung": eintrag.get("beschreibung", "")}
            elif "demnaechst" in eintrag:
                karte = {"art": "demnaechst", "titel": eintrag["demnaechst"], "beschreibung": eintrag.get("beschreibung", "")}
            else:
                sys.exit(f"bereiche.yml: unbekannter Eintrag {eintrag} im Bereich '{b.get('titel')}'")
            b["karten"].append(karte)
    rest_handouts = [h for h in eintraege if ("handout", h["slug"]) not in vergeben]
    rest_werkzeuge = [w for w in werkzeuge if ("werkzeug", w["titel"]) not in vergeben]
    for h in rest_handouts:
        print(f"Hinweis: '{h['titel']}' steht in keinem Bereich in bereiche.yml und erscheint unter „Weitere Handouts“")
    return bereiche, rest_handouts, rest_werkzeuge


def baue_pdfs(alle):
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        # Ohne diese Option rundet Chrome unter Linux Buchstabenbreiten auf ganze Pixel:
        # im PDF entstehen dann ungleichmäßige Abstände zwischen den Buchstaben.
        optionen = {"args": ["--font-render-hinting=none"]}
        if os.environ.get("CHROMIUM_PATH"):
            optionen["executable_path"] = os.environ["CHROMIUM_PATH"]
        browser = p.chromium.launch(**optionen)
        for daten in alle:
            ordner = SITE / daten["slug"]
            page = browser.new_page()
            page.goto((ordner / "index.html").resolve().as_uri(), wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            page.emulate_media(media="print")
            ziel = ordner / daten["pdf_datei"]
            page.pdf(path=str(ziel), prefer_css_page_size=True, print_background=True)
            page.close()
            print(f"PDF:   {ziel}")
        browser.close()


if __name__ == "__main__":
    handouts = baue_seiten()
    if "--ohne-pdf" not in sys.argv:
        baue_pdfs(handouts)
