# Hospedagem futura na Raspberry

Planejamento, não instalação executada. Confirmar Pi 3 Model B 1GB, OS 64-bit compatível com Node 24, espaço, fonte, rede e operação contínua.

Configuração prevista: processo da aplicação como usuário sem privilégios, gerenciado por systemd; dados em diretório persistente local; acesso público via HTTPS, Nginx/Cloudflare Tunnel conforme configuração futura. Não publicar o scaffold como agenda real.

Antes de produção: login e proteção de rotas prontos, credenciais fora do Git, logs sem dados sensíveis, recuperação automática após reinício, atualização de segurança, backup externo e restauração testada. Banco e uploads não podem ser servidos pelo servidor web.

`npm run db:backup` gera cópia consistente do banco. Ainda faltam agendamento do backup, destino externo e política de retenção. A base se vincula a 127.0.0.1 por padrão.

Migração futura: parar escritas, gerar backup consistente, copiar dados/fotos, restaurar no servidor novo, configurar variáveis e conferir agenda antes de apontar o domínio. Não instalar nada na Raspberry sem ela estar acessível e identificada.
