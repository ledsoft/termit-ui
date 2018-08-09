import Constants from './Constants';

export default class Authentication {

    public static saveJwt(jwt:string):void {
        localStorage.setItem(Constants.STORAGE_JWT_KEY, jwt);
    }

    public static loadJwt():string {
        const jwt = localStorage.getItem(Constants.STORAGE_JWT_KEY);
        return jwt != null ? jwt : '';
    }

    public static clearJwt():void {
        localStorage.removeItem(Constants.STORAGE_JWT_KEY);
    }
}