export function validNote(n) {
  return !!n && typeof n === 'object' && typeof n.id === 'string' && !!n.id && typeof n.title === 'string' && !!n.title.trim() && typeof n.content === 'string' && Array.isArray(n.tags) && n.tags.every(t => typeof t === 'string') && typeof n.createdAt === 'string' && Number.isFinite(Date.parse(n.createdAt)) && typeof n.updatedAt === 'string' && Number.isFinite(Date.parse(n.updatedAt));
}
export function decodeNotes(raw) {
  if (raw === null) return [];
  const value = JSON.parse(raw);
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.notes) || !value.notes.every(validNote) || new Set(value.notes.map(n => n.id)).size !== value.notes.length) throw Error('Invalid note schema');
  return value.notes;
}
export function encodeNotes(notes) {
  if (!Array.isArray(notes) || !notes.every(validNote)) throw Error('Invalid notes');
  return JSON.stringify({ schemaVersion: 1, notes }, null, 2);
}
export function makeNote(input, previous, now = new Date().toISOString(), id = crypto.randomUUID()) {
  if (!input.title.trim()) throw Error('A title is required.');
  if (input.title.trim().length > 200 || input.content.length > 20000) throw Error('Title must be at most 200 characters; content at most 20000.');
  return { id: previous?.id ?? id, title: input.title.trim(), content: input.content, tags: [...new Set(input.tags.split(',').map(t => t.trim()).filter(Boolean))], createdAt: previous?.createdAt ?? now, updatedAt: now };
}
export function filterNotes(notes, query, tag) {
  return notes.filter(n => `${n.title} ${n.content} ${n.tags.join(' ')}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) && (!tag.trim() || n.tags.some(t => t.toLocaleLowerCase() === tag.trim().toLocaleLowerCase())));
}
