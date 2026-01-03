# Projeto Lista de Desejo

Arquivos criados:
- `index.html`
- `styles.css`

Como usar:
- Abra `index.html` diretamente no navegador.
- Ou, no VS Code, instale a extensão **Live Server** e use **Open with Live Server** no `index.html` para recarregamento automático.

Se quiser, posso adicionar um exemplo de JavaScript para interatividade (adicionar/remover itens).

## Backend local (Node.js + Express)
O projeto agora inclui um backend simples que salva os itens em `data.json`.

Para rodar localmente:

1. Abra um terminal na pasta do projeto.
2. Rode `npm install` para instalar dependências.
3. Rode `npm start` para iniciar o servidor (padrão: `http://localhost:3000`).

O front-end (o `script.js`) usa `http://localhost:3000/items` para buscar e salvar itens.

Se quiser que eu rode o servidor aqui e teste, me avise que eu faço isso por você.