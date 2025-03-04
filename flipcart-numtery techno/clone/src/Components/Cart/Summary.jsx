import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Summary = () => {
    const { cartData, SetCartData } = useContext(CartContext);

    const handleQuantityChange = (id, quantity) => {
        fetch(`http://localhost:4000/products/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);
                SetCartData((prevData) =>
                    prevData.map((item) =>
                        item.item_id === id ? { ...item, quantity } : item
                    )
                );
            })
            .catch((err) => console.error("Error updating quantity:", err));
    };

    return (
        <div>
            <h1>Order Summary</h1>
            {cartData.map((item) => (
                <div key={item.item_id}>
                    <h2>{item.description}</h2>
                    <p>Quantity: {item.quantity}</p>
                    <button onClick={() => handleQuantityChange(item.item_id, item.quantity + 1)}>+</button>
                    <button onClick={() => handleQuantityChange(item.item_id, item.quantity - 1)}>-</button>
                </div>
            ))}
        </div>
    );
};

export default Summary;
