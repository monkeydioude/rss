import appConfig from "src/appConfig";

export const isValidPassword = (passwd: string): boolean => {
    if (!passwd || passwd.length < appConfig.passwordMinSize) {
        return false;
    }
    return true
}

export const passwordsValidations = (passwd1: string, passwd2: string): [boolean, boolean] => {
    let p1 = false;
    let p2 = false;
    if (isValidPassword(passwd1)) {
        p1 = true;
    }
    if (isValidPassword(passwd2)) {
        p2 = true;
    }
    return [p1, p2];
}