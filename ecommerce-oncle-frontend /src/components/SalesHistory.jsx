import { Table, Card, Tag, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { getSales } from '../api/client';

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setLoading(true);
    try {
      const res = await getSales();
      setSales(res.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '📦 Produit',
      dataIndex: ['productId', 'name'],
      key: 'product',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '💰 Prix unitaire',
      dataIndex: ['productId', 'price'],
      key: 'price',
      render: (price) => <span style={{ color: '#667eea', fontWeight: 'bold' }}>{price} FCFA</span>
    },
    {
      title: '📊 Quantité',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty) => <Tag color="blue">{qty}</Tag>
    },
    {
      title: '👤 Vendeur',
      dataIndex: 'soldBy',
      key: 'soldBy',
      render: (text) => <span>{text}</span>
    },
    {
      title: '📅 Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      title: '💵 Total',
      key: 'total',
      render: (_, record) => {
        const total = record.productId.price * record.quantity;
        return <span style={{ color: '#52c41a', fontWeight: 'bold', fontSize: 14 }}>{total} FCFA</span>;
      }
    }
  ];

  return (
    <Card 
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: 'none',
        marginTop: 24
      }}
    >
      <h2 style={{ marginTop: 0, color: '#333' }}>📜 Historique des ventes</h2>
      {sales.length === 0 ? (
        <Empty description="Aucune vente enregistrée" />
      ) : (
        <Table 
          columns={columns} 
          dataSource={sales} 
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 15, position: ['bottomCenter'] }}
        />
      )}
    </Card>
  );
}