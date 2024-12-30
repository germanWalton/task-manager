export class RegisterUserDTO {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class LoginUserDTO {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class AuthResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
  };

  constructor(token: string, id: string, email: string) {
    this.token = token;
    this.user = { id, email };
  }
}
