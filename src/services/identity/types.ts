import { Error } from "src/errors/errors";

export type Credentials = {
    login: string;
    password: string;
}

export type EditUser = {
    new_login?: string;
    password: string;
    new_password?: string;
}

export type IdentityToken = {
    jwt: string;
    expires: number;
}

export class IdentityError implements Error {
    code: number;
    reason: string;
    message?: string;

    constructor(code: number, reason: string, message?: string) {
        this.reason = reason;
        this.message = message;
        this.code = code;
    }
    getCode(): number {
        return this.code;
    }
    getReason(): string {
        return this.reason
    }
    getMessage(): string {
        return this.message || this.getReason();
    }
}

export type IdentityResponse = {
    token?: IdentityToken | null;
    error?: IdentityError | null;
}

export type User = {
    login: string;
}