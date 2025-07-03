// src/components/ActivoSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { useItems } from '../context/ItemContext';

export default function ActivoSection() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
    clearErrors,
    setError
  } = useFormContext();
  const { getItem } = useItems();
  const { fields, append, remove } = useFieldArray({ control, name: 'activos' });
  const [fileNames, setFileNames] = useState({});

  // Aseguramos que activos sea siempre un arreglo
  const activos = useWatch({ control, name: 'activos' }) || [];
  // Sólo observamos cambios en las placas (tags)
  const tagsList = activos.map(a => a.tag || '').join(',');

  const processedTags = useRef(new Set());
  const erroredTags = useRef(new Set());

  useEffect(() => {
    // Limpiar y procesar sólo cuando tagsList cambie
    // Limpieza de tags removidos
    const currentTags = activos.map(a => a.tag).filter(Boolean);
    processedTags.current.forEach(tag => {
      if (!currentTags.includes(tag)) {
        const idx = fields.findIndex(f => f.tag === tag);
        if (idx !== -1) clearErrors(`activos.${idx}.tag`);
        processedTags.current.delete(tag);
        erroredTags.current.delete(tag);
      }
    });

    // Procesamos cada tag nuevo o con error previo
    activos.forEach((activo, index) => {
      const tag = activo.tag;
      if (!tag) {
        ['item_name', 'item_brand', 'item_serial'].forEach(key =>
          setValue(`activos.${index}.${key}`, '')
        );
        clearErrors(`activos.${index}.tag`);
        processedTags.current.delete(tag);
        erroredTags.current.delete(tag);
        return;
      }

      if (!processedTags.current.has(tag) || erroredTags.current.has(tag)) {
        processedTags.current.add(tag);
        erroredTags.current.delete(tag);

        getItem(tag)
          .then(data => {
            if ((activo.tag || '') === tag) {
              setValue(`activos.${index}.item_name`, data?.name_item || '');
              setValue(`activos.${index}.item_brand`, data?.brand || '');
              setValue(`activos.${index}.item_serial`, data?.serialNumber || '');
              clearErrors(`activos.${index}.tag`);
            }
          })
          .catch(err => {
            if ((activo.tag || '') === tag) {
              ['item_name', 'item_brand', 'item_serial'].forEach(key =>
                setValue(`activos.${index}.${key}`, '')
              );
              const msg = err.response?.data?.message || 'Activo no encontrado';
              setError(`activos.${index}.tag`, { type: 'server', message: msg });
              erroredTags.current.add(tag);
            }
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsList, fields, getItem, setValue, clearErrors, setError]);

  return (
    <div className="flex flex-col">
      <div className="max-h-[300px] overflow-y-auto space-y-6 pr-2">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-white border border-[#C8E2CB] rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[#333333] font-semibold">Activo #{index + 1}</h4>
              <button
                type="button"
                onClick={() => {
                  const tag = activos[index]?.tag;
                  processedTags.current.delete(tag);
                  erroredTags.current.delete(tag);
                  remove(index);
                }}
                className="text-[#C53030] hover:underline text-sm"
              >
                Eliminar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* PLACA */}
              <div>
                <label htmlFor={`activos.${index}.tag`} className="block text-[#333333] text-sm font-medium mb-1">
                  Placa (tag)
                </label>
                <input
                  id={`activos.${index}.tag`}
                  {...register(`activos.${index}.tag`, { required: 'La placa es obligatoria' })}
                  className="w-full bg-[#F9F9F9] text-[#333333] px-3 py-2 rounded-md border border-[#C8E2CB] focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] transition"
                  placeholder="Ej: A123"
                />
                {errors.activos?.[index]?.tag && (
                  <p className="text-red-600 text-xs mt-1">{errors.activos[index].tag.message}</p>
                )}
              </div>

              {/* Campos deshabilitados */}
              {['item_name', 'item_brand', 'item_serial'].map(key => (
                <div key={key}>
                  <label htmlFor={`activos.${index}.${key}`} className="block text-[#333333] text-sm font-medium mb-1 capitalize">
                    {key.replace('_', ' ')}
                  </label>
                  <input
                    id={`activos.${index}.${key}`}
                    {...register(`activos.${index}.${key}`)}
                    disabled
                    className="w-full bg-[#E9ECEC] text-[#555555] px-3 py-2 rounded-md border border-[#C8E2CB] cursor-not-allowed"
                  />
                </div>
              ))}

              {/* Imagen del activo: manejado con setValue y watch */}
              <div className="md:col-span-2">
                <label htmlFor={`image-${index}`} className="block text-[#333333] text-sm font-medium mb-1">
                  Imagen del Activo
                </label>
                <label
                  htmlFor={`image-${index}`}
                  className="flex items-center justify-center px-4 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white rounded-lg cursor-pointer"
                >
                  Seleccionar Imagen
                </label>
                <input
                  type="file"
                  id={`image-${index}`}
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    setValue(`activos.${index}.image`, file ? [file] : null, { shouldValidate: true });
                    setFileNames(prev => ({ ...prev, [index]: file?.name || '' }));
                  }}
                />
                {fileNames[index] && (
                  <p className="mt-1 text-sm text-gray-700">
                    Archivo: <strong>{fileNames[index]}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right mt-6">
        <button
          type="button"
          onClick={() =>
            append({ tag: '', item_name: '', item_brand: '', item_serial: '', item_descrip: '', image: null })
          }
          className="bg-[#2F7A4E] hover:bg-[#255F3D] text-white font-medium py-2 px-4 rounded-md transition"
        >
          Agregar otro bien
        </button>
      </div>
    </div>
  );
}
