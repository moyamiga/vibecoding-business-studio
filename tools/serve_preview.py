#!/usr/bin/env python3
"""
Servidor simple para ver la version construida de TempleFall.

Uso:
    python3 tools/serve_preview.py

Luego abrir:
    http://IP_DEL_SERVIDOR:8080
"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


PORT = int(os.environ.get("PORT", "8080"))
ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)


def main() -> None:
    if not DIST.exists():
        raise SystemExit(
            "No existe la carpeta dist/. Primero corre: npm run build"
        )

    server = ThreadingHTTPServer(("0.0.0.0", PORT), PreviewHandler)
    print(f"TempleFall preview listo en http://0.0.0.0:{PORT}")
    print("Para salir: Ctrl+C")
    server.serve_forever()


if __name__ == "__main__":
    main()
