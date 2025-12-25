import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import './Dashboard.css';

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
    <PageContainer>
      <div
        className="dashboard-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px', // reduced spacing
        }}
      >
        {/* Header / Sidebar */}
        <div
          className="dashboard-sidebar"
          style={{
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3 className="dashboard-title" style={{ margin: 0 }}>
              My Documents
            </h3>

            <button
              onClick={createDocument}
              className="dashboard-btn-primary"
            >
              + New
            </button>
          </div>
        </div>

        {/* Documents Grid */}
        <div
          className="dashboard-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/documents/${doc.id}`)}
              className="dashboard-card"
              style={{
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
              }}
            >
              <h4 className="dashboard-card-title" style={{ margin: 0 }}>
                {doc.title}
              </h4>
              <p className="dashboard-card-sub">
                Click to edit
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
