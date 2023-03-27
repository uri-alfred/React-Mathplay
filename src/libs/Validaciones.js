import { validarFormatEmail } from "./formatos";

export function validaInputEmail(email) {
    let error = {
        error: false,
        message: ''
    };
    if(email.trim() === "") {
        error = {error: true, message: 'El correo es requerido.'};
    } else if(!validarFormatEmail(email)) {
        error = {error: true, message: 'Formato de correo incorrecto.'};
    } else if(email.length > 32) {
        error = {error: true, message: 'El correo no debe ser mayor a 32 caracteres.'};
    }
    return error;
}

export function validaInputPass(password) {
    let error = {
        error: false,
        message: ''
    };
    if(password.trim() === "") {
        error = {error: true, message: 'La contraseña es requerido.'};
    } else if(password.length > 32) {
        error = {error: true, message: 'La contraseña no debe ser mayor a 32 caracteres.'};
    }
    return error;
}

export function validaInputUsername(username) {
    let error = {
        error: false,
        message: ''
    };
    if(username.trim() === "") {
        error = {error: true, message: 'El nombre de usuario es requerido.'};
    } else if(username.length > 32) {
        error = {error: true, message: 'El nombre de usuario no debe ser mayor a 32 caracteres.'};
    }
    return error;
}
