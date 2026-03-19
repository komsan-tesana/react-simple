import { useEffect, useState } from "react";
import {
  getCats,
  getTags,
  getCatsHero,
} from "../../shared/services/cat.service";
import { CsSelect } from "../../shared/components/CsSelect";
import { ProgressDonate } from "../../shared/components/ProgressDonate";
import { CsCard } from "../../shared/components/CsCard";
import { Card, Spin, Button, Carousel } from "antd";
import { useQuery } from "@tanstack/react-query";
import { catsStore } from "../../app/store/cats.store";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const contentStyle = {
  margin: 0,
  width: "1200px",
  height: "500px",
  color: "#fff",
  lineHeight: "500px",
  textAlign: "center",
  background: "grey",
};

function ContentCard({ cat }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <Meta
        title={cat.name}
        description={<h1>Tags : {cat.tags?.join(",") || ""}</h1>}
      />

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
        </div>
      </div>
    </div>
  );
}

function ContentCarousel({ cats }) {
  return (
    <div>
      <Carousel fade autoplaySpeed={5000} autoplay>
        {cats &&
          cats.map((cat) => (
            <div>
              <img
                style={contentStyle}
                loading="eager"
                draggable={false}
                alt={cat.url || null}
                src={cat.url || null}
              />
            </div>
          ))}
      </Carousel>
    </div>
  );
}

export function Home() {
  const limit = catsStore((state) => state.limit);
  const setLimit = catsStore((state) => state.setLimit);
  const defaultTags = catsStore((state) => state.defaultTags);
  const setDefaultTags = catsStore((state) => state.setDefaultTags);
  const [tags, setTags] = useState([]);
  const [catsHero, setCatsHero] = useState([]);
  const [selectedTags, setSelectedTags] = useState(defaultTags);

  const {
    data: cats = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cats", selectedTags, limit],
    queryFn: ({ signal }) => {
      return getCats(selectedTags, limit, signal);
    },
  });

  useEffect(() => {
    getCatsHero().then((res) => setCatsHero(res));
  }, []);

  useEffect(() => {
    setLimit(limit);
  }, [limit]);

  useEffect(() => {
    setDefaultTags(selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    getTags().then((tags) => setTags(tags));
  }, []);

  return (
    <div className="page">
      <div className="home-hero">
        <h1 className="home-title">
          Welcome to Social Enterprise Management Web Application
        </h1>
        <p className="home-subtitle">Discover amazing cats</p>
      </div>

      <div className="home-carousel">
        <ContentCarousel cats={catsHero} />
      </div>

      <div className="container">
        <h2 className="page-title">Our Cats</h2>

        <div className="flex flex-col">
          <label htmlFor="tag">Tag </label>
          <CsSelect
            defaultValue={defaultTags}
            mode="multiple"
            name="tag"
            options={tags}
            handleChange={setSelectedTags}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="limit">Limit </label>
          <CsSelect
            width={100}
            name="limit"
            defaultValue={limit}
            options={[
              { label: "10", value: 10 },
              { label: "30", value: 30 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
              { label: "500", value: 500 },
              { label: "1000", value: 1000 },
            ]}
            handleChange={setLimit}
          />
        </div>

        {error && <p>Error...</p>}
        {isLoading ? (
          <div className="flex justify-center">
            <Spin percent={"auto"} size="large" />
          </div>
        ) : (
          <div className="product-grid">
            {cats.map((cat, index) => (
              <CsCard
                data={cat}
                classNameCard={"home-card"}
                key={cat.id || index}
                content={<ContentCard cat={cat} />}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
