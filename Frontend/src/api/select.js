import axios from './axios';

export const getAllChargeRequest = () => axios.get('/charge');
export const getAllDepenRequest = () => axios.get('/depen');
export const getAllSubRequest = () => axios.get('/sub');
export const getAllStatus = () => axios.get('/statusall');