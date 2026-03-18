# 💧 Watermark Tool

Ferramenta web para adicionar marca d'água em imagens de forma simples, sem perda de qualidade e sem precisar instalar nada.

**[watermark-tool-mathe.vercel.app](https://watermark-tool-mathe.vercel.app)**

## Funcionalidades

- Drag & drop de múltiplas imagens (JPG, PNG, WebP)
- Marca d'água com imagem customizada (PNG com transparência recomendado)
- Controle de posição, opacidade, tamanho e margem
- Nome do arquivo de saída configurável (prefixo e sufixo)
- Preview em tempo real
- Processamento 100% no browser — nenhum dado sai do seu dispositivo
- Sem perda de qualidade (PNG lossless, JPEG quality 95)
- **Desktop:** download direto (1 imagem) ou `.zip` (múltiplas)
- **Mobile:** menu nativo de compartilhamento para salvar na galeria

## Rodando localmente

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Stack

| | Tech |
|---|---|
| Frontend | React + Vite + TypeScript |
| Estilo | Tailwind CSS |
| Imagens | Canvas API + JSZip |
| Deploy | Vercel |
