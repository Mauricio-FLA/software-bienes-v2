import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getAllChargeRequest, getAllDepenRequest, getAllSubRequest } from "../api/select";
import { useForm } from "react-hook-form";
import { usePosition } from "../context/positionContext";
import { useTimeout, useMultiTimeout, useDebounce  } from "../components/ErrorsTimes";
import { FaExclamationCircle } from "react-icons/fa";

function FormPosition() {
  const [subs, setSub] = useState([]);
  const [charges, setCharge] = useState([]);
  const [depen, setDepen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm();

  const { createPosition } = usePosition();

    // Auto-ocultar errores y mensajes tras 3 segundos
useMultiTimeout([
  { fn: () => clearErrors(), delay: 6000, deps: [errors] },
  { fn: () => setServerErrors([]), delay: 6000, deps: [serverErrors] },
  { fn: () => setSuccessMessage(''), delay: 6000, deps: [successMessage] },
]);

  // SELECT DE SUBGERENCIA
  const selectedSub = watch("id_sub");

  // FILTRAR LAS DEPENDENCIAS DE ESA SUBGERENCIA
  const dependenciasFiltradas = useMemo(
    () =>
      selectedSub
        ? depen.filter((d) => String(d.id_sub) === String(selectedSub))
        : [],
    [selectedSub, depen]
  );

  // CARGAR TODOS LOS CARGOS, DEOENDENCIAS Y SUBGERENCIAS
  useEffect(() => {
    (async () => {
      try {
        const chargesRes = await getAllChargeRequest();
        setCharge(chargesRes.data);

        const depenRes = await getAllDepenRequest();
        setDepen(depenRes.data);

        const subRes = await getAllSubRequest();
        setSub(subRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    })();
  }, []);
  // VALIDACIÓN DE ERRORES DEL SERVIDOR
  const onSubmit = async (data) => {
    setLoading(true);
    setServerErrors([]);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("id_pos", data.id_pos);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("id_charge", data.id_charge);
      formData.append("id_sub", data.id_sub);
      formData.append("id_depen", data.id_depen);

      await createPosition(formData);
      setSuccessMessage("Funcionario registrado exitosamente!");
    } catch (err) {
      console.error("Error al registar el Funcionario:", err);
      setServerErrors(
        err.response?.data?.errors
          ? err.response.data.errors
          : [
              err.response?.data?.message ||
                err.message ||
                "Error desconocido al registrar el Funcionario.",
            ]
      );
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="flex h-full items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F1F3F5]">
      <div className="bg-white max-w-4xl w-full p-8 rounded-lg shadow-lg border border-[#C8E2CB]">
        <h2 className="text-3xl font-bold text-[#2F7A4E] mb-6 text-center">
          Registro de Funcionarios
        </h2>

        {/* Errores de servidor */}
        {serverErrors.length > 0 && (
          <div className="bg-[#FFE5E5] p-4 text-[#C53030] rounded-md mb-6">
            <p className="font-semibold mb-2">Errores del servidor:</p>
            <ul className="list-disc list-inside text-sm">
              {serverErrors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-[#E6F7E6] p-4 text-[#27632A] rounded-md mb-6">
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            {/* DOCUMENTO */}
            <div>
              <label
                htmlFor="id_pos"
                className="block text-[#333333] text-sm font-medium mb-2"
              >
                Documento <span className="text-red-500">*</span>
              </label>
              <input
                id="id_pos"
                {...register('id_pos', {
                  required: 'El documento es obligatorio',
                })}
                className="w-full bg-white text-[#333333] px-4 py-2 rounded-md border border-[#C8E2CB] focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] focus:border-transparent transition duration-200"
                placeholder="C.C"
              />
              {errors.id_pos && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.id_pos.message}
                </p>
              )}
            </div>

            {/* NOMBRE COMPLETO */}
            <div>
              <label
                htmlFor="name"
                className="block text-[#333333] text-sm font-medium mb-2"
              >
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                {...register('name', {
                  required: 'El nombre es obligatorio',
                })}
                className="w-full bg-white text-[#333333] px-4 py-2 rounded-md border border-[#C8E2CB] focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] focus:border-transparent transition duration-200"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* CORREO FLA */}
            <div>
              <label
                htmlFor="email"
                className="block text-[#333333] text-sm font-medium mb-2"
              >
                Correo FLA <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'El correo es obligatorio',
                })}
                className="w-full bg-white text-[#333333] px-4 py-2 rounded-md border border-[#C8E2CB] focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] focus:border-transparent transition duration-200"
                placeholder="ejemplo@fla.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* CARGO */}
            <div>
              <label
                htmlFor="id_charge"
                className="block text-[#333333] text-sm font-medium mb-2"
              >
                Cargo <span className="text-red-500">*</span>
              </label>
              <select
                id="id_charge"
                {...register('id_charge', {
                  required: 'El cargo es obligatorio',
                })}
                className="w-full bg-white text-[#333333] px-4 py-2 rounded-md border border-[#C8E2CB] focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] focus:border-transparent transition duration-200 appearance-none pr-8"
              >
                <option value="">Seleccione el cargo</option>
                {charges.map((c) => (
                  <option key={c.id_charge} value={c.id_charge}>
                    {c.name_charge}
                  </option>
                ))}
              </select>
              {errors.id_charge && (
               <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.id_charge.message}
                </p>
              )}
            </div>

            {/* SUBGERENCIA */}
            <div>
              <label
                htmlFor="id_sub"
                className="block text-[#333333] text-sm font-medium mb-2"
              >
                Subgerencia <span className="text-red-500">*</span>
              </label>
              <select
                id="id_sub"
                {...register('id_sub', {
                  required: 'La subgerencia es obligatoria',
                })}
                className="w-full bg-white text-[#333333] px-4 py-2 rounded-md border border-[#C8E2CB] focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] focus:border-transparent transition duration-200 appearance-none pr-8"
              >
                <option value="">Seleccione la subgerencia</option>
                {subs.map((s) => (
                  <option key={s.id_sub} value={s.id_sub}>
                    {s.name_sub}
                  </option>
                ))}
              </select>
              {errors.id_sub && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.id_sub.message}
                </p>
              )}
            </div>

            {/* DEPENDENCIA */}
            <div>
              <label
                htmlFor="id_depen"
                className="block text-[#333333] text-sm font-medium mb-2"
              >
                Dependencia <span className="text-red-500">*</span>
              </label>
              <select
                id="id_depen"
                {...register('id_depen', {
                  required: 'La dependencia es obligatoria',
                })}
                disabled={!selectedSub}
                className="w-full bg-white text-[#333333] px-4 py-2 rounded-md border border-[#C8E2CB] focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] focus:border-transparent transition duration-200 appearance-none pr-8"
              >
                <option value="">
                  {selectedSub
                    ? 'Seleccione la dependencia'
                    : 'Seleccione primero subgerencia'}
                </option>
                {dependenciasFiltradas.map((d) => (
                  <option key={d.id_depen} value={d.id_depen}>
                    {d.name_depen}
                  </option>
                ))}
              </select>
              {errors.id_depen && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.id_depen.message}
                </p>
              )}
            </div>
          </div>

          {/* BOTÓN GUARDAR */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2F7A4E] hover:bg-[#255F3D] text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormPosition;
