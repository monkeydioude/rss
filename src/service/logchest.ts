import appConfig from "../../appConfig";

export interface Log {
    msg: string;
    level: number;
}

export const sendError = async (msg: string) => {
    const ctrl = new AbortController();

    setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(appConfig.logchestAPIURL, {
        method: "POST",
        body: JSON.stringify({
            msg,
            level: 0,
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        signal: ctrl.signal,
    });
}