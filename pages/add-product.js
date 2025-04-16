import React, { useState } from 'react';

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const product = { productName, description, price, image };
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });
            if (!res.ok) {
                throw new Error('Failed to add product');
            }
            const data = await res.json();
            alert('Sản phẩm đã được thêm thành công!');
            setProductName('');
            setDescription('');
            setPrice('');
            setImage('');
        } catch (error) {
            alert('Lỗi khi thêm sản phẩm: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Thêm Sản Phẩm</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên sản phẩm</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mô tả</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Giá</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Hình ảnh (URL)</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng bán'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct; 