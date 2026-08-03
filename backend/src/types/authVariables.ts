export interface RegisterBody {

  nombre: string;

  apellido: string;

  username: string;

  email: string;

  password: string;

  genero: "MALE" | "FEMALE";

  fechaNacimiento: string;

  pesoKg: number;

  estaturaCm: number;

  nivelActividad:
    | "SEDENTARY"
    | "LIGHT"
    | "MODERATE"
    | "VERY_ACTIVE";

}

export interface LoginBody {

  email: string;

  password: string;

}

export interface VerifyEmailBody {

  token: string;

}

export interface ForgotPasswordBody {

  email: string;

}

export interface ResetPasswordBody {

  token: string;

  password: string;

}