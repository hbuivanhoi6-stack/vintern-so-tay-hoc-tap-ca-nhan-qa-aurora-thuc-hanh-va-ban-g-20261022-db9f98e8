import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { decodeNotes, encodeNotes, makeNote, filterNotes } from './model.js';

const STAGE = 4;
const KEY = 'vintern.qa.notes.v1';
type Note = { id: string; title: string; content: string; tags: string[]; createdAt: string; updatedAt: string };
function loadNotes(): { notes: Note[]; issue: string } {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return { notes: [], issue: '' };
    return { notes: decodeNotes(raw), issue: '' };
  } catch { return { notes: [], issue: 'Stored data cannot be read. Original data is preserved; saving is disabled to prevent overwriting it.' }; }
}
function App() {
  const [initial] = useState(loadNotes);
  const [notes, setNotes] = useState<Note[]>(initial.notes);
  const [selected, setSelected] = useState<string | null>(null);
  const [title, setTitle] = useState(''), [content, setContent] = useState(''), [tags, setTags] = useState('');
  const [error, setError] = useState(initial.issue), [query, setQuery] = useState(''), [tagFilter, setTagFilter] = useState(''), [exportPreview, setExportPreview] = useState('');
  function clear() { setSelected(null); setTitle(''); setContent(''); setTags(''); setError(initial.issue); }
  function persist(next: Note[]): boolean {
    if (initial.issue) { setError(initial.issue); return false; }
    try { localStorage.setItem(KEY, encodeNotes(next)); setNotes(next); setError(''); return true; }
    catch { setError('Cannot save notes. Storage may be full or unavailable. Your editor draft is retained.'); return false; }
  }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) { setError('A title is required.'); return; }
    if (title.trim().length > 200 || content.length > 20000) { setError('Title must be at most 200 characters; content at most 20000.'); return; }
    const previous = notes.find(n => n.id === selected);
    const note: Note = makeNote({ title, content, tags }, previous);
    if (persist(previous ? notes.map(n => n.id === previous.id ? note : n) : [...notes, note])) clear();
  }
  function remove(note: Note) {
    if (!window.confirm('Delete this note? Cancel keeps the original note.')) return;
    if (persist(notes.filter(n => n.id !== note.id)) && selected === note.id) clear();
  }
  function exportNotes() {
    const json = encodeNotes(notes);
    setExportPreview(json);
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'notes-v1.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const matches: Note[] = STAGE < 3 ? notes : filterNotes(notes, query, tagFilter);
  return <main style={{ maxWidth: 760, margin: 'auto', padding: 16, fontFamily: 'system-ui', overflowWrap: 'anywhere' }}>
    <h1>Notes — synthetic learning project</h1><p>Owned role-play fixture. No real student's academic result is affected.</p>
    <button data-testid="note-new" type="button" onClick={clear}>New note</button>
    <form onSubmit={save} style={{ display: 'grid', gap: 12, marginBlock: 20 }}>
      <label>Title<input data-testid="note-title" value={title} onChange={e => setTitle(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}/></label>
      <label>Content<textarea data-testid="note-content" value={content} onChange={e => setContent(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}/></label>
      <label>Tags<input data-testid="note-tags" value={tags} onChange={e => setTags(e.target.value)} style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}/></label>
      <button data-testid="note-save" type="submit" disabled={!!initial.issue}>Save</button><p data-testid="note-error" role="alert">{error}</p>
    </form>
    {STAGE >= 3 && <section aria-label="Find notes" style={{ display: 'grid', gap: 12 }}><label>Search<input data-testid="note-search" value={query} onChange={e => setQuery(e.target.value)}/></label><label>Filter by exact tag<input data-testid="note-tag-filter" value={tagFilter} onChange={e => setTagFilter(e.target.value)}/></label><p role="status">{matches.length} notes found</p></section>}
    {STAGE >= 3 && matches.length === 0 && <p data-testid="note-empty" role="status">{notes.length === 0 ? "No notes yet. Use New note to create your first note." : "No matching notes. Clear the search or tag filter to see all notes."}</p>}
    {matches.map(note => <article data-testid="note-card" key={note.id} style={{ borderBottom: '1px solid #aaa', paddingBlock: 12 }}><h2>{note.title}</h2><p>{note.content}</p><p>{note.tags.join(', ')}</p><time dateTime={note.updatedAt}>{new Date(note.updatedAt).toLocaleString()}</time><div><button data-testid="note-edit" type="button" onClick={() => { setSelected(note.id); setTitle(note.title); setContent(note.content); setTags(note.tags.join(', ')); setError(initial.issue); }}>Edit</button>{STAGE >= 3 && <button data-testid="note-delete" type="button" onClick={() => remove(note)}>Delete</button>}</div></article>)}
    {STAGE >= 4 && <section aria-label="Export notes"><h2>Export and handover</h2><button data-testid="note-export" type="button" onClick={exportNotes}>Export JSON</button><pre data-testid="note-export-preview" aria-live="polite" style={{ whiteSpace: 'pre-wrap' }}>{exportPreview}</pre></section>}
  </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
