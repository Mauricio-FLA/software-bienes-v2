import React, { useState, useEffect } from 'react';
import {
  AiOutlineIdcard,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineSolution
} from 'react-icons/ai';
import { useAssign } from '../context/AssignContext';

const ConsultarActivos = () => {
  const [positionIdInput, setPositionIdInput] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [currentSearchId, setCurrentSearchId] = useState(null);
  const [positionData, setPositionData] = useState({ funcionario: null, assigns: [] });

  const {
    getAssignsByPosition,
    loadingByPos,
    errorByPos
  } = useAssign();

  useEffect(() => {
    if (currentSearchId === null) return;
    let mounted = true;

    getAssignsByPosition(currentSearchId)
      .then(({ funcionario, assigns }) => {
        if (mounted) {
          setPositionData({ funcionario, assigns });
        }
      })
      .catch(() => {
        if (mounted) {
          setPositionData({ funcionario: null, assigns: [] });
        }
      });

    return () => { mounted = false; };
  }, [currentSearchId, getAssignsByPosition]);

  const handleInputChange = e => {
    setPositionIdInput(e.target.value);
    setValidationError(null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const trimmed = positionIdInput.trim();
    if (!trimmed) {
      setValidationError('El número de documento no puede estar vacío.');
      return;
    }
    const id = parseInt(trimmed, 10);
    if (isNaN(id)) {
      setValidationError('El número de documento debe ser un valor numérico.');
      return;
    }
    setCurrentSearchId(id);
  };

  const { funcionario, assigns } = positionData;
  const isLoading = loadingByPos && currentSearchId !== null;
  const error = errorByPos;

  return (
    <div className="min-h-screen bg-fla-green-light p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">

        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8
                        bg-clip-text text-transparent bg-gradient-to-r
                        from-fla-gold to-fla-black">
          Consulta de Activos por Funcionario
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-col sm:flex-row items-center
                     space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <input
            type="text"
            value={positionIdInput}
            onChange={handleInputChange}
            placeholder="Número de documento"
            className="flex-grow p-3 border-2 border-fla-gold rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-fla-green
                       focus:border-transparent transition duration-200"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-fla-gold text-fla-black
                       font-semibold rounded-lg shadow-lg hover:bg-yellow-500
                       focus:outline-none focus:ring-2 focus:ring-fla-black
                       focus:ring-offset-2 transition duration-200"
          >
            {isLoading ? 'Cargando...' : 'Buscar Activos'}
          </button>
        </form>

        {validationError && (
          <div className="bg-yellow-50 border-l-4 border-fla-gold
                          text-yellow-800 p-4 mb-6 rounded">
            {validationError}
          </div>
        )}
        {isLoading && (
          <div className="bg-fla-gold/20 border-l-4 border-fla-gold
                          text-fla-black p-4 mb-6 rounded">
            <p className="font-bold">Cargando...</p>
            <p>Obteniendo activos para C.C: {currentSearchId}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-600
                          text-red-700 p-4 mb-6 rounded">
            <p className="font-bold">Error al cargar:</p>
            <p>{error}</p>
          </div>
        )}

        {funcionario && !isLoading && !error && (
          <div className="bg-fla-green/10 p-6 rounded-lg shadow-inner
                          mb-6 space-y-4">
            <h3 className="text-xl font-bold text-fla-black mb-2 flex items-center">
              <AiOutlineUser className="mr-2 text-fla-gold" size={24} />
              Detalles del Funcionario
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <AiOutlineIdcard className="mr-2 text-fla-green" size={20} />
                <span className="text-fla-black font-medium">Cédula:</span>
                <span className="ml-1 text-fla-gold">{funcionario.id_pos}</span>
              </div>
              <div className="flex items-center">
                <AiOutlineUser className="mr-2 text-fla-green" size={20} />
                <span className="text-fla-black font-medium">Nombre:</span>
                <span className="ml-1 text-fla-gold">{funcionario.name}</span>
              </div>
              <div className="flex items-center">
                <AiOutlineMail className="mr-2 text-fla-green" size={20} />
                <span className="text-fla-black font-medium">Email:</span>
                <span className="ml-1 text-fla-gold">{funcionario.email}</span>
              </div>
              <div className="flex items-center">
                <AiOutlineSolution className="mr-2 text-fla-green" size={20} />
                <span className="text-fla-black font-medium">Cargo:</span>
                <span className="ml-1 text-fla-gold">
                  {funcionario.cargo?.name_charge || '-'}
                </span>
              </div>
            </div>
          </div>
        )}

        {funcionario && !isLoading && !error && (
          <>
            <h3 className="text-2xl font-bold text-fla-black mb-4">
              Activos Asociados ({assigns.length})
            </h3>
            {assigns.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-fla-gold
                              text-yellow-800 p-4 rounded">
                <p>No se encontraron traslados para este funcionario.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-md
                              border-2 border-fla-black">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        'ID Asignación',
                        'Fecha',
                        'Ubicación',
                        'Activo',
                        'Placa',
                        'Detalles'
                      ].map(title => (
                        <th
                          key={title}
                          className="px-6 py-3 text-left text-xs font-medium
                                     text-gray-500 uppercase tracking-wider"
                        >
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assigns.map(tr => (
                      <tr key={tr.id_assi} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm
                                       font-medium text-fla-black">
                          {tr.id_assi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm
                                       text-gray-500">
                          {new Date(tr.date_assi).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm
                                       text-gray-500">
                          {tr.location || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm
                                       text-gray-500">
                          {tr.item?.name_item || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm
                                       text-fla-gold font-medium">
                          {tr.item?.tag || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500
                                       max-w-xs overflow-hidden text-ellipsis">
                          {tr.details || 'Sin detalles'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {!funcionario && !validationError && !isLoading && !error && (
          <div className="bg-fla-green/20 border-l-4 border-fla-green
                          text-fla-black p-4 rounded">
            <p>Ingrese su número de documento para empezar la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultarActivos;
