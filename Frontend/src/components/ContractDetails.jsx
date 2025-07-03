import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useContract } from '../context/ContractContext';
import { FaSpinner, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { useTimeout, useMultiTimeout, useDebounce } from '../components/ErrorsTimes'; 

export default function EditContractPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contracts, getContracts, updateContract, loading: contextLoading } = useContract();

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: { id_contra: '', price: '', date_contra: '', provider: '', details: ''}});

  const [serverErrors, setServerErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Auto clear messages
useMultiTimeout([
  { fn: () => clearErrors(), delay: 5000, deps: [errors] },
  { fn: () => setServerErrors([]), delay: 5000, deps: [serverErrors] },
  { fn: () => setSuccessMessage(''), delay: 5000, deps: [successMessage] },
]);

  // Load and populate form
  useEffect(() => {
    if (!contracts.length) {
      getContracts();
      return;
    }
    const contract = contracts.find(c => c.id_contra === id || c._id === id);
    if (contract) {
      reset({
        id_contra: contract.id_contra,
        price: contract.price,
        date_contra: contract.date_contra.split('T')[0],
        provider: contract.provider,
        details: contract.details
      });
    }
  }, [contracts, getContracts, id, reset]);

  const onSubmit = async data => {
    setSubmitting(true);
    setServerErrors([]);
    setSuccessMessage('');
    try {
      await updateContract(id, {
        id_contra: data.id_contra,
        price: parseFloat(data.price),
        date_contra: data.date_contra,
        provider: data.provider,
        details: data.details
      });
      setSuccessMessage('¡Contrato actualizado exitosamente!');
      navigate('/contracts');
    } catch (err) {
      let msg = 'Error desconocido al actualizar el contrato.';
      if (err.response?.data) {
        msg = err.response.data.errors ?? err.response.data.message ?? msg;
      } else if (err.message) msg = err.message;
      setServerErrors(Array.isArray(msg) ? msg : [msg]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-[#2F7A4E]">Editar Contrato</h2>
          <button
            onClick={() => navigate('/contracts')}
            className="px-6 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-sm font-medium rounded-md transition-colors flex items-center space-x-2"
          >
            <FaTimes />
            <span>Cancelar</span>
          </button>
        </div>

        {serverErrors.length > 0 && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-300 p-4 shadow-sm flex items-start text-sm">
            <FaExclamationCircle className="text-red-600 text-2xl mr-3 mt-0.5" />
            <div>
              <p className="font-bold text-red-800 mb-1">Se encontraron errores:</p>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                {serverErrors.map((errMsg, i) => <li key={i}>{errMsg}</li>)}
              </ul>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-300 p-4 shadow-sm flex items-center text-sm">
            <FaCheckCircle className="text-green-600 text-2xl mr-3" />
            <p className="font-bold text-green-800">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* N° Contrato */}
            <div>
              <label htmlFor="id_contra" className="block text-gray-700 font-semibold text-sm mb-2">N° Contrato <span className="text-red-500">*</span></label>
              <input
                id="id_contra"
                {...register('id_contra', { required: 'El número de contrato es obligatorio' })}
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${errors.id_contra ? 'border-red-500 ring-red-200' : 
                  'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'} shadow-sm text-sm transition`}
                placeholder="Ej: C-2025-001"
              />
              {errors.id_contra && <p className="text-red-500 text-xs mt-1 flex items-center"><FaExclamationCircle className="mr-1" />{errors.id_contra.message}</p>}
            </div>

            {/* Precio */}
            <div>
              <label htmlFor="price" className="block text-gray-700 font-semibold text-sm mb-2">Precio <span className="text-red-500">*</span></label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { required: 'El precio es obligatorio', min: { value: 0, message: 'No puede ser negativo' } })}
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${errors.price ? 'border-red-500 ring-red-200' : 
                  'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'} shadow-sm text-sm transition`}
                placeholder="Ej: 15000000"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1 flex items-center"><FaExclamationCircle className="mr-1" />{errors.price.message}</p>}
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="date_contra" className="block text-gray-700 font-semibold text-sm mb-2">Fecha del Contrato <span className="text-red-500">*</span></label>
              <input
                id="date_contra"
                type="date"
                {...register('date_contra', { required: 'La fecha es obligatoria' })}
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${errors.date_contra ? 'border-red-500 ring-red-200' : 
                  'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'} shadow-sm text-sm transition`}
              />
              {errors.date_contra && <p className="text-red-500 text-xs mt-1 flex items-center"><FaExclamationCircle className="mr-1" />{errors.date_contra.message}</p>}
            </div>

            {/* Proveedor */}
            <div>
              <label htmlFor="provider" className="block text-gray-700 font-semibold text-sm mb-2">Proveedor <span className="text-red-500">*</span></label>
              <input
                id="provider"
                type="text"
                {...register('provider', { required: 'El proveedor es obligatorio' })}
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${errors.provider ? 'border-red-500 ring-red-200' : 
                  'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'} shadow-sm text-sm transition`}
                placeholder="Ej: S.A.S"
              />
              {errors.provider && <p className="text-red-500 text-xs mt-1 flex items-center"><FaExclamationCircle className="mr-1" />{errors.provider.message}</p>}
            </div>

            {/* Detalles */}
            <div className="md:col-span-2">
              <label htmlFor="details" className="block text-gray-700 font-semibold text-sm mb-2">Detalles <span className="text-red-500">*</span></label>
              <textarea
                id="details"
                rows={4}
                {...register('details', { required: 'Los detalles sobre el Contraro son obligatorios.'} )}
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${errors.provider ? 'border-red-500 ring-red-200' : 
                  'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'} shadow-sm text-sm transition`}
                placeholder="Descripción detallada..."
                />
                {errors.details && <p className="text-red-500 text-xs mt-1 flex items-center"><FaExclamationCircle className="mr-1" />{errors.details.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || contextLoading}
            className="w-full flex items-center justify-center bg-[#2F7A4E] hover:bg-[#255F3D] text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            {submitting || contextLoading ? <><FaSpinner className="animate-spin mr-3 text-xl" />Guardando...</> : 'Actualizar Contrato'}
          </button>
        </form>
      </div>
    </div>
  );
}
