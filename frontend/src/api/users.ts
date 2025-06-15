export async function updateCurrentUser(data: { name?: string; email?: string; bio?: string }) {
  const token = localStorage.getItem('access_token'); // Adapt as needed
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Profile update failed');
  }
  return await res.json();
}
