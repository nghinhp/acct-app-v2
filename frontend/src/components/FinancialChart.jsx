// import React from 'react';
// Import các thành phần của Recharts
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FinancialChart = ({ transactions }) => {
    // 1. Dùng hàm reduce để tính tổng Thu và tổng Chi từ mảng dữ liệu thô
    const summary = transactions.reduce((acc, curr) => {
        if (curr.type === 'thu') {
            acc.income += Number(curr.amount);
        } else {
            acc.expense += Math.abs(Number(curr.amount)); // Lấy trị tuyệt đối cho số âm
        }
        return acc;
    }, { income: 0, expense: 0 });

    // 2. Chuyển đổi thành dạng dữ liệu mà Recharts hiểu được
    const data = [
        { name: 'Tổng Thu', value: summary.income },
        { name: 'Tổng Chi', value: summary.expense },
    ];

    // Màu sắc: Thu (Xanh lá), Chi (Đỏ cam)
    const COLORS = ['#27ae60', '#e74c3c'];

    // Nếu chưa có dữ liệu thì không vẽ gì cả
    if (transactions.length === 0) return null;

    return (
        <div style={{ width: '100%', height: 300, background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h3 style={{ textAlign: 'center', paddingTop: '10px', margin: 0 }}>Tỷ lệ Thu / Chi</h3>

            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%" // Tọa độ tâm X
                        cy="50%" // Tọa độ tâm Y
                        innerRadius={60} // Bán kính trong (tạo hình bánh Donut)
                        outerRadius={80} // Bán kính ngoài
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toLocaleString() + ' đ'} />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FinancialChart;