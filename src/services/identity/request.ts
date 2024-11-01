import appConfig from "src/appConfig";
import { log } from "src/services/request/logchest";
import { Credentials, EditUser, IdentityError, IdentityResponse, IdentityToken } from "./types";

export const signup = async (credentials: Credentials): Promise<[boolean, IdentityError | null]> => {
    const res = await new Request<Response>({ url: `${appConfig.identityAPIURL}/v1/auth/signup`, method: "POST" }).do(JSON.stringify(credentials));
    if (!res[0]) {
        return [false, res[1]];
    }
    return [res[0].status < 400, res[1]];
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
            const err = await res.json();
            throw new IdentityError(res.status, err.Message);
        }
        const token = getIdentityTokenFromHeaders(res.headers)
        if (!token) {
            throw "no Authorization header"
        }
        return { token };
    } catch (err) {
        log(`Could not signin: ${err}`);
        console.error("Could not signin", err);
        if (err instanceof IdentityError) {
            return {
                error: err,
            }
        }
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
            credentials: "omit",
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

export const refresh = async (token: IdentityToken): Promise<IdentityResponse> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res = await fetch(`${appConfig.identityAPIURL}/v1/jwt/refresh`, {
            credentials: "omit",
            // credentials: "include",
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
type FetchParams = {
    method: "PUT" | "POST" | "GET" | "DELETE" | "PATCH"
    url: string
}
type ResponseTransformer<T> = (res: Response) => T;
export function defaultResponTransformer(res: Response): Response { return res };

export class Request<T> {
    fetchParams: FetchParams;
    token: IdentityToken | null;
    transformer: ResponseTransformer<T> | ResponseTransformer<Response>;

    constructor(
        fetchParams: FetchParams,
        token?: IdentityToken,
        transformer?: ResponseTransformer<T> | null,
    ) {
        this.fetchParams = fetchParams;
        this.token = token || null;
        this.transformer = transformer || defaultResponTransformer;
    }

    private hydrateToken(fetchOptions: RequestInit) {
        if (!this.token) {
            return;
        }

        fetchOptions.headers = {
            ...fetchOptions.headers,
            'Cookie': `Authorization=Bearer ${this.token?.jwt};`,
        };
    }

    private async _request(payload?: any): Promise<[Response | null, IdentityError | null]> {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
        try {
            let fetchOptions: RequestInit = {
                credentials: "omit",
                method: this.fetchParams.method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cookie': `Authorization=Bearer ${this.token?.jwt};`,
                },
                signal: ctrl.signal,
            };
            // this.hydrateToken(fetchOptions);
            if (payload) {
                fetchOptions.body = JSON.stringify(payload);
            }
            console.log(fetchOptions);
            const res = await fetch(this.fetchParams.url, fetchOptions);

            if (res.status > 200) {
                const err = await res.json();
                throw new IdentityError(res.status, err.Message);
            }
            return [res, null];
        } catch (err) {
            log(`Could not request: ${err}`);
            console.error("Could not request", err);
            if (!(err instanceof IdentityError)) {
                const errErr = err as Error;
                return [null, new IdentityError(500, errErr.message)];
            }
            return [null, err];
        } finally {
            clearTimeout(timeoutId);
        }
    }
    async do(payload?: any): Promise<[T | Response | null, IdentityError | null]> {
        try {
            const [res, err] = await this._request(payload);
            if (err) {
                return [null, err];
            }
            if (!res) {
                return [null, new IdentityError(500, "NoResponse")];
            }
            return [this.transformer(res), null];
        } catch (err) {
            return [null, new IdentityError(500, err as string)]
        }
    }
}

export const updateUsernameRequest = async (token: IdentityToken, editUser: EditUser): Promise<[Response | null, IdentityError | null]> => {
    return new Request<Response>({ url: `${appConfig.identityAPIURL}/v1/user/login`, method: "PUT" }, token).do(editUser);
}

export const updatePasswordRequest = async (token: IdentityToken, editUser: EditUser): Promise<[Response | null, IdentityError | null]> => {
    return new Request<Response>({ url: `${appConfig.identityAPIURL}/v1/user/password`, method: "PUT" }, token).do(editUser);
}

export const deactivate = async (token: IdentityToken): Promise<[Response | null, IdentityError | null]> => {
    return await new Request<Response>({ url: `${appConfig.identityAPIURL}/v1/user/deactivate`, method: "DELETE" }, token).do();
}