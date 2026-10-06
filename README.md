# DJ Barbearia 37

Site e sistema de agendamento para a DJ Barbearia 37, pensado para organizar os atendimentos do Dalvan na barbearia e em domicílio aos domingos em Malhador/Alecrim.

Projeto de portfólio de [Gladson Andrade](https://github.com/gladsonandrade), desenvolvido a partir de uma necessidade real: mostrar horários atualizados, evitar reservas simultâneas e facilitar a organização diária pelo celular.

**Status: landing page implementada; agenda em desenvolvimento.** A página apresenta serviços, valores de referência, modalidades e consulta pelo WhatsApp. A seleção de horários com reserva e o painel ainda serão construídos. A consulta atual não bloqueia horários.

## Experiência planejada

1. O cliente consulta serviços e horários disponíveis, sem criar conta.
2. Escolhe o atendimento e solicita uma reserva temporária.
3. Abre o WhatsApp com a mensagem preenchida e a envia para Dalvan.
4. Dalvan combina os detalhes e confirma ou recusa no painel.
5. A agenda compartilhada mantém os horários ocupados; solicitações expiradas liberam a vaga.

O painel terá visões por dia e semana, registro de atendimentos e faltas, ajustes de atraso e exportação da agenda confirmada em PDF e ICS para importação no Google Agenda.

## Tecnologias e decisões

- **Node.js 24 e JavaScript:** servidor HTTP, regras de negócio e testes com recursos nativos.
- **SQLite:** persistência local com migrações, transações e backup consistente.
- **HTML, CSS e JavaScript:** landing page responsiva com logo, serviços e montagem da mensagem de consulta.
- **GitHub Actions:** verificação de sintaxe e execução automatizada dos testes.

A arquitetura separa interface, regras de agenda e persistência. A proposta é começar com hospedagem em Raspberry Pi e permitir migração futura para hospedagem paga; a instalação no dispositivo ainda precisa ser validada.

## Visualizar no GitHub Pages

Publicação estática preparada para `https://gladsonandrade.github.io/djbarbearia37/`. A primeira ativação precisa ser concluída em Settings → Pages, escolhendo GitHub Actions. Consulte o [passo a passo](deploy/github-pages.md). O endereço só fica disponível depois da publicação bem-sucedida.

O GitHub Pages exibe a landing page e o link do WhatsApp. A agenda, o banco e o painel dependem do servidor Node.js.

## Executar

Requer Node.js **24.x** e Git. Nesta base não há dependências externas de execução.

```sh
git clone https://github.com/gladsonandrade/djbarbearia37.git
cd djbarbearia37
npm ci
npm run db:migrate
npm run dev
```

Abra http://127.0.0.1:3000. O arquivo `.env` é opcional: copie `.env.example` para `.env` para configurar caminhos e porta. No PowerShell: `Copy-Item .env.example .env`.

```sh
npm run check
npm test
npm run db:backup
```

O Node pode emitir aviso de API experimental para `node:sqlite`. O acesso ao banco está isolado para permitir troca do adaptador depois. Use o banco em disco local; não em pasta de rede/sincronização.

## Estrutura

| Pasta | Responsabilidade |
|---|---|
| `web/public` | Landing page, estilos, logo e consulta pelo WhatsApp |
| `web/admin` | Especificação da interface administrativa |
| `src/server` | Servidor HTTP e rotas |
| `src/domain` | Regras puras de agenda, horários e estados |
| `src/db` | SQLite e migrações versionadas |
| `src/modules` | Módulos funcionais e limites de responsabilidade |
| `scripts` | Verificação, migração e backup |
| `tests` | Testes de regras, concorrência e servidor |
| `docs` | Escopo acordado, arquitetura, decisões pendentes e próximos passos |
| `deploy` | Orientações para a futura instalação na Raspberry |

## Já implementado nesta base

- Landing page com identidade visual, serviços, modalidades, FAQ e seleção de serviços para WhatsApp.
- Servidor local com recursos públicos permitidos explicitamente e `GET /api/health`.
- Banco inicial, migrações repetíveis e catálogo desativado até confirmar preços e durações.
- Regras de término às 20h, tolerância de atraso até 20h10 e separação entre atendimento futuro e encerrado.
- Repositório interno com criação atômica de bloqueio temporário, expiração e proteção de conflitos entre modalidades.
- Backup consistente do SQLite; testes e workflow de CI.

## Ainda não implementado

Login, painel, geração completa de disponibilidade, reservas pelo navegador, link privado, WhatsApp associado à reserva, gestão de serviços/fotos, remarcação e ajuste coletivo de atrasos, exportação PDF/ICS e instalação de produção.

A rotina interna de reserva já testa conflitos, mas ainda exige a camada de validação de expediente, catálogo, antecedência e proteção contra abuso. **Nenhuma rota pública de gravação está habilitada.**

## Regras e decisões

Leia [escopo](docs/escopo.md), [arquitetura](docs/arquitetura.md) e [próximas etapas](docs/roadmap.md). Datas exibidas no fuso `America/Fortaleza`; instantes persistidos em UTC/epoch ms. Pagamento será combinado diretamente com Dalvan. Mercado Pago está fora da primeira versão.

## Desenvolvimento

As próximas entregas e os critérios do MVP estão em [roadmap](docs/roadmap.md). Preços, duração dos serviços e janelas de atendimento precisam ser confirmados antes de habilitar reservas públicas.

Não versionar `.env`, banco, backups, dados reais de clientes ou certificados. Não há licença de código aberto definida.

## Conteúdo da página

O logo é o arquivo fornecido pelo proprietário do projeto, preservado sem alterações. Os preços são referências do questionário respondido por Dalvan e aparecem como sujeitos à confirmação. A página usa o telefone e o Instagram impressos no logo; confirmar se continuam atuais antes de divulgar. Há divergência entre o Instagram do logo (`dj_barbearia37`) e o questionário (`djbarbearia37`).

A consulta pelo WhatsApp monta uma mensagem no navegador, sem enviar automaticamente, persistir nome ou criar reserva. O visitante precisa enviar a mensagem e combinar o atendimento. Não há fotos de clientes, depoimentos ou horários fictícios.

Veja [Instagram](docs/instagram.md) para a integração planejada.
