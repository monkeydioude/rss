import appConfig from "../../appConfig";

export interface Log {
    msg: string;
    level: number;
}

export const log = async (msg: string): Promise<Response> => {
    const ctrl = new AbortController();

    setTimeout(() => ctrl.abort(), 20000);
    return fetch(appConfig.logchestAPIURL, {
        method: "POST",
        body: JSON.stringify({
            msg,
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        signal: ctrl.signal,
    });
}