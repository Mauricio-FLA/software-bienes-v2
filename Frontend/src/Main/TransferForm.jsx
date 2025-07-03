// src/pages/TransferForm.jsx
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTransfer } from '../context/TransferContext.jsx';
import { usePosition } from '../context/positionContext.jsx';
import FuncionarioSection from '../components/FuncionarioSection.jsx';
import ActivoSection from '../components/ActivoSection.jsx';

export default function TransferForm() {
    const [loading, setLoading] = useState(false);
    const [serverErrors, setServerErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentStep, setCurrentStep] = useState(0);

    const methods = useForm({
        defaultValues: {
            id_posi: '',
            funcionario: { name: '', email: '', depen: '' },
            details: '',
            fecha_traslado: '',
            location: '', // Campo de ubicación a nivel del formulario/funcionario
            activos: [{ tag: '', item_name: '', item_brand: '', item_serial: '', item_descrip: '', image: null }],
        }
    });

    const { createAssign } = useTransfer();
    const { getPosition } = usePosition();
    const navigate = useNavigate();

    const watchedIdPosi = methods.watch('id_posi');

    useEffect(() => {
        methods.clearErrors('id_posi');

        if (!watchedIdPosi) {
            methods.setValue('funcionario', { name: '', email: '', depen: '' });
            return;
        }

        getPosition(watchedIdPosi)
            .then(data => {
                methods.setValue('funcionario', {
                    name: data.name,
                    email: data.email,
                    depen: data.dependencia?.name_depen
                });
                // Establecer la ubicación del funcionario si está disponible
                methods.setValue('location', data.location || '');
                methods.clearErrors('id_posi');
            })
            .catch(err => {
                methods.setValue('funcionario', { name: '', email: '', depen: '' });
                methods.setValue('location', ''); // LIMPIAR: Si no se encuentra funcionario
                const errorMessage = err.response?.data?.message || 'Funcionario no encontrado';
                methods.setError('id_posi', {
                    type: 'server',
                    message: errorMessage
                });
            });
    }, [watchedIdPosi, getPosition, methods]);

    const steps = [
        { name: 'Información del Funcionario', component: FuncionarioSection, fields: ['id_posi', 'fecha_traslado', 'location'] },
        { name: 'Detalles del Traslado', component: ({ register, errors }) => (
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 mb-8">
                <div>
                    <label
                        htmlFor="details"
                        className="block text-[#333333] text-sm font-medium mb-1"
                    >
                        Detalles Adicionales
                    </label>
                    <textarea
                        id="details"
                        {...methods.register('details')} // Usar methods.register directamente
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
                        placeholder="Cualquier información adicional sobre el traslado..."
                        rows="4"
                    />
                </div>
            </div>
        ), fields: ['details'] },
        { name: 'Activos a Trasladar', component: ActivoSection, fields: ['activos'] },
    ];

    const currentStepFields = steps[currentStep].fields;

    const handleNext = async () => {
        const isValid = await methods.trigger(currentStepFields);
        if (isValid) {
            setCurrentStep(prev => prev + 1);
        } else {
            console.log("Errores de validación en el paso actual:", methods.formState.errors);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const onSubmit = async data => {
        setLoading(true);
        setServerErrors([]);
        setSuccessMessage('');

        try {
            const formData = new FormData();
            formData.append('id_posi', data.id_posi);
            formData.append('fecha_traslado', data.fecha_traslado);
            formData.append('details', data.details || '');
            formData.append('location', data.location); // Campo de ubicación

            formData.append('funcionario[name]', data.funcionario.name);
            formData.append('funcionario[email]', data.funcionario.email);
            formData.append('funcionario[depen]', data.funcionario.depen);

            const activosArray = Array.isArray(data.activos) ? data.activos : [];
            activosArray.forEach((activo, index) => {
                formData.append(`activos[${index}][tag]`, activo.tag);
                formData.append(`activos[${index}][item_name]`, activo.item_name || '');
                formData.append(`activos[${index}][item_brand]`, activo.item_brand || '');
                formData.append(`activos[${index}][item_serial]`, activo.item_serial || '');
                formData.append(`activos[${index}][item_descrip]`, activo.item_descrip || '');
                // REMOVIDO: formData.append(`activos[${index}][location]`, activo.location); // Esto ya fue removido correctamente
            });

            // CORRECCIÓN CLAVE: Agrega la imagen una sola vez, si existe en el primer activo.
            // Si la imagen debe ser por traslado, y solo se sube UNA imagen, entonces toma la del primer activo.
            // Si cada activo debe tener su propia imagen, la lógica es diferente y multer debe usar .array() o .fields().
            // Asumiendo que la imagen es para todo el traslado:
            if (activosArray.length > 0 && activosArray[0].image && activosArray[0].image[0]) {
                formData.append('image', activosArray[0].image[0]);
            }
            // FIN CORRECCIÓN CLAVE

            await createAssign(formData);
            setSuccessMessage(`¡Asignación exitosa de ${activosArray.length} activo(s)!`);
            methods.reset();

            setTimeout(() => {
                navigate('/position');
            }, 1000);

        } catch (err) {
            console.error('Error al asignar ítem:', err);
            const errorMessage = err.response?.data?.errors || [err.response?.data?.message || err.message];
            setServerErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const CurrentComponent = steps[currentStep].component;

    return (
        <div className="flex items-center justify-center bg-[#F1F3F5] min-h-screen p-4 sm:p-6 lg:p-8">
            <div
                className="
                    bg-white
                    w-full
                    max-w-6xl {/* O el max-w que prefieras para que sea más amplio */}
                    p-6 sm:p-8
                    rounded-xl
                    shadow-2xl
                    border border-[#C8E2CB]
                "
            >
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} encType="multipart/form-data" noValidate>
                        <h2 className="text-3xl font-bold text-[#2F7A4E] mb-8 text-center">
                            Formulario de Traslado de Activos
                        </h2>

                        {/* Indicador de progreso */}
                        <div className="flex justify-center mb-8">
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-center">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center
                                        font-bold text-sm
                                        ${index === currentStep ? 'bg-[#2F7A4E] text-white shadow-md' : 'bg-[#E0E0E0] text-[#757575]'}
                                    `}>
                                        {index + 1}
                                    </div>
                                    <span className={`ml-2 mr-4 text-sm font-medium hidden sm:inline-block ${index === currentStep ? 'text-[#2F7A4E]' : 'text-[#757575]'}`}>
                                        {step.name}
                                    </span>
                                    {index < steps.length - 1 && (
                                        <div className="w-12 h-0.5 bg-[#E0E0E0] mx-2"></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {successMessage && (
                            <div className="bg-[#E6F7E6] text-[#27632A] p-3 sm:p-4 rounded-md mb-5 text-center">
                                {successMessage}
                            </div>
                        )}

                        {serverErrors.length > 0 && (
                            <div className="bg-[#FFE5E5] text-[#C53030] p-3 sm:p-4 rounded-md mb-5">
                                <p className="font-semibold mb-2">Errores:</p>
                                <ul className="list-disc list-inside text-sm">
                                    {serverErrors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Contenido del paso actual */}
                        <div className="mb-8 p-4 bg-[#F9F9F9] rounded-lg border border-[#E0E0E0]">
                               {/* Paso 0: Información del Funcionario + Fecha Traslado + Ubicación */}
                            {currentStep === 0 && (
                                <>
                                    <h3 className="text-xl font-semibold text-[#2F7A4E] mb-6 text-center">
                                        Paso 1: {steps[0].name}
                                    </h3>
                                    <FuncionarioSection />
                                </>
                            )}
                            {/* Paso 1: Detalles del Traslado (Observaciones) */}
                            {currentStep === 1 && (
                                <>
                                    <h3 className="text-xl font-semibold text-[#2F7A4E] mb-6 text-center">
                                        Paso 2: {steps[1].name}
                                    </h3>
                                    <CurrentComponent register={methods.register} errors={methods.formState.errors} />
                                </>
                            )}
                            {/* Paso 2: Activos a Trasladar */}
                            {currentStep === 2 && (
                                <>
                                    <h3 className="text-xl font-semibold text-[#2F7A4E] mb-6 text-center">
                                        Paso 3: {steps[2].name}
                                    </h3>
                                    <ActivoSection />
                                </>
                            )}
                        </div>

                        {/* Botones de navegación del formulario */}
                        <div className="flex justify-between items-center mt-6">
                            {currentStep > 0 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="
                                        bg-[#E0E0E0] hover:bg-[#C0C0C0] text-[#333333]
                                        font-semibold py-2 px-6 rounded-md
                                        transition duration-200
                                    "
                                >
                                    Anterior
                                </button>
                            )}

                            {currentStep < steps.length - 1 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="
                                        bg-[#2F7A4E] hover:bg-[#255F3D] text-white
                                        font-semibold py-2 px-6 rounded-md ml-auto
                                        transition duration-200
                                    "
                                >
                                    Siguiente
                                </button>
                            )}

                            {currentStep === steps.length - 1 && (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        w-full md:w-auto
                                        bg-[#2F7A4E] hover:bg-[#255F3D] text-white
                                        font-semibold py-3 px-8 rounded-md
                                        transition duration-300 ease-in-out
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    "
                                >
                                    {loading ? 'Guardando...' : 'Finalizar Traslado'}
                                </button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}