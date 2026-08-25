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
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  function toggleFavorite(id: number) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function toggleThem() {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem("theme", newTheme ? "dark" : "light");
  }

  const filteredCars = carsList.filter((car) =>
    car.title.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    setFavoritesLoaded(true);
  }, []);

  useEffect(() => {
    if (!favoritesLoaded) return;
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites, favoritesLoaded]);

  useEffect(() => {
    async function loadCars() {
      const data = await getCars();
      console.log(data);
      setCarsList(data);
    }
    loadCars();
  }, []);

  return (
    <main className={`page ${darkMode ? "dark" : ""}`}>
      <section className="hero">
        <span className="logo">AutoVault</span>

        <h1 className="title">Discover your next dream car.</h1>

        <p className="subtitle">
          Browse and explore a wide range of vehicles with detailed
          specifications and save your favorite models.
        </p>

        <div className="search">
          <FiSearch className="icon" />

          <input
            placeholder="Search by model..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </section>
      <div className="header-actions">
        <button className="theme-button" onClick={toggleThem}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <Link href="/favorites" className="favorites-button">
          Favorites
          <span className="favorites-count">{favorites.length}</span>
        </Link>
      </div>
      <section className="catalog">
        <div className="grid">
          {filteredCars.map((car) => (
            <div className="card" key={car.id}>
              <button onClick={() => toggleFavorite(car.id)}>
                {favorites.includes(car.id) ? "♥" : "♡"}
              </button>

              <Link href={`/cars/${car.id}`}>
                <div className="image">
                  <img src={car.thumbnail} alt={car.title} />
                </div>

                <div className="content">
                  <h3>
                    {car.brand} {car.title}
                  </h3>

                  <p>{car.category}</p>
                  <button>View Details</button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
