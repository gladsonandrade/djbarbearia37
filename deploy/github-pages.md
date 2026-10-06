# Visualização com GitHub Pages

O workflow `Publicar site` publica somente `web/public`. O servidor Node.js, banco SQLite e painel não fazem parte dessa hospedagem estática. A consulta pelo WhatsApp funciona no navegador, sem criar uma reserva.

## Ativação inicial

1. Abra [Settings → Pages](https://github.com/gladsonandrade/djbarbearia37/settings/pages).
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Abra [Actions → Publicar site](https://github.com/gladsonandrade/djbarbearia37/actions/workflows/pages.yml) e execute **Run workflow** na branch `main`. Se uma execução anterior falhou antes da ativação, use **Re-run all jobs** nessa execução.
4. Aguarde a execução terminar com sucesso.

Endereço esperado depois da ativação e publicação:
https://gladsonandrade.github.io/djbarbearia37/

Alterações em `web/public` enviadas à `main` serão publicadas automaticamente. Não colocar dados de clientes, tokens ou arquivos de banco nessa pasta. Os caminhos dos recursos são relativos para funcionar tanto no subdiretório do Pages como no servidor Node.
