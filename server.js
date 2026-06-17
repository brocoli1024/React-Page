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

        db.run(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL UNIQUE,
                rating INTEGER NOT NULL,
                comment TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY(order_id) REFERENCES orders(id)
            )
        `);

        db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id)');
    });
};

initDb();

const PRODUCTS = [
    { id: 1, name: '火腿蛋吐司', price: 35, desc: '經典火腿蛋搭配現烤吐司。', image: '/images/火腿蛋吐司.jpg' },
    { id: 2, name: '蛋餅', price: 30, desc: '外皮香煎、口感軟嫩。', image: '/images/蛋餅.jpg' },
    { id: 3, name: '起司蛋餅', price: 45, desc: '濃郁起司搭配香煎蛋餅。', image: '/images/起司蛋餅.jpg' },
    { id: 4, name: '培根蛋堡', price: 40, desc: '培根、雞蛋與漢堡麵包的飽足組合。', image: '/images/培根蛋堡.jpg' },
    { id: 5, name: '薯餅蛋吐司', price: 35, desc: '酥脆薯餅加上滑嫩雞蛋。', image: '/images/薯餅蛋吐司.jpg' },
    { id: 6, name: '豬排漢堡', price: 75, desc: '厚實豬排搭配清爽生菜。', image: '/images/豬排漢堡.jpg' },
    { id: 7, name: '卡啦雞腿堡', price: 65, desc: '香辣雞腿排，口感酥脆。', image: '/images/卡啦雞腿堡.jpg' },
    { id: 8, name: '鮪魚三明治', price: 50, desc: '鮪魚沙拉與柔軟吐司。', image: '/images/鮪魚三明治.jpg' },
    { id: 9, name: '肉鬆吐司', price: 55, desc: '肉鬆與吐司的鹹香早餐。', image: '/images/肉鬆吐司.jpg' },
    { id: 10, name: '黑胡椒鐵板麵', price: 50, desc: '濃郁黑胡椒醬拌炒麵條。', image: '/images/黑胡椒鐵板麵.jpg' },
    { id: 11, name: '鐵板麵', price: 60, desc: '熱騰騰鐵板麵，早餐也能很滿足。', image: '/images/鐵板麵.jpg' },
    { id: 12, name: '蘿蔔糕', price: 65, desc: '煎到外酥內軟的台式點心。', image: '/images/蘿蔔糕.jpg' },
    { id: 13, name: '炸薯條', price: 45, desc: '酥脆金黃，適合加點分享。', image: '/images/炸薯條.jpg' },
    { id: 14, name: '熱狗', price: 25, desc: '簡單美味的小點。', image: '/images/熱狗.jpg' },
    { id: 15, name: '雞塊', price: 40, desc: '外酥內嫩的經典點心。', image: '/images/雞塊.jpg' },
    { id: 16, name: '豆漿', price: 25, desc: '香濃豆漿，冷熱皆宜。', image: '/images/豆漿.jpg' },
    { id: 17, name: '紅茶', price: 20, desc: '清爽解膩的早餐飲品。', image: '/images/紅茶.jpg' },
    { id: 18, name: '奶茶', price: 25, desc: '茶香與奶香平衡。', image: '/images/奶茶.jpg' },
    { id: 19, name: '冰咖啡', price: 40, desc: '提神醒腦的冰涼咖啡。', image: '/images/冰咖啡.jpg' },
    { id: 20, name: '柳橙汁', price: 35, desc: '酸甜清新的果汁。', image: '/images/柳橙汁.jpg' },
];

const normalizeReview = review => review ? {
    id: review.id,
    orderId: review.order_id,
    rating: review.rating,
    comment: review.comment || '',
    created_at: review.created_at,
} : null;

app.get('/api/products', (req, res) => {
    res.json(PRODUCTS);
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const normalizedUsername = username?.trim();

    if (!normalizedUsername || !password) {
        return res.status(400).json({ success: false, message: '請輸入帳號與密碼。' });
    }

    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(normalizedUsername, password, function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ success: false, message: '此帳號已被使用，請換一個帳號。' });
            }
            return res.status(500).json({ success: false, message: '註冊失敗，請稍後再試。' });
        }

        return res.json({ success: true, username: normalizedUsername, userId: this.lastID });
    });
    stmt.finalize();
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const normalizedUsername = username?.trim();

    if (!normalizedUsername || !password) {
        return res.status(400).json({ success: false, message: '請輸入帳號與密碼。' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [normalizedUsername], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: '登入失敗，請稍後再試。' });
        }
        if (!row || row.password !== password) {
            return res.status(400).json({ success: false, message: '帳號或密碼錯誤。' });
        }

        return res.json({ success: true, username: row.username, userId: row.id });
    });
});

app.get('/api/orders', (req, res) => {
    const username = req.query.username?.trim();
    if (!username) {
        return res.status(400).json({ success: false, message: '缺少使用者名稱。' });
    }

    db.get('SELECT id FROM users WHERE username = ?', [username], (err, userRow) => {
        if (err) {
            return res.status(500).json({ success: false, message: '讀取使用者失敗。' });
        }
        if (!userRow) {
            return res.status(400).json({ success: false, message: '找不到使用者。' });
        }

        db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [userRow.id], (err, orderRows) => {
            if (err) {
                return res.status(500).json({ success: false, message: '讀取訂單失敗。' });
            }

            const orderIds = orderRows.map(order => order.id);
            if (!orderIds.length) {
                return res.json([]);
            }

            const placeholders = orderIds.map(() => '?').join(',');
            db.all(`SELECT * FROM order_items WHERE order_id IN (${placeholders})`, orderIds, (err, itemRows) => {
                if (err) {
                    return res.status(500).json({ success: false, message: '讀取訂單明細失敗。' });
                }

                db.all(`SELECT * FROM reviews WHERE order_id IN (${placeholders})`, orderIds, (err, reviewRows) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: '讀取評價失敗。' });
                    }

                    const orders = orderRows.map(order => {
                        const review = reviewRows.find(row => row.order_id === order.id);
                        return {
                            id: order.id,
                            date: order.date,
                            total: order.total,
                            items: itemRows.filter(item => item.order_id === order.id).map(item => ({
                                id: item.product_id,
                                name: item.name,
                                quantity: item.quantity,
                                price: item.price,
                            })),
                            review: normalizeReview(review),
                        };
                    });

                    return res.json(orders);
                });
            });
        });
    });
});

app.post('/api/orders', (req, res) => {
    const { username, items } = req.body;
    const normalizedUsername = username?.trim();

    if (!normalizedUsername || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: '訂單資料不完整。' });
    }

    db.get('SELECT id FROM users WHERE username = ?', [normalizedUsername], (err, userRow) => {
        if (err) {
            return res.status(500).json({ success: false, message: '建立訂單失敗。' });
        }
        if (!userRow) {
            return res.status(400).json({ success: false, message: '找不到使用者。' });
        }

        const normalizedItems = items.map(item => ({
            id: Number(item.id),
            name: String(item.name || ''),
            quantity: Math.max(1, Number(item.quantity) || 1),
            price: Number(item.price) || 0,
        }));
        const total = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const date = new Date().toLocaleString('zh-TW', { hour12: false });

        db.run('INSERT INTO orders (user_id, date, total) VALUES (?, ?, ?)', [userRow.id, date, total], function (err) {
            if (err) {
                return res.status(500).json({ success: false, message: '建立訂單失敗。' });
            }

            const orderId = this.lastID;
            const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, name, quantity, price) VALUES (?, ?, ?, ?, ?)');

            normalizedItems.forEach(item => {
                stmt.run(orderId, item.id, item.name, item.quantity, item.price);
            });

            stmt.finalize(err => {
                if (err) {
                    return res.status(500).json({ success: false, message: '建立訂單明細失敗。' });
                }

                return res.json({
                    success: true,
                    order: {
                        id: orderId,
                        date,
                        total,
                        items: normalizedItems,
                        review: null,
                    },
                });
            });
        });
    });
});

app.post('/api/reviews', (req, res) => {
    const orderId = Number(req.body.orderId);
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || '').trim();

    if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({ success: false, message: '缺少有效的訂單編號。' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: '評分必須是 1 到 5 分。' });
    }
    if (comment.length > 500) {
        return res.status(400).json({ success: false, message: '評論請勿超過 500 字。' });
    }

    db.get('SELECT id FROM orders WHERE id = ?', [orderId], (err, orderRow) => {
        if (err) {
            return res.status(500).json({ success: false, message: '查詢訂單失敗。' });
        }
        if (!orderRow) {
            return res.status(404).json({ success: false, message: '找不到此訂單。' });
        }

        const createdAt = new Date().toLocaleString('zh-TW', { hour12: false });
        db.get('SELECT id FROM reviews WHERE order_id = ?', [orderId], (err, existingReview) => {
            if (err) {
                return res.status(500).json({ success: false, message: '查詢評價失敗。' });
            }

            if (existingReview) {
                db.run(
                    'UPDATE reviews SET rating = ?, comment = ?, created_at = ? WHERE order_id = ?',
                    [rating, comment || null, createdAt, orderId],
                    err => {
                        if (err) {
                            return res.status(500).json({ success: false, message: '更新評價失敗。' });
                        }

                        return res.json({
                            success: true,
                            message: '評價已更新。',
                            review: { id: existingReview.id, orderId, rating, comment, created_at: createdAt },
                        });
                    }
                );
                return;
            }

            db.run(
                'INSERT INTO reviews (order_id, rating, comment, created_at) VALUES (?, ?, ?, ?)',
                [orderId, rating, comment || null, createdAt],
                function (err) {
                    if (err) {
                        return res.status(500).json({ success: false, message: '提交評價失敗。' });
                    }

                    return res.json({
                        success: true,
                        message: '感謝您的評價！',
                        review: { id: this.lastID, orderId, rating, comment, created_at: createdAt },
                    });
                }
            );
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
