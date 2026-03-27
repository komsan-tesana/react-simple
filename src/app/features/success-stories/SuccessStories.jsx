import { useState, useMemo } from "react";
import { useAdopt } from "@/app/providers";
import { Card, Select, Empty, Spin } from "antd";
import { HeartFilled, CalendarOutlined, UserOutlined } from "@ant-design/icons";

function StatsOverview({ totalAdoptions }) {
  return (
    <div className="success-stats">
      <div className="success-stats-item">
        <div className="success-stats-icon">🏠</div>
        <div className="success-stats-number">{totalAdoptions}</div>
        <div className="success-stats-label">Cats Found Forever Homes</div>
      </div>
    </div>
  );
}

function FilterByMonthYear({ onChange, value }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  return (
    <div className="success-filter">
      <Select
        placeholder="Select Month"
        allowClear
        style={{ width: 200 }}
        value={value?.month}
        onChange={(month) => onChange({ ...value, month })}
        options={months}
      />
      <Select
        placeholder="Select Year"
        allowClear
        style={{ width: 150 }}
        value={value?.year}
        onChange={(year) => onChange({ ...value, year })}
        options={years.map((y) => ({ value: y, label: y.toString() }))}
      />
    </div>
  );
}

function StoryCard({ story }) {
  const adoptDate = new Date(story.createdAt);
  const formattedDate = adoptDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card
      hoverable
      className="story-card"
      cover={
        <div className="story-card-image">
          <img
            src={story.cat.url || "https://via.placeholder.com/300x200"}
            alt={story.cat.name || "cat"}
            loading="lazy"
          />
          <div className="story-card-badge">
            <HeartFilled style={{ color: "#fff", fontSize: 20 }} />
          </div>
        </div>
      }
    >
      <Card.Meta
        title={
          <div className="story-card-title">
            <span className="story-cat-name">{story.cat.name || "Unknown"}</span>
            {story.tags && story.tags.length > 0 && (
              <span className="story-cat-tags">
                {story.tags.slice(0, 2).join(", ")}
              </span>
            )}
          </div>
        }
        description={
          <div className="story-card-info">
            <div className="story-info-item">
              <CalendarOutlined />
              <span>{formattedDate}</span>
            </div>
            <div className="story-info-item">
              <UserOutlined />
              <span>{story.user || "Anonymous"}</span>
            </div>
          </div>
        }
      />
    </Card>
  );
}

function StoriesGrid({ stories }) {
  if (stories.length === 0) {
    return (
      <div className="flex justify-center mt-8">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No success stories found for this period"
        />
      </div>
    );
  }

  return (
    <div className="stories-grid">
      {stories.map((story, index) => (
        <StoryCard key={story.id || index} story={story} />
      ))}
    </div>
  );
}

export function SuccessStories() {
  const { adoptItems } = useAdopt();
  const [filter, setFilter] = useState(null);

  console.error('adoptItems',adoptItems);
  
  const filteredStories = useMemo(() => {
    if (!filter) return adoptItems;

    const hasMonth = filter.month !== undefined;
    const hasYear = filter.year !== undefined;

    return adoptItems.filter((item) => {
      const date = new Date(item.createdAt);
      const monthMatch = !hasMonth || date.getMonth() === filter.month;
      const yearMatch = !hasYear || date.getFullYear() === filter.year;
      return monthMatch && yearMatch;
    });
  }, [adoptItems, filter]);

  const sortedStories = useMemo(() => {
    return [...filteredStories].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [filteredStories]);

  return (
    <div className="page">
      <div className="container">
        <div className="success-hero">
          <h1 className="success-title">Success Stories</h1>
          <p className="success-subtitle">
            Heartwarming tales of cats finding their forever homes
          </p>
        </div>

        <StatsOverview totalAdoptions={adoptItems.length} />

        <div className="success-filter-container">
          <FilterByMonthYear value={filter} onChange={setFilter} />
        </div>

        {adoptItems.length === 0 ? (
          <div className="flex justify-center mt-8">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No adoptions yet. Be the first to adopt a cat!"
            />
          </div>
        ) : (
          <StoriesGrid stories={sortedStories} />
        )}
      </div>
    </div>
  );
}