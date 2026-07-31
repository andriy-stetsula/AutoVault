"use client";

import { FiSearch } from "react-icons/fi";
import { getCars } from "./services/api";
import Link from "next/link";
import { useEffect, useState } from "react";

type Car = {
  id: number;
  title: string;
  brand: string;
  thumbnail: string;
  price: number;
  category: string;
};

export default function HomePage() {
  const [carsList, setCarsList] = useState<Car[]>([]);

  useEffect(() => {
    async function loadCars() {
      const data = await getCars();
      console.log(data);
      setCarsList(data);
    }
    loadCars();
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <span className="logo">AutoVault</span>

        <h1 className="title">Discover your next dream car.</h1>

        <p className="subtitle">
          Browse and explore a wide range of vehicles with detailed
          specifications and save your favorite models.
        </p>

        <div className="search">
          <FiSearch className="icon" />

          <input placeholder="Search by model..." />
        </div>
      </section>
      <section className="catalog">
        <div className="grid">
          {carsList.map((car) => (
            <div className="card" key={car.id}>
              <div className="image">
                <img src={car.thumbnail} alt={car.title} />
              </div>

              <div className="content">
                <h3>
                  {car.brand} {car.title}
                </h3>

                <p>{car.category}</p>
                <Link href={`/cars/${car.id}`}>
                  <button>View Details</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
