import { useAuth } from "@/app/providers/auth";
import { menuItems } from "../../router/menu-config";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Button } from "antd";

export default function Navbar() {
  const { user, logout, admin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const items = menuItems
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
      onClick: (x) => navigate(x.key),
    }));

  return (
    <>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />
      <div className="navbar-auth">
        {!user ? (
          <div>
            <Button className="mr-2!" variant="filled" color="primary">
              <Link to="/auth" state={{ mode: "login" }}>
                Login
              </Link>
            </Button>

            <Button variant="solid" color="blue">
              <Link to="/auth" state={{ mode: "signup" }}>
                Signup
              </Link>
            </Button>
          </div>
        ) : (
          <div className="navbar-user">
            <span className="navbar-greeting">Hello, {user.email}</span>
            <Button variant="solid" color="primary" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
