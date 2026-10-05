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

let products = savedProducts || initialProducts;

let editingProduct = null;




// --- FORM SUBMIT HANDLER ---
form.addEventListener("submit", function (event) {
  if(quantityInput.value.trim() === ""){
  const quantityError =document.createElement("p");
  quantityError.textContent = "Quantity field is required";
  quantityError.parentElement.append(quantityError);
  return;

  }


  event.preventDefault();

  const imageFile = imageInput.files[0];

  if (imageFile) {

    const reader = new FileReader();

    reader.onload = function () {

      const product = {

        image: reader.result,
        name: productInputName.value,
        quantity: quantityInput.value,
        location: locationInput.value,
        price: priceInput.value,
        category: categoryInput.value

      };


      // --- EDIT OR ADD ---
      if (editingProduct !== null) {

        editingProduct.name = product.name;
        editingProduct.quantity = product.quantity;
        editingProduct.location = product.location;
        editingProduct.price = product.price;
        editingProduct.image = product.image;
        editingProduct.category = product.category;

      } else {

        products.push(product);

      }


      // --- SAVE ---
      localStorage.setItem(
        "products",
        JSON.stringify(products)
      );


      // --- RESET EDIT MODE ---
      editingProduct = null;

      submitButton.textContent = "Add Product";

      form.reset();

      renderProduct();

    };

    reader.readAsDataURL(imageFile);

  } else {

    // --- EDIT WITHOUT NEW IMAGE ---
    if (editingProduct !== null) {

      editingProduct.name =
        productInputName.value;

      editingProduct.quantity =
        quantityInput.value;

      editingProduct.location =
        locationInput.value;

      editingProduct.price =
        priceInput.value;

      editingProduct.category =
        categoryInput.value;


      // --- SAVE ---
      localStorage.setItem(
        "products",
        JSON.stringify(products)
      );


      // --- RESET EDIT MODE ---
      editingProduct = null;

      submitButton.textContent = "Add Product";

      form.reset();

      renderProduct();

    }

  }

});


// --- RENDER FUNCTION ---
function renderProduct(productList = products) {

  productGrid.innerHTML = "";

  if(productList.length === 0){
  const emptyMessage = document.createElement("p");
  emptyMessage.classList.add("empty-message");
  emptyMessage.textContent = "No products found";
   productGrid.append(emptyMessage);


  return;

  }

  productList.forEach(function (product) {

    const productHTML = `

      <article>

        <h1>Product name: ${product.name}</h1>

        <img
          src="${product.image}"
          alt="${product.name}"
        >

        <p>Category: ${product.category}</p>

        <p>Quantity: ${product.quantity}</p>

        <p>Location: ${product.location}</p>

        <p>Price: ${product.price}</p>

        <button class="edit-btn">Edit</button>

        <button class="delete-btn">Delete</button>

        <button class="view-btn">View</button>

      </article>

    `;


    productGrid.insertAdjacentHTML(
      "beforeend",
      productHTML
    );


    const currentCard =
      productGrid.lastElementChild;


    const editButton =
      currentCard.querySelector(".edit-btn");

    const deleteButton =
      currentCard.querySelector(".delete-btn");

    const viewButton =
      currentCard.querySelector(".view-btn");


    // --- EDIT PRODUCT ---
    editButton.addEventListener("click", function () {

      const selectedProduct =
        products.find(function (item) {

          return item.name === product.name;

        });


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


      editingProduct = selectedProduct;

      submitButton.textContent =
        "Update Product";

    });


    // --- VIEW PRODUCT ---
    viewButton.addEventListener("click", function () {

      const selectedProduct =
        products.find(function (item) {

          return item.name === product.name;

        });


      productDetail.innerHTML = `

        <div class="detail-card">

          <button id="close-detail-btn">
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
            <strong>Category:</strong>
            ${selectedProduct.category}
          </p>

          <p>
            <strong>Price:</strong>
            ${selectedProduct.price}
          </p>

          <p>
            <strong>Quantity:</strong>
            ${selectedProduct.quantity}
          </p>

          <p>
            <strong>Location:</strong>
            ${selectedProduct.location}
          </p>

        </div>

      `;


      const closeButton =
        document.querySelector("#close-detail-btn");


      closeButton.addEventListener(
        "click",
        function () {

          productDetail.innerHTML = "";

        }
      );


      productDetail.addEventListener(
        "click",
        function (event) {

          if (event.target === productDetail) {

            productDetail.innerHTML = "";

          }

        }
      );

    });


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
            products.filter(function (item) {

              return item.name !== product.name;

            });


          localStorage.setItem(
            "products",
            JSON.stringify(products)
          );


          renderProduct();

        }

      }
    );

  });

}

function applyFilters(){

  const searchText = searchInput.value.toLowerCase();

  const selectedCategory = categoryFilter.value;
  const filteredProducts = products.filter(function(product) {
    const searchMatch =
  product.name.toLowerCase().includes(searchText);
  const categoryMatch =
  selectedCategory === "all" ||
  product.category === selectedCategory;
  return searchMatch && categoryMatch;


});
renderProduct(filteredProducts);

}


// --- SEARCH PRODUCT ---

searchInput.addEventListener("input", applyFilters);
// CATEGORY FILTER
categoryFilter.addEventListener("change", applyFilters);


  


// --- START APP ---
renderProduct();