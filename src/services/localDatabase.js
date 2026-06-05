const STORAGE_KEYS = {
    orders: 'orders',
    users: 'users',
    currentUser: 'user',
};

const loadFromStorage = (key, defaultValue) => {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
    } catch (error) {
        console.error(`Failed to load ${key} from localStorage`, error);
        return defaultValue;
    }
};

const saveToStorage = (key, value) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage`, error);
    }
};

export const loadOrders = () => loadFromStorage(STORAGE_KEYS.orders, []);
export const saveOrders = orders => saveToStorage(STORAGE_KEYS.orders, orders);

export const loadUsers = () => loadFromStorage(STORAGE_KEYS.users, []);
export const saveUsers = users => saveToStorage(STORAGE_KEYS.users, users);

export const loadCurrentUser = () => loadFromStorage(STORAGE_KEYS.currentUser, null);
export const saveCurrentUser = user => saveToStorage(STORAGE_KEYS.currentUser, user);
