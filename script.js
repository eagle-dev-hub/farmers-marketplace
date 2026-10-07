
// --- DOM SELECTORS ---

// Add form
const form =
  document.querySelector("#add-product-form");

const productInputName =
  document.querySelector("#product-name");

const quantityInput =
  document.querySelector("#quantity");

const locationInput =
  document.querySelector("#location");

const priceInput =
  document.querySelector("#price");

const imageInput =
  document.querySelector("#image");

const categoryInput =
  document.querySelector("#category");


// Product display
const productGrid =
  document.querySelector("#product-grid");

const productDetail =
  document.querySelector("#product-detail");

const searchInput =
  document.querySelector("#search-input");

const categoryFilter =
  document.querySelector("#category-filter");


// Edit modal
const editModal =
  document.querySelector("#edit-modal");

const editForm =
  document.querySelector("#edit-form");

const editImageInput =
  document.querySelector("#edit-image");

const editCategoryInput =
  document.querySelector("#edit-category");

const editNameInput =
  document.querySelector("#edit-product-name");

const editQuantityInput =
  document.querySelector("#edit-quantity");

const editLocationInput =
  document.querySelector("#edit-location");

const editPriceInput =
  document.querySelector("#edit-price");

const closeEditModal =
  document.querySelector("#close-edit-modal");

const cancelEdit =
  document.querySelector("#cancel-edit");
  const toast = 
  document.querySelector(".toast");


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
  JSON.parse(
    localStorage.getItem("products")
  );


let products =
  savedProducts || initialProducts;


// Product currently being edited

let editingProduct = null;


// --- VALIDATION ---

function validateField(
  input,
  message
) {

  const existingError =
    input.parentElement.querySelector(
      ".error-message"
    );


  if (
    input.value.trim() === ""
  ) {

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

function validateImage(
  input,
  existingProduct,
  message
) {

  const container =
    input.parentElement;

  const existingError =
    container.querySelector(
      ".error-message"
    );


  // Editing existing product
  // without selecting a new image

  if (
    existingProduct !== null &&
    input.files.length === 0
  ) {

    if (existingError) {
      existingError.remove();
    }

    input.classList.remove(
      "input-error"
    );

    return true;
  }


  // No image selected

  if (
    input.files.length === 0
  ) {

    if (!existingError) {

      const errorMessage =
        document.createElement("p");

      errorMessage.classList.add(
        "error-message"
      );

      errorMessage.textContent =
        message;

      container.append(
        errorMessage
      );

    }

    input.classList.add(
      "input-error"
    );

    return false;
  }


  // Image exists

  if (existingError) {
    existingError.remove();
  }

  input.classList.remove(
    "input-error"
  );

  return true;
}


// --- CLEAR VALIDATION ERRORS ---

function clearValidationErrors(
  container
) {

  const errors =
    container.querySelectorAll(
      ".error-message"
    );

  errors.forEach(
    function (error) {
      error.remove();
    }
  );


  const invalidInputs =
    container.querySelectorAll(
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


// =====================================================
// ADD PRODUCT
// =====================================================

form.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    // --- VALIDATE ---

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
      validateImage(
        imageInput,
        null,
        "Product image is required"
      );


    // Stop if invalid

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

      category:
        categoryInput.value,

      quantity:
        quantityInput.value.trim(),

      location:
        locationInput.value.trim(),

      price:
        priceInput.value.trim(),

      image: ""

    };


    // --- READ IMAGE ---

    const imageFile =
      imageInput.files[0];


    const reader =
      new FileReader();


    reader.onload =
      function () {

        product.image =
          reader.result;


        products.push(
          product
        );


        saveProducts();


        form.reset();


        clearValidationErrors(
          form
        );


        renderProduct();
        showToast("Product Added Successfully");

      };
      
     


    reader.readAsDataURL(
      imageFile
    );

  }
);


// =====================================================
// EDIT PRODUCT
// =====================================================


// Open edit modal

function openEditModal(
  product
) {

  editingProduct =
    product;


  // Fill edit form

  editNameInput.value =
    product.name;

  editCategoryInput.value =
    product.category;

  editQuantityInput.value =
    product.quantity;

  editLocationInput.value =
    product.location;

  editPriceInput.value =
    product.price;


  // Clear previous errors

  clearValidationErrors(
    editForm
  );


  // Show modal

  editModal.classList.add(
    "show"
  );

}


// Close edit modal

function closeEditModalWindow() {

  editModal.classList.remove(
    "show"
  );


  clearValidationErrors(
    editForm
  );


  editForm.reset();


  editingProduct = null;

}


// Close buttons

closeEditModal.addEventListener(
  "click",
  closeEditModalWindow
);

cancelEdit.addEventListener(
  "click",
  closeEditModalWindow
);


// Close when clicking outside modal

editModal.addEventListener(
  "click",
  function (event) {

    if (
      event.target === editModal
    ) {

      closeEditModalWindow();

    }

  }
);


// --- SAVE EDITED PRODUCT ---

editForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    if (
      editingProduct === null
    ) {

      return;

    }
    


    // --- VALIDATE ---

    const nameValid =
      validateField(
        editNameInput,
        "Product name is required"
      );

    const categoryValid =
      validateField(
        editCategoryInput,
        "Category is required"
      );

    const quantityValid =
      validateField(
        editQuantityInput,
        "Quantity is required"
      );

    const locationValid =
      validateField(
        editLocationInput,
        "Location is required"
      );

    const priceValid =
      validateField(
        editPriceInput,
        "Price is required"
      );


    const imageValid =
      validateImage(
        editImageInput,
        editingProduct,
        "Product image is required"
      );


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


    // --- UPDATE BASIC DATA ---

    editingProduct.name =
      editNameInput.value.trim();

    editingProduct.category =
      editCategoryInput.value;

    editingProduct.quantity =
      editQuantityInput.value.trim();

    editingProduct.location =
      editLocationInput.value.trim();

    editingProduct.price =
      editPriceInput.value.trim();


    // --- IMAGE UPDATE ---

    const imageFile =
      editImageInput.files[0];


    if (imageFile) {

      const reader =
        new FileReader();


      reader.onload =
        function () {

          editingProduct.image =
            reader.result;


          finishEditing();

        };


      reader.readAsDataURL(
        imageFile
      );

    } else {

      // Keep old image

      finishEditing();

    }

  }
);


