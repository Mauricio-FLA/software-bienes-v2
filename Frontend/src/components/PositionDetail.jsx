import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSpinner, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { usePosition } from '../context/PositionContext';
import axios from '../api/axios';
import { getAllChargeRequest, getAllSubRequest, getAllDepenRequest, getAllStatus } from '../api/select';

export default function PositionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPosition, updatePosition, loadingUpdate } = usePosition();

  const [charges, setCharges] = useState([]);
  const [subgerencias, setSubgerencias] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filteredDependencias, setFilteredDependencias] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const selectedSub = watch('id_sub');

  // auto-clear messages
  useEffect(() => {
    if (serverErrors.length) {
      const t = setTimeout(() => setServerErrors([]), 5000);
      return () => clearTimeout(t);
    }
  }, [serverErrors]);
  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  // Load initial data
  useEffect(() => {
    async function load() {
      setLoading(true);
      setServerErrors([]);
      try {
        const pos = await getPosition(id);
        setInitialData(pos);

        const [chgRes, subRes, depRes, statRes] = await Promise.all([
          getAllChargeRequest(),
          getAllSubRequest(),
          getAllDepenRequest(),
          getAllStatus()
        ]);
        setCharges(chgRes.data);
        setSubgerencias(subRes.data);
        setDependencias(depRes.data);
        setStatuses(statRes.data);

        // Pre-filter dependencias for initial subgerencia
        if (pos.id_sub && depRes.data.length) {
          setFilteredDependencias(
            depRes.data.filter(d => d.id_sub === Number(pos.id_sub))
          );
        }

        reset({
          name: pos.name || '',
          email: pos.email || '',
          id_charge: pos.id_charge || '',
          id_sub: pos.id_sub || '',
          id_depen: pos.id_depen || '',
          id_status: pos.id_status || ''
        });
      } catch (err) {
        const msg = err.response?.data?.message || 'Error cargando datos.';
        setServerErrors([msg]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, getPosition, reset]);

  // Filter dependencias when subgerencia changes
  useEffect(() => {
    if (selectedSub && dependencias.length) {
      setFilteredDependencias(
        dependencias.filter(d => d.id_sub === Number(selectedSub))
      );
    } else {
      setFilteredDependencias([]);
    }
  }, [selectedSub, dependencias]);

  const onSubmit = async data => {
    setServerErrors([]);
    setSuccessMessage('');
    try {
      const formData = new FormData();
      // compare fields
      if (data.name !== initialData.name) formData.append('name', data.name);
      if (data.email !== initialData.email) formData.append('email', data.email);
      if (+data.id_charge !== initialData.id_charge) formData.append('id_charge', data.id_charge);
      if (+data.id_sub !== initialData.id_sub) formData.append('id_sub', data.id_sub);
      if (+data.id_depen !== initialData.id_depen) formData.append('id_depen', data.id_depen);
      if (+data.id_status !== initialData.id_status) formData.append('id_status', data.id_status);

      if (!formData.entries().next().done) {
        await updatePosition(id, formData);
        setSuccessMessage('¡Usuario actualizado exitosamente!');
        setTimeout(() => navigate('/positions'), 1500);
      } else {
        setSuccessMessage('No se detectaron cambios.');
      }
    } catch (err) {
      const errs = err.response?.data?.errors || [err.response?.data?.message || err.message];
      setServerErrors(Array.isArray(errs) ? errs : [errs]);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-gray-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Funcionario</h2>
      {serverErrors.length > 0 && (
        <div className="bg-red-50 border border-red-300 p-4 rounded mb-4">
          <FaExclamationCircle className="text-red-600 inline mr-2" />
          <ul className="list-disc list-inside text-red-700">
            {serverErrors.map((e,i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-300 p-4 rounded mb-4">
          <FaCheckCircle className="text-green-600 inline mr-2" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            {...register('name', { required: 'El nombre es obligatorio' })}
            defaultValue={initialData?.name}
            className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}            
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            {...register('email', { required: 'El email es obligatorio', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Email inválido' } })}
            defaultValue={initialData?.email}
            className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}          
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Cargo</label>
          <select
            {...register('id_charge', { required: 'El cargo es obligatorio' })}
            defaultValue={initialData?.id_charge}
            className={`w-full px-3 py-2 border rounded ${errors.id_charge ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Seleccione cargo</option>
            {charges.map(c => <option key={c.id_charge} value={c.id_charge}>{c.name_charge}</option>)}
          </select>
          {errors.id_charge && <p className="text-red-500 text-sm">{errors.id_charge.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Subgerencia</label>
          <select
            {...register('id_sub', { required: 'La subgerencia es obligatoria' })}
            defaultValue={initialData?.id_sub}
            className={`w-full px-3 py-2 border rounded ${errors.id_sub ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Seleccione subgerencia</option>
            {subgerencias.map(s => <option key={s.id_sub} value={s.id_sub}>{s.name_sub}</option>)}
          </select>
          {errors.id_sub && <p className="text-red-500 text-sm">{errors.id_sub.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Dependencia</label>
          <select
            {...register('id_depen', { required: 'La dependencia es obligatoria' })}
            defaultValue={initialData?.id_depen}
            className={`w-full px-3 py-2 border rounded ${errors.id_depen ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Seleccione dependencia</option>
            {filteredDependencias.map(d => <option key={d.id_depen} value={d.id_depen}>{d.name_depen}</option>)}
          </select>
          {errors.id_depen && <p className="text-red-500 text-sm">{errors.id_depen.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Estado</label>
          <select
            {...register('id_status', { required: 'El estado es obligatorio' })}
            defaultValue={initialData?.id_status}
            className={`w-full px-3 py-2 border rounded ${errors.id_status ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Seleccione estado</option>
            {statuses.map(st => <option key={st.id_status} value={st.id_status}>{st.name_status}</option>)}
          </select>
          {errors.id_status && <p className="text-red-500 text-sm">{errors.id_status.message}</p>}
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loadingUpdate}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loadingUpdate ? (<><FaSpinner className="animate-spin inline mr-2"/>Actualizando...</>) : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
