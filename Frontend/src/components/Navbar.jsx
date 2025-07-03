import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContex";
import LogoFLA from "../assets/logo_fla.png";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Define rutas y sus etiquetas
  const routes = [
    { path: "/home", label: "Inicio"},
    { path: "/bienes", label: "Bienes" },
    { path: "/devolution", label: "Devoluciones"},
    { path: "/contracts", label: "Contratos" },
    { path: "/assign", label: "Asignar Activo" },
    { path: "/position", label: "Funcionarios" },
    { path: "/transfer", label: "Traslados" },
  ];

  // Función para determinar si una ruta está activa (exacta o anidada)
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-[#2B2B2B] border-b border-[#2F7A4E] px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Logo y título */}
      <div className="flex items-center">
        <img
          src={LogoFLA}
          alt="Logo Fábrica de Licores de Antioquia"
          className="h-10 w-auto mr-3"
        />
        <Link
          to="/home"
          className={`text-lg font-semibold ml-1 ${
            isActive("/home") ? "text-white border-b-2 border-[#2F7A4E]" : "text-[#E0E0E0] hover:text-[#A3C1A3]"
          } transition-colors`}
        >
          Gestión de Bienes
        </Link>
      </div>

      {/* Menú de navegación */}
      <ul className="flex space-x-6">
        {isAuthenticated ? (
          <>
            {routes.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`text-sm font-medium pb-1 ${
                    isActive(path)
                      ? "text-white border-b-2 border-[#2F7A4E]"
                      : "text-[#E0E0E0] hover:text-[#A3C1A3]"
                  } transition-colors`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={logout}
                className="text-sm font-medium text-[#E0E0E0] hover:text-[#A3C1A3] transition-colors"
              >
                Salir
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className={`text-sm font-medium pb-1 ${
                  isActive("/") && location.pathname === "/"
                    ? "text-white border-b-2 border-[#2F7A4E]"
                    : "text-[#E0E0E0] hover:text-[#A3C1A3]"
                } transition-colors`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/consultar"
                className={`text-sm font-medium pb-1 ${
                  isActive("/register")
                    ? "text-white border-b-2 border-[#2F7A4E]"
                    : "text-[#E0E0E0] hover:text-[#A3C1A3]"
                } transition-colors`}
              >
                Consultar Activos
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
