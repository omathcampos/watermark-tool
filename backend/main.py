import io
import zipfile
import os
from typing import Annotated

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from watermark import apply_watermark

app = FastAPI(title="Watermark Tool API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
VALID_POSITIONS = {"top-left", "top-right", "bottom-left", "bottom-right"}


@app.post("/process")
async def process_images(
    images: Annotated[list[UploadFile], File()],
    watermark: Annotated[UploadFile, File()],
    position: Annotated[str, Form()] = "bottom-right",
    opacity: Annotated[float, Form()] = 0.8,
    scale: Annotated[float, Form()] = 0.20,
    margin: Annotated[int, Form()] = 20,
):
    # Validate inputs
    if not images:
        raise HTTPException(status_code=400, detail="Nenhuma imagem enviada")

    if position not in VALID_POSITIONS:
        raise HTTPException(status_code=400, detail=f"Posição inválida: {position}")

    if not (0.0 < opacity <= 1.0):
        raise HTTPException(status_code=400, detail="Opacidade deve ser entre 0 e 1")

    if not (0.0 < scale <= 1.0):
        raise HTTPException(status_code=400, detail="Escala deve ser entre 0 e 1")

    for img in images:
        if img.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de arquivo não suportado: {img.filename}",
            )

    wm_bytes = await watermark.read()

    # Process all images and pack into zip
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for img_file in images:
            img_bytes = await img_file.read()
            try:
                processed, ext = apply_watermark(
                    img_bytes,
                    wm_bytes,
                    position=position,
                    opacity=opacity,
                    scale=scale,
                    margin=margin,
                )
            except Exception as e:
                raise HTTPException(
                    status_code=422,
                    detail=f"Erro ao processar {img_file.filename}: {str(e)}",
                )

            base_name = os.path.splitext(img_file.filename or "image")[0]
            zf.writestr(f"{base_name}.{ext}", processed)

    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="watermarked.zip"'},
    )
