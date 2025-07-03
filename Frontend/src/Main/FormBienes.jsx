import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useItems } from '../context/ItemContext';
import { getTagRequest } from '../api/tag';
import { getContractRequest } from '../api/contract';
import { FaUpload, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; 
import { useTimeout, useMultiTimeout, useDebounce } from '../components/ErrorsTimes'; 


export default function ItemFormPage() {
  const [placas, setPlacas] = useState([]);
  const [contracts, setcontracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    formState: { errors }
  } = useForm();

  const { createItem } = useItems();

    // Auto clear messages
  useMultiTimeout([
    { fn: () => clearErrors(), delay: 5000, deps: [errors] },
    { fn: () => setServerErrors([]), delay: 5000, deps: [serverErrors] },
    { fn: () => setSuccessMessage(''), delay: 5000, deps: [successMessage] },
  ]);

  // Carga inicial de datos (placas y contracts)
  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingInitialData(true);
      try {
        const [resTags, rescontracts] = await Promise.all([
          getTagRequest(),
          getContractRequest()
        ]);
        setPlacas(resTags.data);
        setcontracts(rescontracts.data);
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
        setServerErrors(['Error al cargar los datos iniciales. Por favor, intente de nuevo.']);
      } finally {
        setLoadingInitialData(false);
      }
    };
    loadInitialData();
  }, []);

  // Para previsualizar el nombre del archivo de imagen
  const imageFile = watch('image');
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      setSelectedFileName(imageFile[0].name);
    } else {
      setSelectedFileName('');
    }
  }, [imageFile]);

  const onSubmit = async data => {
    setLoading(true);
    setServerErrors([]);
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('tag', data.tag);
      formData.append('name_item', data.name_item);
      formData.append('brand', data.brand);
      formData.append('serialNumber', data.serialNumber);
      formData.append('id_tag', data.id_tag);
      formData.append('id_contra', data.id_contra);
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      await createItem(formData);
      setSuccessMessage('¡Producto registrado exitosamente!');
      reset();
      setSelectedFileName('');
    } catch (err) {
      console.error('Error al registrar el producto:', err);
      setServerErrors(
        err.response?.data?.errors
          ? err.response.data.errors
          : [err.response?.data?.message || 'Error desconocido al registrar el producto.']
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitialData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="flex items-center text-[#2F7A4E] text-xl font-semibold">
          <FaSpinner className="animate-spin mr-3 text-3xl" />
          Cargando datos...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2F7A4E] mb-6 text-center tracking-tight">
          Registro de Activos
        </h2>

        {/* Mensajes de estado */}
        {serverErrors.length > 0 && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-300 p-4 shadow-sm flex items-start text-sm sm:text-base">
            <FaExclamationCircle className="text-red-600 text-xl sm:text-2xl mr-3 mt-0.5" />
            <div>
              <p className="font-bold text-red-800 mb-1.5">Se encontraron los siguientes errores:</p>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                {serverErrors.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-300 p-4 shadow-sm flex items-center text-sm sm:text-base">
            <FaCheckCircle className="text-green-600 text-xl sm:text-2xl mr-3" />
            <p className="font-bold text-green-800">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            {/* Campo Placa */}
            <div>
              <label htmlFor="tag" className="block text-gray-700 font-semibold text-sm mb-2">
                Placa <span className="text-red-500">*</span>
              </label>
              <input
                {...register('tag', { required: 'La placa es obligatoria' })}
                id="tag"
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${
                  errors.tag ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'
                } focus:ring transition duration-200 shadow-sm text-sm`}
                placeholder="Ej: A123"
              />
              {errors.tag && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.tag.message}
                </p>
              )}
            </div>

            {/* Campo Denominación de Activos */}
            <div>
              <label htmlFor="name_item" className="block text-gray-700 font-semibold text-sm mb-2">
                Denominación de Activos <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name_item', { required: 'La denominación es obligatoria' })}
                id="name_item"
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${
                  errors.name_item ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'
                } focus:ring transition duration-200 shadow-sm text-sm`}
                placeholder="Ej: Laptop Dell Latitude E5470"
              />
              {errors.name_item && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.name_item.message}
                </p>
              )}
            </div>

            {/* Campo Marca */}
            <div>
              <label htmlFor="brand" className="block text-gray-700 font-semibold text-sm mb-2">
                Marca 
              </label>
              <input
                {...register('brand')}
                id="brand"
                className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#2F7A4E] focus:ring
                 focus:ring-[#2F7A4E]/50 transition duration-200 shadow-sm text-sm"
                placeholder="Ej: Dell, HP, Samsung"
              />
            </div>

            {/* Campo Número Serial */}
            <div>
              <label htmlFor="serialNumber" className="block text-gray-700 font-semibold text-sm mb-2">
                Número Serial 
              </label>
              <input
                {...register('serialNumber')}
                id="serialNumber"
                className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#2F7A4E] focus:ring
                 focus:ring-[#2F7A4E]/50 transition duration-200 shadow-sm text-sm"
                placeholder="Ej: SN123456ABC"
              />
            </div>

            {/* Campo Tipo de Placa (id_tag) - Select */}
            <div>
              <label htmlFor="id_tag" className="block text-gray-700 font-semibold text-sm mb-2">
                Tipo de Placa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="id_tag"
                  {...register('id_tag', { required: 'El tipo de placa es obligatorio' })}
                  className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${
                    errors.id_tag ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'
                  } focus:ring transition duration-200 appearance-none pr-10 shadow-sm text-sm`}
                >
                  <option value="">Seleccione un tipo de placa</option>
                  {placas.map(p => (
                    <option key={p.id_tag} value={p.id_tag}>
                      {p.TagType}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z" />
                  </svg>
                </div>
              </div>
              {errors.id_tag && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.id_tag.message}
                </p>
              )}
            </div>

            {/* Campo ID de Contraparte (id_contra) - Select */}
            <div>
              <label htmlFor="id_contra" className="block text-gray-700 font-semibold text-sm mb-2">
                Número de Contrato
              </label>
              <div className="relative">
                <select
                  id="id_contra"
                  {...register('id_contra', { required: 'La contraparte es obligatoria' })}
                  className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${
                    errors.id_contra ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'
                  } focus:ring transition duration-200 appearance-none pr-10 shadow-sm text-sm`}
                >
                  <option value="">Seleccione un # de contrato</option>
                  {contracts.map(c => (
                    <option key={c.id_contra} value={c.id_contra}>
                      {c.id_contra}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338z" />
                  </svg>
                </div>
              </div>
              {errors.id_contra && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.id_contra.message}
                </p>
              )}
            </div>

            {/* Campo de carga de imagen - Colocado en la tercera columna para pantallas grandes */}
            <div className="md:col-span-2 lg:col-span-1"> {/* Ocupa 2 columnas en md, 1 en lg */}
              <label htmlFor="image" className="block text-gray-700 font-semibold text-sm mb-2">
                Imagen del Activo (Opcional)
              </label>
              <div className="flex items-center space-x-3 sm:space-x-4"> {/* Ajuste de espacio */}
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-[#2F7A4E] hover:bg-[#255F3D] text-white font-bold py-2.5 px-4 rounded-xl transition duration-300 shadow-md flex items-center justify-center text-sm sm:text-base min-w-[120px] sm:min-w-[150px]"
                >
                  <FaUpload className="mr-2 text-sm sm:text-base" />
                  Subir Imagen
                  <input
                    id="image-upload"
                    type="file"
                    {...register('image')}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {selectedFileName && (
                  <span className="text-gray-600 text-xs sm:text-sm truncate max-w-[calc(100%-140px)] sm:max-w-[calc(100%-180px)]">
                    Archivo: <span className="font-medium text-gray-800">{selectedFileName}</span>
                  </span>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>

          {/* Botón de envío - Ocupa todas las columnas para centrarlo y darle prominencia */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 flex items-center justify-center bg-[#2F7A4E] hover:bg-[#255F3D] text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-3 text-xl" />
                Guardando...
              </>
            ) : (
              'Guardar Activo'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}