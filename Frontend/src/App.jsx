import { BrowserRouter, Routes, Route } from "react-router-dom";

// Rutas de los context ./Context/
import { AuthProvider } from "./context/AuthContex";
import { ItemProvider } from "./context/ItemContext";
import { PositionProvider } from "./context/positionContext";
import { TransferProvider } from "./context/TransferContext";
import { ContractProvider } from "./context/ContractContext";
import { AssignProvider } from "./context/AssignContext";

// Rutas de los formularios, funcionalidad principal del Software V2 ./Main/
import LoginPage from "./Main/Login";
import ItemForm from "./Main/FormBienes";
import FormPosition from "./Main/FormPosition";
import TransferForm from "./Main/TransferForm";
import ConsultarActas from './Main/ConsultarActivos';
import ContractFormPage from "./Main/FormContract";
import AssignForm from "./Main/AssignForm";

// Rutas de paginas ./Pages
import HomePage from "./pages/HomePage";
import PositionPage from "./pages/PositionPage";
import BienesPage from "./pages/BienesPage";
import TransferPages from "./pages/TransferPages";
import ContractPages from "./pages/ContractPages";
import AssignPage from "./pages/AssignPage";
import Devolution from "./pages/Devolution";

// Rutas de los componentes ./Components/
import Navbar from "./components/Navbar";
import PositionDetail from "./components/PositionDetail";
import ContractDetails from "./components/ContractDetails";
import TransferDetails from "./components/TransferDetails";
import FuncionarioTransfers from "./components/FuncionarioTransfers";
import UpdateTtransfer from './components/UpdateTransfer'
import AssignPosition from "./components/AssignPosition";
import AssignDetails from "./components/AssignDetails";
import ItemDetails from "./components/ItemDetails";

// Ruta de Rutas protegidas 
import ProtectedRoute from "./ProtectedRoute";

// Ruta de las Actas ./pdf
import Acta from './pdf/Acta'
import HomeUser from "./HomeUser";

function App() {
  return (
    <AuthProvider>
      <ItemProvider>
          <PositionProvider>
            <TransferProvider>
              <ContractProvider>
                <AssignProvider>
                <BrowserRouter>
                  <Navbar />
                    <Routes>

                      {/* RUTAS ACCESIBLES SIN AUTENTICACIÓN*/}
                      <Route path="/" element={<HomeUser/>}/>
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path="/consultar" element={<ConsultarActas />} />
                    <Route path="/assign/position/:id_pos" element={<AssignPosition />} />
                    <Route path="/assign/:id" element={<AssignDetails />} />
                    <Route path="/assign/" element={<AssignPage />} />
                    <Route path="/assign/new" element={<AssignForm />} />
                    <Route path="/item/:id" element={<ItemDetails/>} />
                    <Route path="/devolution" element={<Devolution/>}/>
                    
                      {/* RUTAS PROTEGIDAS */}
                    <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<HomePage />} />
                      <Route path="/acta" element={<Acta />} />
                      <Route path="/transfer/:id" element={<UpdateTtransfer />} />
                      <Route path='/position/:id/info' element={<PositionDetail />} />
                      <Route path='/positions/:id_pos/assign' element={<FuncionarioTransfers />} />
                      <Route path="/contracts/new" element={<ContractFormPage />} />
                      <Route path="/contracts" element={<ContractPages />} />
                      <Route path='/contract/:id/info' element={<ContractDetails />} />
                      <Route path='/transfers/:id/info' element={<TransferDetails />} />
                      <Route path="/position" element={<PositionPage />} />
                      <Route path="/position/new" element={<FormPosition />} />
                      <Route path="/transfer" element={<TransferPages />} />
                      <Route path="/assing" element={<TransferForm />} />
                      <Route path="/bienes" element={<BienesPage />} />
                      <Route path="/item/new" element={<ItemForm />} />
                    </Route>

                  </Routes>
                </BrowserRouter>
                </AssignProvider>
              </ContractProvider>
            </TransferProvider>
          </PositionProvider>
      </ItemProvider>
    </AuthProvider>
  );
}

export default App;