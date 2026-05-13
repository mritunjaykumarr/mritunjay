import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdFree from './pages/AdFree';
import Loader from './components/Loader';

function App() {
  return (
    <BrowserRouter>
      <Loader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adfree" element={<AdFree />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
