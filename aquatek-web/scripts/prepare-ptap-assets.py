from __future__ import annotations

import argparse
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
VIDEO_PROJECT = ROOT.parent / "aquatek-ptap-video"
DELIVERY = Path(r"D:\2026\0_PTAP SAN FCO ENE\ENTREGA")
TARGET = ROOT / "public" / "media" / "projects" / "ptap-san-francisco"
BRAND_TARGET = ROOT / "public" / "brand"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    filename = "arialbd.ttf" if bold else "arial.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / filename), size)


def watermark(image: Image.Image) -> Image.Image:
    canvas = image.convert("RGBA")
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    label = "AQUATEK · VISTA WEB · NO APTO PARA CONSTRUCCIÓN"
    label_font = font(max(18, canvas.width // 58), bold=True)
    box = draw.textbbox((0, 0), label, font=label_font)
    text_width = box[2] - box[0]
    padding = max(16, canvas.width // 90)
    x = max(padding, canvas.width - text_width - 2 * padding)
    y = canvas.height - (box[3] - box[1]) - 2 * padding
    draw.rounded_rectangle(
        (x - padding, y - padding, canvas.width - padding, canvas.height - padding),
        radius=8,
        fill=(7, 30, 61, 190),
    )
    draw.text((x, y), label, font=label_font, fill=(255, 255, 255, 235))
    return Image.alpha_composite(canvas, overlay).convert("RGB")


def export_web_image(source: Path, target_name: str, crop_right: float = 1.0) -> None:
    with Image.open(source) as opened:
        image = opened.convert("RGB")
    if crop_right < 1:
        image = image.crop((0, 0, round(image.width * crop_right), image.height))
    if image.width > 1600:
        new_height = round(image.height * 1600 / image.width)
        image = image.resize((1600, new_height), Image.Resampling.LANCZOS)
    image = watermark(image)
    image.save(TARGET / target_name, "WEBP", quality=82, method=6)


def export_report_page(pdf_path: Path, page_number: int, target_name: str) -> None:
    document = pdfium.PdfDocument(pdf_path)
    page = document[page_number - 1]
    image = page.render(scale=1.8).to_pil().convert("RGB")
    margin_x = round(image.width * 0.07)
    margin_top = round(image.height * 0.055)
    margin_bottom = round(image.height * 0.05)
    image = image.crop((margin_x, margin_top, image.width - margin_x, image.height - margin_bottom))
    if image.width > 1200:
        image = image.resize(
            (1200, round(image.height * 1200 / image.width)), Image.Resampling.LANCZOS
        )
    image = watermark(image)
    image.save(TARGET / target_name, "WEBP", quality=84, method=6)


def export_report_cover(pdf_path: Path) -> None:
    document = pdfium.PdfDocument(pdf_path)
    page = document[1]
    image = page.render(scale=2).to_pil().convert("RGB")
    image = image.crop(
        (
            round(image.width * 0.08),
            round(image.height * 0.06),
            round(image.width * 0.92),
            round(image.height * 0.70),
        )
    )
    if image.width > 1200:
        image = image.resize(
            (1200, round(image.height * 1200 / image.width)), Image.Resampling.LANCZOS
        )
    image = watermark(image)
    image.save(TARGET / "memoria-portada.webp", "WEBP", quality=84, method=6)


def export_redacted_rainfall_chart(source: Path) -> None:
    with Image.open(source) as opened:
        original = opened.convert("RGB")

    blurred = original.filter(ImageFilter.GaussianBlur(radius=6))
    veil = Image.new("RGBA", original.size, (244, 247, 251, 52))
    blurred = Image.alpha_composite(blurred.convert("RGBA"), veil).convert("RGB")

    left = round(original.width * 0.13)
    top = round(original.height * 0.245)
    right = round(original.width * 0.87)
    bottom = round(original.height * 0.745)
    blurred.paste(original.crop((left, top, right, bottom)), (left, top))

    output = watermark(blurred)
    output.save(TARGET / "hidrologia-precipitacion.webp", "WEBP", quality=84, method=6)


def export_poster(source: Path) -> None:
    with Image.open(source) as opened:
        image = opened.convert("RGB")
    image = ImageEnhance.Contrast(image).enhance(1.04)
    target_ratio = 16 / 9
    if image.width / image.height > target_ratio:
        width = round(image.height * target_ratio)
        left = (image.width - width) // 2
        image = image.crop((left, 0, left + width, image.height))
    else:
        height = round(image.width / target_ratio)
        top = (image.height - height) // 2
        image = image.crop((0, top, image.width, top + height))
    image = image.resize((1600, 900), Image.Resampling.LANCZOS)

    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    pixels = overlay.load()
    for x in range(overlay.width):
        opacity = round(205 * max(0, 1 - x / (overlay.width * 0.72)))
        for y in range(overlay.height):
            pixels[x, y] = (7, 30, 61, opacity)
    image = Image.alpha_composite(image.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(image)
    draw.text((72, 610), "PTAP SAN FRANCISCO · PUTUMAYO", font=font(28, True), fill="#75CFFF")
    draw.text((72, 660), "Diseño hidráulico y modelo BIM", font=font(58, True), fill="white")
    draw.text((72, 738), "Caudal de diseño: 16 L/s", font=font(36, True), fill="white")
    draw.ellipse((1410, 690, 1518, 798), fill=(255, 255, 255, 235))
    draw.polygon(((1453, 720), (1453, 768), (1490, 744)), fill="#071E3D")
    image.convert("RGB").save(TARGET / "video-poster.webp", "WEBP", quality=86, method=6)


def export_logo(source: Path) -> None:
    with Image.open(source) as opened:
        clean = opened.convert("RGB")
    logo = Image.new("RGBA", clean.size, (0, 0, 0, 0))
    source_pixels = clean.load()
    target_pixels = logo.load()
    for x in range(clean.width):
        for y in range(clean.height):
            red, green, blue = source_pixels[x, y]
            alpha = 0 if min(red, green, blue) > 244 else 255
            target_pixels[x, y] = (red, green, blue, alpha)
    alpha_box = logo.getchannel("A").getbbox()
    if alpha_box:
        logo = logo.crop(alpha_box)
    if logo.width > 720:
        logo = logo.resize((720, round(logo.height * 720 / logo.width)), Image.Resampling.LANCZOS)
    BRAND_TARGET.mkdir(parents=True, exist_ok=True)
    logo.save(BRAND_TARGET / "logo-aquatek-recursos-hidricos.png", "PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--rainfall-source", type=Path)
    args = parser.parse_args()
    TARGET.mkdir(parents=True, exist_ok=True)
    assets = VIDEO_PROJECT / "public" / "assets"

    export_logo(assets / "brand" / "Logo_Aquatek_transparent.png")
    export_poster(assets / "revit" / "R01_isometrico_general_limpio.jpg")
    export_web_image(
        assets / "revit" / "R01_isometrico_general_limpio.jpg", "modelo-general.webp"
    )
    export_web_image(
        assets / "revit" / "R02_isometrico_con_unidades.jpg",
        "modelo-unidades-en-corte.webp",
    )
    export_web_image(
        assets / "revit" / "R07_vista_ptap_DEM.jpg",
        "modelo-implantacion-topografia.webp",
    )
    export_web_image(
        assets / "revit" / "R03_caja_seccion_floculador.jpg", "modelo-floculacion.webp"
    )
    export_web_image(
        assets / "revit" / "R04_caja_seccion_sedimentador_filtros.jpg",
        "modelo-sedimentacion-filtracion.webp",
    )
    export_web_image(
        assets / "revit" / "R05_tanque_cloracion_y_salida.jpg", "modelo-cloracion.webp"
    )
    export_web_image(
        assets / "planos" / "P01_implantacionterreno_ptap.jpg",
        "plano-implantacion.webp",
        crop_right=0.84,
    )
    export_web_image(
        assets / "planos" / "P02_planta_cortelong_bajo_pasarelas.jpg",
        "plano-tren-tratamiento.webp",
        crop_right=0.88,
    )
    export_web_image(
        assets / "planos" / "P03_detallecorte_ptap.jpg",
        "plano-corte-unidades.webp",
        crop_right=0.84,
    )

    report = DELIVERY / "MH-PTAP_SAN_FRANCISCO.pdf"
    export_report_cover(report)
    if args.rainfall_source:
        export_redacted_rainfall_chart(args.rainfall_source)

    for output in sorted(TARGET.glob("*.webp")):
        with Image.open(output) as prepared:
            print(f"{output.name}: {prepared.width}x{prepared.height}")


if __name__ == "__main__":
    main()
