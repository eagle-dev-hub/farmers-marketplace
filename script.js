// --- DOM SELECTORS ---

const form = document.querySelector(".form");

const productInputName = document.querySelector("#product-name");
const quantityInput = document.querySelector("#quantity");
const locationInput = document.querySelector("#location");
const priceInput = document.querySelector("#price");
const imageInput = document.querySelector("#image");
const categoryInput = document.querySelector("#category");

const productGrid = document.querySelector("#product-grid");
const productDetail = document.querySelector("#product-detail");
const searchInput = document.querySelector("#search-input");
const submitButton = document.querySelector("#submit-btn");
const categoryFilter = document.querySelector("#category-filter");


// --- INITIAL STATE & STORAGE ---

const initialProducts = [
  {
    category: "Fruit",
    name: "Banana",
    quantity: "50kg",
    location: "Dessie",
    price: "1500$",
    image: "image/Banana.webp"
  },
  {
    category: "Vegetable",
    name: "Tomato",
    quantity: "50kg",
    location: "Dessie",
    price: "500$",
    image: "image/Tomato.webp"
  },
  {
    category: "Vegetable",
    name: "Potato",
    quantity: "50kg",
    location: "Dessie",
    price: "250$",
    image: "image/potato.webp"
  }
];

const savedProducts =
  JSON.parse(localStorage.getItem("products"));

let products =
  savedProducts || initialProducts;

let editingProduct = null;


// --- VALIDATION ---

function validateField(input, message) {

  const existingError =
    input.parentElement.querySelector(".error-message");

  if (input.value.trim() === "") {

    if (!existingError) {

      const errorMessage =
        document.createElement("p");

      errorMessage.classList.add(
        "error-message"
      );

      errorMessage.textContent =
        message;

      input.parentElement.append(
        errorMessage
      );
    }

    input.classList.add(
      "input-error"
    );

    return false;
  }

  if (existingError) {
    existingError.remove();
  }

  input.classList.remove(
    "input-error"
  );

  return true;
}


// --- IMAGE VALIDATION ---

function validateImage() {

  const imageContainer =
    imageInput.parentElement;

  const existingError =
    imageContainer.querySelector(
      ".error-message"
    );


  // Editing existing product
  // does not require a new image

  if (
    editingProduct !== null &&
    imageInput.files.length === 0
  ) {

    if (existingError) {
      existingError.remove();
    }

    return true;
  }


  // New product must have image

  if (imageInput.files.length === 0) {

    if (!existingError) {

      const errorMessage =
        document.createElement("p");

      errorMessage.classList.add(
        "error-message"
      );

      errorMessage.textContent =
        "Product image is required";

      imageContainer.append(
        errorMessage
      );
    }

    imageInput.classList.add(
      "input-error"
    );

    return false;
  }


  // Image is valid

  if (existingError) {
    existingError.remove();
  }

  imageInput.classList.remove(
    "input-error"
  );

  return true;
}


// --- FORM SUBMIT HANDLER ---

form.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    // --- VALIDATE FIELDS ---

    const nameValid =
      validateField(
        productInputName,
        "Product name is required"
      );

    const categoryValid =
      validateField(
        categoryInput,
        "Category is required"
      );

    const quantityValid =
      validateField(
        quantityInput,
        "Quantity is required"
      );

    const locationValid =
      validateField(
        locationInput,
        "Location is required"
      );

    const priceValid =
      validateField(
        priceInput,
        "Price is required"
      );

    const imageValid =
      validateImage();


    // --- STOP IF INVALID ---

    if (
      !nameValid ||
      !categoryValid ||
      !quantityValid ||
      !locationValid ||
      !priceValid ||
      !imageValid
    ) {
      return;
    }


    // --- CREATE PRODUCT ---

    const product = {

      name:
        productInputName.value.trim(),

      quantity:
        quantityInput.value.trim(),

      location:
        locationInput.value.trim(),

      price:
        priceInput.value.trim(),

      category:
        categoryInput.value

    };


    // --- IMAGE HANDLING ---

    const imageFile =
      imageInput.files[0];


    if (imageFile) {

      const reader =
        new FileReader();


      reader.onload =
        function () {

          product.image =
            reader.result;

          saveProduct(product);

        };


      reader.readAsDataURL(
        imageFile
      );

    } else {

      // Keep existing image
      // when editing

      if (
        editingProduct !== null
      ) {

        product.image =
          editingProduct.image;

      }


      saveProduct(product);

    }

  }
);


// --- SAVE PRODUCT ---

function saveProduct(product) {

  // --- EDIT OR ADD ---

  if (
    editingProduct !== null
  ) {

    editingProduct.name =
      product.name;

    editingProduct.quantity =
      product.quantity;

    editingProduct.location =
      product.location;

    editingProduct.price =
      product.price;

    editingProduct.category =
      product.category;

    editingProduct.image =
      product.image;

  } else {

    products.push(product);

  }


  // --- SAVE TO LOCAL STORAGE ---

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );


  // --- RESET EDIT MODE ---

  editingProduct = null;

  submitButton.textContent =
    "Add Product";

  form.reset();


  // --- RENDER PRODUCTS ---

  renderProduct();

}


// --- RENDER FUNCTION ---

