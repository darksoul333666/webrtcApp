import { GendersEsp, GendersIng } from '../config/Constants';

const lang = 'ESP';

export const TextEsp = text => {
  switch (text) {
    case TextEng.invalidCredentials:
      return 'Contraseña incorrecta.';
    case TextEng.isCredentialsFalse:
      return 'No ha ingresado su correo o contraseña.';
    case TextEng.userNotFound:
      return 'Este correo no está registrado en hoppi.';
    case TextEng.userNotFound2:
      return 'Usuario no encontrado, verifica tus credenciales.';
    case TextEng.signUpNotData:
      return '¡Ups! Debes llenar todos los campos para continuar.';
    case TextEng.tryLater:
      return '¡Ups! Ha ocurrido un problema. Vuleve a intentarlo más tarde.';
    case TextEng.mailRegistered:
      return 'Este correo ya está registrado.';
    case TextEng.usernameRegistered:
      return '¡Ups! Este nickname ya le pertenece a otro usuario.';
    case TextEng.emailNotVerified:
      return 'Antes de iniciar sesión, por favor verifica tu correo.';
    default:
      return '¡Ups! Ha ocurrido un problema. Vuleve a intentarlo más tarde.';
  }
};

const TextEng = {
  isCredentialsFalse: 'Please fill email and password!',
  invalidCredentials: 'Incorrect password, check your credentials',
  userNotFound: 'User not found',
  userNotFound2: 'User not founded, check your credentials',
  signUpNotData: 'Please fill all the fields to create a new user!',
  tryLater: 'The system cannot response, try later!',
  mailRegistered: 'Mail already registered!',
  usernameRegistered: 'Username already taken!',
  emailNotVerified: 'This account is not verified'
};

export const getGenderEsp = gender => {
  return GendersEsp[GendersIng.indexOf(gender)];
};

export const getGenderEng = gender => {
  return GendersIng[GendersEsp.indexOf(gender)];
};
