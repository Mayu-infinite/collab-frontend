import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

type Document = {
  id: string;
  title: string;
  createdAt: string;
};

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/documents').then((res) => {
      setDocuments(res.data);
    });
  }, []);

  const createDocument = async () => {
    const res = await api.post('/documents', {
      title: 'Untitled Document',
    });
    navigate(`/documents/${res.data.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <h2 style={{ margin: 0 }}>My Documents</h2>

        <button
          onClick={handleLogout}
          style={{
            padding: '8px 14px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      {/* Create Button */}
      <button
        onClick={createDocument}
        style={{
          padding: '10px 16px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        + New Document
      </button>

      {/* Documents List */}
      {documents.length === 0 ? (
        <p style={{ color: '#777' }}>No documents yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {documents.map((doc) => (
            <li
              key={doc.id}
              onClick={() => navigate(`/documents/${doc.id}`)}
              style={{
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#f5f5f5')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'white')
              }
            >
              {doc.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
