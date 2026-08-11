"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCars } from "../services/api";
import "./page.scss";

type Car = {
  id: number;
  title: string;
  brand: string;
  thumbnail: string;
  price: number;
  category: string;
};

export default function Favorites() {
  const [cars, setCars] = useState<Car[]>([]);
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    async function loadCars() {
      const data = await getCars();
      setCars(data);
    }

    loadCars();
  }, []);

  const favoriteCars = cars.filter((car) => favorites.includes(car.id));

  function removeFavorite(id: number) {
    const updatedFavorites = favorites.filter((item) => item !== id);

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  }

  return (
    <main className={`favorites-page ${darkMode ? "dark" : ""}`}>
      <header className="favorites-header">
        <Link href="/" className="back-link">
          ← Back to catalog
        </Link>

        <h1>Favorites</h1>

        <p>
          {favoriteCars.length} {favoriteCars.length === 1 ? "car" : "cars"}{" "}
          saved
        </p>
      </header>

      {favoriteCars.length === 0 ? (
        <div className="empty">
          <h2>No favorite cars yet</h2>
          <p>Add cars to your favorites and they will appear here.</p>

          <Link href="/" className="browse-button">
            Browse cars
          </Link>
        </div>
      ) : (
        <section className="favorites-grid">
          {favoriteCars.map((car) => (
            <article className="favorite-card" key={car.id}>
              <div className="favorite-image">
                <img src={car.thumbnail} alt={car.title} />
              </div>

              <div className="favorite-content">
                <span>{car.category}</span>

                <h2>
                  {car.brand} {car.title}
                </h2>

                <p className="price">${car.price}</p>

                <div className="actions">
                  <Link href={`/cars/${car.id}`}>View Details</Link>

                  <button onClick={() => removeFavorite(car.id)}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
