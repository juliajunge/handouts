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


def markdown():
    md = MarkdownIt("commonmark", {"typographer": False})
    container(md, "karten", lambda _: '<div class="karten">\n')
    container(md, "karte", lambda t: f'<div class="karte">\n<div class="karte-label">{t}</div>\n')
    container(md, "rahmenkarte", lambda t: f'<div class="karte karte--rahmen">\n<div class="karte-label">{t}</div>\n')
    container(md, "schritte", lambda _: '<div class="schritte">\n')
    container(
        md, "tipp",
        lambda _: '<aside class="tipp"><img class="tipp-icon" src="../vorlage/bilder/icon-tipp.svg" alt="">\n<div class="tipp-text">\n',
        "</div></aside>\n",
    )
    container(md, "canvas", lambda _: '<section class="canvas">\n', "</section>\n")
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
    daten["slug"] = ordner.name
    daten["pdf_datei"] = (daten.get("pdf_name") or ordner.name) + ".pdf"
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

    for ordner in sorted(p for p in HANDOUTS.iterdir() if (p / "handout.md").exists()):
        daten, text = lies_handout(ordner)
        html = md.render(text)
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
        alle.append(daten)
        print(f"Seite: {ziel / 'index.html'}")

    (SITE / "index.html").write_text(
        env.get_template("index.html.j2").render(handouts=alle), encoding="utf-8"
    )
    (SITE / ".nojekyll").write_text("")
    return alle


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
