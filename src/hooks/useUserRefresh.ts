import { useCallback } from "react";
import { setUser, useDispatch } from "src/global_states/user";
import logger from "src/services/logger";
import { get_user } from "src/services/request/panya";

export const useUserRefresh = () => {
    const userDispatch = useDispatch();
    const userFullRefresh = useCallback(async () => {
        try {
            const usrRes = await get_user();
            const user = await usrRes[0]?.json();
            userDispatch(setUser(user));
        } catch (err) {
            logger.error("💀 could not update user user", err);
        }
    }, []);

    return {
        userFullRefresh,
    }
}