import React, { useEffect, useState, useMemo } from 'react';
import { useTransfer } from '../context/TransferContext';
import { useNavigate } from 'react-router-dom';

function TransferPages() {
  const {
    transfers,
    getTransfers: fetchSummaryTransfers,
    getAllTransfer: fetchAllTransfers,
    loadingList: loading,
    errorList: error
  } = useTransfer();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState('all'); 
  const itemsPerPage = 500;
  const navigate = useNavigate();

  // Load data when viewType changes
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm('');
    if (viewType === 'all') {
      fetchAllTransfers();
    } else {
      fetchSummaryTransfers();
    }
  }, [viewType, fetchAllTransfers, fetchSummaryTransfers]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return transfers;
    return transfers.filter(item => {
      const name = viewType === 'summary' ? item.name : item.funcionario_name;
      const tag = viewType === 'summary' ? item.sampleTag : item.tag;
      return (
        name?.toLowerCase().includes(term) ||
        tag?.toLowerCase().includes(term)
      );
    });
  }, [transfers, searchTerm, viewType]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="p-6 bg-[#F1F3F5]">
  {/* Encabezado y controles */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
    <h1 className="text-2xl font-semibold text-[#2F7A4E]">
      Listado de Traslados
    </h1>
    <div className="flex items-center space-x-2 w-full sm:w-auto">
      {/* Botones de vista */}
      <button
        onClick={() => { setViewType('all'); setCurrentPage(1); }}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] ${
            viewType === 'all'
              ? 'bg-[#2F7A4E] text-white'
              : 'bg-white text-[#2F7A4E] border border-[#C8E2CB]'
          }`}
      >
        Todos
      </button>
      <button
        onClick={() => { setViewType('summary'); setCurrentPage(1); }}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] ${
            viewType === 'summary'
              ? 'bg-[#2F7A4E] text-white'
              : 'bg-white text-[#2F7A4E] border border-[#C8E2CB]'
          }`}
      >
        Total por funcionario
      </button>

      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por Funcionario o Placa"
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full sm:w-64 px-3 py-2 text-[#333333] bg-white border border-[#C8E2CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] placeholder:text-[#888888]"
      />

      {/* Botón Generar Traslado */}
      <button
        onClick={() => navigate('/assing')}
        className="px-4 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] transition-colors"
      >
        Generar Traslado
      </button>
    </div>
  </div>

  {/* Mensaje de error */}
  {error && (
    <div className="mb-4 p-4 bg-[#FFE5E5] text-[#C53030] rounded-md text-sm">
      {error}
    </div>
  )}

  {/* Contenedor de la tabla con scroll horizontal y vertical propio */}
  <div className="overflow-x-auto overflow-y-auto max-h-96 bg-white rounded-lg border border-[#C8E2CB] shadow-sm custom-scrollbar">
    <table className="min-w-full divide-y divide-[#E0E0E0]">
      <thead className="bg-[#E9ECEC] sticky top-0 z-10">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
            Funcionario
          </th>
          {viewType === 'summary' && (
            <th className="px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
              Total Traslados
            </th>
          )}
          <th className="px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
            Placa
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
            Fecha
          </th>
          {viewType === 'all' && (
            <th className="px-6 py-3 text-center text-xs font-medium text-[#555555] uppercase tracking-wider">
              Información
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td
              colSpan={viewType === 'summary' ? 4 : 4}
              className="px-6 py-4 text-center text-[#555555]"
            >
              Cargando...
            </td>
          </tr>
        ) : searchTerm && filtered.length === 0 ? (
          <tr>
            <td
              colSpan={viewType === 'summary' ? 4 : 4}
              className="px-6 py-4 text-center text-[#555555]"
            >
              No se encontró traslado con término “{searchTerm.trim()}”.
            </td>
          </tr>
        ) : currentData.length > 0 ? (
          currentData.map((item, idx) => {
            const keyValue =
              viewType === 'summary'
                ? item.sampleId != null
                  ? `summary-${item.sampleId}`
                  : `summary-idx-${idx}`
                : item.id_transfer != null
                  ? `all-${item.id_transfer}`
                  : `all-idx-${idx}`;

            return (
              <tr
                key={keyValue}
                className="hover:bg-[#EDF5EE] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                  {viewType === 'summary' ? item.name : item.funcionario_name}
                </td>
                {viewType === 'summary' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                    {item.totalTransfers}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                  {viewType === 'summary' ? item.sampleTag : item.tag}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                  {new Date(
                    viewType === 'summary' ? item.sampleDate : item.fecha_traslado
                  ).toLocaleDateString()}
                </td>
                {viewType === 'all' && (
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() =>
                        navigate(`/transfers/${item.id_transfer}/info`)
                      }
                      className="px-3 py-1 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] transition-colors"
                    >
                      Información
                    </button>
                  </td>
                )}
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={viewType === 'summary' ? 4 : 4}
              className="px-6 py-4 text-center text-[#555555]"
            >
              No hay traslados registrados.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Paginación */}
  <div className="flex justify-center mt-4 space-x-2">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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

export default TransferPages;
