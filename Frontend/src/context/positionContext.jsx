import { createContext, useCallback, useContext, useState } from 'react';
import { createPositonRequest, getPositionById,  getAllPositionRequest, updatePositionRequest } from '../api/position';

const PositionContext = createContext();
export const usePosition = () => useContext(PositionContext);

export const PositionProvider = ({ children }) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null); 
  const [error, setError] = useState(null);

  const getPositions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllPositionRequest();
      setPositions(data);
    } catch (err) {
      console.error('Error al obtener posiciones:', err);
      setError('No se pudieron cargar las posiciones');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPosition = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data: newPosition } = await createPositonRequest(formData);
      setPositions((prev) => [...prev, newPosition]);
      return newPosition;
    } catch (err) {
      console.error('Error al crear posición:', err);
      setError('No se pudo crear la posición');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePosition = useCallback(
     async (id, formData) => {
    setLoadingUpdate(true);
    setErrorUpdate(null);
    try {

      const confirm = window.confirm(
        "¿Estás seguro de que deseas actualizar este Funcionario?"
      );
      if (!confirm) return;

      const { data: updatedPosition } = await updatePositionRequest(id, formData);
      return updatedPosition;

    } catch (error) {
      if(axios.isAxiosError(err) && err.message) {
        setErrorUpdate(err.response.data?.message || "No se pudo actualizar el Funcionario.");
        throw err.response;
      } else {
        setErrorUpdate(err.message || "Error al inesperado al actualizar el Funcionario.")
        throw err;
      }
    } finally {
      setLoadingUpdate(false);
    }}, []);

  const getPosition = useCallback(async (id) => {
    setError(null);
    try {
      const { data } = await getPositionById(id);
      return data;
    } catch (err) {

      console.error(`Error al obtener posición con ID ${id}:`, err.response?.data?.message || err.message);
      setError(err.response?.data?.message || `No se encontró la posición con ID ${id}`);
      throw err; 
    }
  }, []);

  return (
    <PositionContext.Provider
      value={{
        positions,
        loading,
        error,
        getPositions,
        createPosition,
        getPosition,
        updatePosition,
        updatePositionRequest, 
        setLoadingUpdate, 
        setErrorUpdate
      }}
    >
      {children}
    </PositionContext.Provider>
  );
};