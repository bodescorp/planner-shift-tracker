# Cronograma

Sistema de gerenciamento de plantão 12x36 com rastreamento de atividades e hidratação.

## Características

- **Sistema Automático**: Configure uma vez e o sistema alterna automaticamente entre plantão e folga
- **Carregamento Automático**: Todas as configurações são salvas no localStorage e carregadas automaticamente ao abrir a aplicação
- **Persistência Total**: Checkboxes, configurações de plantão, histórico de água - tudo é salvo automaticamente
- **PWA**: Funciona offline como um aplicativo instalável
- **Rastreamento de Água**: Lembretes periódicos para hidratação
- **Relatórios**: Estatísticas semanais de atividades e consumo de água
- **Design Minimalista**: Interface limpa e profissional

## Como Funciona o Sistema de Cache/LocalStorage

A aplicação utiliza o **localStorage** do navegador para persistir todas as informações:

### Dados Salvos Automaticamente:
- ✅ **Configuração de Plantão**: Data inicial e ciclo 12x36
- ✅ **Estado dos Checkboxes**: Todas as atividades marcadas
- ✅ **Histórico de Água**: Registro diário de consumo
- ✅ **Relatórios Semanais**: Estatísticas e progresso
- ✅ **Preferências**: Visualização mobile, última limpeza, etc.

### Carregamento Automático:
Ao abrir a aplicação, ela automaticamente:
1. 🔍 Verifica se existe configuração salva no localStorage
2. 📅 Detecta se hoje é plantão ou folga baseado na data inicial
3. ✨ Restaura todos os checkboxes e configurações
4. 💧 Mostra o contador de água do dia
5. 📊 Atualiza os indicadores e relatórios

### Primeira Configuração:
Se é a primeira vez usando a aplicação:
1. Um diálogo aparecerá perguntando: "Você está trabalhando hoje?"
2. Após responder, o sistema salva automaticamente no localStorage
3. Nas próximas aberturas, tudo será carregado automaticamente!

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

## Troubleshooting

### A aplicação não está carregando minhas configurações
1. Verifique se está usando o mesmo navegador
2. Certifique-se de que o localStorage não foi limpo
3. Abra o console do navegador (F12) e veja os logs de carregamento
4. Você verá mensagens como: `✅ Configuração carregada automaticamente do localStorage`

### Como resetar tudo
Se quiser começar do zero:
1. Abra o console do navegador (F12)
2. Digite: `localStorage.clear()`
3. Recarregue a página (F5)

### Ver dados salvos no localStorage
No console do navegador:
```javascript
// Ver configuração de plantão
console.log(localStorage.getItem('cycleStartDate'))
console.log(localStorage.getItem('currentWeek'))

// Ver checkboxes salvos
console.log(JSON.parse(localStorage.getItem('checkboxes')))

// Ver histórico de água
console.log(JSON.parse(localStorage.getItem('waterData')))
```

## Licença

MIT
# planner-shift-tracker
PWA minimalista com rastreamento automático de turnos, hidratação e relatórios.
