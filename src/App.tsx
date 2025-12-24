import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Dashboard from './documents/Dashboard';
import Editor from './documents/Editor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/documents/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
