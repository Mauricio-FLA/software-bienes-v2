import axios from './axios';

export const createPositonRequest = (position) => axios.post('/posi', position);
export const getPositionById = (id) => axios(`/posi/${id}`);
export const getAllPositionRequest = () => axios.get('/posi');
export const updatePositionRequest = (id, position) => axios.put(`/posi/${id}`, position);
