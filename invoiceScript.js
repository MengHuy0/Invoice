function calculateTotal() {
    let totalsArray = []; // Array to store individual totals
    let totalSum = 0; // Variable to store the sum

    // Loop through total-1 to total-12
    for (let i = 1; i <= 12; i++) {
        const totalElement = document.getElementById(`total-${i}`);
        if (totalElement) {
            // Extract the numeric value, removing "$" and commas
            const value = parseFloat(totalElement.textContent.replace('$', '').replace(',', '').trim());
            if (!isNaN(value)) {
                totalsArray.push(value); // Add to the array
                totalSum += value; // Add to the sum
            }
        }
    }

    // Display the total in the total-all element
    const totalAllElement = document.getElementById('total-all');
    if (totalAllElement) {
        totalAllElement.textContent = `$${totalSum.toFixed(2)}`;
    }

    console.log("Totals Array:", totalsArray); 
}

// Call the function to calculate the total
calculateTotal();


// profile info
const profileData = {
    name: 'Meng Huy',
    email: 'menghuy0000@gmail.com',
    phone: '081-777-344',
    address: '123 Main St, City'
};
// Function to preview the uploaded logo and update the company logo in invoice
function previewLogo(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const profileLogo = document.getElementById("profile-logo");
            const invoiceLogo = document.getElementById("invoice-logo");

            profileLogo.src = e.target.result;
            invoiceLogo.src = e.target.result;
        }

        reader.readAsDataURL(file);
    }
}
// Insert profile data into the invoice header and profile table
document.getElementById('company-name').textContent = profileData.name;
document.getElementById('company-address').textContent = profileData.address;
document.getElementById('company-phone').textContent = profileData.phone;
document.getElementById('company-email').textContent = profileData.email;
document.getElementById('company-email').href = `mailto:${profileData.email}`;

document.getElementById('profile-name').textContent = profileData.name;
document.getElementById('profile-email').textContent = profileData.email;
document.getElementById('profile-phone').textContent = profileData.phone;
document.getElementById('profile-address').textContent = profileData.address;

// Function to enable editing
function enableEditing() {
    document.getElementById('profile-name').contentEditable = true;
    document.getElementById('profile-email').contentEditable = true;
    document.getElementById('profile-phone').contentEditable = true;
    document.getElementById('profile-address').contentEditable = true;
    document.getElementById('edit-button').style.display = 'none';
    document.getElementById('save-button').style.display = 'inline-block';
}

// Function to save edited data
function saveProfileData() {
    profileData.name = document.getElementById('profile-name').textContent;
    profileData.email = document.getElementById('profile-email').textContent;
    profileData.phone = document.getElementById('profile-phone').textContent;
    profileData.address = document.getElementById('profile-address').textContent;

    // Update invoice header with the new data
    document.getElementById('company-name').textContent = profileData.name;
    document.getElementById('company-address').textContent = profileData.address;
    document.getElementById('company-phone').textContent = profileData.phone;
    document.getElementById('company-email').textContent = profileData.email;

    // Hide the save button and show the edit button
    document.getElementById('edit-button').style.display = 'inline-block';
    document.getElementById('save-button').style.display = 'none';

    // Disable content editing
    document.getElementById('profile-name').contentEditable = false;
    document.getElementById('profile-email').contentEditable = false;
    document.getElementById('profile-phone').contentEditable = false;
    document.getElementById('profile-address').contentEditable = false;
}



//   import inventory
const textInput = document.getElementById("text");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const btm = document.getElementById("add");
const inventoryList = document.getElementById("inventory-list");

let inventory = [
    { id: 1, name: "car", price: 1000, quantity: 1 },
    { id: 2, name: "motorcycle", price: 102, quantity: 11 },
    { id: 3, name: "bike", price: 102, quantity: 11 }
];

let editingId = null;

function renderInventory() {
    inventoryList.innerHTML = inventory.map(item => `
        <tr>
            <td class="no_no">${item.id}</td>
            <td class="desc_no">${item.name}</td>
            <td class="unit_no">${item.price}</td>
            <td class="qty_no">${item.quantity}</td>
            <td>
                <button class="delete" onclick="clear_inventory(${item.id})">Delete</button>
                <button class="edit" onclick="edit_inventory(${item.id})">Edit</button>
            </td>
        </tr>
    `).join("");
}

function clear_inventory(id) {
    inventory = inventory.filter(item => item.id !== id);
    renderInventory();
}

function edit_inventory(id) {
    const item = inventory.find(item => item.id === id); // Find the item in inventory
    if (item) {
        // Populate input fields with the item's current values
        textInput.value = item.name;
        priceInput.value = item.price;
        quantityInput.value = item.quantity;

        // Set the editing state
        editingId = id;

        // Update the button text to indicate editing
        btm.textContent = "Update";
        btm.classList.add('editing'); // Optionally add a class for styling during editing
    }
}


function clearInputs() {
    textInput.value = "";
    priceInput.value = "";
    quantityInput.value = "";
    editingId = null; // Reset the editing state
    btm.textContent = "Add"; // Reset button text
    btm.classList.remove('editing'); // Remove the editing class
}


