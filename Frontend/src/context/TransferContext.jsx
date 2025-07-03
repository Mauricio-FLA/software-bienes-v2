// TransferContext.js
import { createContext, useCallback, useContext, useState, useRef } from 'react';
import axios from '../api/axios';
import { AssingItemRequest, getAllTransferRequest, getsTransferRequest, getTransferRequesById, getAssingItemByPosition, deleteAssingRequest, 
  updateAssingRequest, getTransRequesByImg } from '../api/transfer';

const TransferContext = createContext();
export const useTransfer = () => useContext(TransferContext);

export const TransferProvider = ({ children }) => {
  const [loadingList, setLoadingList]     = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [errorList, setErrorList]       = useState(null);
  const [errorCreate, setErrorCreate]   = useState(null);
  const [errorUpdate, setErrorUpdate]   = useState(null);

  const [transfers, setTransfers] = useState([]);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail]     = useState(null);
  const [currentTransfer, setCurrentTransfer] = useState(null);

  const detailCache = useRef({});
  const pendingRequests = useRef({});

  const createAssign = useCallback(async (formData) => {
    setLoadingCreate(true);
    setErrorCreate(null);
    try {
      const { data: assignment } = await AssingItemRequest(formData);
      return assignment;
    } catch (err) {
      console.error('Error al asignar ítem:', err);
      setErrorCreate(err.response?.data?.message || 'No se pudo completar la asignación');
      throw err;
    } finally {
      setLoadingCreate(false);
    }
  }, []);

  const getAllTransfer = useCallback(async () => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const { data } = await getsTransferRequest();
      setTransfers(data);
    } catch (err) {
      console.error("Error al obtener registros:", err);
      setErrorList(err.response?.data?.message || 'No se pudieron cargar los registros.');
      throw err;
    } finally {
      setLoadingList(false);
    }
  }, []);

  const getTransfers = useCallback(async () => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const { data } = await getAllTransferRequest();
      const formatted = data.map(group => ({
        name: group.funcionario.name,
        email: group.funcionario.email,
        depen: group.funcionario.depen,
        totalTransfers: group.total_transfers,
        sampleId: group.sample.id_transfer,
        sampleDate: group.sample.fecha_traslado,
        sampleTag: group.sample.tag,
        sampleLocation: group.sample.location,
        sampleDetails: group.sample.details,
        itemName: group.sample.item.name,
        itemBrand: group.sample.item.brand,
        itemSerial: group.sample.item.serial,
        itemDescrip: group.sample.item.descrip,
      }));
      setTransfers(formatted);
    } catch (err) {
      console.error('Error al obtener transferencias agrupadas:', err);
      setErrorList(err.response?.data?.message || 'No se pudieron cargar las asignaciones');
      throw err;
    } finally {
      setLoadingList(false);
    }
  }, []);

  const getTransfersByPosition = useCallback(async (id_pos) => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const { data } = await getAssingItemByPosition(id_pos);
      setTransfers(data.transfers);
      return [data.funcionario, ...data.transfers];
    } catch (err) {
      console.error(`Error al obtener traslados de la posición ${id_pos}:`, err);
      setErrorList(err.response?.data?.message || 'No se pudieron cargar los traslados de la posición.');
      throw err;
    } finally {
      setLoadingList(false);
    }
  }, []);

  const deleteTransferRequest = useCallback(async (id) => {
    try {
      const res = await deleteAssingRequest(id);
      return res;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error al eliminar transferencia (contexto):", error.response);
        setErrorList(errorDetail.error.response.data?.message || 'Error al eliminar traslado.');
        throw error.response;
      } else {
        console.error("Error inesperado al eliminar (contexto):", error);
        setErrorList(error.message || 'Error de conexión al eliminar traslado.');
        throw error;
      }
    }
  }, []);


  const getTransfer = useCallback(async (id, options = { withImage: false }) => {
    const { withImage } = options;
    const cacheKey = withImage ? `conImg-${id}` : `sinImg-${id}`;

    if (pendingRequests.current[cacheKey]) {
      return pendingRequests.current[cacheKey];
    }

    setLoadingDetail(true);
    setErrorDetail(null);

    if (detailCache.current[cacheKey]) {
      const cached = detailCache.current[cacheKey];
      setCurrentTransfer(cached);
      setLoadingDetail(false);
      return cached;
    }

    const promise = (async () => {
      try {
        let response;
        if (withImage) {
          response = await getTransRequesByImg(id);
        } else {
          response = await getTransferRequesById(id);
        }

        detailCache.current[cacheKey] = response.data;
        setCurrentTransfer(response.data);
        return response.data;
      } catch (err) {
        console.error(`Error al obtener traslado ${id} (withImage=${withImage}):`, err);
        setErrorDetail(err.response?.data?.message || `No se encontró el traslado con ID ${id}`);
        throw err;
      } finally {
        setLoadingDetail(false);
        delete pendingRequests.current[cacheKey];
      }
    })();

    pendingRequests.current[cacheKey] = promise;
    return promise;
  }, []);

  const getTransferById = useCallback(
    (id) => getTransfer(id, { withImage: false }),
    [getTransfer]
  );

  const getTransferByIdImg = useCallback(
    (id) => getTransfer(id, { withImage: true }),
    [getTransfer]
  );

  const updateAssign = useCallback(async (id, formData) => {
    setLoadingUpdate(true);
    setErrorUpdate(null);
    try {
      const { data: updatedTransfer } = await updateAssingRequest(id, formData);
      return updatedTransfer;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setErrorUpdate(err.response.data?.message || 'No se pudo actualizar el traslado');
        throw err.response;
      } else {
        setErrorUpdate(err.message || 'Error inesperado al actualizar traslado');
        throw err;
      }
    } finally {
      setLoadingUpdate(false);
    }
  }, []);

  return (
    <TransferContext.Provider
      value={{
        transfers,
        getAllTransfer,
        getTransfers,
        getTransfersByPosition,
        createAssign,
        getTransferById,
        getTransferByIdImg,
        deleteTransferRequest,
        updateAssign,
        loadingList,
        errorList,
        loadingCreate,
        errorCreate,
        loadingDetail,
        errorDetail,
        loadingUpdate,
        errorUpdate,
        currentTransfer
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};