import { createContext, useCallback, useContext, useState } from 'react';
import { CreateAssignRequest, DevolutionAssignRequest, getAssignByIdRquest, getAssignByPosRequest, getAssignRequest } from '../api/Assign';

const AssignContext = createContext();
export const useAssign = () => useContext(AssignContext);

export const AssignProvider = ({ children }) => {

  const [summaryData, setSummaryData]     = useState([]);
const [loadingSummary, setLoadingSummary] = useState(false);
const [errorSummary, setErrorSummary]     = useState(null);
  // Estado para lista general de asignaciones
  const [assigns, setAssigns] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorList, setErrorList] = useState(null);

  // Estado para detalle de asignación individual
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState(null);

  // Estado para creación de asignación
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errorCreate, setErrorCreate] = useState(null);

  // Estado para asignaciones por funcionario
  const [positionData, setPositionData] = useState({ funcionario: null, assigns: [] });
  const [loadingByPos, setLoadingByPos] = useState(false);
  const [errorByPos, setErrorByPos] = useState(null);

  // Obtener todas las asignaciones
  const getAssign = useCallback(async () => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const { data } = await getAssignRequest();
      setAssigns(data);
    } catch (err) {
      console.error('Error al obtener registros:', err);
      setErrorList('No se pudieron cargar los registros');
    } finally {
      setLoadingList(false);
    }
  }, []);

  // Crear una nueva asignación
  const createAssign = useCallback(async (formData) => {
    setLoadingCreate(true);
    setErrorCreate(null);
    try {
      const { data: assignment } = await CreateAssignRequest(formData);
      return assignment;
    } catch (err) {
      console.error('Error al asignar ítem:', err);
      setErrorCreate(err.response?.data?.message || 'No se pudo completar la asignación');
      throw err;
    } finally {
      setLoadingCreate(false);
    }
  }, []);

  // Obtener asignación por ID
  const getAssignById = useCallback(
    async (rawId) => {
      setLoadingDetail(true);
      setErrorDetail(null);
      const id = rawId?.toString().trim();
      if (!id) {
        setErrorDetail('ID de Asignación vacío');
        setLoadingDetail(false);
        throw new Error('ID de Asignación vacío');
      }

      try {
        const safeId = encodeURIComponent(id);
        const { data } = await getAssignByIdRquest(safeId);
        return data;
      } catch (err) {
        console.error(`Error al obtener el registro con ID ${id}:`, err);
        const message = err.response?.data?.message || 'Error al conectar con el servidor';
        setErrorDetail(message);
        throw err;
      } finally {
        setLoadingDetail(false);
      }
    },
    []
  );

  // Obtener asignaciones de un funcionario específico
const getAssignsByPosition = useCallback(
  async (rawPosId) => {
    setLoadingByPos(true);
    setErrorByPos(null);
    const posId = parseInt(rawPosId, 10);
    if (isNaN(posId)) {
      setErrorByPos('ID de funcionario inválido');
      setLoadingByPos(false);
      throw new Error('ID de funcionario inválido');
    }

    try {
      const { data } = await getAssignByPosRequest(posId);

      // Guardar en el estado global
      setPositionData({
        funcionario: data.funcionario,
        assigns: data.assigns
      });

      // ✅ RETORNAR datos para el componente
      return {
        funcionario: data.funcionario,
        assigns: data.assigns
      };
    } catch (err) {
      console.error(`Error al obtener asignaciones para funcionario ${posId}:`, err);
      const message = err.response?.data?.message || 'Error al cargar asignaciones';
      setErrorByPos(message);
      throw err;
    } finally {
      setLoadingByPos(false);
    }
  },[]);

const AssignDevolution = useCallback(async (id) => {
  try {
    const res = await DevolutionAssignRequest(id);
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error al realizar la devolución (AssignContext): ", error.response)
      setErrorList(errorDetail.response.data?.message || "Error de conexión al realizar la devolución.")
      throw error.response;
    } else{
      console.error("Error inesperado al realizar la axios (AsssignContext): ", error)
      setErrorList(error.message || "Erro de conexión al realizar la acción")
      throw error;
    }
  }
}, [])


  return (
    <AssignContext.Provider
      value={{
        // Lista general
        assigns,
        loadingList,
        errorList,
        getAssign,
        // Detalle individual
        getAssignById,
        loadingDetail,
        errorDetail,
        // Creación
        createAssign,
        AssignDevolution,
        loadingCreate,
        errorCreate,
        // Asignaciones por funcionario
        positionData,
        loadingByPos,
        errorByPos,
        getAssignsByPosition,
        summaryData,
        loadingSummary,
        errorSummary
      }}
    >
      {children}
    </AssignContext.Provider>
  );
};