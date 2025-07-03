// src/context/ContractContext.js
import React, { useCallback, useContext, createContext, useState } from "react";
import {
  createContractRequest,
  getContractRequest,
  getContractRequestById,
  updateContractRequest,
} from "../api/contract";

const ContractContext = createContext();
export const useContract = () => useContext(ContractContext);

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper: extrae un mensaje limpio de un AxiosError o similar
  const extractErrorMessage = err => {
    return (
      err.response?.data?.message ||
      (Array.isArray(err.response?.data?.errors) && err.response.data.errors[0]) ||
      err.message ||
      "Ocurrió un error inesperado."
    );
  };

  // Crear contrato
  const createContract = useCallback(async contractData => {
    setLoading(true);
    setError(null);
    try {
      const { data: newContract } = await createContractRequest(contractData);
      setContracts(prev => [...prev, newContract]);
      return newContract;
    } catch (err) {
      const msg = extractErrorMessage(err);
      console.error("Error al registrar el contrato:", msg);
      setError(msg);
      // Lanzamos un Error limpio para que el UI solo vea err.message
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar contrato
  const updateContract = useCallback(async (id, contractData) => {
    const confirmAction = window.confirm(
      "¿Estás seguro de que deseas actualizar este contrato?"
    );
    if (!confirmAction) return;

    setLoading(true);
    setError(null);
    try {
      const { data: updated } = await updateContractRequest(id, contractData);
      setContracts(prev => prev.map(c => (c._id === id ? updated : c)));
      return updated;
    } catch (err) {
      const msg = extractErrorMessage(err);
      console.error("Error al actualizar el contrato:", msg);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener todos
  const getContracts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getContractRequest();
      setContracts(data);
    } catch (err) {
      const msg = extractErrorMessage(err);
      console.error("Error al obtener los registros:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener por ID
  const getContractById = useCallback(async id => {
    setError(null);
    try {
      const { data } = await getContractRequestById(id);
      return data;
    } catch (err) {
      const msg = extractErrorMessage(err) || `No se encontró el contrato con ID ${id}`;
      console.error(`Error al obtener contrato con ID ${id}:`, msg);
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        loading,
        error,            
        getContracts,
        getContractById,
        createContract,
        updateContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
