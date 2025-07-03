// src/components/ActivoSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { useItems } from '../context/ItemContext';

export default function AssignSection() {
    const { register, control, setValue, formState: { errors }, clearErrors, setError } = useFormContext();
    const { getItem } = useItems();
    const { fields, append, remove } = useFieldArray({ control, name: 'activos' });
    const [fileNames, setFileNames] = useState({});

    const activos = useWatch({ control, name: 'activos' });

    const processedTags = useRef(new Set());
    const erroredTags = useRef(new Set());

    useEffect(() => {
        const currentTagsInForm = activos.map(a => a.tag).filter(Boolean);

        processedTags.current.forEach(tag => {
            if (!currentTagsInForm.includes(tag)) {
                const indexToClear = fields.findIndex(field => field.tag === tag);
                if (indexToClear !== -1) {
                    clearErrors(`activos.${indexToClear}.tag`);
                }
                processedTags.current.delete(tag);
                erroredTags.current.delete(tag);
            }
        });

        activos.forEach((activo, index) => {
            const tag = activo.tag;

            if (!tag) {
                if (activo.item_name) {
                    setValue(`activos.${index}.item_name`, '');
                    setValue(`activos.${index}.item_brand`, '');
                    setValue(`activos.${index}.item_serial`, '');
                    clearErrors(`activos.${index}.tag`);
                }
                if (processedTags.current.has(tag)) {
                    processedTags.current.delete(tag);
                    erroredTags.current.delete(tag);
                }
                return;
            }

            if (tag && (!processedTags.current.has(tag) || erroredTags.current.has(tag))) {
                processedTags.current.add(tag);
                erroredTags.current.delete(tag);

                getItem(tag)
                    .then(data => {
                        if (activos[index]?.tag === tag) {
                            setValue(`activos.${index}.item_name`, data?.name_item || '');
                            setValue(`activos.${index}.item_brand`, data?.brand || '');
                            setValue(`activos.${index}.item_serial`, data?.serialNumber || '');
                            clearErrors(`activos.${index}.tag`);
                        }
                    })
                    .catch(err => {
                        if (activos[index]?.tag === tag) {
                            setValue(`activos.${index}.item_name`, '');
                            setValue(`activos.${index}.item_brand`, '');
                            setValue(`activos.${index}.item_serial`, '');
                            const errorMessage = err.response?.data?.message || 'Activo no encontrado';
                            setError(`activos.${index}.tag`, {
                                type: 'server',
                                message: errorMessage
                            });
                            erroredTags.current.add(tag);
                        }
                    });
            }
        });
    }, [activos, getItem, setValue, clearErrors, setError, fields]);


    return (
        <div className="flex flex-col">
            <div className="max-h-[300px] overflow-y-auto space-y-6 pr-2">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="
                            bg-white
                            border border-[#C8E2CB]
                            rounded-lg
                            shadow-sm
                            p-4
                        "
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[#333333] font-semibold">
                                Activo #{index + 1}
                            </h4>
                            <button
                                type="button"
                                onClick={() => {
                                    const tagToRemove = activos[index]?.tag;
                                    if (tagToRemove) {
                                        processedTags.current.delete(tagToRemove);
                                        erroredTags.current.delete(tagToRemove);
                                    }
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
                                <label
                                    className="block text-[#333333] text-sm font-medium mb-1"
                                    htmlFor={`activos.${index}.tag`}
                                >
                                    Placa (tag)
                                </label>
                                <input
                                    id={`activos.${index}.tag`}
                                    {...register(`activos.${index}.tag`, {
                                        required: 'La placa es obligatoria',
                                    })}
                                    className="
                                        w-full
                                        bg-[#F9F9F9]
                                        text-[#333333]
                                        px-3 sm:px-4 py-2
                                        rounded-md
                                        border border-[#C8E2CB]
                                        focus:outline-none
                                        focus:ring-2 focus:ring-[#2F7A4E]
                                        focus:border-transparent
                                        transition duration-200
                                    "
                                    placeholder="Ej: A123"
                                />
                                {errors.activos?.[index]?.tag && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {errors.activos[index].tag.message}
                                    </p>
                                )}
                            </div>

                            {/* NOMBRE ÍTEM */}
                            <div>
                                <label
                                    className="block text-[#333333] text-sm font-medium mb-1"
                                    htmlFor={`activos.${index}.item_name`}
                                >
                                    Nombre Ítem
                                </label>
                                <input
                                    id={`activos.${index}.item_name`}
                                    {...register(`activos.${index}.item_name`)}
                                    disabled
                                    className="
                                        w-full
                                        bg-[#E9ECEC]
                                        text-[#555555]
                                        px-3 sm:px-4 py-2
                                        rounded-md
                                        border border-[#C8E2CB]
                                        cursor-not-allowed
                                    "
                                />
                            </div>

                            {/* MARCA ÍTEM */}
                            <div>
                                <label
                                    className="block text-[#333333] text-sm font-medium mb-1"
                                    htmlFor={`activos.${index}.item_brand`}
                                >
                                    Marca Ítem
                                </label>
                                <input
                                    id={`activos.${index}.item_brand`}
                                    {...register(`activos.${index}.item_brand`)}
                                    disabled
                                    className="
                                        w-full
                                        bg-[#E9ECEC]
                                        text-[#555555]
                                        px-3 sm:px-4 py-2
                                        rounded-md
                                        border border-[#C8E2CB]
                                        cursor-not-allowed
                                    "
                                />
                            </div>

                            {/* SERIAL ÍTEM */}
                            <div>
                                <label
                                    className="block text-[#333333] text-sm font-medium mb-1"
                                    htmlFor={`activos.${index}.item_serial`}
                                >
                                    Serial Ítem
                                </label>
                                <input
                                    id={`activos.${index}.item_serial`}
                                    {...register(`activos.${index}.item_serial`)}
                                    disabled
                                    className="
                                        w-full
                                        bg-[#E9ECEC]
                                        text-[#555555]
                                        px-3 sm:px-4 py-2
                                        rounded-md
                                        border border-[#C8E2CB]
                                        cursor-not-allowed
                                    "
                                />
                            </div>

                            {/* DESCRIPCIÓN */}
                            <div className="md:col-span-2">
                                <label
                                    className="block text-[#333333] text-sm font-medium mb-1"
                                    htmlFor={`activos.${index}.item_descrip`}
                                >
                                    Descripción
                                </label>
                                <textarea
                                    id={`activos.${index}.item_descrip`}
                                    {...register(`activos.${index}.item_descrip`, {
                                        required: 'La descripción es obligatoria',
                                    })}
                                    className="
                                        w-full
                                        bg-[#F9F9F9]
                                        text-[#333333]
                                        px-3 sm:px-4 py-2
                                        rounded-md
                                        border border-[#C8E2CB]
                                        focus:outline-none
                                        focus:ring-2 focus:ring-[#2F7A4E]
                                        focus:border-transparent
                                        transition duration-200
                                    "
                                    placeholder="Descripción detallada..."
                                    rows="2"
                                />
                                {errors.activos?.[index]?.item_descrip && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {errors.activos[index].item_descrip.message}
                                    </p>
                                )}
                            </div>

                            {/* REMOVIDO: UBICACIÓN DEL ACTIVO */}
                            {/* BOTÓN DE SUBIR IMAGEN */}
                            <div className="md:col-span-2">
                            <label htmlFor={`image-${index}`} className="block text-[#333333] text-sm font-medium mb-1">
                                Imagen del Activo
                            </label>
                            <label
                                htmlFor={`image-${index}`}
                                className="flex items-center justify-center px-4 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white text-sm font-semibold rounded-lg cursor-pointer transition"
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
                                setFileNames(prev => ({ ...prev, [index]: file?.name || '' }));
                                // si usas react-hook-form: register ya ha guardado el archivo en el campo
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
                        append({ tag: '', item_name: '', item_brand: '', item_serial: '', item_descrip: '', image: null }) // REMOVIDO: location del default value
                    }
                    className="
                        bg-[#2F7A4E]
                        hover:bg-[#255F3D]
                        text-white
                        font-medium
                        py-2
                        px-4
                        rounded-md
                        transition duration-200
                    "
                >
                    Agregar otro bien
                </button>
            </div>
        </div>
    );
}