import { useState, useEffect } from 'react';
import { Button, Select, InputNumber, Table, message, Space, Card } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { getProducts, recordSale } from '../api/client';

export default function CashierDashboard() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
      if (res.data.length > 0) {
        setSelectedProduct(res.data[0]._id);
      }
    } catch (error) {
      message.error('Erreur au chargement des produits');
    }
  };

  const handleSale = async () => {
    if (!selectedProduct || !selectedVariant || quantity < 1) {
      message.error('Sélectionne un produit, un type et une quantité');
      return;
    }

    setLoading(true);
    try {
      await recordSale({
        productId: selectedProduct,
        variantType: selectedVariant,
        quantity: parseInt(quantity),
        soldBy: localStorage.getItem('userEmail')
      });
      message.success('✅ Vente enregistrée!');
      setQuantity(1);
      setSelectedVariant(null);
      loadProducts();
    } catch (error) {
      message.error(error.response?.data?.error || 'Erreur lors de la vente');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      title: 'Nom', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <strong>{text}</strong>
    },
    { 
      title: 'Prix', 
      dataIndex: 'price', 
      key: 'price',
      render: (price) => <span style={{ color: '#667eea', fontWeight: 'bold' }}>{price} FCFA</span>
    },
    { 
      title: 'Types disponibles', 
      dataIndex: 'variants', 
      key: 'variants',
      render: (variants) => (
        <Space wrap>
          {variants.map((v, i) => (
            <span key={i} style={{ background: v.quantity > 0 ? '#e6f7ff' : '#fff1f0', padding: '4px 8px', borderRadius: 4, color: v.quantity > 0 ? '#0050b3' : '#ff4d4f' }}>
              {v.type} ({v.quantity})
            </span>
          ))}
        </Space>
      )
    }
  ];

  const currentProduct = products.find(p => p._id === selectedProduct);
  const variantOptions = currentProduct?.variants.filter(v => v.quantity > 0).map(v => ({
    label: `${v.type} - ${v.quantity} en stock`,
    value: v.type
  })) || [];

  return (
    <div>
      <Card 
        style={{ 
          borderRadius: '12px',
          marginBottom: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: 'none',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <h2 style={{ marginTop: 0, color: 'white' }}>🛒 Enregistrer une vente</h2>
        <Space direction="vertical" style={{ width: '100%', gap: 12 }}>
          <Space style={{ width: '100%', gap: 12 }}>
            <Select
              value={selectedProduct}
              onChange={setSelectedProduct}
              options={products.map(p => ({
                label: p.name,
                value: p._id
              }))}
              style={{ width: 200 }}
              size="large"
              placeholder="Sélectionne un produit"
            />
            <Select
              value={selectedVariant}
              onChange={setSelectedVariant}
              options={variantOptions}
              style={{ width: 280 }}
              size="large"
              placeholder="Sélectionne un type"
              disabled={!selectedProduct}
            />
            <InputNumber
              min={1}
              value={quantity}
              onChange={setQuantity}
              style={{ width: 120 }}
              size="large"
            />
            <Button 
              type="primary" 
              loading={loading} 
              onClick={handleSale}
              icon={<ShoppingOutlined />}
              size="large"
              style={{ borderRadius: 6, background: '#52c41a', borderColor: '#52c41a' }}
            >
              Vendre
            </Button>
          </Space>
        </Space>
      </Card>

      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: 'none'
        }}
      >
        <h2 style={{ marginTop: 0, color: '#333' }}>📦 Produits disponibles</h2>
        <Table 
          columns={columns} 
          dataSource={products} 
          rowKey="_id"
          pagination={{ pageSize: 10, position: ['bottomCenter'] }}
        />
      </Card>
    </div>
  );
}