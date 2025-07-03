import React, { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { useAssign } from '../context/AssignContext';
import logo from '../assets/logo_fla.png';
import firmaDigital from '../assets/firma.Villegas.png';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1px solid #eee',
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  titleSection: {
    flex: 2,
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  subtitle: {
    fontSize: 9,
    textAlign: 'center',
    color: '#555',
  },
  documentInfo: {
    flexDirection: 'column',
    fontSize: 8,
    textAlign: 'right',
    flex: 1,
  },
  documentInfoText: {
    marginBottom: 2,
  },
  commitmentText: {
    fontSize: 8,
    marginBottom: 15,
    lineHeight: 1.2,
    color: '#333',
  },
  actaInfoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  actaInfoBlock: {
    flex: 1,
    padding: 5,
  },
  actaInfoLabel: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  actaInfoValue: {
    marginBottom: 3,
    fontSize: 9,
    color: '#333',
  },
 table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 15,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    backgroundColor: '#f2f2f2',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 8,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    fontSize: 8,
  },
  colDate: { width: '15%' },
  colTag: { width: '10%' },
  colLocation: { width: '15%' },
  colDetails: { width: '25%' },
  colItem: { width: '40%' },
  colSerial: { width: '10%' },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 10,
    paddingTop: 10,
    borderTop: '1px solid #eee',
  },
  signatureBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  signatureLine: {
    borderBottom: '1px solid #000',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 5,    // un poquito de espacio antes de la cédula
  },
  signatureLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  signatureCedula: {
    fontSize: 8,
    marginTop: 8,
  },
   signatureImage: {
    width: 120,
    height: 50,
    alignSelf: 'center',
    marginBottom: 4,    // sólo 4px de espacio al fondo
  },

  signaturePlaceholder: {
    width: 120,
    height: 50,
    alignSelf: 'center',
    marginBottom: 4,    // mismo hueco que la imagen
  },
   noteSection: {
    marginTop: 60,
    paddingHorizontal: 10,
  },
  noteText: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#171717',
    lineHeight: 1.2,
    textAlign: 'center',
  },
});


// Subcomponentes (DocumentHeader, CommitmentText, ActaInformation, AssignTable, SignatureBlocks) se mantienen sin cambios

const DocumentHeader = ({ logoSrc, title, subtitle, docCode, docVersion, approvalDate }) => (
  <View style={styles.header}>
    {logoSrc && <Image src={logoSrc} style={styles.logo} />}
    <View style={styles.titleSection}>
      <Text style={styles.mainTitle}>{title || 'NO APLICA'}</Text>
      <Text style={styles.subtitle}>{subtitle || 'NO APLICA'}</Text>
    </View>
    <View style={styles.documentInfo}>
      <Text style={styles.documentInfoText}>Código: {docCode || 'NO APLICA'}</Text>
      <Text style={styles.documentInfoText}>Versión: {docVersion || 'NO APLICA'}</Text>
      <Text style={styles.documentInfoText}>Fecha Aprobación: {approvalDate || 'NO APLICA'}</Text>
    </View>
  </View>
);

const CommitmentText = () => (
  <Text style={styles.commitmentText}>
    Me comprometo a hacer buen uso de los activos fijos que recibo, cuidar de sus partes como
    (Software, licencias y sistema operativo), no retirar, ni borrar los adhesivos que contienen
    los seriales y la placa de identificación de la Dirección de Adquisiciones, Bienes y Seguros.
  </Text>
);

