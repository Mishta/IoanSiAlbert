"""
export_all_pdf.py — P.O.L.A.R.I.S. Print-Ready PDF Export
===========================================================
Convertește toate fișierele HTML → PDF gata de trimis la tipar.

Output: print-materials/PDF-TIPAR/
  flyer/     — 6 PDF  (A4 landscape, 297×210 mm)
  display/   — 7 PDF  (native 476×238 mm → scala la 120×60 cm la tipar)
  rollup/    — 1 PDF  (native 225×529 mm → scala la 85×200 cm la tipar)
  t-shirt/   — 1 SVG  (copiat direct, vectorial)

Dimensiuni native CSS la 96 DPI (1px = 0.2646 mm):
  Display  1800×900 px  → 476.25×238.12 mm  → tipografia scalează la 120×60 cm
  Rollup    850×2000 px  → 224.90×529.17 mm  → tipografia scalează la 85×200 cm
  Flyer    @page A4 landscape (297×210 mm) — deja setat în HTML
"""
import base64, io, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path
from urllib.parse import unquote
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")

CHROME   = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
BASE_DIR = Path(__file__).parent          # print-materials/
OUT_DIR  = BASE_DIR / "PDF-TIPAR"

MIME = {
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml", ".css": "text/css", ".webp": "image/webp",
}

PX_TO_MM = 25.4 / 96   # 0.264583 mm/px

# ── CSS injectat în fiecare fișier înainte de export ─────────────────────────
CSS_COMMON = """<style id="pdf-print-common">
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
html, body { overflow: hidden !important; }
</style>"""

# @page + forțare dimensiuni html/body per grup
# html min-height:100vh și padding din fișierele sursă cauzează overflow → 2 pagini
_W_FLYER   = "297mm";    _H_FLYER   = "210mm"
_W_DISPLAY = f"{round(1800*PX_TO_MM,2)}mm"; _H_DISPLAY = f"{round(900*PX_TO_MM,2)}mm"
_W_ROLLUP  = f"{round(850*PX_TO_MM,2)}mm";  _H_ROLLUP  = f"{round(2000*PX_TO_MM,2)}mm"

PAGE_INJECT = {
    "flyer": (
        f"<style id='pdf-page'>"
        f"@page {{ size: {_W_FLYER} {_H_FLYER}; margin: 0; }}"
        f"html, body {{ width: {_W_FLYER} !important; height: {_H_FLYER} !important;"
        f" min-height: unset !important; padding: 0 !important; }}"
        f"</style>"
    ),
    "display": (
        f"<style id='pdf-page'>"
        f"@page {{ size: {_W_DISPLAY} {_H_DISPLAY}; margin: 0; }}"
        f"html, body {{ width: {_W_DISPLAY} !important; height: {_H_DISPLAY} !important;"
        f" min-height: unset !important; padding: 0 !important; }}"
        f"</style>"
    ),
    "rollup": (
        f"<style id='pdf-page'>"
        f"@page {{ size: {_W_ROLLUP} {_H_ROLLUP}; margin: 0; }}"
        f"html, body {{ width: {_W_ROLLUP} !important; height: {_H_ROLLUP} !important;"
        f" min-height: unset !important; padding: 0 !important; }}"
        f"</style>"
    ),
}

# ── Fișiere grupate ───────────────────────────────────────────────────────────
FILES = {
    "flyer": [
        "flyer/flyer_v1_fata.html",
        "flyer/flyer_v1_verso.html",
        "flyer/flyer_v2_fata.html",
        "flyer/flyer_v2_verso.html",
        "flyer/flyer_v3_fata.html",
        "flyer/flyer_v3_verso.html",
    ],
    "display": [
        "display/display_A_narativ.html",
        "display/display_B_tehnologie.html",
        "display/display_C_bold.html",
        "display/display_Z_v1_fata.html",
        "display/display_Z_v1_verso.html",
        "display/display_Z_v2_fata.html",
        "display/display_Z_v2_verso.html",
    ],
    "rollup": [
        "rollup/rollup_1_viziunea.html",
        "rollup/rollup_2_tehnologia.html",
        "rollup/rollup_3_impactul.html",
        "rollup/rollup_4_complet.html",
    ],
}

