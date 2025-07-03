import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useContract } from '../context/ContractContext';
import { useTimeout, useMultiTimeout, useDebounce } from '../components/ErrorsTimes'; 

export default function ContractFormPage() {
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm();

  const { createContract } = useContract();

  // Auto-ocultar errores y mensajes tras 3 segundos
// Una sola llamada para limpiar errors y éxito:
useMultiTimeout([
  { fn: () => clearErrors(), delay: 5000, deps: [errors] },
  { fn: () => setServerErrors([]), delay: 5000, deps: [serverErrors] },
  { fn: () => setSuccessMessage(''), delay: 5000, deps: [successMessage] },
]);


  const onSubmit = async data => {
    setLoading(true);
    setServerErrors([]);
    setSuccessMessage('');

    try {
      const contractData = {
        id_contra: data.id_contra,
        price: parseFloat(data.price),
        date_contra: data.date_contra,
        details: data.details,
        provider: data.provider,
      };

      await createContract(contractData);
      setSuccessMessage('¡Contrato registrado exitosamente!');
      reset();
    } catch (err) {
      console.error('Error al registrar el contrato:', err);

      // **INICIO DE LA MODIFICACIÓN EN EL MANEJO DE ERRORES**
      let errorMessage = 'Error desconocido al registrar el contrato.';

      if (err.response) {
        // Errores de respuesta del servidor (ej. 400, 500)
        if (err.response.status === 400 && err.response.data.message) {
          // Específico para el error de duplicidad del backend
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          // Si el backend envía un array de errores (como en validaciones de Joi/Express-validator)
          errorMessage = err.response.data.errors; // Asigna directamente el array
        } else if (err.response.data.message) {
          // Mensaje de error general del backend
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        // Errores de red o de cliente (sin respuesta del servidor)
        errorMessage = err.message;
      }
      
      // Asegurarse de que serverErrors sea siempre un array
      setServerErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
      // **FIN DE LA MODIFICACIÓN EN EL MANEJO DE ERRORES**

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2F7A4E] mb-6 text-center tracking-tight">
          Registro de Contrato
        </h2>

        {/* Errores del servidor */}
        {serverErrors.length > 0 && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-300 p-4 shadow-sm flex items-start text-sm sm:text-base">
            <FaExclamationCircle className="text-red-600 text-xl sm:text-2xl mr-3 mt-0.5" />
            <div>
              <p className="font-bold text-red-800 mb-1.5">Se encontraron los siguientes errores:</p>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                {serverErrors.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-300 p-4 shadow-sm flex items-center text-sm sm:text-base">
            <FaCheckCircle className="text-green-600 text-xl sm:text-2xl mr-3" />
            <p className="font-bold text-green-800">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Número de Contrato */}
            <div>
              <label htmlFor="id_contra" className="block text-gray-700 font-semibold text-sm mb-2">
                Número de Contrato
              </label>
              <input
                type="text"
                {...register('id_contra', { required: 'El número de contrato es obligatorio' })}
                id="id_contra"
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${
                  errors.id_contra
                    ? 'border-red-500 ring-red-200'
                    : 'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'
                } focus:ring transition duration-200 shadow-sm text-sm`}
                placeholder="Ej: C-2025-001"
              />
              {errors.id_contra && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.id_contra.message}
                </p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label htmlFor="price" className="block text-gray-700 font-semibold text-sm mb-2">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'El precio es obligatorio',
                  min: { value: 0, message: 'El precio no puede ser negativo' }
                })}
                id="price"
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${
                  errors.price
                    ? 'border-red-500 ring-red-200'
                    : 'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'
                } focus:ring transition duration-200 shadow-sm text-sm`}
                placeholder="Ej: 15000000"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Fecha del Contrato */}
            <div>
              <label htmlFor="date_contra" className="block text-gray-700 font-semibold text-sm mb-2">
                Fecha del Contrato
              </label>
              <input
                type="date"
                {...register('date_contra', { required: 'La fecha del contrato es obligatoria' })}
                id="date_contra"
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${
                  errors.date_contra
                    ? 'border-red-500 ring-red-200'
                    : 'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'
                } focus:ring transition duration-200 shadow-sm text-sm`}
              />
              {errors.date_contra && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.date_contra.message}
                </p>
              )}
            </div>

            {/* Proveedor */}
            <div>
              <label htmlFor="provider" className="block text-gray-700 font-semibold text-sm mb-2">
                Proveedor
              </label>
              <input
                type="text"
                {...register('provider', { required: 'El proveedor es obligatorio' })}
                id="provider"
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${
                  errors.provider
                    ? 'border-red-500 ring-red-200'
                    : 'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'
                } focus:ring transition duration-200 shadow-sm text-sm`}
                placeholder="Ej: Suministros ABC S.A."
              />
              {errors.provider && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.provider.message}
                </p>
              )}
            </div>

            {/* Detalles */}
            <div className="md:col-span-2">
              <label htmlFor="details" className="block text-gray-700 font-semibold text-sm mb-2">
                Detalles del Contrato (Opcional)
              </label>
              <textarea
                {...register('details')}
                id="details"
                rows="3"
                className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#2F7A4E] focus:ring focus:ring-[#2F7A4E]/50 transition duration-200 shadow-sm text-sm resize-y"
                placeholder="Descripción detallada del contrato, términos, etc."
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 flex items-center justify-center bg-[#2F7A4E] hover:bg-[#255F3D]
             text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 disabled:opacity-60 
             disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            {loading ? (
              <><FaSpinner className="animate-spin mr-3 text-xl" />Guardando...</>
            ) : (
              'Registrar Contrato'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}