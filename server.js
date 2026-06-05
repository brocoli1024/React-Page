const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error('Failed to open database:', err);
        process.exit(1);
    }
});

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const initDb = () => {
    db.serialize(() => {
        db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

        db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        total REAL NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

        db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id)
      )
    `);
    });
};

initDb();

const PRODUCTS = [
    { id: 1, name: '蘿蔔糕', price: 35, desc: '金黃酥脆，外酥內嫩', image: '/images/蘿蔔糕.jpg' },
    { id: 2, name: '蛋餅', price: 30, desc: '餅皮Q彈，香氣十足', image: '/images/蛋餅.jpg' },
    { id: 3, name: '起司蛋餅', price: 45, desc: '濃郁起司牽絲超滿足', image: '/images/起司蛋餅.jpg' },
    { id: 4, name: '火腿蛋吐司', price: 40, desc: '經典搭配，簡單美味', image: '/images/火腿蛋吐司.jpg' },
    { id: 5, name: '肉鬆吐司', price: 35, desc: '鹹香肉鬆，口感豐富', image: '/images/肉鬆吐司.jpg' },
    { id: 6, name: '卡啦雞腿堡', price: 75, desc: '酥脆雞腿，大口過癮', image: '/images/卡啦雞腿堡.jpg' },
    { id: 7, name: '豬排漢堡', price: 65, desc: '厚實豬排，香氣滿分', image: '/images/豬排漢堡.jpg' },
    { id: 8, name: '鮪魚三明治', price: 50, desc: '鮪魚濃郁，清爽不膩', image: '/images/鮪魚三明治.jpg' },
    { id: 9, name: '培根蛋堡', price: 55, desc: '培根鹹香，早餐首選', image: '/images/培根蛋堡.jpg' },
    { id: 10, name: '薯餅蛋吐司', price: 50, desc: '酥脆薯餅超有飽足感', image: '/images/薯餅蛋吐司.jpg' },
    { id: 11, name: '鐵板麵', price: 60, desc: '醬香濃郁，經典台味', image: '/images/鐵板麵.jpg' },
    { id: 12, name: '黑胡椒鐵板麵', price: 65, desc: '黑胡椒香氣超開胃', image: '/images/黑胡椒鐵板麵.jpg' },
    { id: 13, name: '雞塊', price: 45, desc: '外酥內嫩，一口接一口', image: '/images/雞塊.jpg' },
    { id: 14, name: '熱狗', price: 25, desc: '香嫩多汁，小朋友最愛', image: '/images/熱狗.jpg' },
    { id: 15, name: '炸薯條', price: 40, desc: '現炸酥脆，越吃越涮嘴', image: '/images/炸薯條.jpg' },
    { id: 16, name: '奶茶', price: 25, desc: '香濃順口，早餐必備', image: '/images/奶茶.jpg' },
    { id: 17, name: '紅茶', price: 20, desc: '古早味紅茶，清爽回甘', image: '/images/紅茶.jpg' },
    { id: 18, name: '豆漿', price: 25, desc: '香醇濃厚，傳統好滋味', image: '/images/豆漿.jpg' },
    { id: 19, name: '冰咖啡', price: 40, desc: '提神首選，香氣濃郁', image: '/images/冰咖啡.jpg' },
    { id: 20, name: '柳橙汁', price: 35, desc: '酸甜清爽，活力滿滿', image: '/images/柳橙汁.jpg' },
];

app.get('/api/products', (req, res) => {
    res.json(PRODUCTS);
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: '帳號與密碼不能為空。' });
    }

    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username.trim(), password, function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ success: false, message: '此帳號已存在，請選擇其他名稱。' });
            }
            return res.status(500).json({ success: false, message: '建立帳號失敗，請稍後再試。' });
        }

        res.json({ success: true, username, userId: this.lastID });
    });
    stmt.finalize();
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: '帳號與密碼不能為空。' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username.trim()], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: '登入失敗，請稍後再試。' });
        }
        if (!row) {
            return res.status(400).json({ success: false, message: '帳號不存在，請先註冊。' });
        }
        if (row.password !== password) {
            return res.status(400).json({ success: false, message: '密碼錯誤，請再試一次。' });
        }
        return res.json({ success: true, username: row.username, userId: row.id });
    });
});

app.get('/api/orders', (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ success: false, message: '缺少使用者名稱。' });
    }

    db.get('SELECT id FROM users WHERE username = ?', [username.trim()], (err, userRow) => {
        if (err) {
            return res.status(500).json({ success: false, message: '查詢訂單失敗，請稍後再試。' });
        }
        if (!userRow) {
            return res.status(400).json({ success: false, message: '使用者不存在。' });
        }

        db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [userRow.id], (err, orderRows) => {
            if (err) {
                return res.status(500).json({ success: false, message: '讀取訂單失敗。' });
            }

            const orderIds = orderRows.map(order => order.id);
            if (!orderIds.length) {
                return res.json([]);
            }

            db.all(`SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => '?').join(',')})`, orderIds, (err, itemsRows) => {
                if (err) {
                    return res.status(500).json({ success: false, message: '讀取訂單明細失敗。' });
                }

                const orders = orderRows.map(order => ({
                    id: order.id,
                    date: order.date,
                    total: order.total,
                    items: itemsRows.filter(item => item.order_id === order.id).map(item => ({
                        id: item.product_id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                }));

                return res.json(orders);
            });
        });
    });
});

app.post('/api/orders', (req, res) => {
    const { username, items } = req.body;
    if (!username || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: '下單資料不完整。' });
    }

    db.get('SELECT id FROM users WHERE username = ?', [username.trim()], (err, userRow) => {
        if (err) {
            return res.status(500).json({ success: false, message: '建立訂單失敗，請稍後再試。' });
        }
        if (!userRow) {
            return res.status(400).json({ success: false, message: '使用者不存在。' });
        }

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const date = new Date().toLocaleString('zh-TW', { hour12: false });

        db.run('INSERT INTO orders (user_id, date, total) VALUES (?, ?, ?)', [userRow.id, date, total], function (err) {
            if (err) {
                return res.status(500).json({ success: false, message: '建立訂單失敗，請稍後再試。' });
            }

            const orderId = this.lastID;
            const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, name, quantity, price) VALUES (?, ?, ?, ?, ?)');

            items.forEach(item => {
                stmt.run(orderId, item.id, item.name, item.quantity, item.price);
            });

            stmt.finalize(err => {
                if (err) {
                    return res.status(500).json({ success: false, message: '建立訂單明細失敗。' });
                }

                const order = {
                    id: orderId,
                    date,
                    total,
                    items: items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
                };

                return res.json({ success: true, order });
            });
        });
    });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
