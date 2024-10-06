import { signin, signup } from './request';
import { Credentials, IdentityError, IdentityResponse, IdentityToken } from './types';

export const addErrorMessage = (idErr: IdentityError): IdentityError => {
    if (!idErr) {
        return new IdentityError(
            500,
            "unknown",
            "unknown"
        )
    }

    console.log("idErr", idErr)

    if (idErr.code == 401 && idErr.reason == "InvalidCredentials") {
        idErr.message = "email and password did not match"
        return idErr;
    }

    return idErr;
}

export const signupWithEmailPassword = async (credentials: Credentials): Promise<IdentityResponse> => {
    return {
        error: await signup(credentials) ? null : new IdentityError(500, "UnknownError")
    }
}

export const signinWithEmailPassword = async (credentials: Credentials): Promise<IdentityResponse> => {
    const response = await signin(credentials);
    if (!response) {
        return {
            token: null,
            error: new IdentityError(500, "UnknownError", "unknown error"),
        }
    }
    if (response.error) {
        return {
            error: addErrorMessage(response.error),
        }
    }
    return response
}

export const shouldRefreshToken = (token: IdentityToken, refreshInterval: number): boolean => {
    if (!token) {
        return false
    }
    return token.expires - refreshInterval <= +new Date();
}