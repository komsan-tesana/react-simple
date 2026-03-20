import { getCatsHero } from "../../shared/services/cat-service";
import { Carousel,Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";

function ContentCarousel({ cats }) {
  const contentStyle = {
    margin: 0,
    width: "1200px",
    height: "500px",
    color: "#fff",
    lineHeight: "500px",
    textAlign: "center",
    background: "grey",
  };

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
  const {
    data: catsHero = [],    
    isFetching    
  } = useQuery({
    queryKey: ["catsHero"],
    queryFn: () => getCatsHero(),
    staleTime: 1000 * 120, // 2 min
    cacheTime: 1000 * 60 * 5, 
    keepPreviousData: true,
  });

  return (
    <div className="page">
      <div className="home-hero">
        <h1 className="home-title">
          Welcome to Social Enterprise Management Web Application
        </h1>
        <p className="home-subtitle">Discover amazing cats</p>
      </div>

      <div className="home-carousel">
        {isFetching ? <Skeleton active/> : <ContentCarousel cats={catsHero} />}
      </div>
      {/* 
      <div className="container">
          container
      </div> */}
    </div>
  );
}
