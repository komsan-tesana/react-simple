import { useEffect, useState } from "react";
import ProductCard from "../../shared/components/ProductCard";
import { getProducts } from "../../shared/data/products";
import { getCats } from "../../shared/services/cat.service";

export function Home() {
  const products = getProducts();
  const [cats,setCats] = useState([]);
  useEffect(()=>{
    getCats().then((res)=>setCats(res))
  },[])
  
  console.error("🚀 ~ Home ~ cats:", cats)
  

  return (
    <div className="page">
      <div className="home-hero">
        <h1 className="home-title">Welcome to Social Enterprise Management Web Application</h1>
        <p className="home-subtitle">
          Discover amazing products at great prices
        </p>
      </div>
      <div className="container">
        <h2 className="page-title">Our Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
