import axios from './axios';

export const createPracticeRequest = (practice) => axios.post('practice', practice); 
export const getAllPracticesRequest = () => axios.get('/practices')
export const getPracticeRequest = (id) => axios.get(`/practice/${id}`)
export const updatePracticeRequest = (id, practice) => axios.put(`/practice/${id}`, practice);