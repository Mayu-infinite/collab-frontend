import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Dashboard coming next</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
