#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convierte un archivo Markdown a PDF, SIN dependencias externas (Python puro).

Lee DIRECTAMENTE el .md (una sola fuente de la verdad) para que el PDF nunca
se quede viejo. Soporta: titulos (#, ##, ###), parrafos, vinetas (-), citas (>),
tablas (| ... |) y separadores (---). Quita emojis (un PDF simple no los dibuja).

Uso: python3 md_to_pdf.py entrada.md salida.pdf
"""
import sys, re

# ---------- Lectura de argumentos ----------
md_path  = sys.argv[1] if len(sys.argv) > 1 else "IDEA_DEL_JUEGO.md"
pdf_path = sys.argv[2] if len(sys.argv) > 2 else "salida.pdf"

with open(md_path, "r", encoding="utf-8") as f:
    raw_lines = f.read().split("\n")

# ---------- Limpieza a Latin-1 (quita emojis y simbolos raros) ----------
REPL = {
    "→": "->", "←": "<-", "‘": "'", "’": "'", "“": '"', "”": '"',
    "–": "-", "—": "-", "•": "-", "…": "...", " ": " ", "≈": "~",
}
def clean(s):
    for k, v in REPL.items():
        s = s.replace(k, v)
    return s.encode("latin-1", "ignore").decode("latin-1")

def strip_inline(s):
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)   # **negrita**
    s = re.sub(r"__(.+?)__", r"\1", s)        # __negrita__
    s = re.sub(r"`(.+?)`", r"\1", s)          # `codigo`
    s = re.sub(r"\[(.+?)\]\((.+?)\)", r"\1", s)  # [texto](url)
    return s

def tidy(s):
    return clean(strip_inline(s)).strip()

# ---------- Parseo del Markdown a bloques (estilo, texto) ----------
DOC = []
i = 0
n = len(raw_lines)
first_h1 = True
while i < n:
    line = raw_lines[i].rstrip()
    stripped = line.strip()

    if stripped == "":
        DOC.append(("spacer", "")); i += 1; continue

    if stripped == "---":
        DOC.append(("rule", "")); i += 1; continue

    # Citas (>) -> juntar lineas consecutivas
    if stripped.startswith(">"):
        parts = []
        while i < n and raw_lines[i].strip().startswith(">"):
            parts.append(raw_lines[i].strip().lstrip(">").strip())
            i += 1
        DOC.append(("quote", tidy(" ".join(p for p in parts if p))))
        continue

    # Tablas (|) -> juntar filas consecutivas
    if stripped.startswith("|"):
        rows = []
        while i < n and raw_lines[i].strip().startswith("|"):
            rows.append(raw_lines[i].strip())
            i += 1
        first_row = True
        for r in rows:
            cells = [c.strip() for c in r.strip().strip("|").split("|")]
            # saltar la fila separadora |---|---|
            if all(set(c) <= set("-: ") for c in cells):
                continue
            txt = "   |   ".join(tidy(c) for c in cells)
            DOC.append(("trow" if first_row else "trow2", txt))
            first_row = False
        continue

    # Titulos
    if stripped.startswith("### "):
        DOC.append(("h2", tidy(stripped[4:]))); i += 1; continue
    if stripped.startswith("## "):
        DOC.append(("h1", tidy(stripped[3:]))); i += 1; continue
    if stripped.startswith("# "):
        style = "title" if first_h1 else "h1"
        first_h1 = False
        DOC.append((style, tidy(stripped[2:]))); i += 1; continue

    # Vinetas
    if stripped.startswith("- ") or stripped.startswith("* "):
        DOC.append(("bullet", tidy(stripped[2:]))); i += 1; continue

    # Parrafo normal
    DOC.append(("body", tidy(stripped))); i += 1

# ---------- Metricas aproximadas de Helvetica ----------
def text_width(s, size):
    return len(s) * size * 0.50

def wrap(s, size, max_w):
    words = s.split(" ")
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if text_width(test, size) <= max_w or not cur:
            cur = test
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines or [""]

# ---------- Estilos: (font, size, leading, space_before, color, indent) ----------
STYLES = {
    "title":  ("HB", 26, 30, 0,  (0.10,0.10,0.35), 0),
    "h1":     ("HB", 16, 21, 16, (0.12,0.30,0.65), 0),
    "h2":     ("HB", 12.5,17, 9, (0.20,0.20,0.30), 0),
    "body":   ("H",  11, 15.5,6, (0,0,0),          0),
    "quote":  ("HO", 11.5,16, 6, (0.25,0.25,0.25), 12),
    "bullet": ("H",  11, 15.5,4, (0,0,0),          14),
    "trow":   ("HB", 10.5,15, 6, (0.10,0.10,0.30), 10),
    "trow2":  ("H",  10.5,15, 2, (0,0,0),          10),
    "spacer": ("H",  6,  6,  0,  (0,0,0),          0),
    "rule":   ("H",  6,  10, 8,  (0,0,0),          0),
}

PAGE_W, PAGE_H = 612, 792
MARGIN_L, MARGIN_R = 60, 60
MARGIN_T, MARGIN_B = 64, 60
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

def esc(s):
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")

# ---------- Construye paginas ----------
pages, cur_ops = [], []
y = PAGE_H - MARGIN_T

def new_page():
    global cur_ops, y
    if cur_ops:
        pages.append(cur_ops)
    cur_ops = []
    y = PAGE_H - MARGIN_T

for style, raw in DOC:
    font, size, leading, sp_before, color, indent = STYLES[style]
    y -= sp_before
    if style == "rule":
        if y - leading < MARGIN_B:
            new_page()
        y -= 4
        cur_ops.append(("line", MARGIN_L, y, PAGE_W - MARGIN_R, y))
        y -= leading
        continue
    if style == "spacer":
        y -= leading
        continue
    text = raw
    if text == "":
        y -= leading
        continue
    x = MARGIN_L + indent
    avail = CONTENT_W - indent
    prefix = "-  " if style == "bullet" else ""
    lines = wrap(prefix + text, size, avail)
    for k, ln in enumerate(lines):
        if y - leading < MARGIN_B:
            new_page()
        lx = x
        if style == "bullet" and k > 0:
            lx = x + text_width("-  ", size)
        cur_ops.append(("text", font, size, lx, y - size, color, esc(ln)))
        y -= leading

if cur_ops:
    pages.append(cur_ops)

# ---------- Serializa el PDF ----------
FONTS = {"H": "Helvetica", "HB": "Helvetica-Bold", "HO": "Helvetica-Oblique"}

page_streams = []
for ops in pages:
    parts = []
    for op in ops:
        if op[0] == "text":
            _, font, size, tx, ty, color, txt = op
            r, g, b = color
            parts.append(f"BT /{font} {size:.1f} Tf {r:.3f} {g:.3f} {b:.3f} rg "
                         f"1 0 0 1 {tx:.1f} {ty:.1f} Tm ({txt}) Tj ET")
        elif op[0] == "line":
            _, x1, y1, x2, y2 = op
            parts.append(f"0.75 0.78 0.85 RG 1 w {x1:.1f} {y1:.1f} m {x2:.1f} {y2:.1f} l S")
    page_streams.append("\n".join(parts))

font_obj_nums = {}
nn = 2
for key in FONTS:
    nn += 1
    font_obj_nums[key] = nn
first_page_obj = nn + 1
content_obj_nums, page_obj_nums = [], []
nn = first_page_obj
for _ in pages:
    content_obj_nums.append(nn); nn += 1
    page_obj_nums.append(nn); nn += 1
total = nn - 1

out = []
out.append("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
offsets = {}
def write_obj(num, body):
    offsets[num] = sum(len(x.encode('latin-1')) for x in out)
    out.append(f"{num} 0 obj\n{body}\nendobj\n")

write_obj(1, "<< /Type /Catalog /Pages 2 0 R >>")
kids = " ".join(f"{p} 0 R" for p in page_obj_nums)
write_obj(2, f"<< /Type /Pages /Count {len(page_obj_nums)} /Kids [{kids}] >>")
for key, name in FONTS.items():
    write_obj(font_obj_nums[key],
              f"<< /Type /Font /Subtype /Type1 /BaseFont /{name} /Encoding /WinAnsiEncoding >>")
for idx, p in enumerate(pages):
    stream = page_streams[idx]
    data = stream.encode("latin-1", "ignore")
    write_obj(content_obj_nums[idx],
              f"<< /Length {len(data)} >>\nstream\n{stream}\nendstream")
    fref = " ".join(f"/{k} {font_obj_nums[k]} 0 R" for k in FONTS)
    write_obj(page_obj_nums[idx],
              f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_W} {PAGE_H}] "
              f"/Resources << /Font << {fref} >> >> /Contents {content_obj_nums[idx]} 0 R >>")

xref_pos = sum(len(x.encode('latin-1')) for x in out)
xref = [f"xref\n0 {total+1}\n", "0000000000 65535 f \n"]
for j in range(1, total+1):
    xref.append(f"{offsets[j]:010d} 00000 n \n")
out.append("".join(xref))
out.append(f"trailer\n<< /Size {total+1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n")

data = "".join(out).encode("latin-1", "ignore")
with open(pdf_path, "wb") as f:
    f.write(data)
print(f"PDF creado: {pdf_path}  paginas: {len(pages)}  bytes: {len(data)}")
