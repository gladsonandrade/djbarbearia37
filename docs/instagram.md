# Instagram e galeria

## Estado atual

A landing page tem um link para o perfil impresso no logo: `dj_barbearia37`. O questionário informa `djbarbearia37`; confirmar qual é o perfil atual. Nenhuma conta foi conectada e nenhuma foto foi importada.

## Caminhos

- Galeria manual: receber arquivos selecionados por Dalvan e publicá-los com autorização de uso.
- Galeria automática: usar Instagram API with Instagram Login, voltada a contas profissionais (Empresa ou Criador), com autorização da conta de Dalvan. Essa modalidade não exige uma Página do Facebook vinculada.

Para a integração automática, confirmar perfil e tipo de conta; configurar app Meta, permissões necessárias e acesso de produção aplicável; conectar a conta. Manter tokens somente no servidor, fora do Git e do JavaScript público. Implementar cache com atualização controlada, renovação de token e tratamento de expiração/indisponibilidade. A galeria não deve bloquear a agenda se o Instagram estiver indisponível.

Não há integração automática habilitada nesta entrega. Não solicitar senha por chat nem expor tokens ao navegador.

## Referências

- [Documentação oficial mantida pela Meta no Postman](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/)

Consulta em 06/10/2026.
