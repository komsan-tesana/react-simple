import { ConfigProvider, theme } from "antd";

const tokens = {
  colorPrimary: "#6366f1",
  colorSuccess: "#22c55e",
  colorWarning: "#f59e0b",
  colorError: "#ef4444",
  colorInfo: "#3b82f6",
  colorBgBase: "#f8fafc",
  colorTextBase: "#1e293b",
  borderRadius: 8,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

const components = {
  Menu: {
    horizontalItemBorderRadius: 4,
    itemPaddingInline: 16,
  },
  Button: {
    borderRadius: 6,
    controlHeight: 40,
    paddingContentHorizontal: 20,
  },
  Card: {
    borderRadiusLG: 12,
  },
  Input: {
    borderRadius: 6,
    controlHeight: 40,
  },
  Select: {
    borderRadius: 6,
    controlHeight: 40,
  },
};

export function AntConfigProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        tokens,
        components,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
