import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTransfer } from '../context/TransferContext';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

export default function UpdateTransfer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getTransferById,
    updateAssign,
    loadingDetail,
    errorDetail,
    loadingUpdate,
    errorUpdate
  } = useTransfer();

  const [formData, setFormData] = useState({
    id_posi: '',
    fecha_traslado: '',
    funcionario_name: '',
    funcionario_email: '',
    funcionario_depen: '',
    item_name: '',
    item_brand: '',
    item_serial: '',
    item_descrip: '',
    tag: '',
    location: '',
    details: ''
  });
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    // Al cargar, obtenemos el traslado para poblar el formulario
    const fetchData = async () => {
      try {
        const data = await getTransferById(id);
        setFormData({
          id_posi: data.id_posi || '',
          fecha_traslado: data.fecha_traslado
            ? new Date(data.fecha_traslado).toISOString().slice(0, 10)
            : '',
          funcionario_name: data.funcionario_name || '',
          funcionario_email: data.funcionario_email || '',
          funcionario_depen: data.funcionario_depen || '',
          item_name: data.item_name || '',
          item_brand: data.item_brand || '',
          item_serial: data.item_serial || '',
          item_descrip: data.item_descrip || '',
          tag: data.tag || '',
          location: data.location || '',
          details: data.details || ''
        });
      } catch (err) {
        setFetchError(err.response?.data?.message || 'No se pudo cargar el traslado.');
      }
    };
    fetchData();
  }, [id, getTransferById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAssign(id, formData);
      alert('Traslado actualizado exitosamente.');
      navigate(-1);
    } catch {
      // El error se muestra desde errorUpdate
    }
  };

  return (
    <div className="bg-[#F1F3F5] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Botón “Volver” */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center mb-6 px-3 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white rounded-lg transition"
        >
          <FaArrowLeft className="mr-2" /> Volver
        </button>

        <h1 className="text-2xl font-bold text-[#2F7A4E] mb-4">
          Editar Traslado #{id}
        </h1>

        {loadingDetail ? (
          <p className="text-center text-[#555555]">Cargando datos…</p>
        ) : fetchError || errorDetail ? (
          <p className="text-center text-[#C53030]">
            {fetchError || errorDetail}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cédula Funcionario */}
            <div>
              <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                Cédula Funcionario <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="id_posi"
                value={formData.id_posi}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                required
              />
            </div>

            {/* Fecha de Traslado */}
            <div>
              <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                Fecha de Traslado <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_traslado"
                value={formData.fecha_traslado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                required
              />
            </div>

            {/* Funcionario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                  Nombre Funcionario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="funcionario_name"
                  value={formData.funcionario_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                  Correo Funcionario
                </label>
                <input
                  type="email"
                  name="funcionario_email"
                  value={formData.funcionario_email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                  Dependencia Funcionario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="funcionario_depen"
                  value={formData.funcionario_depen}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                  required
                />
              </div>
            </div>

            {/* Detalles del Traslado */}
            <div>
              <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                Detalles <span className="text-red-500">*</span>
              </label>
              <textarea
                name="details"
                rows="4"
                value={formData.details}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                required
              />
            </div>

            {/* Activo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tag y Ubicación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                  Tag (Placa) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                  Ubicación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                  required
                />
              </div>
            </div>
              <div>
                <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                  Nombre Activo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                  Marca Activo
                </label>
                <input
                  type="text"
                  name="item_brand"
                  value={formData.item_brand}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                  Serial Activo
                </label>
                <input
                  type="text"
                  name="item_serial"
                  value={formData.item_serial}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#2F7A4E] mb-1">
                  Descripción Activo
                </label>
                <textarea
                  name="item_descrip"
                  rows="3"
                  value={formData.item_descrip}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]"
                  
                />
              </div>
            </div>

            

            {/* Estado de error de actualización */}
            {errorUpdate && (
              <p className="text-center text-[#C53030]">{errorUpdate}</p>
            )}

            {/* Botón Guardar */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loadingUpdate}
                className={`
                  inline-flex items-center justify-center
                  w-full sm:w-auto
                  px-6 py-3 bg-[#2F7A4E] hover:bg-[#255F3D]
                  text-white font-medium rounded-lg
                  transition focus:outline-none focus:ring-2 focus:ring-[#A3D9A5]
                  ${loadingUpdate ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                <FaSave className="mr-2" />
                {loadingUpdate ? 'Actualizando…' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
