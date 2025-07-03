// src/pages/FuncionarioAssigns.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssign } from '../context/AssignContext';
import { pdf } from '@react-pdf/renderer';
import ActaAssignDocument from '../pdf/AssigActa';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { DevolutionAssignRequest } from '../api/Assign';

export default function AssignPosition() {
  const { id_pos } = useParams();
  const navigate = useNavigate();
  const {
    positionData,
    getAssignsByPosition,
    loadingByPos,
    errorByPos,
  } = useAssign();

  const [pdfLoading, setPdfLoading]  = useState(false);

  useEffect(() => {
    if (id_pos) {
      getAssignsByPosition(id_pos);
    }
  }, [id_pos, getAssignsByPosition]);

  const { funcionario, assigns } = positionData;

  const handleGenerarActa = async () => {
    setPdfLoading(true);
    try {
      const positionInfo = {
        id_pos: funcionario.id_pos ?? 'NO APLICA',
        name: funcionario.name ?? 'NO APLICA',
        dependencia: funcionario.dependencia?.name_depen ?? 'NO APLICA'
      };

      const entrega = {
        name: funcionario.name ?? 'NO APLICA',
        id_pos: funcionario.id_pos ?? 'NO APLICA'
      };

      let recibe = { name: 'NO APLICA', id_pos: 'NO APLICA', position_depen: 'NO APLICA'};
      if (assigns.length > 0) {
  const latest = assigns[0];
  recibe = {
    name: latest.funcionario?.name ?? 'NO APLICA',   // ← Esto está mal
    id_pos: latest.tag ?? 'NO APLICA',
    dependencia: funcionario.dependencia?.name_depen ?? 'NO APLICA'
  };
}



      const pdfInstance = pdf(
        <ActaAssignDocument
          position={positionInfo}
          assigns={assigns}
          actaNumber={`ACTA-ASIGNACIÓN-${id_pos}-${Date.now()}`}
          date={new Date().toLocaleDateString('es-CO')}
          entrega={entrega}
          recibe={recibe}
        />
      );
      

      const blob = await pdfInstance.toBlob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `acta_asignación_${positionInfo.name}_${id_pos}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Error al generar Acta para funcionario ${id_pos}:`, err);
      alert(`Ocurrió un problema al generar el PDF: ${err.message}`);
    } finally {
      setPdfLoading(false);
    }
  };


  const handleDevolutionAssignRequest = async(id_assi) => {
    try {
      const confirmarAccion = window.confirm(
        "¿Está seguro de realizar la devolución de este activo?"
      );
      if(!confirmarAccion) return;

      const res = await DevolutionAssignRequest(id_assi);
      if(res.status === 200 || res.status === 204) {
        alert('Devolución realizada exitosamente.');
        await getAssignsByPosition(id_pos);
      } else {
        const errorData = await res.json();
        console.error("Error en la respuesta de Devolución: ", res, errorData);
        alert(`Error al realizar el traslado: ${errorData.message || 'Erro desconocido'} `)
      }
    } catch (error) {
     console.error("Error al realizar la devolución del activo.", error);
     alert(`No se puede realizar la devolución de activo. error en la conexión o el servidor.`) 
    }

  }

  return (
    <div className="bg-[#F1F3F5] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-[#2F7A4E] hover:bg-[#255F3D] text-white rounded-lg transition"
        >
          &larr; Volver
        </button>
        <button
          onClick={handleGenerarActa}
          disabled={pdfLoading}
          className={`inline-flex items-center px-4 py-2 ${
            pdfLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2F7A4E] hover:bg-[#255F3D]'
          } text-white rounded-lg transition`}
        >
          {pdfLoading ? 'Generando…' : 'Generar Acta'}
        </button>
      </div>

      <h1 className="text-3xl font-bold text-[#2F7A4E] mb-6">
        Asignaciones del funcionario C.C {id_pos}
      </h1>

      {loadingByPos && <p className="text-center text-[#555]">Cargando asignaciones…</p>}
      {errorByPos && <p className="text-center text-[#C53030]">Error: {errorByPos}</p>}
      {!loadingByPos && !errorByPos && assigns.length === 0 && (
        <p className="text-center text-[#555]">No hay asignaciones registradas del funcionario con C.C {id_pos}.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {assigns.map((a) => (
          <div
            key={a.id_assi}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition border border-[#D1E7D1] relative"
          >
            <button
              onClick={() => navigate(`/transfer/${a.id_assi}`)}
              className="absolute top-3 right-12 p-2 m-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              title="Editar traslado"
            >
              <FaEdit className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDevolutionAssignRequest(a.id_assi)}
              className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              title="Eliminar traslado"
            >
              <FaTrashAlt className="w-4 h-4" />
            </button>

            <p className="text-[#333333] mb-3">
              <strong>Ubicación:</strong> {a.location || 'NO APLICA'}
            </p>

            <div className="mb-3">
              <h3 className="text-[#2F7A4E] font-medium mb-1">Funcionario</h3>
              <p className="text-[#555555] text-sm">{funcionario.name || 'NO APLICA'}</p>
              <p className="text-[#555555] text-sm">{funcionario.email || 'NO APLICA'}</p>
              <p className="text-[#555555] text-sm">{funcionario.dependencia?.name_depen || 'NO APLICA'}</p>
            </div>

            <div className="mb-3">
              <h3 className="text-[#2F7A4E] font-medium mb-1">Ítem</h3>
              <p className="text-[#555555] text-sm">{a.item?.name_item || 'NO APLICA'}</p>
              <p className="text-[#555555] text-sm">Marca: {a.item?.brand || 'NO APLICA'}</p>
              <p className="text-[#555555] text-sm">N/S: {a.item?.serialNumber || 'NO APLICA'}</p>
            </div>

            {a.details && (
              <p className="text-[#333333] mt-2">
                <strong>Detalles:</strong> {a.details}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
