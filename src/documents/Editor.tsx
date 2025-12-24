import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function Editor() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/documents/${id}`).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content || '');
    });
  }, [id]);

  const saveDocument = async () => {
    setSaving(true);
    await api.put(`/documents/${id}`, { title, content });
    setSaving(false);
    alert('Saved');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto' }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', fontSize: '20px', marginBottom: '10px' }}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={15}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <button onClick={saveDocument} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
