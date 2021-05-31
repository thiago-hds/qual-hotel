module.exports = {
  usernameField: 'email',
  errorMessages: {
    MissingPasswordError: 'No password was given',
    AttemptTooSoonError: 'Conta bloqueada. Tente novamente mais tarde',
    TooManyAttemptsError:
      'Conta bloqueada devido à muitas tentativas de login sem sucesso',
    NoSaltValueStoredError: 'Erro ao autenticar',
    IncorrectPasswordError: 'E-mail ou senha incorretos',
    IncorrectUsernameError: 'E-mail ou senha incorretos',
    MissingUsernameError: 'Nenhum e-mail fornecido',
    UserExistsError: 'Usuário já registrado',
  },
};
