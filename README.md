# 🎮 GroupGames

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-success?style=for-the-badge&logo=pwa&logoColor=white)

**GroupGames** é um hub de jogos de festa (Party Games) desenvolvido como uma Progressive Web App (PWA). O objetivo é transformar qualquer encontro de amigos em uma competição divertida usando apenas
um celular. Obs: o PWA funciona apenas depois de fazer a build da aplicação.

---

## 🕹️ Os Jogos

O aplicativo conta com três módulos de jogos distintos:

### 1. 🌊 ITO (Sincronia)

Um jogo cooperativo de sintonia mental.

-   **Objetivo:** O grupo deve colocar suas cartas (números ocultos de 1 a 100 - jogo original) em ordem crescente na mesa.
-   **Mecânica:** Um tema é sorteado (ex: "Popularidade de Pratos Japoneses"). Os jogadores discutem baseados no tema ("Eu sou um Sushi, sou muito popular!").
-   **Destaque:** Interface intuitiva para revelar números e temas aleatórios infinitos.

### 2. 🎭 Mímica

O clássico jogo de charadas, turbinado com categorias e pontuação automática.

-   **Categorias:**
    -   👤 **P** - Pessoa, Lugar ou Animal.
    -   📦 **O** - Objeto.
    -   🏃 **A** - Ação (Verbos).
    -   🧠 **D** - Difícil.
    -   🍿 **L** - Lazer (Filmes, Livros, Jogos).
    -   🎲 **M** - Mix (Aleatório).
-   **Recursos:** Cronômetro integrado, gerenciamento de equipes e sistema de pontuação variável por dificuldade.

### 3. 🦆 Nem a Pato

Um jogo de trivia, estimativa e blefe.

-   **Mecânica:** Uma pergunta de um Tema é lida (ex: "Quantos dentes tem um tubarão branco?"). A resposta é sempre um número inteiro e o proximo jogador não pode falar um número menor que o anterior.
-   **Fluxo:** Jogadores dão palpites. Se um palpite for contestado, a resposta real é revelada.
-   **Pontuação (Patos):**
    -   Se o desafiante acertar que o palpite estava errado, o dono do palpite ganha os "Patos" (Pontos de penalidade).
    -   Se o desafiante errar, ele leva os "Patos".
-   **Vitória:** O jogo termina quando um jogador bater um numero de patos determinados (Ex: 10 patos). Vence quem terminar a partida com **menos** patos (o grande perdedor é quem tem mais).

---

## 🚀 Tecnologias Utilizadas

-   **Core:** React.js + Vite
-   **Estilização:** Tailwind CSS
-   **Ícones:** Lucide React
-   **Animações:** Framer Motion
-   **Funcionalidades PWA:** `vite-plugin-pwa` (Instalável no Android/iOS)
-   **Gerenciamento de Estado:** React Hooks (Context API / useState) / Zustand

---

## 📦 Como Rodar o Projeto

Pré-requisitos: Tenha o [Node.js](https://nodejs.org/) instalado.

1. **Clone o repositório:**
    ```bash
    git clone [https://github.com/LucasMarrane/group-games-hub.git](https://github.com/LucasMarrane/group-games-hub.git)
    cd group-games-hub
    ```
2. **Instale as dependências:**

```bash
npm install
```

3. **Rode o servidor de desenvolvimento:**

```bash
npm run dev
```

## 🤝 Contribuição

Contribuições são bem-vindas! Se você tiver ideias de novos temas para o "Sincronia" ou novas perguntas para o "Nem a Pato":

1. Faça um Fork do projeto.

2. Crie uma Branch para sua Feature (git checkout -b feature/NovasPerguntas).

3. Adicione suas mudanças nos arquivos JSON em src/data.

4. Faça o Commit (git commit -m 'Add: Novas perguntas de mímica').

5. Faça o Push (git push origin feature/NovasPerguntas).

6. Abra um Pull Request.
