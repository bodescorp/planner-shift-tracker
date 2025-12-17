# 🧪 Guia de Teste

## Como Testar as Novas Funcionalidades

### 1️⃣ Visualização Mobile (Dia Único)

**Desktop:**
```bash
# Abra DevTools (F12)
# Toggle Device Toolbar (Ctrl+Shift+M)
# Selecione iPhone ou Android
```

**O que verificar:**
- ✅ Vê apenas 1 dia (o dia de hoje)
- ✅ Botão "📱 Dia Único / 📅 Todos" aparece
- ✅ Clicando alterna entre visualizações
- ✅ Em desktop, botão some

**Teste manual:**
1. Abra no celular ou modo mobile
2. Deve ver apenas o dia atual (ex: Quarta-feira)
3. Clique em "📅 Todos" → Vê todos os dias
4. Clique em "📱 Dia Único" → Volta para apenas hoje

---

### 2️⃣ Modal de Água

**Teste Rápido (não esperar 30min):**

Abra o console do navegador (F12) e execute:
```javascript
// Forçar modal aparecer imediatamente
document.getElementById('waterModal').classList.add('active');
```

**O que verificar:**
- ✅ Modal aparece com pergunta
- ✅ Botão "✅ Sim" incrementa contador
- ✅ Botão "❌ Não" fecha modal
- ✅ Contador no header atualiza (💧 X)
- ✅ Modal fecha após clicar

**Teste automático (30 minutos):**
1. Deixe app aberto
2. Aguarde 30 minutos
3. Modal deve aparecer automaticamente

**Teste botão manual:**
1. Clique no botão 💧 no header
2. Modal deve abrir
3. Clique "Sim" → Contador incrementa

---

### 3️⃣ Relatório Semanal

**Como testar:**
1. Marque algumas atividades (checkboxes)
2. Registre água (clique no botão 💧 → "Sim")
3. Clique em "📊 Relatório Semanal"

**O que verificar:**
- ✅ Exibe atividades completadas (X/Y e %)
- ✅ Exibe dias 100% completos
- ✅ Exibe água hoje
- ✅ Exibe água na semana com média
- ✅ Histórico das últimas 4 semanas (se houver)
- ✅ Informações sobre limpeza automática

**Ver dados salvos:**
```javascript
// No console do navegador
JSON.parse(localStorage.weeklyReports)
JSON.parse(localStorage.waterData)
```

---

### 4️⃣ Limpeza Automática (Segunda 00:30)

**Teste simulado (não esperar segunda):**

No console do navegador:
```javascript
// Simular limpeza
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(cb => cb.checked = false);
localStorage.setItem('checkboxes', JSON.stringify({}));
location.reload();
```

**Teste real:**
1. Marque várias atividades
2. Aguarde até segunda-feira 00:30
3. Atividades devem ser limpadas automaticamente

**Verificar no console:**
```
🗑️ Limpeza semanal iniciada...
✅ Limpeza semanal concluída!
```

**O que é preservado:**
- ✅ Histórico de água (`waterData`)
- ✅ Relatórios semanais (`weeklyReports`)

**O que é limpo:**
- ❌ Checkboxes de atividades
- ❌ Cache de atividades

---

## 📱 Teste Completo Mobile

### Cenário: Uso Diário

**Manhã (08:00):**
1. Abre app no celular
2. Vê apenas hoje (ex: Quarta-feira)
3. Marca "Acordar" ✓
4. Marca "Trabalho Presencial" ✓

**Durante o dia (10:30):**
5. Modal aparece: "Bebeu água?"
6. Clica "✅ Sim"
7. Contador atualiza (💧 1)

**Almoço (13:00):**
8. Modal aparece novamente
9. Clica "✅ Sim"
10. Contador (💧 2)

**Tarde (15:30):**
11. Modal aparece
12. Esqueceu de beber → "❌ Não"
13. Contador não muda (💧 2)

**Noite (20:00):**
14. Volta ao app
15. Marca "Academia" ✓
16. Marca "Leitura" ✓

**Antes de dormir (23:30):**
17. Clica "📊 Relatório Semanal"
18. Vê progresso do dia: 5/8 (62%)
19. Vê água: 2 copos hoje
20. Fecha relatório

---

## 🖥️ Teste Completo Desktop

### Cenário: Planejamento Semanal

