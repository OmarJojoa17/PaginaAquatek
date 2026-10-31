"""Build reviewable, non-source web excerpts from the Orito design memo.

The original PDF stays outside public/.  Each export keeps the requested
figure readable while removing adjacent tables and softening surrounding text.
"""

from pathlib import Path
import subprocess
import tempfile
import shutil

from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "aquatek-orito-video/public/assets/source/pdfs/MH_PLUVIAL_ORITO_V1.pdf"
OUTPUT = ROOT / "aquatek-web/public/media/projects/alcantarillado-pluvial-orito"
PLAN = ROOT / "aquatek-orito-video/public/assets/reviewed/plano-areas-tributarias-review.png"
VIDEO_REVIEWED = ROOT / "aquatek-orito-video/public/assets/reviewed"
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


def make_areas_preview() -> None:
    """Remove the drawing title block and irreversibly blur the area table."""
    image = Image.open(PLAN).convert("RGB").crop((35, 45, 1935, 1360))
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rectangle((750, 925, 1400, 1315), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(18))
    image = Image.composite(image.filter(ImageFilter.GaussianBlur(24)), image, mask)
    image.save(VIDEO_REVIEWED / "areas-plano-public.png", optimize=True)

    canvas = Image.new("RGB", (960, 540), "white")
    fitted = ImageOps.contain(image, canvas.size, Image.Resampling.LANCZOS)
    canvas.paste(fitted, ((960 - fitted.width) // 2, (540 - fitted.height) // 2))
    for quality in (76, 68, 60, 52):
        canvas.save(OUTPUT / "areas-tributarias.webp", "WEBP", quality=quality, method=6)
        if (OUTPUT / "areas-tributarias.webp").stat().st_size <= 200 * 1024:
            break


def main() -> None:
    if not PDF.is_file():
        raise FileNotFoundError(PDF)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    make_areas_preview()
    with tempfile.TemporaryDirectory(dir=ROOT / "aquatek-web/output") as temp:
        directory = Path(temp)
        pages = {number: render_page(number, directory) for number, _, _ in EXCERPTS.values()}
        for name, (number, crop, focus) in EXCERPTS.items():
            make_excerpt(pages[number], crop, focus).save(OUTPUT / name, "WEBP", quality=78, method=6)


if __name__ == "__main__":
    main()
