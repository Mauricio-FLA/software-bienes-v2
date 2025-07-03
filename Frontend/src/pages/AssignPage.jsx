// src/pages/AssignPages.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useAssign } from '../context/AssignContext';
import { useNavigate } from 'react-router-dom';

export default function AssignPages() {
  const navigate = useNavigate();
  const { assigns, getAssign, loading, errorList } = useAssign();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 300;

  useEffect(() => {
    getAssign();
  }, [getAssign]);

  // Filtrado por funcionario o placa
  const filtered = useMemo(() => {
    return assigns.filter(a => {
      const funcName = a.position?.name ?? '';
      const plate = a.item?.tag ?? '';
      const term = search.trim().toLowerCase();
      return (
        funcName.toLowerCase().includes(term) ||
        plate.toLowerCase().includes(term)
      );
    });
  }, [assigns, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage]);

  const handlePageChange = page => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-[#F1F3F5]">
      {/* Header y búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold text-[#2F7A4E]">Listado de Asignaciones</h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por Funcionario o Placa"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-64 px-3 py-2 bg-white text-[#333] border border-[#C8E2CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] placeholder:text-[#888]"
          />
          <button
            onClick={() => navigate('/assign/new')}
            className="px-4 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-sm font-medium rounded-md transition-colors"
          >
            Asignar Activo
          </button>
        </div>
      </div>

      {errorList && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-sm">{errorList}</div>}

      {/* Tabla con scroll interno */}
      <div className="flex-1 overflow-hidden bg-white rounded-lg border border-[#C8E2CB] shadow-sm max-h-[60vh]">
        <div className="overflow-y-auto h-full">
          <table className="min-w-full divide-y divide-[#E0E0E0]">
            <thead className="bg-[#E9ECEC] sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#555] uppercase tracking-wider">FUNCIONARIO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#555] uppercase tracking-wider">PLACA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#555] uppercase tracking-wider">FECHA</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[#555] uppercase tracking-wider">INFORMACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-[#555]">Cargando...</td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map(assign => (
                  <tr key={assign.id_assi} className="hover:bg-[#F1F3F5] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333]">{assign.position?.name || 'NA'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333]">{assign.item?.tag || 'NA'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333]">{new Date(assign.date_assi).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => navigate(`/assign/${assign.id_assi}`)}
                        className="px-3 py-1 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-xs font-medium rounded-md transition-colors"
                      >
                        Información
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-[#555]">No hay registros</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación fija en el fondo */}
      <div className="mt-4 flex justify-center items-center py-2 bg-white border-t border-[#C8E2CB]">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md text-sm font-medium mr-2"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-md text-sm font-medium mx-1 transition-colors ${
              page === currentPage
                ? 'bg-[#2F7A4E] text-white'
                : 'bg-white text-[#2F7A4E] border border-[#C8E2CB]'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md text-sm font-medium ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
