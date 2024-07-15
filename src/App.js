import './App.css';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import { RootPage } from './pages/root';
import { SmartstorePage } from './pages/smartstore';
import { GlobalConnectionContextProvider } from './contexts/GlobalConnectionContextProvider';
import { GlobalSmartstoreContextProvider } from './contexts/GlobalSmartstoreContextProvider';

function App() {
  return (
    <>
      <HashRouter>
        <GlobalConnectionContextProvider>
          <GlobalSmartstoreContextProvider>
            <AppCore />
          </GlobalSmartstoreContextProvider>
        </GlobalConnectionContextProvider>
      </HashRouter>
    </>
  );
}

function AppCore() {

  return (
    <>
      <Routes>
        <Route path='/' element={<RootPage />} />
        <Route path='/smartstore' element={<SmartstorePage />} />
        <Route path='/coupang' element={<RootPage />} />
      </Routes>
    </>
  )
}
export default App;
