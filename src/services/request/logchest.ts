import appConfig from "src/appConfig";

export interface Log {
    msg: string;
    level: number;
}

export const log = async (msg: string): Promise<Response> => {
    const ctrl = new AbortController();

    setTimeout(() => ctrl.abort(), 20000);
    return await fetch(appConfig.logchestAPIURL + "/log", {
        method: "POST",
        body: JSON.stringify({
            msg,
            date: +new Date(),
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        signal: ctrl.signal,
    });
}

export const log_any = async (err: any): Promise<Response> => {
    return await log(err.toString());
}