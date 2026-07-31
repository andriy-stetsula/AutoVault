export async function getCars() {
  const response = await fetch(
    "https://dummyjson.com/products/category/vehicle"
  );

  const data = await response.json();

  return data.products;
}

export async function getCar(id: string) {
  const response = await fetch(
    `https://dummyjson.com/products/${id}`
  );

  return response.json();
}