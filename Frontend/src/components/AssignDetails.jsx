import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssign } from '../context/AssignContext';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

; // Ajusta según el puerto de tu backend

export default function AssignDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    currentassigns: assigns,
    getAssignById,
    loadingDetail: loading,
    errorDetail: error
  } = useAssign();

  useEffect(() => {
    getAssignById(id);
  }, [getAssignById, id]);

  if (loading) {
    return (
      <div className="bg-[#F1F3F5] min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin mr-3 text-3xl" />
        <p className="text-center text-[#555555] py-8">Cargando detalles de traslado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F1F3F5] min-h-screen flex items-center justify-center">
        <p className="text-center text-[#C53030] py-8">{error}</p>
      </div>
    );
  }

  if (!assigns) {
    return (
      <div className="bg-[#F1F3F5] min-h-screen flex items-center justify-center">
        <p className="text-center text-[#555555] py-8">
          No se encontraron detalles para este traslado.
        </p>
      </div>
    );
  }

  // Construir la URL completa de la imagen
  const imageUrl = assigns.img ? `${BACKEND_URL}/uploads/${assigns.img}` : null;

  return (

    <div className="bg-[#F1F3F5] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center px-3 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white rounded-lg transition"
      >
        <FaArrowLeft className="mr-2" /> Volver
      </button>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md border border-[#C8E2CB]">
        <h2 className="text-2xl font-bold text-[#2F7A4E] mb-6">Detalles del Traslado</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Básica */}
          <InfoCard title="Información Básica" items={[
            { label: 'ID de Traslado', value: assigns.id_assigns },
            { label: 'Fecha de Traslado', value: new Date(assigns.date_assi).toLocaleDateString() },
            { label: 'Detalles', value: assigns.details },
            { label: 'Ubicación', value: assigns.location }
          ]} />

          {/* Información del Funcionario */}
          <InfoCard title="Funcionario" items={[
            { label: 'Documento', value: assigns.id_pos },
            { label: 'Nombre', value: assigns.name },
            { label: 'Email', value: assigns.email },
            { label: 'Dependencia', value: assigns.id_depen }
          ]} />

          {/* Detalles del Activo */}
          <InfoCard title="Activo Asignado" items={[
            { label: 'Tag', value: assigns.tag },
            { label: 'Nombre', value: assigns.name_item },
            { label: 'Marca', value: assigns.brand },
            { label: 'Serial', value: assigns.serialNumber },
          ]} />

          {/* Imagen */}
          {/* Fotos */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#C8E2CB]">
            <h3 className="text-lg font-semibold text-[#2F7A4E] mb-3">Foto del Traslado</h3>
            {assigns.img ? (
              <img
                src={`${BACKEND_URL}/uploads/${assigns.img}`}
                alt="Foto del traslado"
                className="w-full max-w-md h-auto rounded-md border"
              />
            ) : (
              <p className="text-[#555555] text-sm">No hay foto disponible.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Componente reutilizable para mostrar listas de información
function InfoCard({ title, items }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-[#C8E2CB]">
      <h3 className="text-lg font-semibold text-[#2F7A4E] mb-3">{title}</h3>
      <ul className="space-y-2 text-[#333333] text-sm">
        {items.map((item, index) => (
          <li key={index}>
            <span className="font-medium">{item.label}:</span> {item.value || '—'}
          </li>
        ))}
      </ul>
    </div>
  );
}