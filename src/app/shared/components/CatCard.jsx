import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Badge, message, Space, Tooltip } from "antd";
import { HeartOutlined, HeartFilled, EyeOutlined, HomeOutlined, DeleteOutlined } from "@ant-design/icons";
import { ProgressDonate } from "./ProgressDonate";
import { useAuth, useAdopt, useFavorites } from "@/app/providers";

function ContentCard({ cat, showRemove }) {
  const { hasCurrentEmail } = useAuth();
  const { catIsAdopted } = useAdopt();
  const { toggleFavorite, isFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  const isFav = useMemo(() => isFavorite(cat.id), [isFavorite, cat.id]);
  const adopted = useMemo(() => catIsAdopted(cat), [catIsAdopted, cat]);

  const handleFavorite = useCallback((e) => {
    e.stopPropagation();
    toggleFavorite(cat);
  }, [toggleFavorite, cat]);

  const handleViewDetail = useCallback(() => {
    navigate(`/products/${cat.id}`);
  }, [navigate, cat.id]);

  const handleAdopt = useCallback(() => {
    if (!hasCurrentEmail()) {
      message.warning("Please login first to adopt.");
      return;
    }
    navigate(`/virtualAdopt/${cat.id}`);
  }, [hasCurrentEmail, navigate, cat.id]);

  const handleRemove = useCallback(() => {
    removeFavorite(cat.id);
  }, [removeFavorite, cat.id]);

  const tags = useMemo(() => {
    if (adopted) {
      return (
        <div className="cat-card-meta">
          <span className="cat-card-tags">{cat.tags?.join(", ") || "No tags"}</span>
          <span className="cat-card-owner">Owner: {adopted.fullName}</span>
        </div>
      );
    }
    return <span className="cat-card-tags">{cat.tags?.join(", ") || "No tags"}</span>;
  }, [adopted, cat.tags]);

  return (
    <div className="cat-card-content">
      <div className="cat-card-header">
        <div className="cat-card-info">
          <h3 className="cat-card-name">{cat.name}</h3>
          {tags}
        </div>
        <Tooltip title={isFav ? "Remove from favorites" : "Add to favorites"}>
          <Button
            type="text"
            size="small"
            icon={isFav ? <HeartFilled style={{ color: "#ef4444" }} /> : <HeartOutlined />}
            onClick={handleFavorite}
            className="favorite-btn"
          />
        </Tooltip>
      </div>

      <div className="cat-card-progress">
        <ProgressDonate key={`${cat.id}-${cat.name}`} cat={cat} />
      </div>

      <Space.Compact className="cat-card-actions">
        <Tooltip title="View details">
          <Button icon={<EyeOutlined />} onClick={handleViewDetail}>
            Details
          </Button>
        </Tooltip>
        <Tooltip title={adopted ? "Already adopted" : "Adopt this cat"}>
          <Button 
            type="primary" 
            icon={<HomeOutlined />} 
            disabled={adopted}
            onClick={handleAdopt}
          >
            Adopt
          </Button>
        </Tooltip>
        {showRemove && (
          <Tooltip title="Remove from favorites">
            <Button danger icon={<DeleteOutlined />} onClick={handleRemove} />
          </Tooltip>
        )}
      </Space.Compact>
    </div>
  );
}

export function CatCard({ cat, showRemove = false }) {
  const { catIsAdopted } = useAdopt();

  const isAdopted = useMemo(() => catIsAdopted(cat), [catIsAdopted, cat]);

  const cardContent = (
    <Card
      cover={
        <div className="cat-card-image-wrapper">
          <img
            loading="lazy"
            draggable={false}
            alt={cat.name || "cat"}
            src={cat.url || null}
            className="cat-card-image"
          />
        </div>
      }
      className="cat-card"
      hoverable
    >
      <ContentCard cat={cat} showRemove={showRemove} />
    </Card>
  );

  if (isAdopted) {
    return (
      <Badge.Ribbon text="Adopted" color="green" placement="end">
        {cardContent}
      </Badge.Ribbon>
    );
  }

  return cardContent;
}

export function CatCardSkeleton() {
  return (
    <Card className="cat-card" loading>
      <div className="cat-card-skeleton" />
    </Card>
  );
}
