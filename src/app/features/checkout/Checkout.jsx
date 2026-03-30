import { useMemo } from "react";
import { useCart } from "@/app/providers/cart";
import { Card, Row, Col, Button, Empty, List, Image, Typography, message } from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export function Checkout() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.food || 0) + (item.medical || 0) + (item.supplies || 0);
    }, 0);
  }, [cartItems]);

  function placeOrder() {
    message.success("Thank you for your donation!");
    clearCart();
    navigate("/");
  }

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <Card className="empty-cart-card">
            <Empty
              image={<ShoppingCartOutlined style={{ fontSize: 64, color: "#ccc" }} />}
              description={
                <span>
                  Your cart is empty.
                  <br />
                  Browse cats to make a donation!
                </span>
              }
            >
              <Button type="primary" onClick={() => navigate("/cats")}>
                Browse Cats
              </Button>
            </Empty>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Title level={2} className="page-title">Checkout</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Order Summary" className="checkout-card">
              <List
                dataSource={cartItems}
                renderItem={(item) => (
                  <List.Item className="checkout-list-item">
                    <div className="checkout-item">
                      <Image
                        src={item.cat?.url}
                        alt={item.cat?.name || "cat"}
                        className="checkout-item-image"
                        preview={false}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                      <div className="checkout-item-details">
                        <Title level={5} className="checkout-item-name">
                          {item.cat?.name || "Unknown"}
                        </Title>
                        <Text type="secondary" className="checkout-item-breakdown">
                          Food: ฿{item.food || 0} | Medical: ฿{item.medical || 0} | Supplies: ฿{item.supplies || 0}
                        </Text>
                      </div>
                      <div className="checkout-item-controls">
                        <Text strong className="checkout-item-total">
                          ฿{(item.food || 0) + (item.medical || 0) + (item.supplies || 0)}
                        </Text>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Payment Summary" className="checkout-summary-card">
              <div className="checkout-summary-content">
                <div className="checkout-total-row">
                  <Text>Subtotal ({cartItems.length} items)</Text>
                  <Text>฿{total}</Text>
                </div>
                <div className="checkout-total-row">
                  <Text>Total</Text>
                  <Title level={3} className="checkout-total-final">
                    ฿{total}
                  </Title>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={placeOrder}
                  className="checkout-place-order-btn"
                >
                  Place Order
                </Button>
                <Button block onClick={clearCart} className="checkout-clear-btn">
                  Clear Cart
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
