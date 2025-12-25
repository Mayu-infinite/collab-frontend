import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import PageContainer from '../components/PageContainer';
import './Editor.css';

export default function Editor() {
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  const lastSaved = useRef({ title: '', content: '' });

  /* Initial load */
  useEffect(() => {
    if (!id) return;

    api.get(`/documents/${id}`).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content || '');
      lastSaved.current = {
        title: res.data.title,
        content: res.data.content || '',
      };
      setLoading(false);
    });
  }, [id]);

  /* AUTOSAVE */
  useEffect(() => {
    if (!id || loading) return;

    const interval = setInterval(async () => {
      if (
        title === lastSaved.current.title &&
        content === lastSaved.current.content
      ) {
        return;
      }

      try {
        setSaveStatus('saving');
        await api.put(`/documents/${id}`, { title, content });
        lastSaved.current = { title, content };
        setSaveStatus('saved');
      } catch (err) {
        console.error('Autosave failed', err);
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [title, content, id, loading]);

  if (loading) {
    return (
      <PageContainer>
        <p className="editor-loading">Loading document...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="editor-container">
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled document"
          className="editor-title"
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing here..."
          className="editor-content"
        />

        {/* Status */}
        <div className="editor-actions">
          <span className="editor-status">
            {saveStatus === 'saving' ? 'Saving…' : 'Saved'}
          </span>
        </div>
      </div>
    </PageContainer>
  );
}
