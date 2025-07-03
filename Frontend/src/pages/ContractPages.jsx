import React, { useEffect, useState, useMemo } from 'react';
import { useContract } from '../context/ContractContext';
import { FaEdit, FaSpinner, FaSearch, FaChevronLeft, FaChevronRight, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ContractPages() {
  const { contracts, getContracts, loading, error } = useContract();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 6;

  useEffect(() => {
    getContracts();
  }, [getContracts]);

  const filteredContracts = useMemo(() => {
    if (!contracts?.length) return [];
    const term = searchTerm.toLowerCase();
    return contracts.filter(c =>
      (c.id_contra?.toLowerCase().includes(term)) ||
      (c.provider?.toLowerCase().includes(term))
    );
  }, [contracts, searchTerm]);

  // Paginación
  const indexOfLast = currentPage * contractsPerPage;
  const indexOfFirst = indexOfLast - contractsPerPage;
  const currentContracts = filteredContracts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  const paginate = n => setCurrentPage(n);
  const handleEdit = id => navigate(`/contract/${id}/info`);

  return (
    <div className="flex flex-col h-screen p-4 bg-[#F1F3F5]">
      {/* Header y búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold text-[#2F7A4E]">Contratos Registrados</h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto relative">
          <input
            type="text"
            placeholder="N° Contrato o Proveedor..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-64 pl-10 pr-3 py-2 bg-white text-[#333333] border border-[#C8E2CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E]"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button
            onClick={() => navigate('/contracts/new')}
            className="px-4 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-sm font-medium rounded-md transition-colors"
          >
            Registrar Contrato
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      {/* Contenedor de contratos con scroll */}
      <div className="overflow-hidden bg-white rounded-lg border border-[#C8E2CB] shadow-sm flex-1 flex flex-col">
        <div className="overflow-y-auto p-4 flex-1 max-h-[60vh]">
          {loading && contracts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#2F7A4E] font-semibold">
              <FaSpinner className="animate-spin mr-2" /> Cargando contratos...
            </div>
          ) : filteredContracts.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No hay contratos que mostrar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentContracts.map(contract => (
                <div key={contract.id_contra} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 pt-12 relative">
                  <div className="absolute top-3 right-3 bg-[#E0F2F1] text-[#2F7A4E] text-xs font-semibold px-2.5 py-1 rounded-full">
                    {new Date(contract.date_contra).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                  <button
                    onClick={() => handleEdit(contract.id_contra)}
                    className="absolute top-3 left-3 p-1 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600"
                    title="Editar contrato"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-bold text-[#2F7A4E] mb-2">Contrato N° {contract.id_contra}</h3>
                  <p><strong>Valor:</strong> ${contract.price ? new Intl.NumberFormat('es-CO').format(contract.price) : 'N/A'}</p>
                  <p><strong>Proveedor:</strong> {contract.provider || 'N/A'}</p>
                  <p className="line-clamp-3"><strong>Detalles:</strong> {contract.details || 'Sin detalles'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paginación */}
        {filteredContracts.length > contractsPerPage && (
          <div className="py-2 bg-white border-t border-[#C8E2CB] flex justify-center items-center">
            <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-1 rounded-md text-sm font-medium mr-2">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium mx-1 transition-colors ${
                  page === currentPage ? 'bg-[#2F7A4E] text-white' : 'bg-white text-[#2F7A4E] border border-[#C8E2CB]'
                }`}
              >{page}</button>
            ))}
            <button onClick={nextPage} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md text-sm font-medium ml-2">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
