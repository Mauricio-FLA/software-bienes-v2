import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAssign } from '../context/AssignContext';
import { useEffect } from 'react';
import { useState } from 'react';

function AssignPosition() {
  const { id_pos } = useParams();
  const navigate = useNavigate();

  const { assings, setAssigns, getByPosition, loadingList, errorList } = useAssign();
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if(id_pos) {
      getByPosition(id_pos).catch(() => {

      })
    }
  }, [id_pos, getByPosition])

    const handleGenerarActa = async () => {
    setPdfLoading(true);
    try {
      const resultArray = await getTransfersByPosition(id_pos);
      if (!Array.isArray(resultArray) || resultArray.length === 0) {
        throw new Error(`getTransfersByPosition NO devolvió un array válido.`);
      }
      const funcionarioInfo = resultArray[0];
      const fetchedTransfers = resultArray.slice(1);

      const positionInfo = {
        id_pos: funcionarioInfo.id_pos ?? 'NO APLICA',
        name: funcionarioInfo.name ?? 'NO APLICA',
        depen: funcionarioInfo.id_depen ?? 'NO APLICA',
      };

      const entrega = {
        name: funcionarioInfo.name ?? 'NO APLICA',
        id_pos: funcionarioInfo.id_pos ?? 'NO APLICA',
      };

      let recibe = { name: 'NO APLICA', id_pos: 'NO APLICA', position_depen: 'NO APLICA' };
      if (fetchedTransfers.length > 0) {
        const ultimo = fetchedTransfers[fetchedTransfers.length - 1];
        recibe = {
          name: ultimo.funcionario?.name ?? 'NO APLICA',
          id_pos: ultimo.funcionario?.email ?? 'NO APLICA',
          position_depen: ultimo.funcionario?.depen ?? 'NO APLICA',
        };
      }

      const pdfInstance = pdf(
        <ActaTransfersDocument
          position={positionInfo}
          transfers={fetchedTransfers}
          actaNumber={`ACTA-${id_pos}-${Date.now()}`}
          date={new Date().toLocaleDateString('es-CO')}
          entrega={entrega}
          recibe={recibe}
        />
      );

      const blob = await pdfInstance.toBlob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `acta_traslados_${id_pos}.pdf`;
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
  

  return (
    <div className='bg-[#F1F3F5] min-h-screen py-8 px-4 sm:px-6 lg:px-8'>
      {/* Botones: Volver - Generar Actas */}
      <div className="mb-6 flex justify-between">
        <button onClick={() => navigate(-1)}
          className='inline-flex items-center px-4 py-2 bg-[#2F7A4E] hover:gb-[#255F3D]
           text-white rounded-lg transition'> 
           &larr; Volver
           </button>
           <button onClick={handleGenerarActa} disabled={pdfLoading} className={`inline-flex items-center px-4 py-2 ${pdfLoading ? 'bg-gray-400 cursor-not-allowed': 
            'bg-[#2F7A4E] hover:bg-[#255F3D]'} text-white rounded-lg transition`}>
              {pdfLoading ? 'Generando...' : 'GenerarActa'}</button>
      </div>
      {/* Titulo con las cedula del funcionario consultado */}
      <h1 className='text-3xl font-bold '> Asignaciones del funcionario C.C: {id_pos}</h1>
        {/* Estados y errores */}


        <div>
          {assings.map((a) => {
            const funcionarioData = a.funcionario || {
              name: a.name,
              ema
            }
          })}
        </div>
    </div>
    
  )

 
}

export default AssignPosition 