document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const productsContainer = document.getElementById("products-container");
  let allProducts = [];

  // Function to create a product card (moved from card.js)
  function createCard(product) {
    return `
      <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="relative h-64 overflow-hidden">
              <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
          </div>
          <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">${product.name}</h3>
              <p class="text-blue-600 font-bold text-lg">${product.price}</p>
              <a href="${product.buyLink}" target="_blank" class="block w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white text-center font-semibold py-2 rounded-lg transition-colors duration-200">
                  Buy Now
              </a>
          </div>
      </div>
    `;
  }

  // Fetch products from the JSON file
  fetch("products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((products) => {
      allProducts = products;
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      if (productsContainer) {
        productsContainer.innerHTML =
          "<p class='text-red-500 text-center'>Failed to load product data.</p>";
      }
    });

  // Function to render search results
  function renderResults(results) {
    if (!productsContainer) return;

    if (results.length === 0) {
      productsContainer.innerHTML =
        "<p class='text-gray-500 text-center'>No products found matching your search.</p>";
      return;
    }

    productsContainer.innerHTML = results.map(createCard).join("");
  }

  // Event listener for the search input
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm.length < 2) {
      if (productsContainer) {
        productsContainer.innerHTML =
          "<p class='text-gray-500 text-center'>Please enter at least 2 characters to search.</p>";
      }
      return;
    }

    const filteredProducts = allProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    });

    renderResults(filteredProducts);
  });
});
