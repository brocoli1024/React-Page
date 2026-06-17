const handleResponse = async response => {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const message = data?.message || '請求失敗，請稍後再試。';
        throw new Error(message);
    }
    return data;
};

export const fetchProducts = async () => {
    const response = await fetch('/api/products');
    return handleResponse(response);
};

export const login = async ({ username, password }) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
};

export const register = async ({ username, password }) => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
};

export const fetchOrders = async username => {
    const response = await fetch(`/api/orders?username=${encodeURIComponent(username)}`);
    return handleResponse(response);
};

export const createOrder = async ({ username, items }) => {
    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, items }),
    });
    return handleResponse(response);
};

export const submitReview = async ({ orderId, rating, comment }) => {
    const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, rating, comment }),
    });
    return handleResponse(response);
};
