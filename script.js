
"use strict";

/* =========================================
   1. ELEMENT SELECTORS
========================================= */

const addProductForm = document.querySelector("#add-product-form");

const nameInput = document.querySelector("#product-name");
const categoryInput = document.querySelector("#category");
const quantityInput = document.querySelector("#quantity");
const locationInput = document.querySelector("#location");
const priceInput = document.querySelector("#price");
const imageInput = document.querySelector("#image");

const productGrid = document.querySelector("#product-grid");
const productDetail = document.querySelector("#product-detail");

const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");

const editModal = document.querySelector("#edit-modal");
const editForm = document.querySelector("#edit-form");

const editNameInput = document.querySelector("#edit-product-name");
const editCategoryInput = document.querySelector("#edit-category");
const editQuantityInput = document.querySelector("#edit-quantity");
const editLocationInput = document.querySelector("#edit-location");
const editPriceInput = document.querySelector("#edit-price");
const editImageInput = document.querySelector("#edit-image");

const closeEditModalButton =
  document.querySelector("#close-edit-modal");

const cancelEditButton =
  document.querySelector("#cancel-edit");

const submitButton = document.querySelector("#submit-btn");
const toast = document.querySelector(".toast");

const STORAGE_KEY = "farmersMarketplaceProducts";
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;


/* =========================================
   2. INITIAL PRODUCT DATA
========================================= */

const initialProducts = [
  {
    id: "starter-banana",
    name: "Banana",
    category: "Fruit",
    quantity: "50 kg",
    location: "Dessie",
    price: "1500 birr",
    image: "image/Banana.webp"
  },
  {
    id: "starter-tomato",
    name: "Tomato",
    category: "Vegetable",
    quantity: "50 kg",
    location: "Dessie",
    price: "500 birr",
    image: "image/Tomato.webp"
  },
  {
    id: "starter-potato",
    name: "Potato",
    category: "Vegetable",
    quantity: "50 kg",
    location: "Dessie",
    price: "250 birr",
    image: "image/potato.webp"
  }
];


/* =========================================
   3. APPLICATION STATE
========================================= */

function createId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 9)
  );
}

function normalizeProduct(product) {
  return {
    id: product.id || createId(),
    name: String(product.name ?? ""),
    category: product.category || "Vegetable",
    quantity: String(product.quantity ?? ""),
    location: String(product.location ?? ""),
    price: String(product.price ?? ""),
    image: product.image || ""
  };
}

function loadProducts() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
      return initialProducts.map(normalizeProduct);
    }

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      throw new Error("Saved product data is not an array.");
    }

    return parsedData.map(normalizeProduct);
  } catch (error) {
    console.error("Could not load products:", error);

    showToast("Could not load saved products.");
    return initialProducts.map(normalizeProduct);
  }
}

let products = loadProducts();
let editingProductId = null;
let toastTimer = null;


/* =========================================
   4. SAVE PRODUCTS
========================================= */

function saveProducts() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products)
    );

    return true;
  } catch (error) {
    console.error("Could not save products:", error);

    if (error.name === "QuotaExceededError") {
      showToast(
        "Storage is full. Try a smaller product image."
      );
    } else {
      showToast("Could not save products.");
    }

    return false;
  }
}


/* =========================================
   5. TOAST NOTIFICATIONS
========================================= */

function showToast(message) {
  if (!toast) {
    console.log(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("toast-visible");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function () {
    toast.textContent = "";
    toast.classList.remove("toast-visible");
  }, 3000);
}


/* =========================================
   6. FORM VALIDATION
========================================= */

function clearValidationErrors(form) {
  form.querySelectorAll(".error-message").forEach(function (error) {
    error.remove();
  });

  form.querySelectorAll(".input-error").forEach(function (field) {
    field.classList.remove("input-error");
    field.removeAttribute("aria-invalid");
  });
}

function showFieldError(field, message) {
  field.classList.add("input-error");
  field.setAttribute("aria-invalid", "true");

  const error = document.createElement("p");
  error.className = "error-message";
  error.textContent = message;

  field.insertAdjacentElement("afterend", error);
}

function validateForm(form, fields) {
  clearValidationErrors(form);

  let isValid = true;
  let firstInvalidField = null;

  fields.forEach(function (fieldInfo) {
    const field = fieldInfo.element;
    const label = fieldInfo.label;

    if (!field.value.trim()) {
      showFieldError(field, label + " is required.");
      isValid = false;

      if (!firstInvalidField) {
        firstInvalidField = field;
      }
    }
  });

  if (firstInvalidField) {
    firstInvalidField.focus();
  }

  return isValid;
}

function validateImageFile(file) {
  if (!file) {
    return true;
  }

  if (!file.type.startsWith("image/")) {
    showToast("Please select a valid image file.");
    return false;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    showToast("Choose an image smaller than 2 MB.");
    return false;
  }

  return true;
}


/* =========================================
   7. READ IMAGE FILES
========================================= */

function readImageAsDataURL(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();

    reader.onload = function () {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read the image."));
      }
    };

    reader.onerror = function () {
      reject(new Error("Failed to read the image file."));
    };

    reader.readAsDataURL(file);
  });
}


