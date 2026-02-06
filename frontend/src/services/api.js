// Lưu ý: Dùng biến môi trường VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
};

export const loginAPI = async (username, password) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return res.json();
};

export const getTransactionsAPI = async () => {
    const res = await fetch(`${API_URL}/transactions`, { headers: getAuthHeader() });
    if (res.status === 401 || res.status === 403) throw new Error("Unauthorized");
    return res.json();
};

export const addTransactionAPI = async (data) => {
    return fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
    }).then(res => res.json());
};

export const deleteTransactionAPI = async (id) => {
    return fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    }).then(res => res.json());
};