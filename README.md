# 💧 Watermark Tool

Ferramenta web para adicionar marca d'água em imagens de forma simples e sem perda de qualidade.

## Funcionalidades

- Upload de múltiplas imagens (JPG, PNG, WebP)
- Marca d'água com imagem customizada (PNG com transparência recomendado)
- Controle de posição, opacidade, tamanho e margem
- Preview em tempo real
- Processamento em massa com download em `.zip`
- Sem perda de qualidade (PNG lossless, JPEG quality 95)

## Como rodar

### Pré-requisitos

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

O servidor sobe em `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Stack

| Camada   | Tech                    |
|----------|-------------------------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend  | Python + FastAPI        |
| Imagens  | Pillow                  |
