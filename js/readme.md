# ✨ Mundo Mágico - Site Institucional para Crianças

![Status](https://img.shields.io/badge/Status-Completo-success)
![HTML5](https://img.shields.io/badge/HTML5-Semântico-orange)
![CSS3](https://img.shields.io/badge/CSS3-Avançado-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Acessível](https://img.shields.io/badge/WCAG-2.1%20AA-green)
![Responsivo](https://img.shields.io/badge/Responsivo-Mobile%20First-purple)

Um site institucional encantador e interativo, desenvolvido especialmente para crianças! Com animações mágicas, cores vibrantes e uma experiência de usuário que faz os olhinhos brilharem. ✨🦄🌈

---

## 🎯 Objetivo do Projeto

Criar uma experiência web **mágica e encantadora** para crianças, combinando:
- **Visual vibrante** com cores do arco-íris
- **Animações suaves** que encantam
- **Interatividade divertida** para engajar
- **Acessibilidade** para todos
- **Performance otimizada** para qualquer dispositivo

---

## ✅ Funcionalidades Implementadas

### 🏠 Navegação
- [x] Header fixo com transparência e blur
- [x] Menu responsivo com animação hamburger
- [x] Scroll suave para âncoras
- [x] Indicador de seção ativa
- [x] Logo animado com flutuação

### 🌙 Tema Dark/Light Mode
- [x] Toggle de tema com animação
- [x] Respeita preferência do sistema (`prefers-color-scheme`)
- [x] Persistência via `localStorage`
- [x] Transição suave entre temas

### ✨ Animações e Efeitos
- [x] Loading screen com spinner mágico
- [x] Cursor personalizado com trail (desktop)
- [x] Partículas flutuantes (emojis mágicos)
- [x] Parallax suave no hero
- [x] Animações de scroll (Intersection Observer)
- [x] Contadores animados nas estatísticas
- [x] Efeito tilt 3D nos cards
- [x] Ripple effect nos botões
- [x] Mouse sparkles em áreas interativas
- [x] Emoji explosion ao clicar no hero
- [x] Barra de progresso de scroll
- [x] Nuvens animadas no fundo

### 📄 Seções do Site
- [x] **Hero** - Apresentação impactante com mascote unicórnio
- [x] **Sobre** - Cards informativos com missão, valores e promessa
- [x] **Estatísticas** - Contadores animados
- [x] **Atividades** - 6 cards de serviços com filtro de destaque
- [x] **Galeria** - Grid responsivo com filtros por categoria
- [x] **Depoimentos** - Carrossel de testimonials
- [x] **Contato** - Formulário completo com validação
- [x] **Footer** - Links, newsletter e redes sociais

### 📝 Formulários
- [x] Validação em tempo real
- [x] Máscara de telefone brasileiro
- [x] Feedback visual de erros
- [x] Loading state no envio
- [x] Mensagem de sucesso com confetti
- [x] Acessível com ARIA labels

### ♿ Acessibilidade (WCAG 2.1 AA)
- [x] HTML5 semântico completo
- [x] ARIA labels e roles
- [x] Skip to content link
- [x] Contraste de cores adequado (≥ 4.5:1)
- [x] Focus visible em elementos interativos
- [x] Respeita `prefers-reduced-motion`
- [x] Textos alternativos
- [x] Hierarquia de headings correta

### 📱 Responsividade
- [x] Mobile First approach
- [x] Breakpoints: 320px, 768px, 1024px+
- [x] Menu hamburger em mobile
- [x] Grid adaptativo
- [x] Imagens/cards responsivos
- [x] Touch-friendly em dispositivos móveis

### ⚡ Performance
- [x] CSS otimizado com variáveis
- [x] JavaScript modular e eficiente
- [x] Event delegation
- [x] Debounce e throttle em eventos
- [x] Intersection Observer para lazy animations
- [x] Animações via CSS (GPU accelerated)
- [x] Fontes com preconnect
- [x] Scripts com defer

---

## 📁 Estrutura de Arquivos

```
projeto/
├── index.html              # Página principal
├── css/
│   ├── style.css          # Estilos principais (45KB)
│   └── animations.css     # Animações CSS (19KB)
├── js/
│   ├── main.js            # JavaScript principal (32KB)
│   └── animations.js      # Animações JS avançadas (20KB)
└── README.md              # Documentação
```

---

## 🎨 Design System

### Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Roxo Mágico | `#7c3aed` | Cor primária |
| Rosa Encantado | `#f472b6` | Cor secundária |
| Amarelo Estrela | `#fbbf24` | Acentos |
| Verde Esperança | `#34d399` | Sucesso |
| Azul Céu | `#60a5fa` | Informações |
| Coral Alegre | `#fb7185` | Destaques |

### Tipografia

| Fonte | Uso |
|-------|-----|
| **Bubblegum Sans** | Títulos e elementos de destaque |
| **Nunito** | Corpo de texto e UI |

### Espaçamento (Escala)
- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)
- `3xl`: 4rem (64px)

---

## 🚀 Como Usar

### Visualização Local
1. Clone ou baixe os arquivos
2. Abra `index.html` em um navegador moderno
3. Para melhor experiência, use um servidor local

### Personalização

#### Cores
Edite as variáveis CSS em `css/style.css`:
```css
:root {
    --color-primary: #7c3aed;
    --color-secondary: #f472b6;
    /* ... */
}
```

#### Conteúdo
Edite diretamente no `index.html`:
- Textos das seções
- Informações de contato
- Cards de serviços
- Depoimentos

#### Partículas
Configure em `js/main.js`:
```javascript
const CONFIG = {
    particleCount: 30,
    particleEmojis: ['✨', '⭐', '🌟', '💫', '🎈', /* ... */]
};
```

---

## 🌐 URIs Funcionais

| Caminho | Descrição |
|---------|-----------|
| `/` ou `/index.html` | Página principal |
| `/#home` | Seção Hero |
| `/#about` | Seção Sobre |
| `/#services` | Seção Atividades |
| `/#gallery` | Seção Galeria |
| `/#contact` | Seção Contato |

---

## 📊 Métricas de Performance Esperadas

| Métrica | Desktop | Mobile |
|---------|---------|--------|
| **Lighthouse Performance** | 90+ | 85+ |
| **LCP** | < 2.0s | < 2.5s |
| **FID** | < 50ms | < 100ms |
| **CLS** | < 0.1 | < 0.1 |

---

## 🔧 Tecnologias Utilizadas

- **HTML5** - Semântico com Schema.org JSON-LD
- **CSS3** - Grid, Flexbox, Custom Properties, Animações
- **JavaScript ES6+** - Vanilla JS moderno
- **Google Fonts** - Bubblegum Sans, Nunito
- **Font Awesome 6** - Ícones
- **Intersection Observer API** - Animações de scroll
- **Web Animations API** - Efeitos avançados

---

## 📋 Próximos Passos (Sugestões)

1. **Adicionar imagens reais** - Substituir placeholders por fotos
2. **Integrar formulário** - Conectar a backend ou serviço como Formspree
3. **Adicionar mais páginas** - Página de cada atividade
4. **Implementar blog** - Seção de notícias/dicas
5. **Galeria real** - Lightbox com imagens reais
6. **Sistema de agendamento** - Para atividades e festas
7. **Área do cliente** - Login e perfil
8. **Internacionalização** - Suporte a múltiplos idiomas

---

## 🤝 Suporte

Para dúvidas ou sugestões sobre o projeto, sinta-se à vontade para entrar em contato.

---

## 📜 Licença

Este projeto foi criado para fins demonstrativos e educacionais.

---

<div align="center">
    
**Feito com 💖 para crianças felizes!**

✨🦄🌈 **Mundo Mágico** 🌈🦄✨

</div>
