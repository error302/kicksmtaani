import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 10 },
    { duration: "2m", target: 20 },
    { duration: "1m", target: 0 },
  ],
};

const BASE_URL = __ENV.API_URL || "http://localhost:4000/api/v1";

export default function () {
  // Browse products
  const products = http.get(`${BASE_URL}/products`);
  check(products, { "products loaded": (r) => r.status === 200 });

  // Get a product
  const product = http.get(`${BASE_URL}/products?limit=1`);
  check(product, { "product loaded": (r) => r.status === 200 });

  sleep(2);
}
