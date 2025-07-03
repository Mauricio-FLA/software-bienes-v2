import { useNavigate } from 'react-router-dom';

function HomeUser  () {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-center px-4"
      style={{
        backgroundImage: 'linear-gradient(to bottom right, #FFFFFF, #DCC6B6)',
      }}
    >
      <main className="flex flex-col items-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-semibold text-[#7C635F]">
          Bienvenido a Bienes FLA - EICE
        </h1>
        <p className="text-lg sm:text-xl text-[#4A3F3A] max-w-md">
          Consulta de forma rápida y sencilla el estado y la ubicación de los activos asignados a tu documento.
          ¡Tu información, siempre a tu alcance!
        </p>
        <button
          aria-label="Consultar Activos"
          className="mt-4 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transform transition-transform 
          focus:outline-none focus:ring-2 focus:ring-[#C1A57B] hover:scale-105 hover:shadow-xl"
          style={{ backgroundColor: '#C1A57B', color: '#FFFFFF' }}
          onClick={() => navigate('/consultar')}>
          Consultar Mis Activos
        </button>
      </main>
    </div>
  );
};

export default HomeUser;