# ── TIPAR README per grup ─────────────────────────────────────────────────────
TIPAR_INFO = {
    "flyer": {
        "titlu":       "Flyer A4 Tri-fold",
        "dimensiune":  "A4 landscape (297 × 210 mm)",
        "note": [
            "Fiecare fișier = 1 pagină A4 landscape.",
            "Față + Verso se printează față-verso pe același coală A4.",
            "Perechile: v1_fata+v1_verso / v2_fata+v2_verso / v3_fata+v3_verso.",
            "Hârtie recomandată: 170–200 g/m², glossy sau silk.",
            "Bleed: 3 mm la marginile exterioare dacă tipografia cere.",
        ],
    },
    "display": {
        "titlu":       "Display Triptych 120×60 cm",
        "dimensiune":  "120 × 60 cm (PDF nativ la ~47.6×23.8 cm, scala ×2.52)",
        "note": [
            "PDF generat la dimensiuni native CSS (476.25 × 238.12 mm).",
            "Tipografia va scala la 120 × 60 cm (factor ×2.52).",
            "Rezoluție recomandată la tipar: minim 150 DPI la dimensiunea finală.",
            "Suport recomandat: forex 5 mm sau dibond.",
            "Foloseliți 3 panouri: stânga 30 cm / centru 60 cm / dreapta 30 cm.",
        ],
    },
    "rollup": {
        "titlu":       "Roll-up Banner 85×200 cm",
        "dimensiune":  "85 × 200 cm (PDF nativ la ~22.5×52.9 cm, scala ×3.78)",
        "note": [
            "PDF generat la dimensiuni native CSS (224.90 × 529.17 mm).",
            "Tipografia va scala la 85 × 200 cm (factor ×3.78).",
            "Rezoluție recomandată la tipar: minim 100 DPI la dimensiunea finală.",
            "Suport: banner roll-up standard (material tekstil sau PVC).",
        ],
    },
    "t-shirt": {
        "titlu":       "T-Shirt Logo",
        "dimensiune":  "Vectorial SVG — scalabil la orice dimensiune",
        "note": [
            "Format SVG vectorial — fără pierdere la orice dimensiune.",
            "Recomandat pentru broderie sau serigrafie.",
            "Convertiți la AI/EPS dacă tipografia cere format Adobe Illustrator.",
            "Culori canonice:",
            "  #ffba20  Solar Gold",
            "  #00e5ff  Laser Cyan",
            "  #dfe2f3  Ice White",
            "  #080c1a  Deep Navy (fundal)",
        ],
    },
}

