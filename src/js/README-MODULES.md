# Estrutura Modular do JavaScript

## 📁 Organização dos Arquivos

```
src/js/
├── app.js                          # Arquivo principal (importa todos os módulos)
├── app-old.js                      # Backup do arquivo anterior
├── sw.js                           # Service Worker (PWA)
└── modules/                        # Módulos organizados por funcionalidade
    ├── dom-elements.js             # Elementos DOM (seletores)
    ├── utils.js                    # Funções utilitárias
    ├── cycle-system.js             # Sistema de ciclo 12x36
    ├── menu.js                     # Menu sanduíche lateral
    ├── mobile-view.js              # Visualização mobile
    ├── notifications.js            # Notificações de água
    ├── activities.js               # Gerenciamento de atividades
    ├── weekly-cleanup.js           # Limpeza semanal automática
    ├── reports.js                  # Relatórios e atalhos
    └── service-worker-register.js  # Registro do Service Worker
```

## 📦 Módulos

### `dom-elements.js`
Exporta todos os elementos DOM usados na aplicação.
- `weekButtons`, `weekContents`, `resetBtn`
- Elementos do menu: `menuToggle`, `sideMenu`, `menuOverlay`
- Modais: `reportModal`, `waterModal`
- Badges e indicadores

### `utils.js`
Funções utilitárias reutilizáveis:
- `getDayName()` - Retorna nome do dia atual
- `isMobile()` - Detecta dispositivo móvel
- `showNotification()` - Exibe toast notifications
- `getWeekKey()`, `getWeekStart()` - Manipulação de datas

### `cycle-system.js`
Sistema de ciclo alternado 12x36:
- `getTodayDate()` - Data atual normalizada
- `getStartDate()` - Data inicial do ciclo
- `isWorkDay()` - Verifica se é dia de trabalho
- `detectCurrentMode()` - Detecta semana A ou B
- `confirmTodayAsWorkDay()` - Salva configuração
- `showConfirmDialog()` - Modal de configuração
- `startDayChangeMonitor()` - Monitor de mudança de dia

### `menu.js`
Gerenciamento do menu lateral:
- `openMenu()`, `closeMenu()` - Controle do menu
- `updateMenuIndicators()` - Atualiza badges do menu
- `initMenu()` - Inicializa event listeners

### `mobile-view.js`
Visualização otimizada para mobile:
- `updateDayView()` - Atualiza visualização do dia
- `toggleViewMode()` - Alterna entre ver todos os dias ou apenas hoje

### `notifications.js`
Sistema de notificações de hidratação:
- `startWaterReminder()` - Inicia lembretes a cada 30min
- `incrementWaterCount()` - Registra copo de água
- `updateWaterDisplay()` - Atualiza contadores
- `initWaterNotifications()` - Inicializa listeners

### `activities.js`
Gerenciamento de atividades e checkboxes:
- `loadState()` - Carrega estado do localStorage
- `switchWeek()` - Alterna entre semanas A e B
- `updateProgress()` - Atualiza progresso do dia
- `saveCheckboxState()` - Salva estado dos checkboxes
- `resetCurrentDay()` - Limpa atividades do dia
- `initActivities()` - Inicializa listeners

### `weekly-cleanup.js`
Limpeza automática semanal:
- `checkAndClearWeeklyData()` - Verifica e limpa dados
- `startWeeklyCleanupMonitor()` - Inicia monitor (toda segunda 00:30)

### `reports.js`
Relatórios e atalhos de teclado:
- `saveWeeklyReport()` - Salva relatório da semana
- `generateReport()` - Gera HTML do relatório
- `initReports()` - Inicializa modal de relatório
- `initKeyboardShortcuts()` - Atalhos (Ctrl+1, Ctrl+2, ESC)

### `service-worker-register.js`
Registro do Service Worker para PWA:
- `registerServiceWorker()` - Registra SW para uso offline

## 🚀 Como Funciona

1. **index.html** carrega `app.js` como módulo ES6:
   ```html
   <script type="module" src="src/js/app.js"></script>
   ```

2. **app.js** importa todos os módulos e inicializa a aplicação:
   ```javascript
   import { initMenu } from './modules/menu.js';
   import { loadState } from './modules/activities.js';
   // ... outros imports
   
   initMenu();
   loadState();
   // ... outras inicializações
   ```

3. Cada módulo exporta suas funções:
   ```javascript
   export function minhaFuncao() { ... }
   export const meuElemento = document.getElementById('...');
   ```

4. Outros módulos podem importar o que precisam:
   ```javascript
   import { minhaFuncao } from './utils.js';
   ```

## ✅ Vantagens da Modularização

- ✅ **Manutenção Fácil**: Cada funcionalidade em seu próprio arquivo
- ✅ **Código Limpo**: Separação clara de responsabilidades
- ✅ **Reutilização**: Funções podem ser importadas onde necessário
- ✅ **Debugging**: Mais fácil encontrar e corrigir bugs
- ✅ **Colaboração**: Múltiplos desenvolvedores podem trabalhar em paralelo
- ✅ **Testes**: Mais fácil testar módulos isoladamente

## 🔧 Modificações Futuras

Para adicionar nova funcionalidade:

1. Crie um novo arquivo em `modules/`
2. Exporte as funções necessárias
3. Importe no `app.js`
4. Chame a função de inicialização

Exemplo:
```javascript
// modules/nova-feature.js
export function initNovaFeature() {
    console.log('Nova feature iniciada!');
}

// app.js
import { initNovaFeature } from './modules/nova-feature.js';
initNovaFeature();
```

## 📝 Notas

- Todos os módulos usam **ES6 modules** (`import`/`export`)
- O arquivo `app-old.js` é o backup do código monolítico anterior
- Compatível com navegadores modernos que suportam ES6 modules
- Para navegadores antigos, seria necessário usar bundler (Webpack, Rollup, etc.)
