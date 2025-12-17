# Estrutura do Projeto

```
planer_hor/
│
├── index.html                 # Página principal do aplicativo
├── manifest.json              # Configuração PWA (nome, ícones, tema)
│
├── src/                       # Código fonte
│   ├── css/
│   │   └── style.css          # Estilos principais (design minimalista)
│   │
│   ├── js/
│   │   ├── app.js             # Lógica principal da aplicação
│   │   └── sw.js              # Service Worker (PWA/offline)
│   │
│   └── assets/
│       ├── icon-192.svg       # Ícone PWA 192x192
│       └── icon-512.svg       # Ícone PWA 512x512
│
├── docs/                      # Documentação
│   ├── create-icons.html      # Guia para recriar ícones
│   ├── FUNCIONALIDADES.md     # Lista de funcionalidades
│   ├── INSTALACAO.md          # Instruções de instalação
│   ├── INSTRUCOES.md          # Manual de uso
│   ├── MELHORIAS-V3.md        # Histórico de melhorias v3
│   └── TESTES.md              # Guia de testes
│
├── README.md                  # Documentação principal
├── CHANGELOG.md               # Histórico de mudanças
├── CONTRIBUTING.md            # Guia de contribuição
└── .gitignore                 # Arquivos ignorados pelo Git
```

## Descrição dos Diretórios

### `/src`
Contém todo o código fonte da aplicação, organizado por tipo:
- **css/**: Estilos CSS
- **js/**: Código JavaScript
- **assets/**: Recursos estáticos (imagens, ícones)

### `/docs`
Documentação técnica e guias de uso do projeto.

## Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Estrutura HTML da aplicação |
| `manifest.json` | Configuração PWA |
| `src/js/app.js` | Lógica principal (ciclos, água, relatórios) |
| `src/js/sw.js` | Service Worker para funcionamento offline |
| `src/css/style.css` | Todos os estilos (minimalista, responsivo) |

## Fluxo de Dados

```
localStorage
    ├── cycleStartDate     # Data de início do ciclo
    ├── currentWeek        # 'A' (Plantão) ou 'B' (Folga)
    ├── checkboxes         # Estado das atividades
    ├── waterData          # Registro de água por dia
    └── weeklyReports      # Relatórios semanais salvos
```

## Padrões

- **Nomenclatura**: camelCase para JS, kebab-case para CSS
- **Idioma**: Código em inglês, comentários em português
- **Estrutura**: Modular e organizado por responsabilidade
