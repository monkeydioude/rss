export interface Error {
    getCode(): number;
    getReason(): string;
    getMessage(): string;
}