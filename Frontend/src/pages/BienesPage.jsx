import React, { useEffect, useState, useMemo } from 'react';
import { useItems } from '../context/ItemContext';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

function BienesPage() {
  const { items, getItems, loading, error } = useItems();
  const [buscarTag, setbuscarTag] = useState('');
  const [filtrarTipos, setfiltrarTipos] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 400;
  const navigate = useNavigate();

  useEffect(() => {
    getItems();
  }, [getItems]);

  const filtrado = useMemo(() => {
  const term = buscarTag.trim().toLowerCase();

  return items.filter(item => {
    // 1. filtro por tipo
    const verTipos =
      filtrarTipos === 'ALL' ||
      item.tag === filtrarTipos; 

    // 2. filtro por texto (si hay buscarTag)
    const buscare =
      term === '' ||
      item.tag.toLowerCase().includes(term) ||
      item.name_item.toLowerCase().includes(term);

    return verTipos && buscare;
  });
}, [items, filtrarTipos, buscarTag]);

  

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtrado.slice(start, start + itemsPerPage);
  }, [filtrado, currentPage]);

  const handlePageChange = page => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-[#F1F3F5]">
      {/* Header y búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold text-[#2F7A4E]">Listado de Bienes</h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            {['ALL','FLA','Gobernación'].map(type => (
              <button
                key={type}
                onClick={() => { setfiltrarTipos(type); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filtrarTipos === type
                    ? 'bg-[#2F7A4E] text-white'
                    : 'bg-white text-[#2F7A4E] border border-[#C8E2CB]'
                }`}
              >{type === 'ALL' ? 'Todos' : type}</button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar por placa o nombre"
            value={buscarTag}
            onChange={e => { setbuscarTag(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-48 px-3 py-2 bg-white text-[#333333] border border-[#C8E2CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E]"
          />
          <button
            onClick={() => navigate('/item/new')}
            className="px-4 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-sm font-medium rounded-md transition-colors"
          >Agregar Activos</button>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      {/* Contenido de la tabla con altura limitada */}
      <div className="overflow-hidden bg-white rounded-lg border border-[#C8E2CB] shadow-sm max-h-[60vh]">
        <div className="overflow-y-auto h-full">
          <table className="min-w-full divide-y divide-[#E0E0E0]">
            <thead className="bg-[#E9ECEC] sticky top-0">
              <tr>
                {['Placa','Nombre','Estado','Historial', 'Acciones'].map(head => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-medium text-[#555555] uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4}  className="px-6 py-4 text-center text-[#555555]"> <FaSpinner className="animate-spin mr-3 text-3xl" />Cargando...</td></tr>
              ) : currentData.length > 0 ? (
                currentData.map(item => (
                  <tr key={item.tag} className="hover:bg-[#F1F3F5] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">{item.tag}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">{item.name_item}</td>
                    <td>
                      <p  className='bg-[#41bc41] m-1 rounded-md text-center'>
                       {item.status?.name_status|| 'NO APLICA'}
                      </p>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/assign/${assign.id_assi}`)}
                        className="px-3 py-1 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-xs font-medium rounded-md transition-colors m-3"
                      >
                        Ver Historial
                      </button>
                    </td>
                    
                    <td>
                      <button
                        onClick={() => navigate(`/item/${item.tag}`)}
                        className="px-3 py-1 bg-[#094485] hover:bg-[#09458586] text-white text-xs font-medium rounded-md transition-colors m-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => navigate(`/item/${item.tag}`)}
                        className="px-3 py-1 bg-[#B51C1C] hover:bg-[#b51c1c85] text-white text-xs font-medium rounded-md transition-colors"
                      >
                        Eliminar
                      </button>
                      </td>
                    
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-[#555555]">El activo no existe.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación fija en el fondo */}
      <div className="mt-4 flex justify-center items-center py-2 bg-white border-t border-[#C8E2CB]">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-md text-sm font-medium mr-2">Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-md text-sm font-medium mx-1 transition-colors ${
              page === currentPage ? 'bg-[#2F7A4E] text-white' : 'bg-white text-[#2F7A4E] border border-[#C8E2CB]'
            }`}
          >{page}</button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md text-sm font-medium ml-2">Next</button>
      </div>
    </div>
  );
}

export default BienesPage;