interface HttpServiceOptions extends RequestInit {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: any;
  language?: string;
  params?: Record<string, any>;
  paramsSerializer?: (params: Record<string, any>) => string;
  withCredentials?: boolean;
}

export default new (class HttpService {
  get apiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE_URL;
  }

  async request<T>(path: string, options: HttpServiceOptions): Promise<T> {
    const fullPath = this.apiBaseUrl + path;

    const requestOptions: HttpServiceOptions = {
      withCredentials: true,
      headers: {
        'Api-Key': import.meta.env.VITE_EPISERVER_API_KEY,
        'Camel-Case-Response': 'true',
        'Accept-Language': options.language || '',
      },
      ...options,
    };

    // TODO: Do we need params?
    // const params = new URLSearchParams(requestOptions.params);
    // const queryString = params.toString();
    // const requestUrl = queryString ? `${fullPath}?${queryString}` : fullPath;
    const requestUrl = fullPath;

    const response = await fetch(requestUrl, requestOptions);

    if (!response.ok) {
      throw new Error(
        `HTTP request failed with error code: ${response.status}`
      );
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(path, { method: 'GET', params });
  }

  post<T>(path: string, data: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
      params,
    });
  }

  patch<T>(path: string, data: any): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  put<T>(path: string, data: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
      params,
    });
  }

  delete<T>(
    path: string,
    params?: Record<string, any>,
    paramsSerializer?: (params: Record<string, any>) => string
  ): Promise<T> {
    return this.request<T>(path, {
      method: 'DELETE',
      params,
      paramsSerializer,
    });
  }
})();

// import Axios, { type AxiosInstance } from 'axios';

// export default new (class HttpService {
//   constructor(basePath: string | undefined = undefined) {
//     this.axiosInstance = Axios.create({
//       withCredentials: true,
//       headers: {
//         'Api-Key': import.meta.env.VITE_EPISERVER_API_KEY,
//         'Camel-Case-Response': true,
//       },
//       baseURL: this.apiBaseUrl + (basePath ?? ''),
//     });

//     this.axiosInstance.interceptors.request.use(async (config) => {
//       return config;
//     });
//   }

//   private get apiBaseUrl(): string {
//     return import.meta.env.VITE_API_BASE_URL;
//   }

//   private axiosInstance: AxiosInstance;

//   get(url: string, params?: any): Promise<any> {
//     return this.axiosInstance.get(url, params);
//   }

//   post(url: string, data?: any, params?: any): Promise<any> {
//     return this.axiosInstance.post(url, data, params);
//   }

//   protected patch(url: string, data?: any): Promise<any> {
//     return this.axiosInstance.patch(url, data);
//   }

//   protected put(url: string, data: any, params?: any): Promise<any> {
//     return this.axiosInstance.put(url, data, params);
//   }

//   protected delete(
//     url: string,
//     params?: any,
//     paramsSerializer?: any
//   ): Promise<any> {
//     return this.axiosInstance.delete(url, {
//       params,
//       paramsSerializer,
//     });
//   }
// })();
