import { Card } from "antd";

export function CsCard({ cover, content, classNameCard, extra }) {
  return (
    <Card
      extra={extra || undefined}
      className={classNameCard || undefined}
      hoverable
      cover={cover}
      children={content}
    />
  );
}
