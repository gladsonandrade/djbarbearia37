# Módulos

`bookings/repository.js`: infraestrutura interna de reservas (implementada parcialmente).

Separar as próximas implementações em:
- `auth`: login/sessões/recuperação administrativa.
- `availability`: janelas, catálogo, deslocamento, slots e revalidação.
- `bookings`: serviço de solicitação/confirmação/expiração/cancelamento.
- `agenda`: visões por data, resultados e ajuste de atrasos.
- `catalog`: serviços, combos e preços.
- `portfolio`: fotos e informações públicas.
- `exports`: PDF e ICS.
- `whatsapp`: somente links com mensagem pré-preenchida na primeira versão.

Não criar rotas públicas diretamente sobre o repositório de reservas.
