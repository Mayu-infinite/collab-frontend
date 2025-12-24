import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Dashboard from './documents/Dashboard';
import Editor from './documents/Editor';
import ProtectedRoute from './routes/ProtectedRoute';
import Signup from './auth/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents/:id"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
