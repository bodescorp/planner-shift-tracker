# Cronograma

Sistema de gerenciamento de plantão 12x36 com rastreamento de atividades e hidratação.

## Características

- **Sistema Automático**: Configure uma vez e o sistema alterna automaticamente entre plantão e folga
- **PWA**: Funciona offline como um aplicativo instalável
- **Rastreamento de Água**: Lembretes periódicos para hidratação
- **Relatórios**: Estatísticas semanais de atividades e consumo de água
- **Design Minimalista**: Interface limpa e profissional

## Estrutura do Projeto

```
planer_hor/
├── index.html              # Página principal
├── manifest.json           # Configuração PWA
├── src/
│   ├── css/
│   │   └── style.css       # Estilos
│   ├── js/
│   │   ├── app.js          # Lógica principal
│   │   └── sw.js           # Service Worker
│   └── assets/
│       ├── icon-192.svg    # Ícone PWA
│       └── icon-512.svg    # Ícone PWA
└── docs/                   # Documentação
```

## Instalação

1. Clone o repositório
2. Sirva os arquivos com um servidor HTTP:
   ```bash
   python3 -m http.server 8000
   ```
3. Acesse `http://localhost:8000`
4. No primeiro acesso, confirme se está em plantão ou folga

## Uso

### Configuração Inicial

Na primeira execução, o sistema perguntará se você está trabalhando hoje. Após confirmar, o sistema calculará automaticamente os próximos dias.

### Menu

Acesse todas as funcionalidades pelo menu hambúrguer (☰):
- **Configurar Plantão**: Reconfigurar o ciclo se necessário
- **Registrar Água**: Marcar consumo de água
- **Ver Todos os Dias**: Alternar visualização (mobile)
- **Relatório**: Ver estatísticas semanais
- **Limpar Hoje**: Resetar atividades do dia

### Atalhos

- Marque checkboxes para completar atividades
- O progresso é salvo automaticamente
- Sistema atualiza sozinho à meia-noite

## Tecnologias

- HTML5
- CSS3 (design minimalista)
- JavaScript (Vanilla)
- PWA (Service Worker + Manifest)
- LocalStorage (persistência de dados)

## Compatibilidade

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile (iOS/Android)

## Licença

MIT
# planner-shift-tracker
PWA minimalista com rastreamento automático de turnos, hidratação e relatórios.
