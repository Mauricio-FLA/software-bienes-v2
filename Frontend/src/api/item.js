import axios from './axios';

export const createItemRequest = (formData) => {
  return axios.post('/item', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getItemRequestById = (id) => axios.get(`/item/${id}`)
export const getAllItemsRequest = () => axios.get('/items');
export const deleteItemRequest = (id) => axios.delete(`/item/${id}`);
export const updateItemRequest = (id, item) => axios.put(`/item/${id}`, item);