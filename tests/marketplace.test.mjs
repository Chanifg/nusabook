import test from "node:test";
import assert from "node:assert/strict";

// Dataset sample to test filter logic isolated for Workstream D
const SAMPLE_PACKAGES = [
  {
    id: "pkg-1",
    title: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    category: "open_trip",
    destinationCity: "Yogyakarta",
    pricePerPax: 250000,
    availableQuota: 12,
  },
  {
    id: "pkg-2",
    title: "Midnight Overland Bromo Sunrise & Savana Teletubbies",
    category: "open_trip",
    destinationCity: "Malang",
    pricePerPax: 450000,
    availableQuota: 4,
  },
  {
    id: "pkg-3",
    title: "Private Premium Trip Candi Borobudur",
    category: "private_trip",
    destinationCity: "Magelang",
    pricePerPax: 650000,
    availableQuota: 6,
  },
  {
    id: "pkg-4",
    title: "Eksplorasi Api Biru Kawah Ijen",
    category: "open_trip",
    destinationCity: "Banyuwangi",
    pricePerPax: 380000,
    availableQuota: 0, // Sold out
  },
];

function filterPackages(packages, { query = "", city = "", category = "", maxPrice = 5000000, availableOnly = false, pax = 1 }) {
  return packages.filter((pkg) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchesTitle = pkg.title.toLowerCase().includes(q);
      const matchesCity = pkg.destinationCity.toLowerCase().includes(q);
      if (!matchesTitle && !matchesCity) return false;
    }

    if (city.trim() && pkg.destinationCity.toLowerCase() !== city.toLowerCase()) {
      return false;
    }

    if (category && pkg.category !== category) {
      return false;
    }

    if (maxPrice < 5000000 && pkg.pricePerPax > maxPrice) {
      return false;
    }

    if (availableOnly && pkg.availableQuota <= 0) {
      return false;
    }

    if (pax > 1 && pkg.availableQuota < pax) {
      return false;
    }

    return true;
  });
}

test("Workstream D: Filter by search query matches title or city", () => {
  const result = filterPackages(SAMPLE_PACKAGES, { query: "merapi" });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "pkg-1");
});

test("Workstream D: Filter by destination city", () => {
  const result = filterPackages(SAMPLE_PACKAGES, { city: "Magelang" });
  assert.equal(result.length, 1);
  assert.equal(result[0].title, "Private Premium Trip Candi Borobudur");
});

test("Workstream D: Filter by category (private_trip)", () => {
  const result = filterPackages(SAMPLE_PACKAGES, { category: "private_trip" });
  assert.equal(result.length, 1);
  assert.equal(result[0].category, "private_trip");
});

test("Workstream D: Filter by maximum price", () => {
  const result = filterPackages(SAMPLE_PACKAGES, { maxPrice: 3000000 }); // all <= 300k
  const filteredUnder300k = filterPackages(SAMPLE_PACKAGES, { maxPrice: 300000 });
  assert.equal(filteredUnder300k.length, 1);
  assert.equal(filteredUnder300k[0].id, "pkg-1");
});

test("Workstream D: Filter available quota only (hides sold out)", () => {
  const result = filterPackages(SAMPLE_PACKAGES, { availableOnly: true });
  assert.equal(result.length, 3);
  assert.ok(result.every((pkg) => pkg.availableQuota > 0));
});

test("Workstream D: Filter by pax count requirement", () => {
  const result = filterPackages(SAMPLE_PACKAGES, { pax: 10 });
  assert.equal(result.length, 1); // Only Merapi has 12 quota
  assert.equal(result[0].id, "pkg-1");
});
