import React, { useEffect, useState, useMemo } from 'react';
import { usePosition } from '../context/positionContext';
import { useAssign } from '../context/AssignContext'; 
import { pdf } from '@react-pdf/renderer';                
import ActaAssignDocument from '../pdf/AssigActa';         
import { useNavigate } from 'react-router-dom';


export default function PositionPages() {
  const { positions, getPositions, loading, error } = usePosition();
  const { getAssignsByPosition } = useAssign(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfLoadingId, setPdfLoadingId] = useState(null); 
  const itemsPerPage = 50;
  const navigate = useNavigate();

  useEffect(() => {
    getPositions();
  }, [getPositions]);

  // Filtrado por ID o Nombre
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return positions;
    return positions.filter((pos) => {
      const matchesId = pos.id_pos?.toString().includes(term);
      const matchesName = pos.name?.toString().includes(term);
      return matchesId || matchesName;
    });
  }, [positions, searchTerm]);  

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Genera y descarga el PDF cuando se hace clic en “Generar Acta”
  const handleGenerarActa = async (pos) => {
    setPdfLoadingId(pos.id_pos);
    try {
      // 1) Obtener un array [ funcionario, ...traslados ]
      const resultArray = await getAssignsByPosition(pos.id_pos);

      // 2) Validar que sea un array y tenga al menos el objeto funcionario
      const result = await getAssignsByPosition(pos.id_pos);

      if (!result || typeof result !== 'object' || !Array.isArray(result.assigns)) {
        throw new Error(`getAssignsByPosition NO devolvió un objeto válido con assigns (recibido: ${JSON.stringify(result)})`);
      }

      const funcionarioInfo = result.funcionario;
      const fetchedAssigns = result.assigns;


      // 4) Validar que fetchedTransfers sea un array
      if (!Array.isArray(fetchedAssigns)) {
        throw new Error(
          `getAssignsByPosition NO devolvió un array de traslados (devolvió: ${JSON.stringify(
            fetchedAssigns
          )})`
        );
      }

      // 5) Construir la info del funcionario principal
      const positionInfo = {
        id_pos: funcionarioInfo.id_pos ?? '-',
        name:    funcionarioInfo.name   ?? '-',
        depen:   funcionarioInfo.id_depen ?? '-',
        position_status: funcionarioInfo?.id_status  ?? '-',
      };

      // 6) Preparar “entrega” (origen) usando los datos del funcionario
      const entrega = {
        name:    funcionarioInfo.name   ?? '-',
        id_pos: funcionarioInfo.id_pos ?? '-',
        position_status: funcionarioInfo?.id_status  ?? '-',
      };

      // 7) Preparar “recibe” (destino) a partir del último traslado, si existe
      let recibe = { name: '—', id_pos: '—', depen: '—', position_status: '—' };
      if (fetchedAssigns.length > 0) {
        const ultimo = fetchedAssigns[fetchedAssigns.length - 1];
        recibe = {
          name:            ultimo.position?.name ?? '-',
          id_pos:          ultimo.tag ?? '-',
          depen: funcionarioInfo.id_depen ?? '-',
          position_status: funcionarioInfo?.id_status ?? '-', // si quieres mostrar el estado actual
        };

      }

      // 8) Generar el PDF en memoria
      const pdfInstance = pdf(
        <ActaAssignDocument
          position={positionInfo}
          assigns={fetchedAssigns}
          actaNumber={`ACTA-${pos.id_pos}-${Date.now()}`}
          date={new Date().toLocaleDateString('es-CO')}
          entrega={entrega}
          recibe={recibe}
        />
      );

      // 9) Convertir a Blob y forzar la descarga
      const blob = await pdfInstance.toBlob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Acta_Asignación_${positionInfo.name}_${pos.id_pos}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Error al generar Acta para posición ${pos.id_pos}:`, err);
      console.error('Detalle de err.message:', err.message);
      console.error('Detalle de err.stack:', err.stack);
      alert(`Ocurrió un problema al generar el PDF: ${err.message}`);
    } finally {
      setPdfLoadingId(null);
    }
  };

  return (
    <div className="p-6 bg-[#F1F3F5]">
      {/* Encabezado y controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h1 className="text-2xl font-semibold text-[#2F7A4E]">
          Listado de Funcionarios
        </h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por Documento o Nombre"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-64 px-3 py-2 text-[#333333] bg-white border border-[#C8E2CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] placeholder:text-[#888888]"
          />
          <button
            onClick={() => navigate('/position/new')}
            className="px-4 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] transition-colors"
          >
            Agregar Funcionario
          </button>
        </div>
      </div>

      {/* Mensaje de error si lo hay */}
      {error && (
        <div className="mb-4 p-4 bg-[#FFE5E5] text-[#C53030] rounded-md text-sm">
          {error}
        </div>
      )}

      {/* ——— Wrapper de la tabla con scroll propio ——— */}
      <div className="overflow-x-auto bg-white rounded-lg border border-[#C8E2CB] shadow-sm">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-[#E0E0E0]">
            <thead className="bg-[#E9ECEC]">
              <tr>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
                  Documento
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
                  Nombre
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
                  Correo
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
                  Cargo
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
                  Estado
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
                  Información
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
                  Traslados
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
                  Acta
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-[#555555]">
                    Cargando...
                  </td>
                </tr>
              ) : searchTerm && filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-[#555555]">
                    No se encontró funcionario con Documento o nombre "
                    {searchTerm.trim()}".
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((pos) => (
                  <tr
                    key={pos.id_pos}
                    className="hover:bg-[#EDF5EE] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      {pos.id_pos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      {pos.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      {pos.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      {pos.cargo?.name_charge || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                     <p className='bg-[#41BC41] m-1 rounded-md text-center'> {pos.status?.name_status || '-'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      <button
                        onClick={() => navigate(`/position/${pos.id_pos}/info`)}
                        className="px-3 py-1 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] transition-colors"
                      >
                        Información
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      <button
                        onClick={() =>
                          navigate(`/assign/position/${pos.id_pos}`)
                        }
                        className="px-3 py-1 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] transition-colors"
                      >
                        Ver Traslados
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      <button
                        onClick={() => handleGenerarActa(pos)}
                        disabled={pdfLoadingId === pos.id_pos}
                        className={`px-3 py-1 text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] transition-colors ${
                          pdfLoadingId === pos.id_pos
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#2F7A4E] hover:bg-[#255F3D] text-white'
                        }`}
                      >
                        {pdfLoadingId === pos.id_pos ? 'Generando…' : 'Generar Acta'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-[#555555]">
                    No hay funcionarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación debajo de la tabla */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-[#2F7A4E] text-white'
                : 'bg-white text-[#2F7A4E] border border-[#C8E2CB]'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
