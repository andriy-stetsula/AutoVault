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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  function toggleThem() {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem("theme", newTheme ? "dark" : "light");
  }

  const filteredCars = carsList.filter((car) =>
    car.title.toLowerCase().includes(search.toLowerCase()),
  );

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
      <button className="theme-button" onClick={toggleThem}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
      <section className="catalog">
        <div className="grid">
          {filteredCars.map((car) => (
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
