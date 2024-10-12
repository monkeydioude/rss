import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import appConfig from "src/appConfig";
import toast from "src/services/toast";
import { TokenStorage } from "src/storages/custom/token_storage";
import { shouldRefreshToken, signinWithEmailPassword, signupWithEmailPassword } from "./client";
import { refresh, status } from "./request";
import { setToken, useDispatch, useIsAuthentified, useToken } from "./state";
import { IdentityToken } from "./types";

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const isAuth = useIsAuthentified();
    const intervalSeed = useRef<NodeJS.Timeout | null>(null);
    const token = useToken();

    const refreshToken = useCallback(async (forcedToken?: IdentityToken) => {
        const _token = forcedToken || token;
        if (!_token || !shouldRefreshToken(_token, appConfig.tokenRefreshInterval)) {
            return
        }
        const newToken = await refresh(_token);
        if (!newToken || !newToken.token) {
            dispatch(setToken(null));
            await TokenStorage.clear();
            return
        }

        if (newToken.error) {
            if (newToken.error.reason == "TokenExpiredError") {
                toast.err(appConfig.labels.en.SESSION_EXPIRED_1, appConfig.labels.en.SESSION_EXPIRED_2);
                dispatch(setToken(null));
                await TokenStorage.clear();
            }
            return;
        }
        await TokenStorage.update(newToken.token);
        dispatch(setToken(newToken.token));
    }, [token]);

    useEffect(() => {
        if (isAuth) {
            intervalSeed.current = setInterval(refreshToken, appConfig.tokenRefreshInterval);
        } else if (intervalSeed.current) {
            clearInterval(intervalSeed.current);
        }
        return () => {
            if (intervalSeed.current) {
                clearInterval(intervalSeed.current);
            }
        }
    }, [isAuth]);

    const signup = useCallback(async (email: string, password: string) => {
        try {
            setLoading(true);
            const { error } = await signupWithEmailPassword({
                login: email,
                password,
            });

            if (error) {
                throw error.getMessage();
            }
            toast.ok(appConfig.labels.en.SIGN_UP_SUCCESS_1, appConfig.labels.en.SIGN_UP_SUCCESS_2);
        } catch (err) {
            toast.err(appConfig.labels.en.SIGN_UP_ERR_1, "" + err);
        } finally {
            setLoading(false);
        }
    }, []);

    const signin = useCallback(async (email: string, password: string) => {
        try {
            setLoading(true);
            const { token, error } = await signinWithEmailPassword({
                login: email,
                password,
            });
            if (error) {
                throw error.getReason();
            }
            if (!token) {
                throw "error retrieving token";
            }
            await TokenStorage.update(token);
            dispatch(setToken(token));
            toast.ok(appConfig.labels.en.LOG_IN_SUCCESS_1);
            router.replace("/");
        } catch (err) {
            console.error(err)
            toast.err(appConfig.labels.en.LOG_IN_ERR_1, err as string);
        } finally {
            setLoading(false);
        }
    }, []);

    const signout = useCallback(async () => {
        await TokenStorage.clear();
        dispatch(setToken(null));
    }, []);

    const initSignin = useCallback(async () => {
        let _token = await TokenStorage.retrieve();
        if (!_token) {
            return;
        }
        const test = await status(_token);
        if (test?.error && test.error.code === 401) {
            const newToken = await refresh(_token);
            if (!newToken || newToken.error || !newToken.token) {
                dispatch(setToken(null));
                await TokenStorage.clear();
                return
            }
            _token = newToken.token;
            await TokenStorage.update(_token);
            dispatch(setToken(_token));
        } else if (shouldRefreshToken(_token, appConfig.tokenRefreshInterval)) {
            dispatch(setToken(_token));
            await refreshToken(_token);
        }
    }, []);

    return {
        loading,
        signup,
        signin,
        signout,
        initSignin,
    }
}

export default useAuth;