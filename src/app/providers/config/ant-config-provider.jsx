import { ConfigProvider } from "antd";
export function AntConfigProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            horizontalItemBorderRadius: 4, 
            itemPaddingInline:16,     
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
