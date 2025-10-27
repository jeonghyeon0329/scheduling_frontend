import { HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import MainPage from './components/MainPage/MainPage';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