**Domingo (Planejamento):**
1. Abre app no desktop
2. Vê semana completa
3. Revisa atividades de todos os dias
4. Clica "📊 Relatório Semanal"
5. Analisa semana anterior

**Durante a semana:**
6. Marca atividades diariamente
7. Responde modais de água
8. Acompanha progresso

**Sexta-feira:**
9. Clica relatório
10. Vê: 45/60 atividades (75%)
11. Vê: 38 copos de água na semana
12. Média: ~5.4 copos/dia

---

## 🐛 Testes de Bugs Comuns

### Bug 1: Modal não fecha
**Teste:**
1. Abra modal de água
2. Clique fora do modal
3. Pressione ESC

**Esperado:** Modal fecha em ambos os casos

### Bug 2: Contador não atualiza
**Teste:**
1. Clique "✅ Sim" no modal
2. Verifique header (💧 X)

**Esperado:** Número incrementa imediatamente

### Bug 3: Dia errado no mobile
**Teste:**
1. Abra no mobile
2. Verifique qual dia está exibido

**Esperado:** Dia atual do sistema

**Conferir:**
```javascript
// No console
const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
console.log(days[new Date().getDay()]); // Deve ser hoje
```

### Bug 4: Limpeza duplicada
**Teste:**
1. Simule segunda 00:30 duas vezes
2. Verifique localStorage

**Esperado:** Limpa apenas uma vez
```javascript
localStorage.getItem('lastWeeklyClear') // Deve ter data de hoje
```

---

## 📊 Validar localStorage

### Estrutura esperada:
```javascript
// No console do navegador (F12)

// 1. Semana ativa
localStorage.getItem('currentWeek') // "A" ou "B"

// 2. Checkboxes
JSON.parse(localStorage.getItem('checkboxes'))
// { "segunda-a-0": true, "segunda-a-1": false, ... }

// 3. Água
JSON.parse(localStorage.getItem('waterData'))
// { "Wed Dec 17 2025": 5, ... }

// 4. Relatórios
JSON.parse(localStorage.getItem('weeklyReports'))
// { "2025-12-15": { activities: {...}, waterTotal: 42 } }

// 5. Última limpeza
localStorage.getItem('lastWeeklyClear') // "Mon Dec 15 2025"
```

---

## ✅ Checklist de Testes

### Básico
- [ ] App carrega sem erros
- [ ] Semana A/B alterna corretamente
- [ ] Checkboxes marcam/desmarcam
- [ ] Progresso atualiza (X/Y)

### Mobile
- [ ] Exibe apenas dia atual
- [ ] Botão toggle funciona
- [ ] Responsivo (tela pequena)
- [ ] Touch funciona bem

### Água
- [ ] Modal aparece a cada 30min
- [ ] Botão "Sim" incrementa
- [ ] Botão "Não" apenas fecha
- [ ] Contador header atualiza
- [ ] Dados salvos no localStorage

### Relatório
- [ ] Abre modal ao clicar
- [ ] Exibe estatísticas corretas
- [ ] Água incluída
- [ ] Histórico de 4 semanas
- [ ] Fecha com X ou ESC

### Limpeza
- [ ] Segunda 00:30 limpa dados
- [ ] Não duplica limpeza
- [ ] Preserva histórico
- [ ] Log no console

### PWA
- [ ] Instala no celular
- [ ] Funciona offline
- [ ] Notificações (se permitido)
- [ ] Ícones corretos

---

## 🚀 Comandos Úteis (Console)

```javascript
// Ver todos os dados
console.table({
    semana: localStorage.currentWeek,
    ultimaLimpeza: localStorage.lastWeeklyClear,
    aguaHoje: JSON.parse(localStorage.waterData || '{}')[new Date().toDateString()]
});

// Forçar modal de água
document.getElementById('waterModal').classList.add('active');

// Resetar tudo
localStorage.clear();
location.reload();

// Ver relatório no console
const reports = JSON.parse(localStorage.weeklyReports || '{}');
console.log('Relatórios:', reports);

// Simular limpeza
const cbs = document.querySelectorAll('input[type="checkbox"]');
cbs.forEach(cb => cb.checked = false);
console.log('✅ Checkboxes limpos');
```

---

**Boa sorte nos testes! 🧪**

Se encontrar bugs, verifique:
1. Console do navegador (F12) para erros
2. localStorage para dados corretos
3. Network tab para Service Worker
