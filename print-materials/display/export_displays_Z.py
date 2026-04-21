"""
Export display Z (fata + verso) la PNG 1800×900px
Foloseste Chrome headless identic cu export_rollup4.py
"""
import base64, io, os, re, subprocess, tempfile

CHROME = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
DISPLAY_DIR = os.path.dirname(os.path.abspath(__file__))
MIME = {
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml", ".css": "text/css", ".webp": "image/webp",
}

DISPLAYS = [
    "display_Z_v1_fata.html",
    "display_Z_v1_verso.html",
    "display_Z_v2_fata.html",
    "display_Z_v2_verso.html",
]
W, H = 1800, 900


def img_to_b64(abs_p, max_px=1200):
    try:
        from PIL import Image
        ext = os.path.splitext(abs_p)[1].lower()
        if ext in (".svg", ".css"):
            return base64.b64encode(open(abs_p, "rb").read()).decode(), MIME.get(ext, "application/octet-stream")
        img = Image.open(abs_p)
        if img.width > max_px:
            ratio = max_px / img.width
            img = img.resize((max_px, int(img.height * ratio)), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        return base64.b64encode(buf.getvalue()).decode(), "image/png"
    except ImportError:
        # PIL not available — just base64 encode raw file
        ext = os.path.splitext(abs_p)[1].lower()
        data = open(abs_p, "rb").read()
        return base64.b64encode(data).decode(), MIME.get(ext, "image/png")


def inline_all(html, html_dir):
    def repl_src(m):
        attr, q, path = m.group(1), m.group(2), m.group(3)
        if path.startswith("data:") or path.startswith("http"):
            return m.group(0)
        abs_p = os.path.normpath(os.path.join(html_dir, path))
        if not os.path.exists(abs_p):
            print(f"  MISS: {abs_p}")
            return m.group(0)
        b64, mime = img_to_b64(abs_p)
        print(f"  OK  {os.path.basename(abs_p):50s} {len(b64)//1024:5d} KB")
        return f'{attr}={q}data:{mime};base64,{b64}{q}'
    html = re.sub(r'(src|href)=(["\'])([^"\']+)\2', repl_src, html)
    def repl_url(m):
        q, path = m.group(1), m.group(2)
        if path.startswith("data:") or path.startswith("http"):
            return m.group(0)
        abs_p = os.path.normpath(os.path.join(html_dir, path))
        if not os.path.exists(abs_p):
            return m.group(0)
        b64, mime = img_to_b64(abs_p)
        return f"url({q}data:{mime};base64,{b64}{q})"
    html = re.sub(r"url\((['\"]?)([^'\")\s]+)\1\)", repl_url, html)
    return html


def chrome_shot(html_path, out_png, w, h):
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()
    html = inline_all(html, os.path.dirname(html_path))
    print(f"  HTML size: {len(html)//1024} KB")
    tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8")
    tmp.write(html)
    tmp.close()
    cmd = [
        CHROME, "--headless=new", "--disable-gpu",
        f"--screenshot={out_png}",
        f"--window-size={w},{h}",
        "--hide-scrollbars", "--no-sandbox",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=5000",
        f"file:///{tmp.name.replace(os.sep, '/')}",
    ]
    try:
        subprocess.run(cmd, capture_output=True, timeout=120)
        if os.path.exists(out_png):
            sz = os.path.getsize(out_png)
            print(f"  Output: {sz:,} bytes -> {os.path.basename(out_png)}")
        else:
            print(f"  ERROR: output not created")
    finally:
        try:
            os.unlink(tmp.name)
        except Exception:
            pass


for name in DISPLAYS:
    src = os.path.join(DISPLAY_DIR, name)
    out = src.replace(".html", ".png")
    print(f"\n=== {name} ===")
    chrome_shot(src, out, W, H)

print("\nDone.")
