import { useEffect, useState } from "react";
import { getCats, getTags } from "@/app/shared/services/cat-service";
import { FormSelect } from "@/app/shared/components/Select";
import { CsCard } from "@/app/shared/components/Card";
import { ProgressDonate } from "@/app/shared/components/ProgressDonate";
import { Card, Spin, Button, Empty, message, Badge } from "antd";
import { useQuery } from "@tanstack/react-query";
import { catsStore } from "@/app/store/cats-store";
import { useNavigate } from "react-router-dom";
import { useAuth, useAdopt } from "@/app/providers";

const { Meta } = Card;

// User for from searchSchema
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const searchSchema = z.object({
  tag: z.string().optional(),
  limit: z.number().optional(),
});

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
                message.error("Should login first.");
                return;
              }

              navigate(`/virtualAdopt/${cat.id}`);
            }}
          >
            Adoption
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
    queryKey: ["cats", searchParams],
    queryFn: ({ signal }) =>
      getCats(searchParams.tags, searchParams.limit, signal),
    staleTime: 1000 * 60, // 1 min
    cacheTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const { control } = useForm({
    resolver: zodResolver(searchSchema),
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

          <FormSelect
            defaultValue={defaultTags}
            mode="multiple"
            name="tag"
            options={tags}
            control={control}
            handleChange={setSelectedTags}
          />

          <label htmlFor="limit">Limit </label>

          <FormSelect
            width={100}
            name="limit"
            defaultValue={limit}
            options={[
              { label: "10", value: 10 },
              { label: "30", value: 30 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
            ]}
            control={control}
            handleChange={setLimit}
          />
        </div>

        <div className="flex justify-start mt-2!">
          <Button variant="solid" color="blue" onClick={() => handleSearch()}>
            Search
          </Button>
        </div>

        {error && <p>Error...</p>}
        {isFetching || isLoading ? (
          <div className="flex justify-center mt-2!">
            <Spin percent={"auto"} size="large" />
          </div>
        ) : cats.length > 0 ? (
          <div className="product-grid">
            {cats.map((cat, index) => (
              <WarpRibbonCard key={cat.id || index} cat={cat} index={index} />
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
