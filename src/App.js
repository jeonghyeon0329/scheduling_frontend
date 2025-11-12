import { HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { UserProvider } from './context/UserContext'; 
import ErrorBoundary from './components/ErrorBoundary';
import MainPage from './components/MainPage/MainPage';
import AdminPage from './components/AdminPage/AdminPage';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <UserProvider> 
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/main" element={<MainPage />} />
              <Route path="/admin/users" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/main" replace />} />
            </Routes>
          </Router>
          <ToastContainer position="top-center" autoClose={2000} />
        </ErrorBoundary>
      </UserProvider> 
    </>
  );
}

export default App;
