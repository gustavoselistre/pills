# pills

PWA de lembrete diário de remédio. Funciona como app no iPhone (iOS 16.4+) com notificações push.

## Estrutura

```
├── index.html        # app principal
├── app.js            # lógica: mensagens, streak, calendário, notificações
├── sw.js             # service worker (cache offline + notificações)
├── manifest.json     # configuração PWA
├── generate-icons.js # script para gerar ícones (opcional)
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    └── badge-72.png
```

## Ícones

### Opção 1 — gerar via script
```bash
npm install canvas
node generate-icons.js
```

### Opção 2 — gerar online (mais fácil)
1. Acesse https://realfavicongenerator.net
2. Faça upload de qualquer imagem (ex: um emoji de pílula)
3. Baixe o pacote e coloque `android-chrome-192x192.png` → `icons/icon-192.png` e `android-chrome-512x512.png` → `icons/icon-512.png`
4. Crie um `icons/badge-72.png` simples (72x72, qualquer ícone pequeno)

## Deploy no Cloudflare Pages

1. Faça push do projeto para o GitHub

2. Acesse https://pages.cloudflare.com e clique em "Create a project"

3. Conecte seu GitHub e selecione este repositório

4. Configurações de build:
   - **Build command:** (deixe vazio)
   - **Build output directory:** `/` (raiz)

5. Clique em "Save and Deploy"

6. Pronto — a URL gerada é o endereço do app (ex: `pills-7zz.pages.dev`)

## Como ela instala no iPhone

1. Abrir a URL no **Safari** (não funciona no Chrome do iOS)
2. Tocar no botão **Compartilhar** (ícone de seta para cima)
3. Tocar em **"Adicionar à Tela de Início"**
4. Confirmar — aparece como app na tela inicial
5. Abrir o app pela tela inicial e ativar as notificações

> **Nota:** notificações push em PWA no iOS exigem que o app esteja instalado via "Adicionar à Tela de Início". Não funciona pelo browser diretamente.

## Mensagens

As mensagens estão em `app.js` no array `MESSAGES`. São 30 mensagens personalizadas que rodam em ciclo com base no dia do ano — uma diferente por dia, automaticamente.

Para adicionar ou editar mensagens, basta modificar o array. Cada item tem:
```js
{ text: "texto da mensagem", tag: "categoria" }
```

## Funcionalidades

- Mensagem diferente a cada dia (ciclo de 30)
- Botão "tomei hoje" com confirmação visual
- Streak de dias consecutivos
- Calendário mensal mostrando dias tomados
- Notificação push diária no horário configurado
- Funciona offline (service worker com cache)
- Dark mode automático
- Dados salvos localmente (localStorage)
