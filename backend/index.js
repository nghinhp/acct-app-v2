const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "bi_mat_khong_the_bat_mi";

// Middleware kiểm tra Token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "Vui lòng đăng nhập" });
    try {
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        req.user = jwt.verify(cleanToken, SECRET_KEY);
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token hết hạn hoặc không hợp lệ" });
    }
};

// 1. API Đăng ký
app.post('/api/register', (req, res) => {
    const { username, password, full_name } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Thiếu thông tin" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)";

    db.query(sql, [username, hashedPassword, full_name], (err, result) => {
        if (err) return res.status(500).json({ error: "Lỗi đăng ký (Có thể trùng tên)" });
        res.json({ message: "Đăng ký thành công!" });
    });
});

// 2. API Đăng nhập
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], (err, results) => {
        if (results.length === 0) return res.status(401).json({ error: "Sai tài khoản/mật khẩu" });

        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Sai tài khoản/mật khẩu" });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ message: "Login OK", token, user: { full_name: user.full_name } });
    });
});

// 3. API Lấy danh sách (Cần Token)
app.get('/api/transactions', verifyToken, (req, res) => {
    // Sắp xếp ngày mới nhất lên đầu
    db.query("SELECT * FROM transactions ORDER BY date DESC", (err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi lấy dữ liệu" });
        res.json(results);
    });
});

// 4. API Thêm giao dịch (Cần Token)
app.post('/api/transactions', verifyToken, (req, res) => {
    const { date, amount, content, type } = req.body;
    const sql = "INSERT INTO transactions (date, amount, content, type) VALUES (?, ?, ?, ?)";
    db.query(sql, [date, amount, content, type], (err) => {
        if (err) return res.status(500).json({ error: "Lỗi lưu dữ liệu" });
        res.json({ message: "Đã thêm thành công" });
    });
});

// 5. API Xóa giao dịch
app.delete('/api/transactions/:id', verifyToken, (req, res) => {
    db.query("DELETE FROM transactions WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Lỗi xóa" });
        res.json({ message: "Đã xóa" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy port ${PORT}`);
});