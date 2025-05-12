import API_ROUTES from '@/config/apiRoutes';

// Cấu hình headers chuẩn cho các API call
const getDefaultHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

// Hàm xử lý lỗi API response
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    // Nếu server trả về lỗi định dạng JSON
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    } catch (e) {
      // Nếu không phải JSON hoặc có lỗi khác
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  return response;
};

// Fetch wrapper với xử lý lỗi và headers
export const fetchApi = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers = {
    ...getDefaultHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  await handleApiError(response);

  return response.json();
};

// GET request helper
export const get = <T>(url: string, options: RequestInit = {}): Promise<T> => {
  return fetchApi<T>(url, {
    method: 'GET',
    ...options,
  });
};

// POST request helper
export const post = <T>(url: string, data: any, options: RequestInit = {}): Promise<T> => {
  return fetchApi<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

// PUT request helper
export const put = <T>(url: string, data: any, options: RequestInit = {}): Promise<T> => {
  return fetchApi<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

// DELETE request helper
export const del = <T>(url: string, options: RequestInit = {}): Promise<T> => {
  return fetchApi<T>(url, {
    method: 'DELETE',
    ...options,
  });
};

// API Service object
const ApiService = {
  products: {
    getAll: () => get(API_ROUTES.PRODUCTS.LIST),
    getById: (id: string) => get(API_ROUTES.PRODUCTS.DETAIL(id)),
    create: (data: any) => post(API_ROUTES.PRODUCTS.CREATE, data),
  },
  orders: {
    getHistory: () => get(API_ROUTES.ORDERS.HISTORY),
    getById: (id: string) => get(API_ROUTES.ORDERS.DETAIL(id)),
    create: (data: any) => post(API_ROUTES.ORDERS.CREATE, data),
  },
  cart: {
    addItem: (data: any) => post(API_ROUTES.CART.ADD, data),
  },
  admin: {
    products: {
      getAll: () => get(API_ROUTES.ADMIN.PRODUCTS.LIST),
      getById: (id: string) => get(API_ROUTES.ADMIN.PRODUCTS.DETAIL(id)),
      update: (id: string, data: any) => put(API_ROUTES.ADMIN.PRODUCTS.UPDATE(id), data),
      delete: (id: string) => del(API_ROUTES.ADMIN.PRODUCTS.DELETE(id)),
    },
    orders: {
      getAll: () => get(API_ROUTES.ADMIN.ORDERS.LIST),
      getById: (id: string) => get(API_ROUTES.ADMIN.ORDERS.DETAIL(id)),
      update: (id: string, data: any) => put(API_ROUTES.ADMIN.ORDERS.UPDATE(id), data),
    },
    users: {
      getAll: () => get(API_ROUTES.ADMIN.USERS.LIST),
      getById: (id: string) => get(API_ROUTES.ADMIN.USERS.DETAIL(id)),
    },
    settings: {
      get: () => get(API_ROUTES.ADMIN.SETTINGS),
      update: (data: any) => put(API_ROUTES.ADMIN.SETTINGS, data),
    },
  },
};

export default ApiService; 