// Finish edit

function finishEditing() {

  saveProducts();


  closeEditModalWindow();


  renderProduct();
showToast("Product Updated Successfully!!")
}


// --- SAVE TO LOCAL STORAGE ---

function saveProducts() {

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

}


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProduct(
  productList = products
) {

  productGrid.innerHTML =
    "";


  // Empty state

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


  // Render products

  productList.forEach(
    function (product) {

      const productHTML = `

        <article>

          <h1>
            Product name:
            ${product.name}
          </h1>

          <img
            src="${product.image}"
            alt="${product.name}"
          >

          <p>
            Category:
            ${product.category}
          </p>

          <p>
            Quantity:
            ${product.quantity}
          </p>

          <p>
            Location:
            ${product.location}
          </p>

          <p>
            Price:
            ${product.price}
          </p>

          <div class="card-actions">

            <button
              class="edit-btn"
            >
              Edit
            </button>

            <button
              class="delete-btn"
            >
              Delete
            </button>

            <button
              class="view-btn"
            >
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


      // --- EDIT ---

      editButton.addEventListener(
        "click",
        function () {

          const selectedProduct =
            products.find(
              function (item) {

                return (
                  item === product
                );

              }
            );


          openEditModal(
            selectedProduct
          );

        }
      );


      // --- VIEW ---

      viewButton.addEventListener(
        "click",
        function () {

          const selectedProduct =
            products.find(
              function (item) {

                return (
                  item === product
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


      // --- DELETE ---

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
                    item !== product
                  );

                }
              );


            saveProducts();


            renderProduct();
            showToast("Product deleted successfully!")

          }

        }
      );

    }
  );

}


// =====================================================
// SEARCH + FILTER
// =====================================================

function applyFilters() {

  const searchText =
    searchInput.value
      .toLowerCase()
      .trim();


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


// Search

searchInput.addEventListener(
  "input",
  applyFilters
);


// Category filter

categoryFilter.addEventListener(
  "change",
  applyFilters
);

function showToast(message){
  toast.textContent = message;
  setTimeout(function(){
   toast.textContent = "";
  }, 3000);

}

// =====================================================
// START APP
// =====================================================

renderProduct();
