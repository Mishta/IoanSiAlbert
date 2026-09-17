"""Export display_A/B/C la 1800x900 px (screen preview)."""
import base64, io, os, re, subprocess, tempfile
from PIL import Image

CHROME = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
DISPLAY_DIR = os.path.dirname(os.path.abspath(__file__))
MIME = {
    ".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",
    ".svg":"image/svg+xml",".css":"text/css",".webp":"image/webp",
}

def img_b64(abs_p, max_px=900):
    ext = os.path.splitext(abs_p)[1].lower()
    if ext in (".svg",".css"):
        return base64.b64encode(open(abs_p,"rb").read()).decode(), MIME.get(ext,"application/octet-stream")
    img = Image.open(abs_p)
    if img.width > max_px:
        ratio = max_px / img.width
        img = img.resize((max_px, int(img.height * ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode(), "image/png"

def inline(html, html_dir, max_px=900):
    def rs(m):
        attr,q,path = m.group(1),m.group(2),m.group(3)
        if path.startswith("data:") or path.startswith("http"): return m.group(0)
        abs_p = os.path.normpath(os.path.join(html_dir, path))
        if not os.path.exists(abs_p): print(f"  MISS {abs_p}"); return m.group(0)
        b64,mime = img_b64(abs_p, max_px)
        print(f"  OK  {os.path.basename(abs_p):48s} {len(b64)//1024:5d}KB")
        return f'{attr}={q}data:{mime};base64,{b64}{q}'
    html = re.sub(r'(src|href)=(["\'])([^"\']+)\2', rs, html)
    def ru(m):
        q,path = m.group(1),m.group(2)
        if path.startswith("data:") or path.startswith("http"): return m.group(0)
        abs_p = os.path.normpath(os.path.join(html_dir, path))
        if not os.path.exists(abs_p): return m.group(0)
        b64,mime = img_b64(abs_p, max_px)
        return f"url({q}data:{mime};base64,{b64}{q})"
    html = re.sub(r"url\((['\"]?)([^'\")\s]+)\1\)", ru, html)
    return html

def export(name, w=1800, h=900, timeout=360):
    html_path = os.path.join(DISPLAY_DIR, f"{name}.html")
    out_png   = os.path.join(DISPLAY_DIR, f"{name}.png")
    print(f"\n=== {name} ===")
    with open(html_path,"r",encoding="utf-8") as f: html = f.read()
    html = inline(html, DISPLAY_DIR)
    print(f"  HTML size: {len(html)//1024//1024} MB")
    tmp = tempfile.NamedTemporaryFile(suffix=".html",delete=False,mode="w",encoding="utf-8")
    tmp.write(html); tmp.close()
    cmd = [CHROME,"--headless=new","--disable-gpu",
           f"--screenshot={out_png}",f"--window-size={w},{h}",
           "--hide-scrollbars","--no-sandbox",
           "--run-all-compositor-stages-before-draw","--virtual-time-budget=10000",
           f"file:///{tmp.name.replace(os.sep,'/')}"]
    try:
        subprocess.run(cmd, capture_output=True, timeout=timeout)
        sz = os.path.getsize(out_png)
        im = Image.open(out_png)
        print(f"  Output: {sz:,} bytes  |  {im.width}x{im.height} px")
    finally:
        try: os.unlink(tmp.name)
        except: pass

export("display_A_narativ")
export("display_B_tehnologie")
export("display_C_bold")
print("\nDone. 3 variante exportate.")
