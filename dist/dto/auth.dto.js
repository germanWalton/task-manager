"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDTO = exports.LoginUserDTO = exports.RegisterUserDTO = void 0;
class RegisterUserDTO {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
exports.RegisterUserDTO = RegisterUserDTO;
class LoginUserDTO {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
exports.LoginUserDTO = LoginUserDTO;
class AuthResponseDTO {
    constructor(token, id, email) {
        this.token = token;
        this.user = { id, email };
    }
}
exports.AuthResponseDTO = AuthResponseDTO;
