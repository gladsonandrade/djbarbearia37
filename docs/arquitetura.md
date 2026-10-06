# Arquitetura inicial

## Escolha da base

JavaScript com módulos ES, Node.js 24 e SQLite local. Uma aplicação com um processo e um banco para o único profissional. A estrutura inicial usa módulos nativos para ficar executável sem instalação de pacotes externos; framework de interface pode ser adicionado na etapa visual.

O adaptador `node:sqlite` é experimental na linha 24. Evitar dependência de detalhes desse adaptador nos módulos de negócio; avaliar estabilidade/alternativa antes de produção. Os testes atuais são locais, não medição de capacidade da Raspberry.

## Responsabilidades

- HTTP: autenticar/autorizar, validar entrada, responder e limitar solicitações.
- Serviço de agenda (a implementar): calcular slots de catálogo ativo + janelas + pausas + bloqueios + reservas + deslocamento; converter entre fuso local e UTC; antecedência e expiração em expediente.
- Domínio: regras de intervalos, limite de horário, grupos da agenda.
- Repositório: transações e persistência; não confiar nos horários/duração recebidos do navegador.
- Integrações: montar link WhatsApp; exportar PDF/ICS; nenhum envio automático nem pagamento na V1.

## Concorrência e expiração

O bloqueio deve ser criado com verificação e escrita dentro de `BEGIN IMMEDIATE`. Não basta consultar disponibilidade antes e salvar depois. O repositório interno já serializa essas ações e verifica blocos e ambas as modalidades.

Disponibilidade deve ignorar pendentes vencidos usando o relógio do servidor, mesmo que um job não tenha rodado. Uma tarefa de manutenção poderá registrar a expiração; a listagem não deve depender só dela. Aceitar pedido vencido exige nova verificação atômica; nunca trocar o status sem checar conflitos.

O prazo simples de 60 minutos já existe no repositório como infraestrutura. O comportamento por expediente precisa ser implementado no serviço antes de expor reservas na internet.

## Dados e acesso

Valores monetários em centavos; instantes em epoch ms UTC; expediente como dia da semana/minutos no fuso America/Fortaleza. A lista pública recebe apenas slots e catálogo, nunca dados dos clientes. Snapshot de nome/preço/duração preserva histórico após editar serviço.

Antes de habilitar painel: senha com hash apropriado, sessões persistentes com cookie HttpOnly/SameSite/Secure, proteção CSRF, tentativas limitadas e autorização em toda rota. Antes de habilitar reserva: validação, limites de tamanho, proteção contra spam/abuso, token privado de acompanhamento armazenado por hash, idempotência e cancelamento autorizado. Nunca usar senha fixa no frontend.

## Portabilidade

Código, configuração e dados separados. Backup SQLite consistente com API de backup, incluindo as escritas em WAL; cópia para outro equipamento. Exportar também fotos/uploads quando existirem. Testar restauração. SQLite exige disco local e um servidor de escrita; para múltiplas instâncias, reavaliar banco e concorrência.

Documentação consultada: https://nodejs.org/docs/latest-v24.x/api/sqlite.html e https://nodejs.org/docs/latest-v24.x/api/test.html .
