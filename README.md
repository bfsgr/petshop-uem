# Petshow

Um sistema de gerenciamento de Petshops

# Ferramentas

- PHP 8.2
- Laravel 10
- React 18

# Como executar

O jeito mais fácil de executar o projeto é usando o [docker](https://docs.docker.com/get-started/get-docker/). Depois de instalá-lo, basta executar o seguinte comando

```bash
docker compose up -d
```

Um usuário padrão será criado no sistema, com ele é possível realizar todas as tarefas de sistema.
```
email: admin@petshop.uem.br
senha: password
```

Ao cadastrar novos usuários, um email de redefinição de senha será enviado, esse email, por padrão, vai ser capturado pelo [MailHog](https://github.com/mailhog/MailHog), acessível pelo endereço http://localhost:8025. Para redefinir a senha do usuário usando o email capturado é importante que o usuário atual DESLOGUE do sistema.