import axios from 'axios';

const API_URL = 'https://ecommerce-oncle.onrender.com/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const getProducts = () => api.get('/products');
export const addProduct = (data) => api.post('/products', data);
export const recordSale = (data) => api.post('/sales', data);
export const getSales = () => api.get('/sales');