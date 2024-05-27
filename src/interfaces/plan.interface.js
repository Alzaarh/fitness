module.exports = (data) => ({
  id: data.id,
  name: data.name,
  url: data.url,
  description: data.description,
  sessions: data.sessions,
  startedAt: data.started_at,
  createdAt: data.created_at,
  meals: data.meals,
});
