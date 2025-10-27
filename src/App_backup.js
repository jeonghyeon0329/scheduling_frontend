import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import MainPage from './components/MainPage/MainPage';

import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router future={{ v7_relativeSplatPath: true }}>
        <div className="App">
          {/* 페이지 라우팅 */}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
