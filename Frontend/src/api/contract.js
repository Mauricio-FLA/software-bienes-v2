import axios from './axios';

export const createContractRequest = (contract) => axios.post('/contract', contract);
export const updateContractRequest = (id, contract) => axios.put(`/contract/${id}`, contract)
export const getContractRequest = () => axios.get('/contract');
export const getContractRequestById = (id) => axios.get(`/contract/${id}`)