# Guia de Publicação no GitHub Pages

Este guia detalha os passos para publicar sua aplicação "Fale Conosco - IFPR Contact Hub" no GitHub Pages.

## 1. Preparação (Já Realizada)

Eu já realizei as seguintes configurações no código para garantir compatibilidade com o GitHub Pages:
- **Roteamento**: Alterei o `BrowserRouter` para `HashRouter`. O GitHub Pages não suporta nativamente o histórico de navegação (HTML5 History API) em subdiretórios, então o `HashRouter` (que usa `#` na URL) é a solução mais segura e estável para este caso.
- **Configuração do Vite**: Adicionei `base: "/ifpr-contact-hub/"` no `vite.config.ts`. Isso informa à aplicação que ela rodará dentro de um subdiretório (o nome do seu repositório), garantindo que imagens e scripts sejam carregados corretamente.
- **Scripts de Deploy**: Adicionei os comandos `predeploy` e `deploy` no seu `package.json`.

## 2. Passo a Passo para Publicação

Siga estes passos no seu terminal (VS Code ou CMD):

### Passo 1: Instalar o pacote `gh-pages`
Este pacote facilita muito o envio da pasta de "build" (produção) para o GitHub. Execute o comando:

```bash
npm install gh-pages --save-dev
```

### Passo 2: Fazer o Commit das Alterações
Antes de publicar, salve as alterações (incluindo as que eu fiz e a instalação do pacote acima) no seu repositório git.

```bash
git add .
git commit -m "Configuração para GitHub Pages"
git push
```

### Passo 3: Publicar
Agora, basta rodar o comando de deploy que configurei. Ele fará o "build" (otimização) do projeto automaticamente e enviará para o GitHub.

```bash
npm run deploy
```

*O que isso faz?*:
1. Roda `npm run build` (cria a pasta `dist` com o site otimizado).
2. Envia o conteúdo da pasta `dist` para uma "branch" especial chamada `gh-pages` no seu repositório remoto.

## 3. Configuração no GitHub (Apenas na primeira vez)

Após rodar o comando acima com sucesso:

1. Acesse seu repositório no GitHub (ex: `https://github.com/osmair36/ifpr-contact-hub`).
2. Vá em **Settings** (Configurações) > **Pages** (no menu lateral esquerdo).
3. Em **Build and deployment** / **Source**, certifique-se de que está selecionado "Deploy from a branch".
4. Em **Branch**, selecione `gh-pages` e a pasta `/ (root)`.
5. Clique em **Save**.

O GitHub começará a processar seu site. Em alguns minutos, ele estará disponível no link fornecido na mesma página (geralmente algo como `https://osmair36.github.io/ifpr-contact-hub/`).

## 4. Atualizações Futuras

Sempre que fizer alterações no código e quiser atualizar o site:

1. Faça suas alterações.
2. `git add`, `git commit`, `git push` (para salvar o código fonte).
3. `npm run deploy` (para atualizar o site no ar).
