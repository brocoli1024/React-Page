const STORAGE_KEYS = {
    orders: 'orders',
    users: 'users',
    currentUser: 'user',
    points: 'points',
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

export const getUserPoints = username => {
    const pointsData = loadFromStorage(STORAGE_KEYS.points, {});
    return Number(pointsData[username] || 0);
};

export const addUserPoints = (username, points) => {
    if (!username) return 0;
    const pointsData = loadFromStorage(STORAGE_KEYS.points, {});
    const nextPoints = Math.max(0, getUserPoints(username) + Number(points || 0));
    pointsData[username] = nextPoints;
    saveToStorage(STORAGE_KEYS.points, pointsData);
    return nextPoints;
};

export const spendUserPoints = (username, points) => {
    if (!username) return { success: false, points: 0, message: '缺少使用者資訊。' };
    const currentPoints = getUserPoints(username);
    const requestedPoints = Number(points || 0);

    if (requestedPoints <= 0) {
        return { success: false, points: currentPoints, message: '兌換點數必須大於 0。' };
    }

    if (currentPoints < requestedPoints) {
        return { success: false, points: currentPoints, message: '點數不足。' };
    }

    const nextPoints = currentPoints - requestedPoints;
    const pointsData = loadFromStorage(STORAGE_KEYS.points, {});
    pointsData[username] = nextPoints;
    saveToStorage(STORAGE_KEYS.points, pointsData);

    return { success: true, points: nextPoints, message: '兌換成功。' };
};
