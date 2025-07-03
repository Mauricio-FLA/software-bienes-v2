// src/pages/AssignForm.jsx
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAssign } from '../context/AssignContext.jsx';
import { usePosition } from '../context/positionContext.jsx';
import FuncionarioSection from '../components/FuncionarioSection.jsx';
import ActivoSection from '../components/ActivoSection.jsx';

export default function AssignForm() {
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm({
    defaultValues: {
      id_pos: '',
      funcionario: { name: '', email: '', depen: '' },
      details: '',
      location: '',
      activos: [{ tag: '', image: null }],
    }
  });

  const { createAssign } = useAssign();
  const { getPosition } = usePosition();
  const navigate = useNavigate();
  const watchedIdPos = methods.watch('id_pos');

  // Autocompletar funcionario y ubicación
  useEffect(() => {
    methods.clearErrors('id_pos');
    if (!watchedIdPos) {
      methods.setValue('funcionario', { name: '', email: '', depen: '' });
      methods.setValue('location', '');
      return;
    }
    getPosition(watchedIdPos)
      .then(data => {
        methods.setValue('funcionario.name', data.name || '');
        methods.setValue('funcionario.email', data.email || '');
        methods.setValue('funcionario.depen', data.dependencia?.name_depen || '');
        methods.setValue('location', data.location || '');
      })
      .catch(err => {
        methods.setValue('funcionario', { name: '', email: '', depen: '' });
        methods.setValue('location', '');
        methods.setError('id_pos', {
          type: 'server',
          message: err.response?.data?.message || 'Funcionario no encontrado'
        });
      });
  }, [watchedIdPos, getPosition, methods]);

  const steps = [
    { name: 'Información Funcionario', fields: ['id_pos', 'location'], component: FuncionarioSection },
    {
      name: 'Detalles y Ubicación',
      fields: ['details', 'location'],
      component: ({ register }) => (
        <div className="grid grid-cols-1 gap-6 mb-8">
          <label htmlFor="details" className="block text-sm font-medium">Detalles Adicionales</label>
          <textarea
            id="details"
            {...register('details')}
            rows={4}
            className="w-full bg-gray-50 p-2 rounded border"
            placeholder="…"
          />
        </div>
      )
    },
    { name: 'Activos a Asignar', fields: ['activos'], component: ActivoSection }
  ];

  const handleNext = async () => {
    if (await methods.trigger(steps[currentStep].fields)) {
      setCurrentStep(step => step + 1);
    }
  };
  const handleBack = () => setCurrentStep(step => step - 1);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerErrors([]);
    setSuccessMessage('');
    try {
      const formData = new FormData();
      // Append each assignment and its image under 'files'
      data.activos.forEach((a, idx) => {
        formData.append(`assigns[${idx}][id_pos]`, data.id_pos.trim());
        formData.append(`assigns[${idx}][details]`, data.details.trim());
        formData.append(`assigns[${idx}][location]`, data.location.trim());
        formData.append(`assigns[${idx}][tag]`, a.tag.trim());
        if (a.image && a.image[0]) {
          formData.append('files', a.image[0]);
        }
      });

      // Debug: log FormData entries
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const created = await createAssign(formData);
      setSuccessMessage(`¡Creada(s) ${created.length} asignación(es)!`);
      methods.reset();
      setTimeout(() => navigate('/assign'), 1000);

    } catch (err) {
      console.error('Error al crear asignación:', err);
      const errs = err.response?.data?.errors
        || [err.response?.data?.message || err.message];
      setServerErrors(Array.isArray(errs) ? errs : [errs]);
    } finally {
      setLoading(false);
    }
  };

  const Current = steps[currentStep].component;
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <h2 className="text-2xl font-bold mb-4">Formulario de Asignación de Activos</h2>
          {serverErrors.length > 0 && (
            <div className="bg-red-100 p-3 rounded mb-4">
              <ul className="list-disc pl-5 text-sm text-red-800">
                {serverErrors.map((e,i)=><li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
          <div className="mb-8">
            <Current register={methods.register} errors={methods.formState.errors} />
          </div>
          <div className="flex justify-between">
            {currentStep > 0 && (
              <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-200 rounded">Anterior</button>
            )}
            {currentStep < steps.length - 1 ? (
              <button type="button" onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded ml-auto">Siguiente</button>
            ) : (
              <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded ml-auto">
                {loading ? 'Guardando…' : 'Finalizar'}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
