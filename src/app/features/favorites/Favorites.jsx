import { useFavorites } from "@/app/providers/favorites/use-favorites";
import { CsCard } from "@/app/shared/components/Card";
import { ProgressDonate } from "@/app/shared/components/ProgressDonate";
import { Card, Button, Empty, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth, useAdopt } from "@/app/providers";

const { Meta } = Card;

function WarpRibbonCard({ cat, index }) {
  const { catIsAdopted } = useAdopt();
  if (catIsAdopted(cat)) {
    return (
      <Badge.Ribbon text="Adopted" color="green">
        <CsCard
          cover={
            <img
              loading="eager"
              draggable={false}
              alt={cat.url || null}
              src={cat.url || null}
            />
          }
          classNameCard={"home-card"}
          key={cat.id || index}
          content={<ContentCard cat={cat} />}
        />
      </Badge.Ribbon>
    );
  }

  return (
    <CsCard
      cover={
        <img
          loading="eager"
          draggable={false}
          alt={cat.url || null}
          src={cat.url || null}
        />
      }
      classNameCard={"home-card"}
      key={cat.id || index}
      content={<ContentCard cat={cat} />}
    />
  );
}

function ContentCard({ cat }) {
  const { hasCurrentEmail } = useAuth();
  const { catIsAdopted } = useAdopt();
  const { removeFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  function desc() {
    const adp = catIsAdopted(cat);

    if (adp) {
      return (
        <>
          <h1>Tags : {cat.tags?.join(",") || ""}</h1>
          <h1>Owner : {adp.fullName + " " + "(" + adp.user + ")"}</h1>
        </>
      );
    }
    return <h1>Tags : {cat.tags?.join(",") || ""}</h1>;
  }

  return (
    <div className="flex flex-col">
      <Meta title={cat.name} description={desc()} />

      <div className="mt-4!">
        <ProgressDonate key={cat.id + "-" + cat.name} cat={cat} />
        <div className="flex justify-center mt-4!">
          <Button
            className="mr-2!"
            onClick={() => {
              navigate(`/products/${cat.id}`);
            }}
          >
            View Detail
          </Button>
          <Button
            className="mr-2!"
            disabled={catIsAdopted(cat)}
            onClick={() => {
              if (!hasCurrentEmail()) {
                return;
              }

              navigate(`/virtualAdopt/${cat.id}`);
            }}
          >
            Adoption
          </Button>
          <Button
            danger={isFavorite(cat.id)}
            onClick={() => removeFavorite(cat.id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="page">
      <div className="container">
        <h2 className="page-title">My Favorites</h2>
        <p className="mb-4!">You have {favorites.length} favorite cats</p>

        {favorites.length > 0 ? (
          <div className="product-grid">
            {favorites.map((cat, index) => (
              <WarpRibbonCard key={cat.id || index} cat={cat} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center mt-2!">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No favorites yet. Browse cats and add your favorites!"
            />
          </div>
        )}
      </div>
    </div>
  );
}