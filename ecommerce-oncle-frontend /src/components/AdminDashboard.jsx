import { useState, useEffect } from 'react';
import { Button, Input, InputNumber, Table, message, Space, Card, Form, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getProducts, addProduct, getSales } from '../api/client';
import StatsCards from './StatsCards';
import SalesHistory from './SalesHistory';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [variants, setVariants] = useState([{ type: '', quantity: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, salesRes] = await Promise.all([
        getProducts(),
        getSales()
      ]);
      setProducts(productsRes.data);
      setSales(salesRes.data);
    } catch (error) {
      message.error('Erreur au chargement des données');
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { type: '', quantity: '' }]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleAddProduct = async () => {
    if (!name || !price || variants.some(v => !v.type || !v.quantity)) {
      message.error('Tous les champs sont requis');
      return;
    }

    const variantsData = variants.map(v => ({
      type: v.type,
      quantity: parseInt(v.quantity)
    }));

    setLoading(true);
    try {
      await addProduct({
        name,
        price: parseFloat(price),
        variants: variantsData
      });
      message.success('Produit ajouté!');
      setName('');
      setPrice('');
      setVariants([{ type: '', quantity: '' }]);
      loadData();
    } catch (error) {
      message.error('Erreur lors de l\'ajout');
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
            <span key={i} style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: 4 }}>
              {v.type} ({v.quantity})
            </span>
          ))}
        </Space>
      )
    }
  ];

  return (
    <div>
      <StatsCards products={products} sales={sales} />

      <Card 
        style={{ 
          borderRadius: '12px', 
          marginBottom: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: 'none'
        }}
      >
        <h2 style={{ marginTop: 0, color: '#333' }}>➕ Ajouter un produit</h2>
        <Space direction="vertical" style={{ width: '100%', gap: 12 }}>
          <Space style={{ width: '100%', gap: 12 }}>
            <Input
              placeholder="Nom du produit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: 220, borderRadius: 6 }}
              size="large"
            />
            <InputNumber
              placeholder="Prix"
              value={price}
              onChange={setPrice}
              style={{ width: 150, borderRadius: 6 }}
              size="large"
              min={0}
            />
          </Space>

          <div>
            <h4>Ajouter les types/variantes:</h4>
            {variants.map((variant, index) => (
              <Space key={index} style={{ marginBottom: 12, width: '100%', gap: 12 }}>
                <Input
                  placeholder="Type (ex: Fer de 10, Fer de 12...)"
                  value={variant.type}
                  onChange={(e) => handleVariantChange(index, 'type', e.target.value)}
                  style={{ width: 240, borderRadius: 6 }}
                  size="large"
                />
                <InputNumber
                  placeholder="Quantité"
                  value={variant.quantity}
                  onChange={(val) => handleVariantChange(index, 'quantity', val)}
                  style={{ width: 150, borderRadius: 6 }}
                  size="large"
                  min={0}
                />
                {variants.length > 1 && (
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveVariant(index)}
                  />
                )}
              </Space>
            ))}
            <Button onClick={handleAddVariant} style={{ marginTop: 12 }}>
              + Ajouter un type
            </Button>
          </div>

          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            loading={loading} 
            onClick={handleAddProduct}
            size="large"
            style={{ borderRadius: 6 }}
          >
            Créer le produit
          </Button>
        </Space>
      </Card>

      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: 'none'
        }}
      >
        <h2 style={{ marginTop: 0, color: '#333' }}>📋 Produits</h2>
        <Table 
          columns={columns} 
          dataSource={products} 
          rowKey="_id" 
          pagination={{ pageSize: 10, position: ['bottomCenter'] }}
        />
      </Card>

      <SalesHistory />
    </div>
  );
}