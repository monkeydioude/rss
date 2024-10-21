import { TokenStorage } from 'src/storages/custom/token_storage';
import { deactivate, signin, signup, updatePasswordRequest, updateUsernameRequest } from './request';
import { Credentials, IdentityError, IdentityResponse, IdentityToken } from './types';

export const addErrorMessage = (idErr: IdentityError): IdentityError => {
    if (!idErr) {
        return new IdentityError(
            500,
            "UnknownError",
            "unknown error"
        )
    }

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
    try {
        const response = await signin(credentials);
        if (!response) {
            throw new IdentityError(500, "UnknownError", "unknown error");
        }
        if (response.error) {
            return { error: addErrorMessage(response.error) };
        }
        return response
    } catch (err) {
        if (err instanceof IdentityError) {
            return { error: addErrorMessage(err) };
        }
        return { error: new IdentityError(500, "UnknownError", "" + err) }
    }
}

export const updateEmailAddr = async (email: string, password: string): Promise<IdentityError | null> => {
    try {
        let _token = await TokenStorage.retrieve();
        if (!_token) {
            throw new IdentityError(401, "InvalidCredentials", "missing Bearer jwt");
        }
        const [_, err] = await updateUsernameRequest(_token, {
            new_login: email,
            password,
        });
        return err;
    } catch (err) {
        if (err instanceof IdentityError) {
            return addErrorMessage(err);
        }
        return new IdentityError(500, "UnknownError", "" + err)
    }
}

export const updatePassword = async (old_password: string, new_password: string): Promise<IdentityError | null> => {
    try {
        let _token = await TokenStorage.retrieve();
        if (!_token) {
            throw new IdentityError(401, "InvalidCredentials", "missing Bearer jwt");
        }
        const [_, err] = await updatePasswordRequest(_token, {
            password: old_password,
            new_password,
        });
        return err;
    } catch (err) {
        if (err instanceof IdentityError) {
            return addErrorMessage(err);
        }
        return new IdentityError(500, "UnknownError", "" + err)
    }
}

export const shouldRefreshToken = (token: IdentityToken, refreshInterval: number): boolean => {
    if (!token) {
        return false
    }
    return token.expires - refreshInterval <= +new Date();
}

export const deactivateUser = async () => {
    try {
        let _token = await TokenStorage.retrieve();
        if (!_token) {
            throw new IdentityError(401, "InvalidCredentials", "missing Bearer jwt");
        }
        const [_, err] = await deactivate(_token);
        return err;
    } catch (err) {
        if (err instanceof IdentityError) {
            return addErrorMessage(err);
        }
        return new IdentityError(500, "UnknownError", "" + err)
    }
}