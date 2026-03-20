import { useEffect, useState } from "react";
import { getCats, getTags } from "@/app/shared/services/cat-service";
import { CsSelect } from "@/app/shared/components/Select";
import { CsCard } from "@/app/shared/components/Card";
import { ProgressDonate } from "@/app/shared/components/ProgressDonate";
import { Card, Spin, Button, Empty } from "antd";
import { useQuery } from "@tanstack/react-query";
import { catsStore } from "@/app/store/cats-store";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;

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

export function SearchCat() {
  const limit = catsStore((state) => state.limit);
  const setLimit = catsStore((state) => state.setLimit);
  const defaultTags = catsStore((state) => state.defaultTags);
  const setDefaultTags = catsStore((state) => state.setDefaultTags);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(defaultTags);
  const [searchParams, setSearchParams] = useState({
      tags: defaultTags,
      limit: limit,
  });

  const {
    data: cats = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["cats" ,searchParams],
    queryFn: ({ signal }) => getCats(searchParams.selectedTags, searchParams.limit, signal),
    staleTime: 1000 * 60, // 1 min
    cacheTime: 1000 * 60 * 5, 
    keepPreviousData: true,    
  });

  const handleSearch = () => {
    setSearchParams({
      tags: [...selectedTags],
      limit,
    });
};

  useEffect(() => {
    setLimit(limit);
  }, [limit, setLimit]);

  useEffect(() => {
    setDefaultTags(selectedTags);
  }, [selectedTags, setDefaultTags]);

  useEffect(() => {
    getTags().then((tags) => setTags(tags));
  }, []);

  console.log("cats", cats);

  return (
    <div className="page">
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

          <label htmlFor="limit">Limit </label>
          <CsSelect
            width={100}
            name="limit"
            defaultValue={limit}
            options={[
              { label: "10", value: 10 },
              { label: "30", value: 30 },
              { label: "50", value: 50 },
              { label: "100", value: 100 }
            ]}
            handleChange={setLimit}
          />
        </div>

        <div className="flex justify-start mt-2!">
          <Button
            variant="solid"
            color="blue"
            onClick={() => handleSearch()}
          >
            Search
          </Button>
        </div>

        {error && <p>Error...</p>}
        {isFetching || isLoading ? (
          <div className="flex justify-center mt-2!">
            <Spin percent={"auto"} size="large" />         
          </div>
        ) : 
        cats.length > 0 ? (
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
        ) : (
          <div className="flex justify-center mt-2!">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </div>
    </div>
  );
}
