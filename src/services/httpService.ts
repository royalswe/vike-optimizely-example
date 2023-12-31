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
    const requestUrl = this.apiBaseUrl + path;

    const defaultRequestOptions: HttpServiceOptions = {
      headers: {
        'Camel-Case-Response': 'true',
        'Accept-Language': '',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: 'GET',
    };

    // Merge default options with options
    const requestOptions: HttpServiceOptions = {
      ...defaultRequestOptions,
      ...options,
      headers: {
        ...defaultRequestOptions.headers,
        ...options.headers,
      },
    };

    const response = await fetch(requestUrl, requestOptions);

    if (!response.ok) {
      throw new Error(
        `HTTP request failed with error code: ${response.status}`
      );
    }

    return response.json().catch(() => {
      return (response as unknown) as Promise<T>;
    }) as Promise<T>;
  }

  get<T>(path: string, options?: Record<string, any> | undefined): Promise<T> {
    return this.request<T>(path, { method: 'GET', ...options });
  }

  post<T>(path: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  delete<T>(path: string, options?: Record<string, any>): Promise<T> {
    return this.request<T>(path, {
      method: 'DELETE',
      ...options,
    });
  }
})();
