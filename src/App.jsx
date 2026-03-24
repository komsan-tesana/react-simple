import "./App.css";
import { AppRoutes } from "@/app/router";
import { AuthProvider, CartProvider,AdoptProvider } from "@/app/providers";
import Navbar from "@/app/shared/components/Navbar";
import { Layout, theme } from "antd";
import logo from "@/assets/images/paw.png";
import { Link } from "react-router-dom";
const { Header, Content, Footer } = Layout;

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG},    
  } = theme.useToken();

  return (
    <AuthProvider>
      <CartProvider>
        <AdoptProvider>
          <div className="app">
            <Layout>
              <Header
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="logo">
                  <Link to="/" className="navbar-brand">
                    <img
                      width={50}
                      height={50}
                      src={logo}
                      alt="logo"
                      className="hover:rotate-20 duration-300"
                    />
                  </Link>
                </div>

                <Navbar />
              </Header>
              <Content>
                {/* <Breadcrumb
                  style={{ margin: "16px 0" }}
                  items={[{ title: "Home" }, { title: "List" }, { title: "App" }]}
                /> */}
                <div
                  style={{
                    background: colorBgContainer,
                    minHeight: 280,
                    padding: 0,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  <AppRoutes />
                </div>
              </Content>
              <Footer style={{ textAlign: "center" }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant
              </Footer>
            </Layout>
          </div>
        </AdoptProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
