import { FiSearch } from "react-icons/fi";
import { cars } from "./data/cars";
import Link from "next/link";

export default function HomePage() {
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
          {cars.map((car) => (
            <div className="card" key={car.id}>
              <div className="image"></div>

              <div className="content">
                <h3>
                  {car.brand} {car.model}
                </h3>

                <p>
                  {car.body} {car.year} {car.transmission}
                </p>
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
