import axios from 'axios';
import Routing from './Routing';

class Ajax {

    private axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/termit/rest/'
    });

    constructor() {
        this.axiosInstance.interceptors.response.use((resp) => {
            return resp;
        }, (error) => {
            if (error.response.status === 401) {
                Routing.transitionToHome();
            }
            return Promise.reject(error);
        })
    }

    public fetchUser() {
        return this.axiosInstance.get("/users/current").then((resp) => resp.data);
    }
}

const instance = new Ajax();

export default instance;