# ── Helpers ───────────────────────────────────────────────────────────────────
def img_to_b64(abs_p: str, max_px: int = 1400):
    ext = os.path.splitext(abs_p)[1].lower()
    if ext in (".svg", ".css"):
        return base64.b64encode(open(abs_p, "rb").read()).decode(), MIME.get(ext, "application/octet-stream")
    img = Image.open(abs_p)
    if img.width > max_px:
        img = img.resize((max_px, int(img.height * max_px / img.width)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode(), "image/png"

def inline_assets(html: str, html_dir: str, max_px: int = 1400) -> str:
    def repl_src(m):
        attr, q, path = m.group(1), m.group(2), m.group(3)
        if path.startswith("data:") or path.startswith("http"):
            return m.group(0)
        abs_p = os.path.normpath(os.path.join(html_dir, unquote(path)))
        if not os.path.exists(abs_p):
            print(f"    MISS: {os.path.basename(abs_p)}")
            return m.group(0)
        b64, mime = img_to_b64(abs_p, max_px)
        print(f"    ✓ {os.path.basename(abs_p):50s} {len(b64)//1024:>5} KB")
        return f'{attr}={q}data:{mime};base64,{b64}{q}'

    def repl_url(m):
        q, path = m.group(1), m.group(2)
        if path.startswith("data:") or path.startswith("http"):
            return m.group(0)
        abs_p = os.path.normpath(os.path.join(html_dir, unquote(path)))
        if not os.path.exists(abs_p):
            return m.group(0)
        b64, mime = img_to_b64(abs_p, max_px)
        return f"url({q}data:{mime};base64,{b64}{q})"

    html = re.sub(r'(src|href)=(["\'])([^"\']+)\2', repl_src, html)
    html = re.sub(r"url\((['\"]?)([^'\")\s]+)\1\)", repl_url, html)
    return html

def html_to_pdf(html_path: Path, out_pdf: Path, group: str) -> bool:
    html = html_path.read_text(encoding="utf-8")
    html = inline_assets(html, str(html_path.parent))

    # Injectăm CSS comun + @page specific grupului
    inject = PAGE_INJECT.get(group, "") + CSS_COMMON
    if "</head>" in html:
        html = html.replace("</head>", inject + "\n</head>", 1)
    else:
        html = inject + html

    tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8")
    tmp.write(html)
    tmp.close()

    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        f"--print-to-pdf={out_pdf.resolve()}",
        "--print-to-pdf-no-header",
        "--no-sandbox",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=10000",
        f"file:///{tmp.name.replace(os.sep, '/')}",
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, timeout=300)
    except subprocess.TimeoutExpired:
        print(f"    ✗ TIMEOUT: {out_pdf.name}")
        try: os.unlink(tmp.name)
        except: pass
        return False
    try:
        os.unlink(tmp.name)
    except Exception:
        pass

    if out_pdf.exists() and out_pdf.stat().st_size > 1000:
        sz = out_pdf.stat().st_size
        print(f"    → {out_pdf.name}  ({sz // 1024} KB)")
        return True
    else:
        print(f"    ✗ FAILED: {out_pdf.name}")
        if result.stderr:
            print(f"      {result.stderr[:300].decode(errors='replace')}")
        return False

def write_readme(folder: Path, group: str, files: list):
    info = TIPAR_INFO.get(group, {})
    lines = [
        "POLARIS Bears — Fișiere Gata de Tipar",
        "=" * 50,
        f"Grup:          {info.get('titlu', group.upper())}",
        f"Dimensiune:    {info.get('dimensiune', 'N/A')}",
        "",
        "Fișiere incluse:",
    ]
    for f in files:
        pdf_name = Path(f).stem + (".pdf" if group != "t-shirt" else ".svg")
        lines.append(f"  • {pdf_name}")
    lines += ["", "NOTE DE TIPAR:"]
    for note in info.get("note", []):
        lines.append(f"  {note}")
    lines += [
        "",
        "Culori: CMYK conversion recomandată (fișierele sunt în RGB sRGB).",
        "Fonturi: embedded în PDF (rasterizate de Chrome la export).",
        "",
        "─" * 50,
        "Echipa:   POLARIS Bears",
        "Membri:   Ioan Cristian CHELARU & Albert David OLARIU",
        "Școala:   ICHB București — Clasa VIII-a",
        "Proiect:  P.O.L.A.R.I.S. · ONCS 2026",
        "Web:      www.POLAR-Bears.ro",
    ]
    (folder / "TIPAR_README.txt").write_text("\n".join(lines), encoding="utf-8")
    print(f"    ✓ TIPAR_README.txt")

# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    OUT_DIR.mkdir(exist_ok=True)
    print(f"\nOutput: {OUT_DIR}\n")

    # ── T-Shirt: copie SVG direct ─────────────────────────────────────────────
    print("=" * 60)
    print("  GROUP: T-SHIRT (SVG vectorial — copiat direct)")
    print("=" * 60)
    tshirt_dst = OUT_DIR / "t-shirt"
    tshirt_dst.mkdir(exist_ok=True)
    src_svg = BASE_DIR / "t-shirt" / "t-shirt LOGO.svg"
    if src_svg.exists():
        shutil.copy2(src_svg, tshirt_dst / "t-shirt LOGO.svg")
        print(f"    ✓ t-shirt LOGO.svg  ({src_svg.stat().st_size // 1024} KB)")
    else:
        print(f"    MISS: {src_svg}")
    write_readme(tshirt_dst, "t-shirt", ["t-shirt LOGO.svg"])

    # ── HTML → PDF grupuri ────────────────────────────────────────────────────
    total_ok, total_fail = 0, 0

    for group, file_list in FILES.items():
        print(f"\n{'=' * 60}")
        print(f"  GROUP: {group.upper()}  ({len(file_list)} fișiere)")
        print(f"{'=' * 60}")

        out_group = OUT_DIR / group
        out_group.mkdir(exist_ok=True)

        for rel_path in file_list:
            src = BASE_DIR / rel_path
            dst = out_group / (src.stem + ".pdf")
            print(f"\n  [{src.name}]")
            ok = html_to_pdf(src, dst, group)
            if ok:
                total_ok += 1
            else:
                total_fail += 1

        write_readme(out_group, group, file_list)

    # ── Sumar final ───────────────────────────────────────────────────────────
    print(f"\n{'=' * 60}")
    print(f"  FINALIZAT")
    print(f"  PDF generate:  {total_ok}")
    print(f"  Erori:         {total_fail}")
    print(f"  SVG copiate:   1")
    print(f"  Output folder: {OUT_DIR}")
    print(f"{'=' * 60}")
    if total_fail == 0:
        print("\n  ✓ Toate fișierele sunt gata de trimis la tipar!")
    else:
        print(f"\n  ⚠ {total_fail} fișiere au eșuat — verificați erorile de mai sus.")
