import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import CONSTANTS from '@shared/constants';
import { globalHandlers } from '@shared/utils/errorHandler';
// import MockAdapter from 'axios-mock-adapter';

export type ApiClient = AxiosInstance;
const apiClient: AxiosInstance = axios.create({
	baseURL: CONSTANTS.BASE_URL,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

apiClient.interceptors.request.use(
	// @ts-ignore
	(config: AxiosRequestConfig) => {
		if (config.headers?.Authorization) return config;
		/*
	  const authToken = AuthStorage.getString('auth_token');
		if (authToken) {
			config.headers!.Authorization = `Bearer ${authToken}`;
		}
		*/
		return config;
	},
	(error: any) => {
		return Promise.reject(error);
	},
);

apiClient.interceptors.response.use(
	response => {
		return response;
	},
	(error: any) => {
		globalHandlers.responseErrorHandler(error)
	},
);

/*
const mock = new MockAdapter(server, { delayResponse: 1000 });

mock.onGet('/tester').reply(200, {
	users: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }],
})

mock.onAny().passThrough();
*/

export default apiClient;
