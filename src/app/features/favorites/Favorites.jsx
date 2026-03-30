import { useFavorites } from "@/app/providers/favorites/use-favorites";
import { CatCard } from "@/app/shared/components/CatCard";
import { Empty } from "antd";

export function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="page">
      <div className="container">
        <h2 className="page-title">My Favorites</h2>
        <p className="mb-4">You have {favorites.length} favorite cats</p>

        {favorites.length > 0 ? (
          <div className="product-grid">
            {favorites.map((cat, index) => (
              <CatCard key={cat.id || index} cat={cat} showRemove />
            ))}
          </div>
        ) : (
          <div className="flex justify-center mt-8">
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