const ActaInformation = ({ position, entrega, recibe }) => (
  <>
    {/* --- Bloque original de datos de origen y destino --- */}
    <View style={styles.actaInfoRow}>
      <View style={styles.actaInfoBlock}>
        <Text style={styles.actaInfoLabel}>
          Secretaría de Origen: {'FLA'}
        </Text>
        <Text style={styles.actaInfoLabel}>
          Dependencia Origen: { 'Recursos Corporativos'}
        </Text>
        <Text style={styles.actaInfoValue}>
          <Text style={styles.actaInfoLabel}>Funcionario que Entrega: </Text> {'Juan Alberto Villegas'}
        </Text>
      </View>

      <View style={styles.actaInfoBlock}>
        <Text style={styles.actaInfoLabel}>
          Secretaría de Destino: {'FLA'}
        </Text>
        <Text style={styles.actaInfoLabel}>
          Dependencia: {recibe.dependencia || 'NO APLICA'}
        </Text>
        <Text style={styles.actaInfoValue}>
          <Text style={styles.actaInfoLabel}>Funcionario que Recibe: </Text> {recibe.name || '—'}
        </Text>
        <Text style={styles.actaInfoValue}>
          <Text style={styles.actaInfoLabel}>Cédula: </Text> {entrega.id_pos || '—'}
        </Text>
      </View>
    </View>

    {/* --- Nuevo bloque con Motivo, Piso, Puesto y Ext --- */}
    <View style={styles.actaInfoRow}>
      {/* Motivo con casillas */}
      <Text style={styles.actaInfoLabel}>
        Motivo:&nbsp;
        Retiro __☐&nbsp;&nbsp;
        Traslado Activos __☐&nbsp;&nbsp;
        Traslado de puesto __☐ ☐&nbsp;&nbsp;
      </Text>

      {/* Datos adicionales de ubicación */}
      <Text style={styles.actaInfoLabel}>
        Piso: _____
      </Text>
      <Text style={styles.actaInfoLabel}>
        Puesto: _______☐&nbsp;&nbsp;
      </Text>
      <Text style={styles.actaInfoLabel}>
        Ext.: _______
      </Text>
    </View>
  </>
);

const AssignTable = ({ assigns }) => (
  <View style={styles.table}>
    {/* Cabecera de la tabla */}
    <View style={styles.tableRow}>
      <View style={[styles.tableColHeader, styles.colDate]}>
        <Text>FECHA</Text>
      </View>
      <View style={[styles.tableColHeader, styles.colTag]}>
        <Text>PLACA</Text>
      </View>
      <View style={[styles.tableColHeader, styles.colItem]}>
        <Text>Denominación de Activo</Text>
      </View>
      <View style={[styles.tableColHeader, styles.colDetails]}>
        <Text>DETALLES</Text>
      </View>
      <View style={[styles.tableColHeader, styles.colSerial]}>
        <Text>SERIAL</Text>
      </View>
    </View>

    {/* Filas de traslados */}
    {assigns.map((t, idx) => (
      <View style={styles.tableRow} key={idx}>
        <View style={[styles.tableCol, styles.colDate]}>
          <Text>
            {t.date_assi
              ? new Date(t.date_assi).toLocaleDateString('es-CO', {
                  year: 'numeric', month: '2-digit', day: '2-digit',
                })
              : 'NO APLICA'}
          </Text>
        </View>

        <View style={[styles.tableCol, styles.colTag]}>
          <Text>{t.tag || 'NO APLICA'}</Text>
        </View>

        <View style={[styles.tableCol, styles.colItem]}>
          <Text>
            {t.item?.name_item || 'NO APLICA'} / {t.item?.brand || 'NO APLICA'}
          </Text>
        </View>

        <View style={[styles.tableCol, styles.colDetails]}>
          <Text>{t.details || 'NO APLICA'}</Text>
        </View>

        <View style={[styles.tableCol, styles.colSerial]}>
          <Text>{t.item?.serialNumber || 'NO APLICA'}</Text>
        </View>
      </View>
    ))}
  </View>
);

const SignatureBlocks = ({entrega}) => (
   <View style={styles.signatureSection}>
    
    <View style={styles.signatureBlock}>
      <Text style={styles.signatureLabel}>Entrega</Text>
      <Image src={firmaDigital} style={styles.signatureImage} />
      <View style={styles.signatureLine} />
      <Text style={styles.signatureCedula}>Cédula: 98523861</Text>
    </View>

    <View style={styles.signatureBlock}>
      <Text style={styles.signatureLabel}>Recibe</Text>
      <View style={styles.signaturePlaceholder} />
      <View style={styles.signatureLine} />
      <Text style={styles.signatureCedula}>Cédula: </Text> 
    </View>

    <View style={styles.signatureBlock}>
      <Text style={styles.signatureLabel}>Vo. Bo. Vigía del Patrimonio</Text>
      <Image src={firmaDigital} style={styles.signatureImage} />
      <View style={styles.signatureLine} />
      <Text style={styles.signatureCedula}>Cédula: 98523861</Text>
    </View>
  </View>
);

