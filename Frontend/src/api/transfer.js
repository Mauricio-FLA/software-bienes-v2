import axios from './axios';

export const AssingItemRequest = (formData) => {
  return axios.post('/transfer', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getsTransferRequest = () => axios.get('/transfers');
export const getAssingItemByPosition = (id_pos) => axios.get(`/positions/${id_pos}/transfers`);
export const deleteAssingRequest = (id) => axios.delete(`/transfer/${id}`);
export const updateAssingRequest = (id, transfer) => axios.put(`/transfer/${id}`, transfer);
export const getAllTransferRequest = () => axios.get('/transfer');
export const getTransferRequesById = (id) => axios.get(`/transfers/${id}`);
export const getTransRequesByImg = (id) => axios.get(`/transfers/${id}/info`);