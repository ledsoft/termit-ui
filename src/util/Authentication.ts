import Constants from './Constants';

export default class Authentication {

    public static saveToken(jwt: string): void {
        localStorage.setItem(Constants.STORAGE_JWT_KEY, jwt);
    }

    public static loadToken(): string {
        const jwt = localStorage.getItem(Constants.STORAGE_JWT_KEY);
        return jwt != null ? jwt : '';
    }

    public static clearToken(): void {
        localStorage.removeItem(Constants.STORAGE_JWT_KEY);
    }
}