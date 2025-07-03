// src/components/FuncionarioSection.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function FuncionarioSection() {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      {/* Documento Funcionario */}
      <div>
        <label
          htmlFor="id_pos"
          className="block text-[#333333] text-sm font-medium mb-1"
        >
          Documento Funcionario
        </label>
        <input
          id="id_pos"
          {...register('id_pos', { required: 'El documento es obligatorio' })}
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
          placeholder="Ej: 12345678"
        />
        {errors.id_pos && (
          <p className="text-red-600 text-xs mt-1">
            {errors.id_pos.message}
          </p>
        )}
      </div>

      {/* Nombre Funcionario */}
      <div>
        <label
          htmlFor="funcionario.name"
          className="block text-[#333333] text-sm font-medium mb-1"
        >
          Nombre Funcionario
        </label>
        <input
          id="funcionario.name"
          {...register('funcionario.name')}
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

      {/* Email Funcionario */}
      <div>
        <label
          htmlFor="funcionario.email"
          className="block text-[#333333] text-sm font-medium mb-1"
        >
          Email Funcionario
        </label>
        <input
          id="funcionario.email"
          {...register('funcionario.email')}
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

      {/* Dependencia */}
      <div>
        <label
          htmlFor="funcionario.depen"
          className="block text-[#333333] text-sm font-medium mb-1"
        >
          Dependencia
        </label>
        <input
          id="funcionario.depen"
          {...register('funcionario.depen')}
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

      {/* Fecha Traslado */}
      <div> {/* Deja este campo en su propia columna para una distribución más equilibrada */}
        <label
          htmlFor="fecha_traslado"
          className="block text-[#333333] text-sm font-medium mb-1"
        >
          Fecha Traslado
        </label>
        <input
          id="fecha_traslado"
          type="date"
          {...register('fecha_traslado', { required: 'La fecha es obligatoria' })}
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
        />
        {errors.fecha_traslado && (
          <p className="text-red-600 text-xs mt-1">
            {errors.fecha_traslado.message}
          </p>
        )}
      </div>

      {/* UBICACIÓN DEL FUNCIONARIO (AGREGADO AQUÍ) */}
      <div>
        <label
          htmlFor="location"
          className="block text-[#333333] text-sm font-medium mb-1"
        >
          Ubicación del Funcionario
        </label>
        <input
          id="location"
          type="text"
          {...register('location', { required: 'La ubicación del funcionario es obligatoria' })}
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
          placeholder="Ej: Oficina 301, Piso 3"
        />
        {errors.location && (
          <p className="text-red-600 text-xs mt-1">
            {errors.location.message}
          </p>
        )}
      </div>
    </div>
  );
}