import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContex";
import { Link, useNavigate } from "react-router-dom";

// Asegúrate de tener el logo en /src/assets/logo_fla.png
import LogoFLA from "../assets/logo_fla.png";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, isAuthenticated, errors: signinErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-[#EBF2E9]">
      <div className="bg-[#F9FAF9] max-w-md w-full p-8 rounded-lg shadow-lg border border-[#C8E2CB]">
        {/* Logo FLA */}
        <div className="flex justify-center mb-6">
          <img
            src={LogoFLA}
            alt="Logo Fábrica de Licores de Antioquia"
            className="h-16 w-auto"
          />
        </div>

        {/* Errores de signin */}
        {signinErrors.length > 0 && (
          <div className="mb-4">
            {signinErrors.map((error, i) => (
              <div
                key={i}
                className="bg-red-600 text-white px-3 py-2 rounded-md mb-2 text-sm"
              >
                {error}
              </div>
            ))}
          </div>
        )}

        <h1 className="text-3xl font-semibold text-[#2F7A4E] text-center mb-4">
          Iniciar Sesión
        </h1>

        <form onSubmit={onSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-[#333333] font-medium mb-1"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              className="w-full border border-[#CCCCCC] bg-[#FFFFFF] text-[#333333] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] focus:border-transparent"
              placeholder="usuario@fla.com.co"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                El correo es obligatorio
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-[#333333] font-medium mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
              className="w-full border border-[#CCCCCC] bg-[#FFFFFF] text-[#333333] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F7A4E] focus:border-transparent"
              placeholder="Contraseña FLA"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                La contraseña es obligatoria
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#2F7A4E] hover:bg-[#255F3D] text-white font-bold py-2 rounded-md transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-[#555555] text-sm mt-4">
          ¿Eres Funcionario?{" "}
          <Link to="/consultar" className="text-[#2F7A4E] hover:underline">
            Consultar Activos
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
