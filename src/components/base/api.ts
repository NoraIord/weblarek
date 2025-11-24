import { ApiPostMethods, IApi } from '../../types';

export class Api implements IApi {
    readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T extends object>(uri: string): Promise<T> {
        const response = await fetch(this.baseUrl + uri);
        return response.json();
    }

    async post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        const response = await fetch(this.baseUrl + uri, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }
}