import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>My Documents</h2>

      <button onClick={createDocument}>+ New Document</button>

      <ul>
        {documents.map((doc) => (
          <li
            key={doc.id}
            style={{ cursor: 'pointer', marginTop: '10px' }}
            onClick={() => navigate(`/documents/${doc.id}`)}
          >
            {doc.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
