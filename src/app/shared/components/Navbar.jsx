import { useState, useMemo } from "react";
import { useAuth } from "@/app/providers/auth";
import { menuItems } from "../../router/menu-config";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";

function NavMenu({ items }) {
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      items={items}
      selectedKeys={[location.pathname]}
      style={{ flex: 1, minWidth: 0, background: "transparent" }}
    />
  );
}

function AuthButtons({ user, logout }) {
  if (!user) {
    return (
      <div className="navbar-auth-buttons">
        <Button variant="filled" color="primary" size="small">
          <Link to="/auth" state={{ mode: "login" }} style={{ color: "inherit" }}>
            Login
          </Link>
        </Button>
        <Button variant="solid" color="blue" size="small">
          <Link to="/auth" state={{ mode: "signup" }} style={{ color: "inherit" }}>
            Signup
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="navbar-user">
      <span className="navbar-greeting">Hello, {user.email}</span>
      <Button variant="solid" color="primary" size="small" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}

export default function Navbar() {
  const { user, logout, admin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItemsFiltered = useMemo(() => {
    return menuItems
      .filter((m) =>
        admin
          ? (m?.show ?? false) == true || (m?.admin || undefined) == admin
          : (m?.show ?? false) == true && !m?.admin,
      )
      .map((menu) => ({
        key: menu.key,
        label: menu.label,
        children: menu.children
          ?.filter((c) => !!c?.show)
          .map((c) => ({
            ...c,
            show: undefined,
          })),
        onClick: (x) => {
          navigate(x.key);
          setMobileMenuOpen(false);
        },
      }));
  }, [admin, navigate]);

  const desktopItems = useMemo(() => {
    return menuItemsFiltered.map((item) => ({
      ...item,
      label: (
        <span role="menuitem" tabIndex={0}>
          {item.label}
        </span>
      ),
    }));
  }, [menuItemsFiltered]);

  return (
    <>
      <div className="navbar-desktop">
        <NavMenu items={desktopItems} />
        <AuthButtons user={user} logout={logout} />
      </div>
      
      <Button
        className="navbar-mobile-toggle"
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
        style={{ color: "#fff" }}
      />
      
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItemsFiltered}
          style={{ borderRight: 0 }}
        />
        <div style={{ padding: "var(--space-md)", borderTop: "1px solid var(--color-border)" }}>
          {!user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <Link to="/auth" state={{ mode: "login" }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="filled" color="primary" block>Login</Button>
              </Link>
              <Link to="/auth" state={{ mode: "signup" }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="solid" color="blue" block>Signup</Button>
              </Link>
            </div>
          ) : (
            <div>
              <p style={{ marginBottom: "var(--space-sm)", color: "var(--color-text-secondary)" }}>
                Signed in as <strong>{user.email}</strong>
              </p>
              <Button variant="solid" color="primary" block onClick={() => { logout(); setMobileMenuOpen(false); }}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
