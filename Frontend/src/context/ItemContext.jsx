import { createContext, useCallback, useContext, useState } from 'react';
import { createItemRequest, deleteItemRequest, getAllItemsRequest, getItemRequestById, updateItemRequest } from '../api/item';

import axios from 'axios'; 

const ItemContext = createContext();
export const useItems = () => useContext(ItemContext);

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [loadingUpdate, setLoadingUpdate] = useState(false); 
  const [errorUpdate, setErrorUpdate] = useState(null); 


  const getItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllItemsRequest();
      setItems(data);
    } catch (err) {
      console.error('Error al obtener Items:', err);
      setError('No se pudieron cargar los ítems');
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const { data: newItem } = await createItemRequest(formData);
        setItems((prev) => [...prev, newItem]);
        return newItem;
      } catch (err) {
        console.error('Error al crear Item:', err);
        setError('No se pudo crear el ítem');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteItem = useCallback(async (id) => {
    try {
      const res = await deleteItemRequest(id);
      return res;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error al eliminar Activo (contexto):", error.response);
        setError(error.response.data?.message || 'Error al eliminar traslado.');
        throw error.response;
      } else {
        console.error("Error inesperado al eliminar (contexto):", error);
        setError(error.message || 'Error de conexión al eliminar traslado.');
        throw error;
      }
    }
  }, []);

  const updateItem = useCallback(
    async (id, formData) => {
      setLoadingUpdate(true);
      setErrorUpdate(null);
      try {
        const { data: updatedItem } = await updateItemRequest(id, formData); 
        return updatedItem;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setErrorUpdate(err.response.data?.message || 'No se pudo actualizar el Activo'); 
          throw err.response;
        } else {
          setErrorUpdate(err.message || 'Error inesperado al actualizar Activo');
          throw err;
        }
      } finally {
        setLoadingUpdate(false);
      }
    },[]);

  const getItem = useCallback(
    async (rawId) => {
      setError(null);
      const id = rawId?.toString().trim();
      if (!id) {
        setError('ID de ítem vacío');
        throw new Error('ID de ítem vacío');
      }

      try {
        const safeId = encodeURIComponent(id);
        const { data } = await getItemRequestById(safeId);
        return data;
      } catch (err) {

        console.error(`Error al obtener el ítem con ID ${id}:`, err.response?.data?.message || err.message);

        const message = err.response?.data?.message || 'Error al conectar con el servidor';
        setError(message); 

        throw err;
      }
    },
    [setError]
  );

  return (
    <ItemContext.Provider
      value={{
        items,
        loading,
        error,
        getItems,
        createItem,
        deleteItem,
        getItem,
        updateItem,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};