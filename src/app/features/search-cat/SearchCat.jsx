import { useState, useMemo, useCallback } from "react";
import { getCats, getTags } from "@/app/shared/services/cat-service";
import { CatCard, CatCardSkeleton } from "@/app/shared/components/CatCard";
import { Button, Empty, Card, Row, Col, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { catsStore } from "@/app/store/cats-store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

const searchSchema = z.object({
  tag: z.string().optional(),
  limit: z.number().optional(),
});

export function SearchCat() {
  const limit = catsStore((state) => state.limit);
  const setLimit = catsStore((state) => state.setLimit);
  const defaultTags = catsStore((state) => state.defaultTags);
  const setDefaultTags = catsStore((state) => state.setDefaultTags);

  const [selectedTags, setSelectedTags] = useState(defaultTags);
  const [searchParams, setSearchParams] = useState({
    tags: defaultTags,
    limit,
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
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const { data: tags = [],isLoading:isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    placeholderData: [],
  });

  console.error('tags',tags);
  console.error('isLoadingTags',isLoadingTags);
  
  const { control } = useForm({
    resolver: zodResolver(searchSchema),
  });

  const handleSearch = useCallback(() => {
    setSearchParams({
      tags: [...selectedTags],
      limit,
    });
  }, [selectedTags, limit]);

  const handleTagChange = useCallback((value) => {
    setSelectedTags(value);
    setDefaultTags(value);
  }, [setDefaultTags]);

  const handleLimitChange = useCallback((value) => {
    setLimit(value);
  }, [setLimit]);

  const skeletonArray = useMemo(
    () => Array.from({ length: searchParams.limit || 10 }, (_, i) => i),
    [searchParams.limit]
  );

  return (
    <div className="page">
      <div className="container">
        <h2 className="page-title">Our Cats</h2>

        <Card className="search-filters-card">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={10}>
              <label className="filter-label">Filter by Tags</label>
              <Controller
                name="tag"
                control={control}
                defaultValue={defaultTags}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    placeholder="Select tags"
                    style={{ width: "100%" }}
                    options={tags}
                    value={selectedTags}
                    onChange={handleTagChange}
                    loading={isLoadingTags} 
                    allowClear
                  />
                )}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <label className="filter-label">Results</label>
              <Controller
                name="limit"
                control={control}
                defaultValue={limit}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%" }}
                    options={[
                      { label: "10 cats", value: 10 },
                      { label: "30 cats", value: 30 },
                      { label: "50 cats", value: 50 },
                      { label: "100 cats", value: 100 },
                    ]}
                    onChange={(value) => {
                      field.onChange(value);
                      handleLimitChange(value);
                    }}
                  />
                )}
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div className="filter-actions">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={isFetching}
                  size="large"
                >
                  Search
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {error && (
          <Card className="error-card">
            <Empty
              image={Empty.PRESENTED_IMAGE_ERROR}
              description="Error loading cats. Please try again."
            >
              <Button type="primary" onClick={handleSearch}>
                Retry
              </Button>
            </Empty>
          </Card>
        )}

        {isLoading ? (
          <Row gutter={[24, 24]}>
            {skeletonArray.map((index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <CatCardSkeleton />
              </Col>
            ))}
          </Row>
        ) : cats.length > 0 ? (
          <Row gutter={[24, 24]}>
            {cats.map((cat, index) => (
              <Col key={cat.id || index} xs={24} sm={12} md={8} lg={6}>
                <CatCard cat={cat} />
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="empty-card">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  No cats found matching your criteria.
                  <br />
                  Try adjusting your filters.
                </span>
              }
            >
              <Button onClick={() => { setSelectedTags([]); handleSearch(); }}>
                Clear Filters
              </Button>
            </Empty>
          </Card>
        )}
      </div>
    </div>
  );
}
