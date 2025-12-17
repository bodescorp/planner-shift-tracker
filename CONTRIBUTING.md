# Guia de Contribuição

## Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Padrões de Código

### JavaScript
- Use `const` e `let`, nunca `var`
- Funções descritivas e comentários em português
- Evite código duplicado
- Mantenha funções pequenas e focadas

### CSS
- Classes descritivas em inglês
- Mobile-first quando aplicável
- Evite !important
- Use variáveis CSS quando repetir valores

### HTML
- Semântico e acessível
- IDs únicos e descritivos
- Atributos aria quando necessário

## Estrutura de Commits

```
tipo: descrição curta

- Detalhe 1
- Detalhe 2
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

## Testes

Antes de submeter:
1. Teste no Chrome/Firefox/Safari
2. Teste em mobile (responsivo)
3. Verifique console sem erros
4. Teste funcionalidade offline (PWA)

## Issues

Ao reportar bugs, inclua:
- Navegador e versão
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots se aplicável
