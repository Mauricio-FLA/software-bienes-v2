import { createContext, useContext, useState } from "react";
import { createPracticeRequest, getAllPracticesRequest, getPracticeRequest, updatePracticeRequest } from "../api/practice";
import { useCallback } from "react";

const PractiContext = createContext();

export const usePractice = () => useContext(PractiContext);

export const PractiProvider = ({ children }) => {
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPractices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllPracticesRequest();
      setPractices(data);
    } catch (err) {
      console.error('Error al obtener Practicantes:', err);
      setError('No se pudieron cargar los ítems');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPractice = async (formData) => {
    const res = await createPracticeRequest(formData);
    return res.data;
  };

  const getPractice = useCallback(async (id) => {
    setError(null);
    try {
      const { data } = await getPracticeRequest(id);
      return data;
    } catch (err) {
      console.error(`Error al obtener el aprendiz con ID ${id}:`, err);
      setError(`No se encontró el aprendiz con ID ${id}`);
    }
  }, []);

  const updatePractice = async (id, practice) => {
    try {
      const confirm = window.confirm(
        "¿Estás seguro de que deseas actualizar este practicante?"
      );
      if (!confirm) return;

      const res = await updatePracticeRequest(id, practice);
      setPractices((prevPractices) =>
        prevPractices.map((p) => (p._id === id ? res.data : p))
      );
    } catch (error) {
      console.error("Error al actualizar el Practicante", error);
    }
  };

  return (
    <PractiContext.Provider value={{ createPractice, getPractices, getPractice, updatePractice, practices, loading, error }}>
      {children}
    </PractiContext.Provider>
  );
};