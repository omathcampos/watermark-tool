from PIL import Image
import io


def apply_watermark(
    base_bytes: bytes,
    wm_bytes: bytes,
    position: str = "bottom-right",
    opacity: float = 0.8,
    scale: float = 0.20,
    margin: int = 20,
) -> tuple[bytes, str]:
    """
    Apply a watermark to an image.

    Returns (processed_bytes, output_format).
    Output format is preserved: PNG stays PNG, JPEG stays JPEG.
    """
    base_img = Image.open(io.BytesIO(base_bytes))
    wm_img = Image.open(io.BytesIO(wm_bytes)).convert("RGBA")

    original_format = base_img.format or "PNG"
    base_rgba = base_img.convert("RGBA")

    # Resize watermark proportionally
    wm_width = int(base_rgba.width * scale)
    wm_height = int(wm_img.height * (wm_width / wm_img.width))
    wm_resized = wm_img.resize((wm_width, wm_height), Image.LANCZOS)

    # Apply opacity
    r, g, b, a = wm_resized.split()
    a = a.point(lambda x: int(x * opacity))
    wm_resized = Image.merge("RGBA", (r, g, b, a))

    # Calculate position
    x, y = _calc_position(position, base_rgba.size, wm_resized.size, margin)

    # Composite
    composite = base_rgba.copy()
    composite.paste(wm_resized, (x, y), mask=wm_resized)

    # Save preserving format/quality
    output = io.BytesIO()
    if original_format in ("JPEG", "JPG"):
        composite = composite.convert("RGB")
        composite.save(output, format="JPEG", quality=95, subsampling=0)
        return output.getvalue(), "jpeg"
    else:
        composite.save(output, format="PNG", optimize=False)
        return output.getvalue(), "png"


def _calc_position(
    position: str,
    base_size: tuple[int, int],
    wm_size: tuple[int, int],
    margin: int,
) -> tuple[int, int]:
    bw, bh = base_size
    ww, wh = wm_size

    positions = {
        "top-left": (margin, margin),
        "top-right": (bw - ww - margin, margin),
        "bottom-left": (margin, bh - wh - margin),
        "bottom-right": (bw - ww - margin, bh - wh - margin),
    }

    return positions.get(position, positions["bottom-right"])