const ActaAssignDocument = ({
  position = { id_pos: '—', name: '—', email: '—', dependencia: '—' },
  assigns  = [],
  actaNumber = '_________',
  date: providedDate,
  entrega = { name: '—', id_pos: '—' },
  recibe = { name: '—', id_pos: '—', dependencia: '—' }
  
}) => {
  
  const hoy = new Date();
  const fechaHoy = `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`;
  const dateToShow = providedDate || fechaHoy;

  


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <DocumentHeader
          logoSrc={logo}
          title="ACTA DE TRASLADOS DE ACTIVOS FIJOS"
          subtitle="Registro de movimientos internos de bienes"
          docCode="FO-M3-P9-027"
          docVersion="1"
          approvalDate={fechaHoy}
        />

        <CommitmentText />

        <View style={styles.section}>
          <ActaInformation position={position} entrega={entrega} recibe={recibe} />
        </View>

        <AssignTable assigns={assigns} />

        <SignatureBlocks entrega={entrega} recibe={recibe} />

        <View>
          <Text style={styles.noteText}>
            NOTA: RECUERDE QUE SI VA A TRASLADAR LOS BIENES A OTRO PISO, DEPENDENCIA O FUERA DEL EDIFICIO, EL ACTA INICIAL DE INVENTARIO DEBE LLEVAR LAS FIRMAS DE LOS JEFES QUE ESTÁN AUTORIZANDO, DE LO CONTRARIO NO SE FIRMA ESTE CAMPO.
          </Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 8, textAlign: 'right' }}>
            Acta: {actaNumber} | Fecha: {dateToShow}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const ActaTransfersPDF = ({ id_pos, actaNumber, date }) => {
  const { getAssignsByPosition } = useAssign();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigns, setAssigns] = useState([]);
  const [position, setPosition] = useState({ id_pos: '—', name: '—', email: '—', id_depen: '—' });
  const [entrega, setEntrega] = useState({ name: '—', id_pos: '—' });
  const [recibe, setRecibe] = useState({ name: '—', id_pos: '—', position_depen: '—' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Desestructurar respuesta correcta
        const { funcionario, assigns: fetchedAssigns } = await getAssignsByPosition(id_pos);

        // Datos del funcionario
        setPosition({
          id_pos: funcionario.id_pos,
          name: funcionario.name,
          email: funcionario.email,
          id_depen: funcionario.id_depen || '—'
        });

        // Asignaciones
        setAssigns(fetchedAssigns || []);

        // Entrega = funcionario
        setEntrega({
          name: funcionario.name,
          id_pos: funcionario.id_pos,
          dependencia: funcionario.dependencia?.name_depen || '—'
        });

        
        if (fetchedAssigns && fetchedAssigns.length > 0) {
          const latest = fetchedAssigns[0];
          setRecibe({
            name: latest.item?.name_item || '—',
            id_pos: latest.tag || '—',
            position_depen: funcionario.id_depen
          });
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos del acta.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id_pos, getAssignsByPosition]);

  if (loading) return <div>Cargando acta…</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ margin: '20px 0' }}>
      <PDFDownloadLink
        document={
          <ActaAssignDocument
            position={position}
            assigns={assigns}
            actaNumber={actaNumber}
            date={date}
            entrega={entrega}
            recibe={recibe}
          />
        }
        fileName={`acta_${position.name}_${id_pos}.pdf`}
      >
        {({ loading: pdfLoading }) =>
          pdfLoading
            ? 'Generando PDF…'
            : `Descargar Acta de Asignación - ${position.name}`
        }
      </PDFDownloadLink>
    </div>
  );
};

export default ActaAssignDocument;
