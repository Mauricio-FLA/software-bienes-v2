import axios from './axios';

export const CreateAssignRequest = (formData) => {
  return axios.post('/assign', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getAssignRequest = () => axios.get('/assign');
export const getAssignByIdRquest = (id) => axios.get(`/assign/${id}`);
export const getAssignByPosRequest = (id_pos) => axios.get(`/assign/position/${id_pos}`);
export const getSummaryAssignsRequest = () => axios.get('/assign/summary')
export const DevolutionAssignRequest = (id) => axios.delete(`assign/devolution/${id}`)