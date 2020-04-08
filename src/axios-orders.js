import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://my-burger-app-7bdc8.firebaseio.com'
});

export default instance;