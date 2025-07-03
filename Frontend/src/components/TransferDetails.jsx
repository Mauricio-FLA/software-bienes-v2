import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransfer } from '../context/TransferContext';
import { FaArrowLeft } from 'react-icons/fa';

; // Ajusta según el puerto de tu backend

export default function TransferDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    currentTransfer: transfer,
    getTransferByIdImg,
    loadingDetail: loading,
    errorDetail: error
  } = useTransfer();

  useEffect(() => {
    getTransferByIdImg(id);
  }, [getTransferByIdImg, id]);

  if (loading) {
    return (
      <div className="bg-[#F1F3F5] min-h-screen flex items-center justify-center">
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

  if (!transfer) {
    return (
      <div className="bg-[#F1F3F5] min-h-screen flex items-center justify-center">
        <p className="text-center text-[#555555] py-8">
          No se encontraron detalles para este traslado.
        </p>
      </div>
    );
  }

  // Construir la URL completa de la imagen
  const imageUrl = transfer.img ? `${BACKEND_URL}/uploads/${transfer.img}` : null;

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
            { label: 'ID de Traslado', value: transfer.id_transfer },
            { label: 'Fecha de Traslado', value: new Date(transfer.fecha_traslado).toLocaleDateString() },
            { label: 'Detalles', value: transfer.details },
            { label: 'Ubicación', value: transfer.location }
          ]} />

          {/* Información del Funcionario */}
          <InfoCard title="Funcionario" items={[
            { label: 'Documento', value: transfer.id_posi },
            { label: 'Nombre', value: transfer.funcionario_name },
            { label: 'Email', value: transfer.funcionario_email },
            { label: 'Dependencia', value: transfer.funcionario_depen }
          ]} />

          {/* Detalles del Activo */}
          <InfoCard title="Activo Asignado" items={[
            { label: 'Tag', value: transfer.tag },
            { label: 'Nombre', value: transfer.item_name },
            { label: 'Marca', value: transfer.item_brand },
            { label: 'Serial', value: transfer.item_serial },
            { label: 'Descripción', value: transfer.item_descrip }
          ]} />

          {/* Imagen */}
          {/* Fotos */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#C8E2CB]">
            <h3 className="text-lg font-semibold text-[#2F7A4E] mb-3">Foto del Traslado</h3>
            {transfer.img ? (
              <img
                src={`${BACKEND_URL}/uploads/${transfer.img}`}
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