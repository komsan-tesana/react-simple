import { useMemo } from "react";
import { useCart } from "@/app/providers/cart";
import { Progress } from "antd";

const PROGRESS_ITEMS = [
  { key: "food", label: "Food" },
  { key: "medical", label: "Medical" },
  { key: "supplies", label: "Supplies" },
];

export function ProgressDonate({ cat }) {
  const { productInCart } = useCart();

  const donations = useMemo(
    () => productInCart(cat?.id) || {},
    [productInCart, cat?.id]
  );

  return (
    <div className="flex flex-col gap-2">
      {PROGRESS_ITEMS.map(({ key, label }) => {
        const value = donations[key] || 0;
        return (
          <div key={key}>
            <div className="text-sm text-gray-600">{label}</div>
            <Progress
              key={`${cat.id}-${key}-progress`}
              showInfo={value > 0}
              status={value === 100 ? "success" : undefined}
              percent={value}
              size="small"
            />
          </div>
        );
      })}
    </div>
  );
}
