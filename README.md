# Planner Shift Tracker

Um planejador de rotina para escalas 12x36 que vai além do básico. Construído para resolver o problema real de gerenciar uma rotina complexa com trabalho, estudos, hobbies e autocuidado.

## Por que este projeto?

Trabalhar em escala 12x36 é desafiador. Os dias alternam entre trabalho intenso e folga, cada um com sua própria lista de atividades. Eu precisava de algo que:

- **Calculasse automaticamente** qual tipo de dia é hoje (Semana A ou B)
- **Adaptasse as atividades** para o contexto do dia (trabalho vs. folga)
- **Lembrasse de beber água** durante o expediente
- **Funcionasse no celular** como um app nativo
- **Não dependesse de servidor** - tudo local e privado

## O que tem aqui

### Sistema de Escala Inteligente
O app detecta automaticamente se você está na Semana A ou B baseado na data inicial. Cada semana tem uma configuração diferente de dias de trabalho/folga e atividades específicas.

### Player de Meditação
Interface tabbed no mobile com 8 áudios que rotacionam automaticamente - 1 por dia. Simples e eficiente.

### Bloco de Notas
Porque às vezes você só precisa anotar algo rápido sem sair do app.

### Relatórios Automáticos
Veja seu progresso semanal: quantas atividades completou, quantos copos de água bebeu, quantas vezes foi na academia.

### PWA Completo
Instale como app, funcione offline, notificações de água - experiência mobile nativa com web tech.

## Stack

**Frontend Puro**
- HTML5 semântico
- CSS3 com gradientes e animações
- Vanilla JavaScript com ES6 modules

**Arquitetura**
- Sistema modular (9 módulos separados)
- localStorage para persistência
- Service Worker para PWA
- Sem frameworks, sem bundlers, sem complexidade desnecessária

**Funcionalidades**
- Audio API para o player
- Notification API para lembretes
- Responsive design (desktop e mobile têm interfaces diferentes)
- SPA com navegação por tabs no mobile

## Como funciona

```
src/
├── js/
│   ├── app.js                    # Entry point
│   └── modules/
│       ├── activities.js         # Gerencia atividades e checkboxes
│       ├── cycle-system.js       # Lógica da escala 12x36
│       ├── dom-elements.js       # Referências DOM
│       ├── menu.js               # Menu lateral
│       ├── mobile-view.js        # Views mobile
│       ├── notifications.js      # Lembretes de água
│       ├── reports.js            # Estatísticas semanais
│       ├── tabs-manager.js       # Navegação entre abas
│       └── meditation-player.js  # Player de áudio
```

**Cada módulo** tem uma responsabilidade única. Nada de god objects ou código espaguete.

## Destaques técnicos

**Cálculo de Escala**  
O sistema calcula dinamicamente qual semana você está (A ou B) baseado na data inicial. Cada semana tem um padrão diferente de dias de trabalho.

**Persistência Inteligente**  
Tudo é salvo no localStorage: checkboxes, histórico de água, última música tocada, notas. Quando você volta, está tudo lá.

**Audio Rotation**  
O player seleciona o áudio do dia usando `(dayOfYear % 8) + 1`. Simples e previsível.

**SPA sem Framework**  
Interface tabbed no mobile com 3 páginas (Cronograma, Meditação, Notas) usando apenas CSS positioning e JavaScript puro.

**Auto-reset à Meia-noite**  
Worker que detecta mudança de dia e reseta atividades automaticamente.

## Rodando localmente

```bash
# Qualquer servidor HTTP serve
python3 -m http.server 8000

# Ou use o Live Server do VS Code
```

Acesse `http://localhost:8000` e configure sua escala no primeiro uso.
## Requisitos


**Feito com JavaScript puro** porque nem tudo precisa de um framework.
- Safari 14+
- Mobile (iOS/Android)
- Desktop (Chrome, Firefox, Edge)

## Licença

MIT
# planner-shift-tracker
PWA minimalista com rastreamento automático de turnos, hidratação e relatórios.
