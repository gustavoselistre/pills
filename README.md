# pills

PWA de lembrete diário de medicamento, com tema Hello Kitty e mensagens personalizadas. Funciona como app no iPhone (iOS 16.4+) com notificações push.

## Estrutura

```
├── index.html     # app principal (UI + estilos, tema rosa)
├── app.js         # lógica: mensagens, streak, calendário, notificações
├── sw.js          # service worker (cache offline + notificações)
├── manifest.json  # configuração PWA
└── icons/
    └── hello-kitty.png   # ícone do app + carinha do hero
```

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

### Mensagens de datas especiais

O objeto `SPECIAL_DAYS` no topo do `app.js` sobrescreve a mensagem do dia
em datas específicas. A chave é a data no formato `AAAA-MM-DD`:

```js
const SPECIAL_DAYS = {
  "2026-05-27": { text: "...", tag: "prova 🎓" },
};
```

## Hello Kitty

A carinha da Hello Kitty no topo reage ao uso:
- **Antes de tomar:** aparece com um band-aid no rosto
- **Depois de marcar "tomei hoje":** o band-aid some e ela fica felizinha
  (bochechas coradas, coraçõezinhos e uma animação de pulinho)

## Funcionalidades

- Mensagem diferente a cada dia (ciclo de 30) + mensagens de datas especiais
- Hello Kitty que reage quando o medicamento é tomado
- Botão "tomei hoje" com confirmação visual
- Streak de dias consecutivos
- Calendário mensal mostrando dias tomados
- Notificação push diária no horário configurado
- Funciona offline (service worker com cache)
- Tema rosa, com dark mode automático
- Dados salvos localmente (localStorage)
