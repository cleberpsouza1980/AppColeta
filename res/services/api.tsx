
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'apisauce';

const api = create({
    //baseURL: 'http://localhost:9000/Api',
    baseURL: 'http://172.16.200.82//APILufthml//Api/',    
    //baseURL: 'https://www.luftlogistics.com:8801//APILuft//Api/',    
    //baseURL: 'https://www.luftlogistics.com:8805//APILufthml//Api/',    
    headers: {
        Accept: 'application/json; charset=utf-8'
    },
    timeout: 30000,
});

api.addAsyncRequestTransform(request => async () => {
    const token = await AsyncStorage.getItem('@token');
    console.log('baseURL:' + api.getBaseURL() + request.url);

    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
    }
    else
        console.log("Não achou o token");
});

api.addResponseTransform(response => {
    console.log("addResponseTransform " + response.status);

    if (response.status == null) {
        return response.data = "999";
    }
    return response.status;
});

export default api;