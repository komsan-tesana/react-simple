import { useState } from "react";
import { createProduct } from "../../shared/data/products";
import { useNavigate } from "react-router-dom";

export function AddProduct() {
  const navigate = useNavigate();
  const [previewImg, setPreviewImg] = useState(null);
  // https://gratisography.com/wp-content/uploads/2024/11/gratisography-leg-warmers-1170x780.jpg

  //can use lib
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      image: formData.get("img"),
      name: formData.get("name"),
      price: Number(formData.get("price")),
      description: formData.get("description"),
    };
    let result = createProduct(data);

   
    if(result.success){
      navigate('/')
    }else{
      alert(result.message)
    } 
  };


  return (
    <div className="page">
      <div className="container">
        <h1 className="home-title">Add Product</h1>

    
        <form onSubmit={handleSubmit}>

        <div className="product-detail">
          <div className="product-detail-image-preview">
             <img src={previewImg || null} />
          </div>

          <div className="product-add-form">
            <label id="img" img="img" htmlFor="img">
              Img Link :
            </label>
            <input
              onChange={(e) => setPreviewImg(e.target.value ?? "")}
              type="text"
              name="img"
            />
            
            <label id="name" name="name" htmlFor="name">
              Name :
            </label>
            <input type="text" name="name" />

            <label id="price" price="price" htmlFor="price">
              Price :
            </label>
            <input type="number" min={0} name="price" />

            <label id="description" description="description" htmlFor="description">
              Description :
            </label>
            <textarea type="text" name="description" />
          </div>
        </div>

        <div className="product-add-footer">         
           <button className="btn btn-secondary btn-small" onClick={()=>navigate('/')}>
            Cancel
          </button>
          <button className="btn btn-primary btn-small" type="submit">
            Add
          </button>        
        </div>
        </form>
      </div>
    </div>
  );
}