/* =========================================
   8. CREATE PRODUCT OBJECT
========================================= */

function getProductFromForm(image) {
  return {
    id: createId(),
    name: nameInput.value.trim(),
    category: categoryInput.value,
    quantity: quantityInput.value.trim(),
    location: locationInput.value.trim(),
    price: priceInput.value.trim(),
    image: image || ""
  };
}


/* =========================================
   9. ADD PRODUCT
========================================= */

addProductForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const fields = [
    { element: nameInput, label: "Product name" },
    { element: categoryInput, label: "Category" },
    { element: quantityInput, label: "Quantity" },
    { element: locationInput, label: "Location" },
    { element: priceInput, label: "Price" }
  ];

  if (!validateForm(addProductForm, fields)) {
    return;
  }

  const selectedFile = imageInput.files[0];

  if (!validateImageFile(selectedFile)) {
    return;
  }

  submitButton.disabled = true;

  try {
    const image = selectedFile
      ? await readImageAsDataURL(selectedFile)
      : "";

    const newProduct = getProductFromForm(image);

    products.push(newProduct);

    if (!saveProducts()) {
      products.pop();
      return;
    }

    addProductForm.reset();
    clearValidationErrors(addProductForm);

    renderProducts();
    showToast("Product added successfully!");
  } catch (error) {
    console.error("Could not add product:", error);
    showToast("Could not read the selected image.");
  } finally {
    submitButton.disabled = false;
  }
});


/* =========================================
   10. RENDER PRODUCT CARDS
========================================= */

function createProductText(label, value) {
  const paragraph = document.createElement("p");
  paragraph.textContent = label + ": " + value;

  return paragraph;
}

function createCardButton(label, action, productId, className) {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = productId;

  if (className) {
    button.className = className;
  }

  return button;
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter(function (product) {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.location.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productGrid.replaceChildren();

  if (filteredProducts.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-message";
    emptyMessage.textContent = products.length === 0
      ? "No products yet. Add your first product!"
      : "No products match your search. Try another search or category.";

    productGrid.appendChild(emptyMessage);
    return;
  }

  filteredProducts.forEach(function (product) {
    const article = document.createElement("article");
    article.className = "product-card";

    if (product.image) {
      const image = document.createElement("img");

      image.src = product.image;
      image.alt = product.name;
      image.loading = "lazy";

      image.addEventListener("error", function () {
        image.alt = "Image unavailable for " + product.name;
        image.classList.add("image-unavailable");
      });

      article.appendChild(image);
    }

    const title = document.createElement("h2");
    title.textContent = product.name;
    article.appendChild(title);

    article.appendChild(
      createProductText("Category", product.category)
    );

    article.appendChild(
      createProductText("Quantity", product.quantity)
    );

    article.appendChild(
      createProductText("Location", product.location)
    );

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = "Price: " + product.price;
    article.appendChild(price);

    article.appendChild(
      createCardButton(
        "View Details",
        "view",
        product.id,
        "view-btn"
      )
    );

    article.appendChild(
      createCardButton(
        "Edit",
        "edit",
        product.id,
        "edit-btn"
      )
    );

    article.appendChild(
      createCardButton(
        "Delete",
        "delete",
        product.id,
        "delete-btn"
      )
    );

    productGrid.appendChild(article);
  });
}


/* =========================================
   11. SEARCH AND CATEGORY FILTERS
========================================= */

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);


/* =========================================
   12. PRODUCT CARD BUTTONS
========================================= */

productGrid.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");

  if (!button || !productGrid.contains(button)) {
    return;
  }

  const productId = button.dataset.id;
  const action = button.dataset.action;

  const product = products.find(function (item) {
    return item.id === productId;
  });

  if (!product) {
    showToast("Product not found.");
    return;
  }

  if (action === "view") {
    showProductDetails(product);
  }

  if (action === "edit") {
    openEditModal(product);
  }

  if (action === "delete") {
    deleteProduct(product);
  }
});


/* =========================================
   13. VIEW PRODUCT DETAILS
========================================= */

