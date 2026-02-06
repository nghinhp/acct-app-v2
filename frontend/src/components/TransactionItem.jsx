function TransactionItem({ item, onDelete }) {
    return (
        <div className="item">
            <span>{item.text}</span>
            <button onClick={() => onDelete(item.id)}>Xóa</button>
        </div>
    );
}
export default TransactionItem;