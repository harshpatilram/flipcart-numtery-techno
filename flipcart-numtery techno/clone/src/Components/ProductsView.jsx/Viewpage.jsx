import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Viewpage = () => {
    const { item_id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4000/all?item_id=${item_id}`)
            .then((res) => res.json())
            .then((data) => setProduct(data))
            .catch((err) => console.error("Error fetching product:", err));
    }, [item_id]);

    const handleAddToCart = () => {
        fetch("http://localhost:4000/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        })
            .then((res) => res.json())
            .then((data) => console.log(data.message))
            .catch((err) => console.error("Error adding to cart:", err));
    };

    return (
        <div>
            {product ? (
                <>
                    <h1>{product.description}</h1>
                    <p>₹{product.new_price}</p>
                    <button onClick={handleAddToCart}>Add to Cart</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Viewpage;
