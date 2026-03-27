import { useEffect, useState, useRef, useMemo } from "react";
import { getCatsHero } from "../../shared/services/cat-service";
import { Carousel, Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useAdopt, useCart } from "@/app/providers";

function ScrollAnimation({ children, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, []);

  return (
    <div ref={elementRef} className={`scroll-animate ${isVisible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function ContentCarousel({ cats }) {
  const contentStyle = {
    margin: 0,
    width: "100%",
    height: "500px",
    color: "#fff",
    lineHeight: "500px",
    textAlign: "center",
    background: "#1a1a2e",
  };

  return (
    <div>
      <Carousel fade autoplaySpeed={5000} autoplay>
        {cats &&
          cats.map((cat, index) => (
            <div key={index}>
              <img
                style={contentStyle}
                loading="eager"
                draggable={false}
                alt={cat.name || "cat"}
                src={cat.url || null}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "20%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#fff",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                }}
              >
                {cat.name}
              </div>
            </div>
          ))}
      </Carousel>
    </div>
  );
}

function StatsBar() {
  const { adoptItems } = useAdopt();
  const { cartItems } = useCart();

  const stats = useMemo(() => {
    const totalDonations = cartItems.reduce((sum, item) => {
      const amount = (item.food || 0) + (item.medical || 0) + (item.supplies || 0);
      return sum + amount;
    }, 0);

    return {
      adoptions: adoptItems.length,
      donations: cartItems.length,
      totalAmount: totalDonations,
    };
  }, [adoptItems, cartItems]);

  return (
    <ScrollAnimation>
      <div className="home-stats">
        <div className="home-stats-item">
          <div className="home-stats-number">{stats.adoptions}</div>
          <div className="home-stats-label">Adoptions</div>
        </div>
        <div className="home-stats-item">
          <div className="home-stats-number">{stats.donations}</div>
          <div className="home-stats-label">Donations</div>
        </div>
        <div className="home-stats-item">
          <div className="home-stats-number">฿{stats.totalAmount}</div>
          <div className="home-stats-label">Total Raised</div>
        </div>
      </div>
    </ScrollAnimation>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: "🔍",
      title: "Browse",
      description: "Explore our lovely cats waiting for a forever home",
    },
    {
      icon: "❤️",
      title: "Choose",
      description: "Donate or adopt the cat that touches your heart",
    },
    {
      icon: "🏠",
      title: "Impact",
      description: "Make a difference in a cat's life today",
    },
  ];

  return (
    <ScrollAnimation>
      <div className="home-how-it-works">
        <h2 className="home-section-title">How It Works</h2>
        <div className="home-steps">
          {steps.map((step, index) => (
            <div key={index} className="home-step animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
              <div className="home-step-icon">{step.icon}</div>
              <h3 className="home-step-title">{step.title}</h3>
              <p className="home-step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </ScrollAnimation>
  );
}

export function Home() {
  const {
    data: catsHero = [],
    isFetching
  } = useQuery({
    queryKey: ["catsHero"],
    queryFn: ({signal}) => getCatsHero(signal),
    staleTime: 1000 * 120,
    cacheTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  return (
    <div className="page">
      <div className="container">
        <div className="hero-gradient animate-fade-in-up">
          <div className="home-hero">
            <h1 className="home-title" style={{ color: "#fff" }}>
              Welcome to SEM Cat Shelter
            </h1>
            <p className="home-subtitle" style={{ color: "rgba(255,255,255,0.9)" }}>
              Find your new best friend or help us care for cats in need
            </p>
          </div>
        </div>

        <StatsBar />
        <HowItWorks />

        <div className="home-carousel mt-8">
          <h2 className="home-section-title">Meet Our Cats</h2>
          {isFetching ? <Skeleton active /> : <ContentCarousel cats={catsHero} />}
        </div>
      </div>
    </div>
  );
}