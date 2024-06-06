import { Route, Routes } from 'react-router';
import AdminRoutes from './routes/AdminRoutes';
import PrivateRoutes from './routes/PrivateRoutes';


function App() {
  return (
    <>
    <Routes>
    <Route element={<PrivateRoutes />}>
        <Route exact path="/admin/*" element={<AdminRoutes />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
