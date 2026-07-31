"use client";

import { getCar } from "@/app/services/api";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "./details.scss";
import Link from "next/link";

type Car = {
  id: number;
  title: string;
  brand: string;
  thumbnail: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  stock: number;
};

export default function CarDetails({}: { params: { carId: string } }) {
  const { carId } = useParams<{ carId: string }>();

  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    async function loadCar() {
      const data = await getCar(carId);
      setCar(data);
    }

    loadCar();
  }, [carId]);

  if (!car) {
    return <h1>Car not found</h1>;
  }

  return (
    <main className="details">
      <div className="back">
        <Link href="/">‹ Back to catalog</Link>
      </div>
      <div className="container">
        <div className="details-image">
          <img src={car.thumbnail} alt={car.title} />
        </div>
        <div className="info">
          <h1>
            {car.brand} {car.title}
          </h1>

          <p className="year">{car.price}</p>

          <div className="specs">
            <div className="spec">
              <span>Brand</span>
              <strong>{car.brand}</strong>
            </div>

            <div className="spec">
              <span>Model</span>
              <strong>{car.title}</strong>
            </div>

            <div className="spec">
              <span>Category</span>
              <strong>{car.category}</strong>
            </div>

            <div className="spec">
              <span>Price</span>
              <strong>${car.price}</strong>
            </div>

            <div className="spec">
              <span>Rating</span>
              <strong>{car.rating} ⭐</strong>
            </div>

            <div className="spec">
              <span>In Stock</span>
              <strong>{car.stock}</strong>
            </div>
          </div>

          <button>Add to Favorites</button>
        </div>
      </div>
    </main>
  );
}