function renderProduct(
  productList = products
) {

  productGrid.innerHTML = "";


  // --- EMPTY STATE ---

  if (
    productList.length === 0
  ) {

    const emptyMessage =
      document.createElement("p");

    emptyMessage.classList.add(
      "empty-message"
    );

    emptyMessage.textContent =
      "No products found";

    productGrid.append(
      emptyMessage
    );

    return;
  }


  // --- RENDER PRODUCTS ---

  productList.forEach(
    function (product) {

      const productHTML = `

        <article>

          <h1>
            Product name: ${product.name}
          </h1>

          <img
            src="${product.image}"
            alt="${product.name}"
          >

          <p>
            Category: ${product.category}
          </p>

          <p>
            Quantity: ${product.quantity}
          </p>

          <p>
            Location: ${product.location}
          </p>

          <p>
            Price: ${product.price}
          </p>

          <div class="card-actions">

            <button class="edit-btn">
              Edit
            </button>

            <button class="delete-btn">
              Delete
            </button>

            <button class="view-btn">
              View
            </button>

          </div>

        </article>

      `;


      productGrid.insertAdjacentHTML(
        "beforeend",
        productHTML
      );


      const currentCard =
        productGrid.lastElementChild;


      const editButton =
        currentCard.querySelector(
          ".edit-btn"
        );

      const deleteButton =
        currentCard.querySelector(
          ".delete-btn"
        );

      const viewButton =
        currentCard.querySelector(
          ".view-btn"
        );


      // --- EDIT PRODUCT ---

      editButton.addEventListener(
        "click",
        function () {

          const selectedProduct =
            products.find(
              function (item) {

                return (
                  item.name ===
                  product.name
                );

              }
            );


          productInputName.value =
            selectedProduct.name;

          quantityInput.value =
            selectedProduct.quantity;

          locationInput.value =
            selectedProduct.location;

          priceInput.value =
            selectedProduct.price;

          categoryInput.value =
            selectedProduct.category;


          editingProduct =
            selectedProduct;


          submitButton.textContent =
            "Update Product";


          // Remove old validation
          // errors when editing

          clearValidationErrors();

        }
      );


      // --- VIEW PRODUCT ---

      viewButton.addEventListener(
        "click",
        function () {

          const selectedProduct =
            products.find(
              function (item) {

                return (
                  item.name ===
                  product.name
                );

              }
            );


          productDetail.innerHTML = `

            <div class="detail-card">

              <button
                id="close-detail-btn"
              >
                X
              </button>

              <img
                src="${selectedProduct.image}"
                alt="${selectedProduct.name}"
              >

              <h2>
                ${selectedProduct.name}
              </h2>

              <p>
                <strong>
                  Category:
                </strong>
                ${selectedProduct.category}
              </p>

              <p>
                <strong>
                  Price:
                </strong>
                ${selectedProduct.price}
              </p>

              <p>
                <strong>
                  Quantity:
                </strong>
                ${selectedProduct.quantity}
              </p>

              <p>
                <strong>
                  Location:
                </strong>
                ${selectedProduct.location}
              </p>

            </div>

          `;


          const closeButton =
            document.querySelector(
              "#close-detail-btn"
            );


          closeButton.addEventListener(
            "click",
            function () {

              productDetail.innerHTML =
                "";

            }
          );


          productDetail.addEventListener(
            "click",
            function (event) {

              if (
                event.target ===
                productDetail
              ) {

                productDetail.innerHTML =
                  "";

              }

            }
          );

        }
      );


      // --- DELETE PRODUCT ---

      deleteButton.addEventListener(
        "click",
        function () {

          const answer =
            confirm(
              "Are you sure you want to delete this product?"
            );


          if (answer) {

            products =
              products.filter(
                function (item) {

                  return (
                    item.name !==
                    product.name
                  );

                }
              );


            localStorage.setItem(
              "products",
              JSON.stringify(products)
            );


            renderProduct();

          }

        }
      );

    }
  );

}


// --- CLEAR VALIDATION ERRORS ---

function clearValidationErrors() {

  const errors =
    document.querySelectorAll(
      ".error-message"
    );

  errors.forEach(
    function (error) {
      error.remove();
    }
  );


  const invalidInputs =
    document.querySelectorAll(
      ".input-error"
    );

  invalidInputs.forEach(
    function (input) {

      input.classList.remove(
        "input-error"
      );

    }
  );

}


// --- APPLY FILTERS ---

function applyFilters() {

  const searchText =
    searchInput.value
      .toLowerCase();

  const selectedCategory =
    categoryFilter.value;


  const filteredProducts =
    products.filter(
      function (product) {

        const searchMatch =
          product.name
            .toLowerCase()
            .includes(searchText);


        const categoryMatch =
          selectedCategory ===
            "all" ||
          product.category ===
            selectedCategory;


        return (
          searchMatch &&
          categoryMatch
        );

      }
    );


  renderProduct(
    filteredProducts
  );

}


// --- SEARCH PRODUCT ---

searchInput.addEventListener(
  "input",
  applyFilters
);


// --- CATEGORY FILTER ---

categoryFilter.addEventListener(
  "change",
  applyFilters
);


// --- START APP ---

renderProduct();