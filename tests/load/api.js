import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "30s", target: 0 },
  ],
};

const BASE_URL = __ENV.API_URL || "http://localhost:4000/api/v1";

export default function () {
  // Test products endpoint
  const productsRes = http.get(`${BASE_URL}/products`);
  check(productsRes, {
    "products status 200": (r) => r.status === 200,
    "products response time < 500ms": (r) => r.timings.duration < 500,
  });

  // Test single product query
  const queryRes = http.get(`${BASE_URL}/products?limit=1`);
  check(queryRes, {
    "query status 200": (r) => r.status === 200,
  });

  sleep(1);
}
