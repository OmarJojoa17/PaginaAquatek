"""Build reviewable, non-source web excerpts from the Orito design memo.

The original PDF stays outside public/.  Each export keeps the requested
figure readable while removing adjacent tables and softening surrounding text.
"""

from pathlib import Path
import subprocess
import tempfile
import shutil

from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "aquatek-orito-video/public/assets/source/pdfs/MH_PLUVIAL_ORITO_V1.pdf"
OUTPUT = ROOT / "aquatek-web/public/media/projects/alcantarillado-pluvial-orito"
POPLER = shutil.which("pdftoppm") or r"C:\Users\PC\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe"

# Coordinates are relative to the 900 px-high rendered page.
EXCERPTS = {
    "precipitacion-mensual.webp": (12, (82, 385, 621, 755), (93, 411, 613, 712)),
    "esquema-red-3d.webp": (23, (75, 248, 627, 635), (91, 308, 606, 611)),
    "socavacion-documento.webp": (28, (75, 280, 628, 775), (92, 314, 606, 746)),
    "enrocado-planta-perfil.webp": (31, (89, 130, 620, 438), (92, 157, 612, 410)),
}


def render_page(page: int, directory: Path) -> Image.Image:
    prefix = directory / f"page-{page}"
    subprocess.run(
        [str(POPLER), "-f", str(page), "-l", str(page), "-scale-to", "900", "-png", "-singlefile", str(PDF), str(prefix)],
        check=True,
        capture_output=True,
    )
    return Image.open(prefix.with_suffix(".png")).convert("RGB")


def make_excerpt(page: Image.Image, crop: tuple[int, ...], focus: tuple[int, ...]) -> Image.Image:
    soft = page.filter(ImageFilter.GaussianBlur(9))
    soft.paste(page.crop(focus), focus[:2])
    excerpt = soft.crop(crop)
    canvas = Image.new("RGB", (960, 720), "white")
    fitted = ImageOps.contain(excerpt, (920, 680), Image.Resampling.LANCZOS)
    canvas.paste(fitted, ((960 - fitted.width) // 2, (720 - fitted.height) // 2))
    return canvas


def main() -> None:
    if not PDF.is_file():
        raise FileNotFoundError(PDF)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=ROOT / "aquatek-web/output") as temp:
        directory = Path(temp)
        pages = {number: render_page(number, directory) for number, _, _ in EXCERPTS.values()}
        for name, (number, crop, focus) in EXCERPTS.items():
            make_excerpt(pages[number], crop, focus).save(OUTPUT / name, "WEBP", quality=78, method=6)


if __name__ == "__main__":
    main()
