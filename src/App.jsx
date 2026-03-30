import "./App.css";
import { AppRoutes } from "@/app/router";
import { AuthProvider, CartProvider, AdoptProvider, FavoritesProvider } from "@/app/providers";
import { ErrorBoundary } from "@/app/shared/components/ErrorBoundary";
import Navbar from "@/app/shared/components/Navbar";
import { Layout, theme } from "antd";
import logo from "@/assets/images/paw.png";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const CURRENT_YEAR = new Date().getFullYear();

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <AdoptProvider>
              <div className="app">
                <Layout style={{ minHeight: "100vh" }}>
                  <Header
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 100,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 var(--space-lg)",
                      height: 70,
                    }}
                  >
                    <div className="logo">
                      <Link to="/" className="navbar-brand" aria-label="Go to homepage">
                        <img
                          width={44}
                          height={44}
                          src={logo}
                          alt="SEM Cat Shelter"
                          className="hover:rotate-20 duration-300"
                        />
                      </Link>
                    </div>
                    <Navbar />
                  </Header>
                  <Content style={{ flex: 1 }}>
                    <div
                      style={{
                        background: colorBgContainer,
                        minHeight: "calc(100vh - 70px - 70px)",
                        padding: 0,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <AppRoutes />
                    </div>
                  </Content>
                  <Footer style={{ 
                    textAlign: "center",
                    padding: "var(--space-lg) var(--space-xl)",
                    background: "var(--color-bg-white)",
                    borderTop: "1px solid var(--color-border)",
                  }}>
                    <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                      ©{CURRENT_YEAR} SEM Cat Shelter. Made with ❤️ for cats.
                    </p>
                  </Footer>
                </Layout>
              </div>
            </AdoptProvider>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