btm.addEventListener('click', () => {
    const text = textInput.value.trim();
    const price = parseFloat(priceInput.value);
    const quantity = parseInt(quantityInput.value, 10);

    if (!text || isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
        alert("Please enter valid data for all fields.");
        return;
    }

    if (editingId) {
        // Update the existing item
        const itemIndex = inventory.findIndex(item => item.id === editingId);
        if (itemIndex !== -1) {
            inventory[itemIndex] = { id: editingId, name: text, price, quantity };
        }
        editingId = null; // Reset editing state
        btm.textContent = "Add"; // Reset button text
        btm.classList.remove('editing'); // Remove editing class
    } else {
        // Add a new item
        const lastId = inventory.length ? inventory[inventory.length - 1].id : 0;
        inventory.push({ id: lastId + 1, name: text, price, quantity });
    }

    renderInventory(); // Re-render the inventory table
    clearInputs(); // Clear input fields
});

renderInventory();


// pop up customer
document.getElementById("customer-link").addEventListener("click", function (e) {
    e.preventDefault();
    const customerPopup = document.querySelector(".customer-popup");
    customerPopup.classList.toggle("hidden");
});

// Close button functionality
const closeButton = document.createElement("button");
closeButton.textContent = "X";
closeButton.classList.add("close-btn");
closeButton.addEventListener("click", function () {
    document.querySelector(".customer-popup").classList.add("hidden");
});
document.querySelector(".customer-popup").prepend(closeButton);

// Customer info elements
const nameCustomerInput = document.getElementById("customerName");
const addressCustomerInput = document.getElementById("customerAddress");
const phoneCustomerInput = document.getElementById("customerPhone");
const btmCustomer = document.getElementById("addCustomer");
const customerList = document.getElementById("customer-list");

let customers = [
    { id: 1, name: "John Doe", address: "123 Main St", phone: "123-456-7890" },
    { id: 2, name: "Jane Smith", address: "456 Elm St", phone: "987-654-3210" },
    { id: 3, name: "Alice Brown", address: "789 Oak St", phone: "456-789-1234" }
];

let editingCustomerId = null; // To track the customer being edited

// Render customer data
function renderCustomers() {
    customerList.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.address}</td>
            <td>${customer.phone}</td>
            <td>
             <button class="c-selete" onclick="seleteCustomer(${customer.id})">Selete</button>
                <button class="c-edit" onclick="editCustomer(${customer.id})">Edit</button>
                <button class="c-delete" onclick="clearCustomer(${customer.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

// Delete customer
function clearCustomer(id) {
    customers = customers.filter(customer => customer.id !== id);
    renderCustomers();
}

// Clear input fields after adding/editing a customer
function clearInputs() {
    nameCustomerInput.value = "";
    addressCustomerInput.value = "";
    phoneCustomerInput.value = "";
    editingCustomerId = null; // Clear the editing state
    btmCustomer.textContent = "Add Customer"; // Reset button text to 'Add Customer'
}

// Edit customer details
function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        nameCustomerInput.value = customer.name;
        addressCustomerInput.value = customer.address;
        phoneCustomerInput.value = customer.phone;
        editingCustomerId = id; // Set the editing state to the selected customer ID
        btmCustomer.textContent = "Update Customer"; // Change button text to 'Update Customer'
    }
}

function seleteCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        // Update the invoice section with selected customer details
        document.querySelector('.customer_name').textContent = customer.name;
        document.querySelector('.phone_number').textContent = customer.phone;
        document.querySelector('.customer-email a').textContent = customer.address; // Update email or other fields as needed
    }
}

// Handle the click event on the 'Add Customer' / 'Update Customer' button
btmCustomer.addEventListener('click', () => {
    const Cname = nameCustomerInput.value.trim();
    const Caddress = addressCustomerInput.value.trim();
    const Cphone = phoneCustomerInput.value.trim();

    if (!Cname || !Caddress || !Cphone) {
        alert("Please enter valid data for all fields.");
        return;
    }

    if (editingCustomerId === null) {
        // Add new customer
        const lastId = customers.length ? customers[customers.length - 1].id : 0;
        customers.push({ id: lastId + 1, name: Cname, address: Caddress, phone: Cphone });
    } else {
        // Update existing customer
        const customer = customers.find(c => c.id === editingCustomerId);
        customer.name = Cname;
        customer.address = Caddress;
        customer.phone = Cphone;
    }

    renderCustomers();
    clearInputs();
});

renderCustomers();

// inventory popup
const inventoryLink = document.getElementById("inventory-link");
const inventoryPopup = document.querySelector(".inventory-popup");


function toggleInventoryPopup() {
    inventoryPopup.classList.toggle("hiddenInventory");
}

inventoryLink.addEventListener("click", (e) => {
    e.preventDefault();

    toggleInventoryPopup();
});
// Close button functionality
const closeInventoryButton = document.createElement("button");
closeInventoryButton.textContent = "X";
closeInventoryButton.classList.add("close-btn");
closeInventoryButton.addEventListener("click", function () {
    document.querySelector(".inventory-popup").classList.add("hiddenInventory");
});
inventoryPopup.prepend(closeInventoryButton);

// customer edit on invoice
function updateInvoice() {
    let rows = document.querySelectorAll('#invoice-items tr');
    let totalSum = 0;
    
    rows.forEach(row => {
      const unitPrice = parseFloat(row.querySelector('.unit-price').value);
      const quantity = parseInt(row.querySelector('.quantity').value);
      const totalPriceElement = row.querySelector('.total-price');
      const totalPrice = unitPrice * quantity;

      totalPriceElement.textContent = totalPrice.toFixed(2);
      totalSum += totalPrice;
    });

    // Update the overall total
    document.getElementById('total-sum').textContent = totalSum.toFixed(2);
  }

  // Listen for changes in unit price or quantity and update the totals
  document.querySelectorAll('.unit-price, .quantity').forEach(input => {
    input.addEventListener('input', updateInvoice);
  });

  // Initial call to populate totals when the page loads
  updateInvoice();

 