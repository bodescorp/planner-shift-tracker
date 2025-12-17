# 📅 Cronograma Semanal - PWA

Aplicativo web progressivo (PWA) para gerenciamento de atividades semanais com sistema bi-semanal alternado.

## ✨ Funcionalidades Principais

### 🗓️ Gerenciamento de Atividades
- **Sistema bi-semanal**: Alternância automática entre Semana A e Semana B
- **Checkboxes interativos**: Marque atividades como concluídas
- **Progresso por dia**: Visualize X/Y atividades completadas
- **Persistência**: Dados salvos automaticamente no localStorage

### 💧 Lembrete de Hidratação
- **Notificações automáticas**: A cada 30 minutos
- **Contador de água**: Registre quantos copos bebeu hoje
- **Histórico semanal**: Acompanhe seu consumo de água

### 📊 Relatório Semanal
- **Estatísticas em tempo real**: % de atividades completadas
- **Dias completos**: Quantos dias você finalizou 100%
- **Consumo de água**: Hoje e na semana
- **Histórico**: Últimas 4 semanas de desempenho

### 📱 PWA (Progressive Web App)
- **Instalável**: Adicione à tela inicial do celular
- **Funciona offline**: Service Worker com cache
- **Responsivo**: Otimizado para mobile e desktop
- **Notificações push**: Lembretes de hidratação

## 🚀 Como Usar

### Desktop
1. Abra `index.html` no navegador
2. Permita notificações quando solicitado
3. Use normalmente

### Mobile (Instalar como App)

#### Android (Chrome/Edge)
1. Abra o site no Chrome
2. Toque no menu (⋮) → "Instalar app" ou "Adicionar à tela inicial"
3. Confirme a instalação
4. O app aparecerá na tela inicial

#### iOS (Safari)
1. Abra o site no Safari
2. Toque no botão "Compartilhar" (□↑)
3. Role para baixo e toque em "Adicionar à Tela de Início"
4. Confirme

## ⌨️ Atalhos do Teclado

- **Ctrl/Cmd + 1**: Mudar para Semana A
- **Ctrl/Cmd + 2**: Mudar para Semana B
- **Ctrl/Cmd + R**: Resetar dia atual
- **ESC**: Fechar modal de relatório

## 🎯 Como Funciona

### Semana A
- **Trabalho**: Segunda, Quarta, Sexta (08:00-20:00)
- **Folga**: Terça, Quinta, Sábado, Domingo
- **Entrega**: Quinta 08:30-09:30 (dia de folga)

### Semana B
- **Trabalho**: Terça, Quinta, Sábado (08:00-20:00)
- **Folga**: Segunda, Quarta, Sexta, Domingo
- **Entrega**: Quinta 05:45-09:30 (antes do trabalho)

### Atividades Principais

#### 💻 Programação
- Desenvolvimento de sistemas para clientes
- 10-12h/semana
- Entregas todas as quintas

#### 🎮 Game Dev
- Desenvolvimento do primeiro jogo (ROTAMG)
- 4-5h/semana
- Sempre separado de programação com pausas

#### 📸 Marketing (AltTab)
- Fotografia de produto
- 4-6 postagens/semana
- AltTab + Bodescorp

#### 🎥 Bodescorp (Lives)
- 2 lives/semana (Quinta + Sábado A)
- 4 posts de cortes das lives
- Gaming diário: 22:45-00:00

#### 🌍 Inglês
- 20min diários (Duolingo)
- 1h30 focado aos domingos
- ~4h/semana total

#### 💪 Saúde
- Academia 5x/semana
- Meditação diária (10-15min)
- Auriculoterapia semanal

## 📊 Dados Salvos

Todos os dados são salvos localmente no navegador:

- `currentWeek`: Semana ativa (A ou B)
- `checkboxes`: Estado de todas as atividades
- `waterData`: Contador de água por dia
- `weeklyReports`: Relatórios das últimas semanas

## 🔧 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo dark theme
- **JavaScript ES6+**: Lógica da aplicação
- **Service Worker**: Cache e funcionamento offline
- **Web Notifications API**: Lembretes de água
- **LocalStorage**: Persistência de dados
- **PWA Manifest**: Instalação como app

## 🎨 Personalização

### Alterar horário de notificações
Edite em `script.js`:
```javascript
// Mudar de 30 para 60 minutos, por exemplo
waterNotificationInterval = setInterval(() => {
    showWaterNotification();
}, 60 * 60 * 1000); // 60 minutos
```

### Alterar tema de cores
Edite em `style.css`:
```css
body {
    background: #0a0a0a; /* Alterar cor de fundo */
    color: #e0e0e0; /* Alterar cor do texto */
}
```

## 📝 Notas

- **Servidor Local**: Para PWA funcionar completamente, serve via HTTPS ou localhost
- **Notificações**: Funciona apenas em HTTPS (exceto localhost)
- **Ícones**: Use `create-icons.html` para gerar ícones PNG se necessário

## 🐛 Solução de Problemas

### Notificações não funcionam
1. Verifique se concedeu permissão
2. Certifique-se que está em HTTPS
3. Recarregue a página

### PWA não instala
1. Use HTTPS ou localhost
2. Verifique se `manifest.json` está acessível
3. Limpe o cache e tente novamente

### Dados perdidos
- Dados ficam no localStorage do navegador
- Não limpe dados do site
- Faça backup exportando dados (futuro)

## 📄 Licença

Projeto pessoal de organização e produtividade.

---

**Última atualização**: 17 de Dezembro de 2025
**Versão**: 2.0 (Com PWA, Notificações e Relatórios)
