import { Row, Col, Statistic, Card } from 'antd';
import { useEffect, useState } from 'react';

export default function StatsCards({ products, sales }) {
  const [revenue, setRevenue] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [stockVal, setStockVal] = useState(0);

  const totalRevenue = sales.reduce((sum, sale) => {
    const product = products.find(p => p._id === sale.productId._id);
    return sum + (product ? product.price * sale.quantity : 0);
  }, 0);

  const totalSales = sales.length;

  const stockValue = products.reduce((sum, p) => {
    const variantsTotal = p.variants.reduce((vSum, v) => vSum + (p.price * v.quantity), 0);
    return sum + variantsTotal;
  }, 0);

  const topProduct = sales.reduce((acc, sale) => {
    const key = sale.productId._id;
    acc[key] = (acc[key] || 0) + sale.quantity;
    return acc;
  }, {});

  const topProductName = Object.keys(topProduct).length > 0
    ? products.find(p => p._id === Object.keys(topProduct).reduce((a, b) => topProduct[a] > topProduct[b] ? a : b))?.name
    : 'N/A';

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(r => r < totalRevenue ? r + totalRevenue / 20 : totalRevenue);
      setSalesCount(s => s < totalSales ? s + 1 : totalSales);
      setStockVal(sv => sv < stockValue ? sv + stockValue / 20 : stockValue);
    }, 50);
    return () => clearInterval(interval);
  }, [totalRevenue, totalSales, stockValue]);

  return (
    <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card 
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            padding: '24px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>💰 Chiffre d'affaires</span>}
            value={Math.round(revenue)}
            suffix=" FCFA"
            valueStyle={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card 
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(245, 87, 108, 0.4)',
            padding: '24px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>🛍️ Nombre de ventes</span>}
            value={salesCount}
            valueStyle={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card 
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(79, 172, 254, 0.4)',
            padding: '24px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>📦 Valeur du stock</span>}
            value={Math.round(stockVal)}
            suffix=" FCFA"
            valueStyle={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card 
          style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(250, 112, 154, 0.4)',
            padding: '24px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>🔥 Produit le plus vendu</span>}
            value={topProductName}
            valueStyle={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}
          />
        </Card>
      </Col>
    </Row>
  );
}