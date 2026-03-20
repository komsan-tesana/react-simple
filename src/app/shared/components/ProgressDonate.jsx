import { useCart } from "@/app/providers/cart";
import { Progress } from "antd";

export function ProgressDonate({ cat }) {
  const { productInCart } = useCart();
  const food = productInCart(cat.id)?.food || 0;
  const medical = productInCart(cat.id)?.medical || 0;
  const supplies = productInCart(cat.id)?.supplies || 0;
  return (
    <div className="flex flex-col">
      <div>
        Food
        <Progress
          key={cat.id + "-food-progress"}
          showInfo={food > 0}
          status={food === 100 ? "success" : undefined}
          percent={food}
        />
      </div>

      <div>
        Medical
        <Progress
          key={cat.id + "-medical-progress"}
          showInfo={medical > 0}
          status={medical === 100 ? "success" : undefined}
          percent={medical}
        />
      </div>

      <div>
        Supplies
        <Progress
          key={cat.id + "-supplies-progress"}
          showInfo={supplies > 0}
          status={supplies === 100 ? "success" : undefined}
          percent={supplies}
        />
      </div>
    </div>
  );
}
