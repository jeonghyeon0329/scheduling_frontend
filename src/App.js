import { HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { UserProvider } from './context/UserContext'; 
import ErrorBoundary from './components/ErrorBoundary';
import MainPage from './components/MainPage/MainPage';
import AdminPage from './components/AdminPage/AdminPage';

function App() {
  return (
    <UserProvider> 
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/main" element={<MainPage />} />
            <Route path="/admin/users" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/main" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </UserProvider> 
  );
}

export default App;
