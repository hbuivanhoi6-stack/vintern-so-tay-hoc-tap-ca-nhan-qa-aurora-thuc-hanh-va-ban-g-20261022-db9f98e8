import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
type Note = { id: string; title: string; content: string; tags: string[] };
const validateTitle = false;
function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [title, setTitle] = useState(''), [content, setContent] = useState(''), [tags, setTags] = useState(''), [error, setError] = useState('');
  function clear() { setSelected(null); setTitle(''); setContent(''); setTags(''); setError(''); }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (validateTitle && !title.trim()) { setError('A title is required.'); return; }
    const note = { id: selected ?? crypto.randomUUID(), title: title.trim(), content, tags: [...new Set(tags.split(',').map(tag => tag.trim()).filter(Boolean))] };
    setNotes(current => selected ? current.map(item => item.id === selected ? note : item) : [...current, note]); clear();
  }
  return <main style={{ maxWidth: 760, margin: 'auto', padding: 16, fontFamily: 'system-ui' }}>
    <h1>Notes — owned QA fixture</h1><p>This synthetic implementation is for integration acceptance, not a real student's assessment.</p>
    <button data-testid="note-new" type="button" onClick={clear}>New note</button>
    <form onSubmit={save} style={{ display: 'grid', gap: 12, marginBlock: 20 }}>
      <label>Title<input data-testid="note-title" value={title} onChange={event => setTitle(event.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}/></label>
      <label>Content<textarea data-testid="note-content" value={content} onChange={event => setContent(event.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}/></label>
      <label>Tags<input value={tags} onChange={event => setTags(event.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}/></label>
      <button data-testid="note-save" type="submit">Save</button><p data-testid="note-error" role="alert">{error}</p>
    </form>
    {notes.map(note => <article data-testid="note-card" key={note.id} style={{ border: '1px solid #aaa', padding: 12, marginBlock: 12, overflowWrap: 'anywhere' }}>
      <h2>{note.title}</h2><p>{note.content}</p><p>{note.tags.join(', ')}</p>
      <button data-testid="note-edit" type="button" onClick={() => { setSelected(note.id); setTitle(note.title); setContent(note.content); setTags(note.tags.join(', ')); setError(''); }}>Edit</button>
    </article>)}
  </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
