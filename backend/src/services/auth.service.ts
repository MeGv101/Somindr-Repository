import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import type { FastifyInstance } from "fastify";

import * as authRepository from "../repositories/auth.repository.js";

import {
    sendVerificationEmail,
    sendPasswordResetEmail,
} from "./mail.service.js";

import {
    verifyToken,
    consumeToken,
} from "../repositories/auth.repository.js";

export async function login(
    fastify: FastifyInstance,
    body: {
        email: string;
        password: string;
    }
) {

    const usuario =
        await authRepository.findUserByEmail(
            body.email
        );

    if (!usuario) {
        throw new Error(
            "Credenciales inválidas"
        );
    }

    const validPassword =
        await bcrypt.compare(
            body.password,
            usuario.passwordHash
        );

    if (!validPassword) {
        throw new Error(
            "Credenciales inválidas"
        );
    }

    if (!usuario.emailVerified) {
        throw new Error(
            "EMAIL_NOT_VERIFIED"
        );
    }

    if (usuario.suspended) {
        throw new Error("USER_SUSPENDED");
    }

    const tokenId = uuidv4();

    await authRepository.createSession(
        usuario.id,
        tokenId
    );

    const token = fastify.jwt.sign({
        id: usuario.id,
        tokenId,
    });

    return {
        token,
        user: {
            id: usuario.id,
            username: usuario.username,
            email: usuario.email,
            nombre: usuario.nombre,
        },
    };
}

export async function register(body: {
    nombre: string;
    apellido: string;
    username: string;
    email: string;
    password: string;
    genero: string;
    fechaNacimiento: string;
    pesoKg: number;
    estaturaCm: number;
    nivelActividad: string;
}) {

    body.username = body.username.trim().toLowerCase();

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(body.email))
        throw new Error("Correo inválido");

    if (
        !body.nombre ||
        !body.apellido ||
        !body.username ||
        !body.email ||
        !body.password ||
        !body.genero ||
        !body.fechaNacimiento ||
        !body.pesoKg ||
        !body.estaturaCm ||
        !body.nivelActividad
    ) {
        throw new Error(
            "Todos los campos son obligatorios"
        );
    }

    if (
        body.pesoKg <= 20 ||
        body.pesoKg >= 450 ||
        body.estaturaCm <= 80 
    ) {
        throw new Error(
            "Datos físicos inválidos"
        );
    }

    if (body.password.length < 8)
        throw new Error(
            "La contraseña debe tener al menos 8 caracteres"
        );

    const existingEmail =
        await authRepository.findUserByEmail(
            body.email
        );

    if (existingEmail)
        throw new Error(
            "EMAIL_EXISTS"
        );

    const existingUsername =
        await authRepository.findUserByUsername(
            body.username
        );

    if (existingUsername)
        throw new Error(
            "USERNAME_EXISTS"
        );

    const passwordHash =
        await bcrypt.hash(
            body.password,
            10
        );

    const newUser =
        await authRepository.createUser({
            nombre: body.nombre,
            apellido: body.apellido,
            username: body.username,
            email: body.email,
            passwordHash,
            genero: body.genero,
            fechaNacimiento: body.fechaNacimiento,
            pesoKg: body.pesoKg,
            estaturaCm: body.estaturaCm,
            nivelActividad: body.nivelActividad,
        });

    await sendVerificationEmail({
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
    });

    return {
        message:
            "Usuario registrado. Revisa tu correo para verificar tu cuenta.",
    };
}

export async function logout(
    tokenId: string
) {

    await authRepository.deleteSession(
        tokenId
    );

    return {
        message:
            "Sesión cerrada",
    };

}

export async function verifyEmail(
    token: string
) {

    const authToken =
        await verifyToken(
            token,
            "VERIFY_EMAIL"
        );

    if (!authToken)
        throw new Error(
            "TOKEN_INVALID"
        );

    await authRepository.verifyUserEmail(
        authToken.userId
    );

    await consumeToken(
        authToken.id
    );

    return {
        message:
            "Correo verificado correctamente.",
    };
}

export async function resendVerification(
    email: string
) {

    const user =
        await authRepository.findUserByEmail(
            email
        );

    if (!user)
        throw new Error(
            "USER_NOT_FOUND"
        );

    if (user.emailVerified)
        throw new Error(
            "ALREADY_VERIFIED"
        );

    await sendVerificationEmail({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
    });

    return {
        message:
            "Correo reenviado.",
    };

}

export async function forgotPassword(
    email: string
) {

    const user =
        await authRepository.findUserByEmail(
            email
        );

    if (user) {

        await sendPasswordResetEmail({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
        });

    }

    return {
        message:
            "Si el correo existe, recibirás un enlace para restablecer la contraseña.",
    };

}

export async function resetPassword(
    body: {
        token: string;
        password: string;
    }
) {

    const authToken =
        await verifyToken(
            body.token,
            "RESET_PASSWORD"
        );

    if (!authToken)
        throw new Error(
            "TOKEN_INVALID"
        );

    const passwordHash =
        await bcrypt.hash(
            body.password,
            10
        );

    await authRepository.updatePassword(
        authToken.userId,
        passwordHash
    );

    await consumeToken(
        authToken.id
    );

    return {
        message:
            "Contraseña actualizada correctamente.",
    };

}

