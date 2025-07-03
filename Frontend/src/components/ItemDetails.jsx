import React, { useEffect, useState, useCallback } from 'react';
import axios from '../api/axios'; 
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import { getTagRequest } from '../api/tag'; 
import { getContractRequest } from '../api/contract'; 
import { FaUpload, FaSpinner, FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa'; 
import { useTimeout, useMultiTimeout, useDebounce } from '../components/ErrorsTimes'; 


export default function ItemDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const { getItem, updateItem, loadingUpdate, errorUpdate } = useItems(); 
  const [placas, setPlacas] = useState([]);
  const [contracts, setContracts] = useState([]); 
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const [currentImageUrl, setCurrentImageUrl] = useState(''); 
  const [selectedFileName, setSelectedFileName] = useState(''); 

  // Estado para los datos iniciales del ítem, útil para la lógica de imagen y comparación
  const [initialItemData, setInitialItemData] = useState(null);

  const { register, handleSubmit, reset, watch, setValue, clearErrors, formState: { errors } } = useForm();

    // Auto clear messages
  useMultiTimeout([
    { fn: () => clearErrors(), delay: 5000, deps: [errors] },
    { fn: () => setServerErrors([]), delay: 5000, deps: [serverErrors] },
    { fn: () => setSuccessMessage(''), delay: 5000, deps: [successMessage] },
  ]);

  // Observa el campo de archivo para mostrar el nombre del archivo seleccionado
  const newImageFile = watch('newImage'); 
  useEffect(() => {
    if (newImageFile && newImageFile.length > 0) {
      setSelectedFileName(newImageFile[0].name);
    } else {
      setSelectedFileName('');
    }
  }, [newImageFile]);

  // --- Carga inicial de datos del ítem y los selects (placas, contratos) ---
  useEffect(() => {
    const loadAllData = async () => {
      setLoadingInitialData(true);
      setServerErrors([]); 

      try {
        // Cargar el ítem específico
        const itemRes = await getItem(id);
        setInitialItemData(itemRes); 

        // Construir la URL completa de la imagen existente para previsualización
        if (itemRes.img) {
          // Asumo que axios.defaults.baseURL está configurado para la base de tu API
          // y que las imágenes se sirven desde /uploads.
          setCurrentImageUrl(`${axios.defaults.baseURL}/uploads/${itemRes.img}`);
        } else {
          setCurrentImageUrl('');
        }

        // Cargar tipos de placa y contratos en paralelo
        const [resTags, resContracts] = await Promise.all([
          getTagRequest(),
          getContractRequest()
        ]);
        setPlacas(resTags.data);
        setContracts(resContracts.data); 
        // Pre-llenar el formulario con los datos del ítem
        reset({
          tag: itemRes.tag || '',
          name_item: itemRes.name_item || '',
          brand: itemRes.brand || '',
          serialNumber: itemRes.serialNumber || '',
          id_tag: itemRes.id_tag || '', 
          id_contra: itemRes.id_contra || '', 
          newImage: null 
        });

      } catch (err) {
        console.error('Error al cargar datos iniciales para edición:', err);
        const errorMessage = err.response?.data?.message || 'Error al cargar los datos iniciales. Por favor, intente de nuevo.';
        setServerErrors([errorMessage]);
      } finally {
        setLoadingInitialData(false);
      }
    };
    loadAllData();
  }, [id, getItem, reset]); // Dependencias para re-ejecutar si el ID del ítem cambia

  // Función para eliminar la imagen actual (desde la UI)
  const handleRemoveImage = () => {
    setCurrentImageUrl(''); // Borra la previsualización
    setValue('newImage', null); // Asegura que el input de archivo esté vacío
    setSelectedFileName(''); // Borra el nombre del archivo seleccionado
    // La lógica para enviar al backend que la imagen se eliminó se hará en onSubmit
  };


  // --- Lógica de envío del formulario de actualización ---
  const onSubmit = async data => {
    setServerErrors([]);
    setSuccessMessage('');

    try {
      const formData = new FormData();

      // Comparar con los datos iniciales y añadir solo si han cambiado
      // Importante: Si 'tag' es tu clave primaria y no debería cambiarse, NO lo incluyas aquí.
      // Si 'tag' puede cambiar, asegúrate de que tu backend lo maneje correctamente (por ID).
      if (data.tag !== initialItemData.tag) formData.append('tag', data.tag);
      if (data.name_item !== initialItemData.name_item) formData.append('name_item', data.name_item);
      if (data.brand !== initialItemData.brand) formData.append('brand', data.brand);
      if (data.serialNumber !== initialItemData.serialNumber) formData.append('serialNumber', data.serialNumber);
      if (data.id_tag !== initialItemData.id_tag) formData.append('id_tag', data.id_tag);
      if (data.id_contra !== initialItemData.id_contra) formData.append('id_contra', data.id_contra);

      // Lógica de la imagen:
      if (data.newImage && data.newImage[0]) {
        // Se seleccionó una NUEVA imagen
        formData.append('newImage', data.newImage[0]); // 'file' debe coincidir con el nombre esperado en tu backend (multer)
      } else if (!currentImageUrl && initialItemData.img) {
        // La imagen existente ha sido eliminada por el usuario (currentImageUrl es vacío pero antes existía)
        formData.append('img', ''); // Esto le indica a tu backend que establezca el campo 'img' a NULL
      }
      // Si no se selecciona nueva imagen y no se eliminó la existente, no se envía el campo 'img'
      // Esto significa que el backend DEBE conservar la imagen existente si no recibe 'file' o 'img'.

      // Debug: log FormData entries (útil para verificar lo que se envía)
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Solo enviar si hay cambios o si hay una imagen que gestionar
      if (formData.entries().next().done && !newImageFile && currentImageUrl === initialItemData.img) {
        setSuccessMessage('No se detectaron cambios para actualizar.');
        return; // No hacer la llamada al API si no hay cambios
      }


      // Llama a la función updateItem de tu contexto con el ID y el FormData
      await updateItem(id, formData);
      setSuccessMessage('¡Activo actualizado exitosamente!');
      // Redirige después de un breve tiempo para mostrar el mensaje de éxito
      setTimeout(() => navigate('/bienes'), 1500); // Ajusta la ruta a la lista de ítems o donde sea apropiado

    } catch (err) {
      console.error('Error al actualizar el ítem:', err);
      // Los errores del contexto ya están formateados si seguiste la sugerencia anterior
      const errs = err.data?.errors || [err.data?.message || err.message || 'Error desconocido al actualizar el activo.'];
      setServerErrors(Array.isArray(errs) ? errs : [errs]);
    }
  };

  if (loadingInitialData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="flex items-center text-[#2F7A4E] text-xl font-semibold">
          <FaSpinner className="animate-spin mr-3 text-3xl" />
          Cargando datos del Activo...
        </div>
      </div>
    );
  }

  // Mostrar un mensaje si el ítem no fue encontrado después de la carga inicial
  if (!initialItemData && !loadingInitialData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="flex flex-col items-center text-red-600 text-xl font-semibold">
          <FaExclamationCircle className="mr-2 text-3xl" />
          Activo no encontrado o error al cargar.
          <button
            onClick={() => navigate('/items')}
            className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2F7A4E] mb-6 text-center tracking-tight">
          Editar Activo
        </h2>

        {/* Mensajes de estado (errores del servidor o éxito) */}
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

        {/* Formulario de edición */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            {/* Campo Placa */}
            <div>
              <label htmlFor="tag" className="block text-gray-700 font-semibold text-sm mb-2">
                Placa
              </label>
              <input
                {...register('tag', { required: 'La placa es obligatoria' })}
                id="tag"
                className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${
                  errors.tag ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'
                } focus:ring transition duration-200 shadow-sm text-sm`}
                placeholder="Ej: A123"
                // Considera hacer el campo 'tag' de solo lectura si es la clave primaria y no debe cambiar
                // readOnly={true} // Descomentar si no se debe permitir editar el tag
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
                Denominación de Activos
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
                className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#2F7A4E] focus:ring focus:ring-[#2F7A4E]/50 transition duration-200 shadow-sm text-sm"
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
                className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#2F7A4E] focus:ring focus:ring-[#2F7A4E]/50 transition duration-200 shadow-sm text-sm"
                placeholder="Ej: SN123456ABC"
              />
            </div>

            {/* Campo Tipo de Placa (id_tag) - Select */}
            <div>
              <label htmlFor="id_tag" className="block text-gray-700 font-semibold text-sm mb-2">
                Tipo de Placa
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

            <div>
              <label htmlFor="id_contra" className="block text-gray-700 font-semibold text-sm mb-2">
                Número de Contrato
              </label>
              <div className="relative">
                <select
                  id="id_contra"
                  {...register('id_contra', { required: 'El contrato es obligatorio' })}
                  className={`w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-xl border ${
                    errors.id_contra ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-[#2F7A4E] focus:ring-[#2F7A4E]/50'
                  } focus:ring transition duration-200 appearance-none pr-10 shadow-sm text-sm`}
                >
                  <option value="">Seleccione un # de contrato</option>
                  {contracts.map(c => (
                    <option key={c.id_contra} value={c.id_contra}>
                      {c.id_contra} {/* Asumo que id_contra es el ID y el valor a mostrar */}
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

            {/* Campo de carga de imagen y previsualización */}
            <div className="md:col-span-2 lg:col-span-1"> {/* Ocupa 2 columnas en md, 1 en lg */}
              <label htmlFor="newImage" className="block text-gray-700 font-semibold text-sm mb-2">
                Imagen del Activo (Opcional)
              </label>
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <label
                  htmlFor="newImage-upload"
                  className="cursor-pointer bg-[#2F7A4E] hover:bg-[#255F3D] text-white font-bold py-2.5 px-4 rounded-xl transition duration-300 shadow-md flex items-center justify-center text-sm sm:text-base min-w-[120px] sm:min-w-[150px]"
                >
                  <FaUpload className="mr-2 text-sm sm:text-base" />
                  Subir Nueva
                  <input
                    id="newImage-upload"
                    type="file"
                    {...register('newImage')}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {selectedFileName && (
                  <span className="text-gray-600 text-xs sm:text-sm truncate max-w-full sm:max-w-[calc(100%-180px)]">
                    Nuevo archivo: <span className="font-medium text-gray-800">{selectedFileName}</span>
                  </span>
                )}
              </div>
              {/* Previsualización de la imagen actual y opción para eliminar */}
              {currentImageUrl && !selectedFileName && (
                <div className="mt-4 flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <img src={currentImageUrl} alt="Imagen actual del activo" className="w-20 h-20 object-cover rounded-md border border-gray-300" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium">Imagen actual</p>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center mt-1 transition duration-200"
                    >
                      <FaTimesCircle className="mr-1" />
                      Eliminar Imagen
                    </button>
                  </div>
                </div>
              )}
              {errors.newImage && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.newImage.message}
                </p>
              )}
            </div>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loadingUpdate}
            className="w-full mt-8 flex items-center justify-center bg-[#2F7A4E] hover:bg-[#255F3D] text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            {loadingUpdate ? (
              <>
                <FaSpinner className="animate-spin mr-3 text-xl" />
                Actualizando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}