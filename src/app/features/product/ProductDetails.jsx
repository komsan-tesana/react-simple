import { useNavigate, useParams } from "react-router-dom";
import { getCatSay } from "@/app/shared/services/cat-service";
import { useQuery } from "@tanstack/react-query";
import { Spin, Radio, Button, notification } from "antd";
import { ProgressDonate } from "@/app/shared/components/ProgressDonate";
import { useCart, useAuth } from "@/app/providers";
import { useState } from "react";

export function ProductDetails() {
  const navigate = useNavigate();
  const [donateType, setDonateType] = useState();
  const { id } = useParams();
  const {
    data: cat = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cat", id],
    queryFn: ({ signal }) => {
      return getCatSay(id, "Meow..", signal);
    },
  });
  const { productInCart, addToCart } = useCart();
  const { hasCurrentEmail } = useAuth();
  const food = productInCart(cat.id)?.food || 0;
  const medical = productInCart(cat.id)?.medical || 0;
  const supplies = productInCart(cat.id)?.supplies || 0;
  const supporters = productInCart(cat.id)?.users || [];

  function donate() {
    if (!hasCurrentEmail()) {
      notification.error({
        title: "Error",
        description: "Should login first.",
      });
      return;
    }
    addToCart(cat.id, donateType);
    clearDonate();
  }

  function clearDonate() {
    if (food === 90 || medical === 90 || supplies === 90) {
      setDonateType(undefined);
    }
  }

  if (!cat) {
    navigate("/");
  }

  if (error) {
    return <h1>Error...</h1>;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="product-detail">
          {isLoading ? (
            <div className="flex justify-center col-span-2">
              <Spin percent={"auto"} size="large" />
            </div>
          ) : (
            <>
              <div className="product-detail-image">
                <img src={cat.url || null} alt={cat.name} />
              </div>
              <div className="product-detail-content">
                <h1 className="product-detail-name">{cat.name}</h1>
                <h1 className="product-detail-description">
                  {cat.tags.join(",") || "No-Tags"}
                </h1>
                <ProgressDonate cat={cat} showAction={true} />
              </div>

              <div className="col-span-2">
                <div>
                  <h1 className="product-detail-supporters">
                    Select your Gift
                  </h1>

                  <Radio.Group
                    value={donateType}
                    name="donateType"
                    onChange={(e) => setDonateType(e.target.value)}
                    options={[
                      { value: 1, label: "$10 Food", disabled: food === 100 },
                      {
                        value: 2,
                        label: "$10 Medical",
                        disabled: medical === 100,
                      },
                      {
                        value: 3,
                        label: "$10 Supplies",
                        disabled: supplies === 100,
                      },
                    ]}
                  />
                </div>
                <div className="product-detail-footer flex justify-start">
                  <Button
                    disabled={
                      food === 100 && medical === 100 && supplies === 100
                    }
                    onClick={donate}
                    color="primary"
                    variant="solid"
                  >
                    Donate Now
                  </Button>
                </div>
              </div>

              <div className="col-span-2">
                <h1 className="product-detail-supporters">Recent Supporters</h1>
              </div>
              <div className="col-span-2">{supporters.join(",")}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
