# Escopo acordado — primeira versão

Consolidado em 02/10/2026. Em caso de conflito, prevalecem as decisões mais recentes do usuário.

## Cliente

- Site responsivo com apresentação, serviços, preços, fotos, Instagram e contato.
- Escolha de serviço(s), modalidade, dia e horário. Sem conta de cliente.
- Barbearia e domicílio compartilham uma única agenda do Dalvan.
- Domicílio aos domingos em Malhador/Alecrim. Pedir região no site; endereço e taxa combinados pelo WhatsApp.
- A lista consulta disponibilidade atualizada; o servidor revalida tudo ao reservar.
- Confirmar a solicitação cria bloqueio temporário e abre WhatsApp com mensagem preenchida e identificação do pedido. O cliente ainda toca em Enviar.
- Reserva pendente sugerida de 1h, configurável para 2h. Expiração libera o horário. Política fora do expediente ainda deve ser fechada antes da rota pública.
- Link privado de acompanhamento/cancelamento a implementar com token não adivinhável; um telefone ou ID público não autentica o cliente.
- Pagamento e confirmação comercial diretamente com Dalvan. Sem integração Mercado Pago na V1.

## Painel pelo celular

- Login somente para administrador. Tela simples: Hoje, Dia, Semana, Pendentes e Novo agendamento.
- Mostrar cliente, serviço, início/fim, modalidade, região/endereço e contato.
- Aceitar/recusar pedido; criar agendamentos manuais; remarcar/cancelar; bloquear e liberar períodos.
- Configurar serviços, preços, duração, disponibilidade e portfólio em área separada da agenda.
- Ao terminar o horário previsto, confirmado sai de A atender e vai para Horário encerrado. Não marcar como atendido sozinho.
- Dalvan registra atendido, não veio ou correção. Manter histórico.
- Exportar PDF e ICS do período selecionado, somente confirmados ainda a atender. Importação ICS não é sincronização automática com Google Agenda.

## Tempo e conflitos

- Expediente geral informado: terça a domingo, 08h–20h; distribuição exata por modalidade ainda pendente.
- Novos horários precisam terminar até 20h. Não oferecer início às 20h.
- Ajuste de atraso pode estender o término até 20h10; a tolerância não aumenta os horários públicos.
- Duração é somada para múltiplos serviços; combos poderão ter duração própria se cadastrados assim.
- Preservar 10 minutos entre clientes; não exigir esse intervalo depois do último atendimento.
- Considerar deslocamento (20 minutos foram informados como referência, variáveis por distância). Confirmar se por trajeto ou total.
- Ajuste coletivo de atraso: mostrar prévia, aproveitar folgas extras sem consumir intervalo obrigatório, respeitar blocos/deslocamento/limite e aplicar em uma transação. Revalidar pendentes e confirmados.
- Aviso de mudança aos clientes pelo botão de WhatsApp; não prometer envio automático.

## Comunicação

WhatsApp automático somente se comprovadamente sem custo e compatível com a conta. Não é requisito de lançamento. Por padrão da V1: atualização no sistema e mensagem manual de Dalvan. Não automatizar WhatsApp Web como substituto da API.

## Informações faltantes antes do lançamento

- Nome visual definitivo, logo, fotos autorizadas, cores, telefone comercial, endereço fixo.
- Preço e duração exatos por serviço/variante e combos. Faixas do questionário são referências, não valores finais.
- Janelas da barbearia e domicílio por dia, pausas e área de atendimento.
- Antecedência mínima e limite de datas futuras; prazo de aprovação fora do expediente.
- Fluxo de cancelamento (questionário indica até 2h antes) e recuperação do link privado.
- Modelo da Raspberry confirmado fisicamente, sistema 64-bit, armazenamento, conexão e funcionamento contínuo.

Referência de hardware recuperada em conversa anterior: Raspberry Pi 3 Model B v1.2, 1GB. Confirmar antes da instalação. Hospedagem paga poderá substituir a Raspberry futuramente.