function showProductDetails(product) {
  productDetail.replaceChildren();

  const card = document.createElement("div");
  card.className = "product-detail-card";

  const heading = document.createElement("h2");
  heading.textContent = product.name;
  card.appendChild(heading);

  if (product.image) {
    const image = document.createElement("img");

    image.src = product.image;
    image.alt = product.name;
    image.className = "detail-image";

    card.appendChild(image);
  }

  card.appendChild(
    createProductText("Category", product.category)
  );

  card.appendChild(
    createProductText("Quantity", product.quantity)
  );

  card.appendChild(
    createProductText("Location", product.location)
  );

  card.appendChild(
    createProductText("Price", product.price)
  );

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "cancel-btn";
  closeButton.textContent = "Close details";

  closeButton.addEventListener("click", function () {
    productDetail.replaceChildren();
  });

  card.appendChild(closeButton);
  productDetail.appendChild(card);

  productDetail.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================================
   14. DELETE PRODUCT
========================================= */

function deleteProduct(product) {
  const confirmed = window.confirm(
    'Delete "' + product.name + '"? This cannot be undone.'
  );

  if (!confirmed) {
    return;
  }

  const previousProducts = products;

  products = products.filter(function (item) {
    return item.id !== product.id;
  });

  if (!saveProducts()) {
    products = previousProducts;
    return;
  }

  if (editingProductId === product.id) {
    closeEditModal();
  }

  if (productDetail.textContent.includes(product.name)) {
    productDetail.replaceChildren();
  }

  renderProducts();
  showToast("Product deleted successfully.");
}


/* =========================================
   15. OPEN EDIT MODAL
========================================= */

function openEditModal(product) {
  editingProductId = product.id;

  editNameInput.value = product.name;
  editCategoryInput.value = product.category;
  editQuantityInput.value = product.quantity;
  editLocationInput.value = product.location;
  editPriceInput.value = product.price;

  editImageInput.value = "";

  clearValidationErrors(editForm);

  editModal.classList.add("show");
  document.body.style.overflow = "hidden";

  editNameInput.focus();
}


/* =========================================
   16. CLOSE EDIT MODAL
========================================= */

function closeEditModal() {
  editModal.classList.remove("show", "active");
  document.body.style.overflow = "";

  editingProductId = null;
  editForm.reset();

  clearValidationErrors(editForm);
}

closeEditModalButton.addEventListener("click", closeEditModal);
cancelEditButton.addEventListener("click", closeEditModal);

editModal.addEventListener("click", function (event) {
  if (event.target === editModal) {
    closeEditModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && editModal.classList.contains("show")) {
    closeEditModal();
  }
});


/* =========================================
   17. SAVE EDITED PRODUCT
========================================= */

editForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!editingProductId) {
    showToast("Select a product to edit.");
    return;
  }

  const product = products.find(function (item) {
    return item.id === editingProductId;
  });

  if (!product) {
    showToast("Product not found.");
    closeEditModal();
    return;
  }

  const fields = [
    { element: editNameInput, label: "Product name" },
    { element: editCategoryInput, label: "Category" },
    { element: editQuantityInput, label: "Quantity" },
    { element: editLocationInput, label: "Location" },
    { element: editPriceInput, label: "Price" }
  ];

  if (!validateForm(editForm, fields)) {
    return;
  }

  const selectedFile = editImageInput.files[0];

  if (!validateImageFile(selectedFile)) {
    return;
  }

  const updatedValues = {
    name: editNameInput.value.trim(),
    category: editCategoryInput.value,
    quantity: editQuantityInput.value.trim(),
    location: editLocationInput.value.trim(),
    price: editPriceInput.value.trim()
  };

  const hasChanged =
    product.name !== updatedValues.name ||
    product.category !== updatedValues.category ||
    product.quantity !== updatedValues.quantity ||
    product.location !== updatedValues.location ||
    product.price !== updatedValues.price ||
    Boolean(selectedFile);

  if (!hasChanged) {
    closeEditModal();
    showToast("No changes were made.");
    return;
  }

  const originalProduct = { ...product };

  try {
    if (selectedFile) {
      updatedValues.image = await readImageAsDataURL(selectedFile);
    }

    Object.assign(product, updatedValues);

    if (!saveProducts()) {
      Object.assign(product, originalProduct);
      return;
    }

    closeEditModal();
    renderProducts();

    if (productDetail.children.length > 0) {
      showProductDetails(product);
    }

    showToast("Product updated successfully.");
  } catch (error) {
    console.error("Could not update product:", error);
    showToast("Could not read the selected image.");
  }
});


/* =========================================
   18. INITIAL PAGE RENDER
========================================= */

renderProducts();

