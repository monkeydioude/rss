import appConfig from "src/appConfig";
import { log } from "src/services/request/logchest";
import { Credentials, IdentityError, IdentityResponse, IdentityToken } from "./types";

export const signup = async (credentials: Credentials): Promise<boolean> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res = await fetch(`${appConfig.identityAPIURL}/v1/auth/signup`, {
            body: JSON.stringify(credentials),
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: ctrl.signal,
        });
        if (res.status > 200) {
            throw await res.text();
        }
        return true;
    } catch (err) {
        log(`Could not signup: ${err}`);
        console.error("Could not signup", err);
    } finally {
        clearTimeout(timeoutId);
    }
    return false;
}

function cookieParser(cookieString: string | null): Map<string, string> {
    const res = new Map<string, string>();
    if (!cookieString || cookieString === "")
        return res;
    cookieString.
        split(";")
        .map((cookie: string) => cookie.split("="))
        .forEach((cookie: string[]) => {
            res.set(decodeURIComponent(cookie[0].trim()), decodeURIComponent(cookie[1].trim().replaceAll("\"", "")));
        });
    return res;
}

export const getIdentityTokenFromHeaders = (headers: Headers): IdentityToken | null => {
    if (!headers.get("set-cookie")) {
        return null;
    }

    const cookies = cookieParser(headers.get("set-cookie"));
    const auth = cookies.get("Authorization");
    if (!auth) {
        return null
    }
    let maxAgeStr = cookies.get("Max-Age");
    let maxAge = 1800;
    if (maxAgeStr) {
        maxAge = Number.parseInt(maxAgeStr);
    }
    return {
        jwt: auth.replace("Bearer ", ""),
        expires: +new Date() + (maxAge * 1000),
    }
}

export const signin = async (credentials: Credentials): Promise<IdentityResponse | null> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res = await fetch(`${appConfig.identityAPIURL}/v1/auth/login`, {
            body: JSON.stringify(credentials),
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: ctrl.signal,
        });
        if (res.status > 200) {
            const err = await res.json()
            throw { code: res.status, reason: err.Message };
        }
        const token = getIdentityTokenFromHeaders(res.headers)
        if (!token) {
            throw "no Authorization header"
        }
        return { token };
    } catch (err) {
        log(`Could not signin: ${err}`);
        console.error("Could not signin", err);
    } finally {
        clearTimeout(timeoutId);
    }
    return null;
}

export const status = async (token: IdentityToken): Promise<IdentityResponse | null> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res = await fetch(`${appConfig.identityAPIURL}/v1/jwt/status`, {
            credentials: "include",
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': `Authorization=Bearer ${token?.jwt};`
            },
            signal: ctrl.signal,
        });
        if (res.status > 200) {
            const err = await res.json()
            throw { code: res.status, reason: err.Message };
        }
        const newToken = getIdentityTokenFromHeaders(res.headers)
        if (!token) {
            throw { code: 400, reason: "No Authorization header" };
        }
        return { token: newToken };
    } catch (err) {
        log(`Could not get jwt status: ${err}`);
        console.error("Could not get jwt status", err);
        if (typeof err === "object") {
            const idErr = err as IdentityError;
            if (idErr.reason == "TokenSchemaError") {
                return { token, error: idErr };
            }
            return { error: err as IdentityError };
        }
        return { error: new IdentityError(500, err as string) }
    } finally {
        clearTimeout(timeoutId);
    }
}

export const refresh = async (token: IdentityToken): Promise<IdentityResponse | null> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res = await fetch(`${appConfig.identityAPIURL}/v1/jwt/refresh`, {
            credentials: "include",
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': `Authorization=Bearer ${token?.jwt};`
            },
            signal: ctrl.signal,
        });
        if (res.status > 200) {
            const err = await res.json()
            throw { code: res.status, reason: err.Message };
        }
        const newToken = getIdentityTokenFromHeaders(res.headers)
        if (!token) {
            throw { code: 400, reason: "No Authorization header" };
        }
        return { token: newToken };
    } catch (err) {
        log(`Could not refresh jwt: ${err}`);
        console.error("Could not refresh jwt", err);
        if (typeof err === "object") {
            const idErr = err as IdentityError;
            if (idErr.reason == "TokenSchemaError") {
                return { token, error: idErr };
            }
            return { error: err as IdentityError }
        }
        return { error: new IdentityError(500, err as string) }
    } finally {
        clearTimeout(timeoutId);
    }
}