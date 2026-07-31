import { cars } from "../../data/cars";
import "./details.scss";

export default async function CarDetails({
  params,
}: {
  params: Promise<{ carId: string }>;
}) {
  const { carId } = await params;

  const car = cars.find((item) => item.id === Number(carId));

  if (!car) {
    return <h1>Car not found</h1>;
  }

  return (
    <main className="details">
      <div className="container">
        <div className="image"></div>

        <div className="info">
          <h1>
            {car.brand} {car.model}
          </h1>

          <p className="year">{car.year}</p>

          <div className="specs">
            <div className="spec">
              <span>Body</span>
              <strong>{car.body}</strong>
            </div>

            <div className="spec">
              <span>Engine</span>
              <strong>{car.engine}</strong>
            </div>

            <div className="spec">
              <span>Fuel</span>
              <strong>{car.fuel}</strong>
            </div>

            <div className="spec">
              <span>Transmission</span>
              <strong>{car.transmission}</strong>
            </div>

            <div className="spec">
              <span>Drive</span>
              <strong>{car.drive}</strong>
            </div>
          </div>

          <button>Add to Favorites</button>
        </div>
      </div>
    </main>
  );
}
