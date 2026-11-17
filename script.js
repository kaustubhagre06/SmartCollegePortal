function welcome() {
    alert("Welcome to the Smart College Portal!");
}


// Department filter
function filterDepartments() {

    let selected = document.getElementById("deptSelect").value;
    let departments = document.querySelectorAll(".department");

    departments.forEach(function(department) {

        if (selected == "all" ||
            department.dataset.dept == selected) {

            department.style.display = "block";

        } else {

            department.style.display = "none";
        }
    });
}


// Faculty expand / collapse
function toggleFaculty(button) {

    let details =
        button.parentElement.querySelector(".details");

    if (details.style.display == "block") {

        details.style.display = "none";
        button.innerText = "View Details";

    } else {

        details.style.display = "block";
        button.innerText = "Hide Details";
    }
}


// Display events
function showEvents() {

    let eventList = document.getElementById("eventList");

    eventList.innerHTML =
        "<div class='event'>Technical Workshop - 10 October</div>" +
        "<div class='event'>Coding Competition - 15 October</div>" +
        "<div class='event'>Sports Event - 20 October</div>" +
        "<div class='event'>Cultural Event - 25 October</div>";
}


// Enquiry form validation
let enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {

    enquiryForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let name =
            document.getElementById("studentName").value.trim();

        let email =
            document.getElementById("studentEmail").value.trim();

        let course =
            document.getElementById("course").value;

        let message =
            document.getElementById("message").value.trim();

        let result =
            document.getElementById("formMessage");


        if (name == "" || email == "" ||
            course == "" || message == "") {

            result.innerText = "Please fill all the fields.";
            result.style.color = "red";

            return;
        }


        let enquiry = {
            name: name,
            email: email,
            department: course,
            message: message
        };


        localStorage.setItem(
            "studentEnquiry",
            JSON.stringify(enquiry)
        );


        result.innerText =
            "Enquiry submitted successfully!";

        result.style.color = "green";

        enquiryForm.reset();
    });
}


// Retrieve saved enquiry
let savedData =
    localStorage.getItem("studentEnquiry");

if (savedData != null) {

    let enquiryData =
        JSON.parse(savedData);

    console.log("Student:", enquiryData.name);
    console.log("Department:", enquiryData.department);
}

// =================================
// PRACTICAL 4: ASYNCHRONOUS DATA
// =================================

let products = [];
let cart = JSON.parse(localStorage.getItem("collegeCart")) || [];


// Load products using Fetch API
async function loadProducts() {

    let loading = document.getElementById("loadingMessage");
    let error = document.getElementById("errorMessage");

    try {

        loading.innerText = "Loading products...";
        error.innerText = "";

        let response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        loading.innerText = "";

        displayProducts();
        displayCart();

    } catch (err) {

        loading.innerText = "";
        error.innerText = "Error loading products. Please try again.";

        console.log(err);
    }
}


// Display products dynamically
function displayProducts() {

    let productList = document.getElementById("productList");

    if (!productList) return;

    productList.innerHTML = "";

    products.forEach(function(product) {

        productList.innerHTML += `
            <div class="product-card">

                <img src="${product.image}" alt="${product.name}">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <p><b>Category:</b> ${product.category}</p>

                <h3>₹${product.price}</h3>

                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

            </div>
        `;
    });
}


// Add product to cart
function addToCart(id) {

    let item = cart.find(product => product.id === id);

    if (item) {

        item.quantity++;

    } else {

        let product = products.find(product => product.id === id);

        if (!product) return;

        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    displayCart();
}


// Save cart in localStorage
function saveCart() {

    localStorage.setItem(
        "collegeCart",
        JSON.stringify(cart)
    );
}


// Display cart items
function displayCart() {

    let cartItems = document.getElementById("cartItems");
    let cartTotal = document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(function(item) {

        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <h3>${item.name}</h3>

                <p>Price: ₹${item.price}</p>

                <p>Quantity: ${item.quantity}</p>

                <button onclick="updateQuantity(${item.id}, 1)">+</button>

                <button onclick="updateQuantity(${item.id}, -1)">-</button>

                <button onclick="removeFromCart(${item.id})">
                    Remove
                </button>

            </div>
        `;
    });

    cartTotal.innerText = "Total: ₹" + total;
}


// Update quantity
function updateQuantity(id, change) {

    let item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    saveCart();
    displayCart();
}


// Remove product
function removeFromCart(id) {

    cart = cart.filter(product => product.id !== id);

    saveCart();
    displayCart();
}


// Clear cart
function clearCart() {

    cart = [];

    saveCart();
    displayCart();
}


// Load products when page opens
loadProducts();

// =================================
// PRACTICAL 5: SPA NAVIGATION
// =================================

function navigateTo(page, updateURL = true) {

    let sections = document.querySelectorAll("body > section");

    sections.forEach(function(section) {
        section.style.display = "none";
    });

    if (page === "home") {

        document.querySelectorAll('[data-page="home"]').forEach(function(section) {
            section.style.display = "block";
        });

    } else {

        let selectedSection = document.getElementById(page);

        if (selectedSection) {
            selectedSection.style.display = "block";
        } else {
            page = "home";

            document.querySelectorAll('[data-page="home"]').forEach(function(section) {
                section.style.display = "block";
            });
        }
    }

    if (updateURL && window.location.hash !== "#" + page) {
        window.location.hash = page;
    }
}

// Navigation Click Event
document.querySelectorAll("#mainNav a").forEach(function(link) {

    link.addEventListener("click", function(event) {
        event.preventDefault();

        let page = this.dataset.route;
        navigateTo(page);
    });

});

// Load Page
window.addEventListener("load", function() {

    let page = window.location.hash.substring(1) || "home";
    navigateTo(page, false);

});

// Browser Back and Forward
window.addEventListener("hashchange", function() {

    let page = window.location.hash.substring(1) || "home";
    navigateTo(page, false);

});