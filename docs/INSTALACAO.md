# 🚀 Guia Rápido de Instalação

## 📱 Instalar no Celular

### Android (Chrome, Edge, Samsung Internet)

1. **Abra o site** no navegador
2. Toque no **menu** (⋮) no canto superior direito
3. Selecione **"Adicionar à tela inicial"** ou **"Instalar app"**
4. Confirme tocando em **"Adicionar"** ou **"Instalar"**
5. O ícone 📅 aparecerá na tela inicial

**Alternativa**: Um banner "Instalar" pode aparecer automaticamente. Basta tocar em "Instalar".

### iOS (Safari)

1. **Abra o site** no Safari (não funciona no Chrome iOS)
2. Toque no botão **Compartilhar** (□↑) na parte inferior
3. Role para baixo e toque em **"Adicionar à Tela de Início"**
4. Edite o nome se quiser
5. Toque em **"Adicionar"**
6. O ícone 📅 aparecerá na tela inicial

**Importante**: No iOS, só funciona no Safari nativo.

## 💻 Instalar no Desktop

### Chrome, Edge, Brave

1. **Abra o site** no navegador
2. Procure o ícone **⊕ Instalar** na barra de endereço
3. Clique e confirme
4. O app será aberto em janela própria

**Alternativa**: Menu (⋮) → "Instalar Cronograma Semanal..."

### Firefox

Firefox não suporta instalação PWA nativamente, mas funciona normalmente no navegador.

## 🔔 Ativar Notificações

### Primeira Vez
1. Ao abrir o app, aparecerá: **"Cronograma Semanal deseja enviar notificações"**
2. Clique em **"Permitir"**
3. Pronto! Receberá lembretes de água a cada 30 minutos

### Se Bloqueou por Engano

**Android**:
1. Configurações do celular → Apps
2. Encontre o app "Cronograma Semanal"
3. Notificações → Ativar

**iOS**:
1. Ajustes → Safari → Avançado
2. Dados de Sites → Limpar histórico
3. Abra o app novamente e permita

**Desktop**:
1. Configurações do navegador → Privacidade
2. Permissões → Notificações
3. Adicione o site à lista de permitidos

## ✅ Verificar se Instalou Corretamente

### Android/iOS
- ✅ Ícone 📅 aparece na tela inicial
- ✅ Abre em tela cheia (sem barra do navegador)
- ✅ Funciona offline
- ✅ Recebe notificações

### Desktop
- ✅ Janela própria (não aba do navegador)
- ✅ Ícone na barra de tarefas
- ✅ Pode fixar na barra de tarefas
- ✅ Abre com atalho

## 🔧 Solução de Problemas

### "Adicionar à tela inicial" não aparece

**Causa**: Site precisa estar em HTTPS ou localhost

**Solução**:
- Use um servidor local (Python, Node.js, etc)
- Ou hospede em GitHub Pages, Netlify, Vercel

**Comando rápido (Python)**:
```bash
cd /home/glayterra/Projetos/planer_hor
python3 -m http.server 8000
```
Depois acesse: `http://localhost:8000`

### Notificações não funcionam

1. **Verifique permissões**: Deve estar permitido
2. **HTTPS obrigatório**: Exceto localhost
3. **Recarregue o app**: Ctrl+R ou pull-to-refresh

### App não funciona offline

1. **Abra com internet primeiro**: Para cachear recursos
2. **Recarregue uma vez**: Ativa o Service Worker
3. **Teste**: Modo avião ou desconecte WiFi

### Dados sumindo

**NÃO faça**:
- ❌ Limpar dados do navegador/app
- ❌ Desinstalar sem backup
- ❌ Modo privado/anônimo

**Dados ficam em**: localStorage do navegador

## 🌐 Servir Localmente (Desenvolvimento)

### Python
```bash
cd /home/glayterra/Projetos/planer_hor
python3 -m http.server 8000
```
Acesse: http://localhost:8000

### Node.js (http-server)
```bash
npm install -g http-server
cd /home/glayterra/Projetos/planer_hor
http-server -p 8000
```

### VS Code (Live Server)
1. Instale extensão "Live Server"
2. Clique com botão direito em `index.html`
3. "Open with Live Server"

## 📦 Hospedar Online (Grátis)

### GitHub Pages
1. Crie repositório no GitHub
2. Faça upload dos arquivos
3. Settings → Pages → Deploy from main
4. URL: `https://seu-usuario.github.io/planer_hor`

### Netlify
1. Arraste a pasta no netlify.app/drop
2. Ou conecte com GitHub
3. URL automática gerada

### Vercel
1. `npm i -g vercel`
2. `vercel` na pasta do projeto
3. URL automática gerada

## 🎯 Uso Diário Recomendado

1. **Manhã**: Abra o app, veja atividades do dia
2. **Durante o dia**: Marque atividades concluídas
3. **Água**: Clique no 💧 sempre que beber
4. **Notificações**: Responda aos lembretes
5. **Fim de semana**: Veja relatório semanal 📊

## 💡 Dicas

- **Adicione à tela inicial**: Acesso mais rápido
- **Permita notificações**: Lembre de beber água
- **Use offline**: Funciona em qualquer lugar
- **Verifique relatório**: Acompanhe seu progresso
- **Não limpe dados**: Perderia histórico

---

**Pronto para usar!** 🎉

Qualquer dúvida, consulte `INSTRUCOES.md` para mais detalhes.
