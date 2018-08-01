import axios from 'axios';
import Routing from './Routing';
import Constants from './Constants';

class Ajax {

    private axiosInstance = axios.create({
        baseURL: Constants.SERVER_URL
    });

    constructor() {
        this.axiosInstance.interceptors.response.use((resp) => {
            return resp;
        }, (error) => {
            if (!error.response) {
                return Promise.reject({
                    message: 'Unable to connect to ' + this.axiosInstance.defaults.baseURL
                });
            }
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