let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 8;

// Function to create card HTML
function createCard(product) {
  return `
        <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <!-- Image Container -->
            <div class="relative h-64 overflow-hidden bg-gray-200 animate-pulse">
                <img data-src="${product.image}" 
                     src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                     alt="${product.name}" 
                     class="lazy w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                     onerror="this.src='https://via.placeholder.com/400x600?text=No+Image'">
                <span class="absolute top-3 right-3 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    ${product.category}
                </span>
            </div>
            
            <!-- Content Container -->
            <div class="p-4">
                <!-- Title and Price -->
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-bold text-gray-800 flex-1">${product.name}</h3>
                    <span class="text-blue-600 font-bold text-lg ml-2">${product.price}</span>
                </div>
                
                <!-- Author -->
                <p class="text-sm text-gray-500 mb-2">
                    <span class="text-gray-400">By</span> ${product.author}
                </p>
                
                <!-- Description -->
                <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                    ${product.description}
                </p>
                
                <!-- Buy Button -->
                <a href="${product.buyLink}" 
                   target="_blank"
                   class="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200">
                    <span class="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                        </svg>
                        Buy Now
                    </span>
                </a>
            </div>
        </div>
    `;
}

// Function to render cards for a specific page
function renderCards(page, productsToRender) {
  currentPage = page;
  const container = document.getElementById("products-container");
  if (!container) return;

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = productsToRender.slice(start, end);

  container.innerHTML = paginatedProducts
    .map((product) => createCard(product))
    .join("");
  lazyLoadImages(); // Re-initialize lazy loading for new cards
}

// Function to set up pagination controls
function setupPagination(productsToPaginate) {
  const paginationContainer = document.getElementById("pagination-container");
  if (!paginationContainer) return;

  const pageCount = Math.ceil(productsToPaginate.length / itemsPerPage);
  paginationContainer.innerHTML = ""; // Clear existing buttons

  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.className = `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200`;

    if (i === currentPage) {
      button.classList.add("bg-blue-500", "text-white");
    } else {
      button.classList.add("bg-white", "text-gray-700", "hover:bg-gray-100");
    }

    button.addEventListener("click", () => {
      renderCards(i, productsToPaginate);
      setupPagination(productsToPaginate); // Re-render pagination to update active state
    });

    paginationContainer.appendChild(button);
  }
}

// Function to set up category filters
function setupCategoryFilters() {
  const filterContainer = document.getElementById("category-filter-container");
  if (!filterContainer) return;

  const categories = ["All", ...new Set(allProducts.map((p) => p.category))];

  filterContainer.innerHTML = categories
    .map((category) => {
      return `<button class="category-btn px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 bg-white text-gray-700 hover:bg-blue-500 hover:text-white" data-category="${category}">${category}</button>`;
    })
    .join("");

  filterContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-btn")) {
      const selectedCategory = e.target.dataset.category;
      filterProducts(selectedCategory);
    }
  });
}

function filterProducts(category) {
  if (category === "All") {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter((p) => p.category === category);
  }
  renderCards(1, filteredProducts);
  setupPagination(filteredProducts);
}

// Function to sort products
function sortProducts(sortBy) {
  switch (sortBy) {
    case "latest":
      filteredProducts.sort(
        (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
      );
      break;
    case "oldest":
      filteredProducts.sort(
        (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
      );
      break;
    case "a-z":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "z-a":
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "random":
      filteredProducts.sort(() => Math.random() - 0.5);
      break;
  }
  renderCards(1, filteredProducts);
  setupPagination(filteredProducts);
}

// Function to set up lazy loading
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll(".lazy");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = image.dataset.src;
        image.classList.remove("lazy");

        image.onload = () => {
          // Hapus animasi pulse dari kontainer induknya
          image.parentElement.classList.remove("animate-pulse", "bg-gray-200");
        };

        observer.unobserve(image);
      }
    });
  });

  lazyImages.forEach((image) => {
    imageObserver.observe(image);
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  const isCategoryPage = window.location.pathname.includes("category.html");

  try {
    const response = await fetch("products.json");
    allProducts = await response.json();
    // Add a dateAdded property for sorting
    allProducts.forEach((product, index) => {
      product.dateAdded = new Date(
        Date.now() - index * 1000 * 60 * 60 * 24
      ).toISOString();
    });
    filteredProducts = [...allProducts];

    if (isCategoryPage) {
      setupCategoryFilters();
    } else {
      // Sorting logic for the home page
      const sortOptions = document.getElementById("sort-options");
      if (sortOptions) {
        sortOptions.addEventListener("change", (e) => {
          sortProducts(e.target.value);
        });
      }
    }

    renderCards(1, filteredProducts);
    setupPagination(filteredProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    const container = document.getElementById("products-container");
    if (container)
      container.innerHTML =
        "<p class='text-red-500 text-center'>Failed to load products.</p>";
  }
});
