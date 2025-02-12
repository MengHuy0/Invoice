const authToken = localStorage.getItem('authToken');
const API_BASE_URL = 'http://localhost:5000/api';

// Check if authToken exists
if (authToken) {
    console.log('User is logged in with token');
    // You can use this token for API requests or authorization checks
} else {
    console.log('No auth token found, redirecting to login...');
    // Redirect to the login page if no authToken exists
    window.location.href = 'index.html';  // Adjust this URL as necessary
}
// ////////////////////
// Function to fetch customer data from the backend
async function fetchCustomers() {
    try {
        const response = await fetch('http://localhost:5000/api/customers');  // URL of the API
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        const customers = await response.json();

        // Get the customer-select dropdown element
        const customerSelect = document.getElementById('customer-select');

        // Clear the existing options (if any)
        customerSelect.innerHTML = '<option value="">Select Customer</option>';

        // Populate the dropdown with customers from the database
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.name;  // You can store the _id if needed
            option.textContent = customer.name;
            customerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

// Call the fetchCustomers function when the page loads
document.addEventListener('DOMContentLoaded', fetchCustomers);
// // ✅ Fetch and display invoices
async function fetchInvoices() {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices`);
        if (!response.ok) {
            throw new Error("Failed to fetch invoices");
        }

        const invoices = await response.json();
        const tableBody = document.getElementById("saved-invoice-list");
        tableBody.innerHTML = ""; // Clear previous entries

        invoices.forEach(invoice => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${invoice.invoiceId}</td>
                <td>${invoice.customer}</td>
                <td>${invoice.date}</td>
                <td>${invoice.items.length}</td>
                <td>${invoice.totalAmount.toFixed(2)}</td>
                <td>${invoice.paymentStatus}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        alert("Failed to fetch invoices. Please try again.");
    }
}
// ✅ Fetch and display customers
async function fetchAndDisplayCustomers() {
    try {
        const response = await fetch('http://localhost:5000/api/customers');
        const customers = await response.json();

        const customerTableBody = document.getElementById('customer-list');
        customerTableBody.innerHTML = ''; // Clear existing rows

        customers.forEach(customer => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = customer.name;
            row.appendChild(nameCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = customer.email;
            row.appendChild(emailCell);

            const phoneCell = document.createElement('td');
            phoneCell.textContent = customer.phone;
            row.appendChild(phoneCell);

            const actionCell = document.createElement('td');
            actionCell.innerHTML = `
                <button onclick="editCustomer('${customer._id}', '${customer.name}', '${customer.email}', '${customer.phone}')">Edit</button>
                <button onclick="deleteCustomer('${customer._id}')">Delete</button>
            `;
            row.appendChild(actionCell);

            customerTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

// Function to edit a customer
async function editCustomer(id, currentName, currentEmail, currentPhone) {
    const newName = prompt('Enter new name:', currentName);
    const newEmail = prompt('Enter new email:', currentEmail);
    const newPhone = prompt('Enter new phone:', currentPhone);

    if (newName && newEmail && newPhone) {
        try {
            const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, email: newEmail, phone: newPhone }),
            });

            if (!response.ok) {
                throw new Error('Failed to update customer');
            }

            // Refresh the customer list after editing
            fetchAndDisplayCustomers();
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    } else {
        alert('All fields are required!');
    }
}

// Function to delete a customer
async function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete customer');
            }

            // Refresh the customer list after deleting
            fetchAndDisplayCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    }
}

// Call the function to fetch and display customers when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayCustomers);
// ✅ Fetch and display inventory items
async function fetchAndDisplayInventory() {
    try {
        const response = await fetch('http://localhost:5000/api/inventory');
        const inventory = await response.json();

        const inventoryTableBody = document.getElementById('inventory-items');
        inventoryTableBody.innerHTML = ''; // Clear existing rows

        inventory.forEach(item => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const priceCell = document.createElement('td');
            priceCell.textContent = item.price.toFixed(2);
            row.appendChild(priceCell);

            const actionCell = document.createElement('td');
            actionCell.innerHTML = `
                <button onclick="editInventoryItem('${item._id}', '${item.name}', ${item.price})">Edit</button>
                <button onclick="deleteInventoryItem('${item._id}')">Delete</button>
            `;
            row.appendChild(actionCell);

            inventoryTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}

// Call the function to fetch and display inventory when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayInventory);

// ✅ Submit new invoice
async function submitInvoice(invoiceData) {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoiceData),
        });
console.log("Invoice data", invoiceData);
        if (!response.ok) throw new Error("Failed to create invoice");

        const newInvoice = await response.json();
        console.log("Invoice Created:", newInvoice);
        fetchInvoices(); // Refresh invoices list
    } catch (error) {
        console.error("Error submitting invoice:", error);
    }
}

///////////////////////////////////// original part


// ✅ Populate inventory items in dropdown
async function populateInventoryDropdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/inventory`); 
        const inventory = await response.json();

        const inventorySelect = document.getElementById('inventorySelect');
        inventorySelect.innerHTML = '<option value="">Select Item</option>';

        inventory.forEach(item => {
            const option = document.createElement('option');
            option.value = JSON.stringify(item); // Store item as JSON string
            option.textContent = `${item.name} - $${item.price}`;
            inventorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}
//////////////////////

//////////////create invoice
// Initialize the current invoice ID
let currentInvoiceId = localStorage.getItem('currentInvoiceId') || 0;
function getNextInvoiceId() {
    currentInvoiceId++;
    localStorage.setItem('currentInvoiceId', currentInvoiceId);
    return `INV${String(currentInvoiceId).padStart(5, '0')}`;
}

// Function to create a new invoice
function addNewInvoice() {
    // Generate the next invoice ID
    const invoiceId = getNextInvoiceId();

    // Update the displayed invoice ID on the page
    document.getElementById('invoice-id').textContent = invoiceId;

    // Show the invoice section (if it's hidden)
    document.getElementById('invoice').classList.remove('hidden');

    // Reset other invoice fields (e.g., date, customer selection, etc.)
    document.getElementById('invoice-date').textContent = new Date().toLocaleDateString();
    document.getElementById('customer-select').value = "John Doe";  // Default customer, adjust as necessary

    // Optionally clear any pre-existing invoice items
    document.getElementById('invoice-items').innerHTML = '';
    document.getElementById('grand-total').textContent = '0.00';

    // Scroll to the invoice section (optional)
    document.querySelector('#invoice').scrollIntoView({ behavior: 'smooth' });
}


const savedInvoices = [];

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function previewLogo() {
    const logoInput = document.getElementById('shop-logo');
    const logoPreview = document.getElementById('logo-preview');

    if (logoInput.files && logoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            logoPreview.src = e.target.result;
            logoPreview.style.display = 'block';
        };
        reader.readAsDataURL(logoInput.files[0]);
    }
}
////////////////////Profile
function saveProfile() {
    const shopName = document.getElementById('shop-name').value;
    const shopPhone = document.getElementById('shop-phone').value;
    const logoPreview = document.getElementById('logo-preview');

    const shopProfile = {
        shopName,
        shopPhone,
        logoUrl: logoPreview.src || ""
    };

    // Store profile in localStorage
    localStorage.setItem("shopProfile", JSON.stringify(shopProfile));

    // Update UI
    if (shopName) {
        document.getElementById('invoice-shop-name').textContent = shopName;
    }

    if (shopPhone) {
        document.getElementById('invoice-shop-phone').textContent = shopPhone;
    }

    if (logoPreview.src) {
        const invoiceLogo = document.getElementById('invoice-logo');
        invoiceLogo.src = logoPreview.src;
        invoiceLogo.style.display = 'block';
    }

    alert('Profile saved successfully!');
}

// Load profile from localStorage on page load
function loadProfile() {
    const storedProfile = localStorage.getItem("shopProfile");
    
    if (storedProfile) {
        const profile = JSON.parse(storedProfile);

        document.getElementById('shop-name').value = profile.shopName || "";
        document.getElementById('shop-phone').value = profile.shopPhone || "";

        if (profile.logoUrl) {
            const logoPreview = document.getElementById('logo-preview');
            logoPreview.src = profile.logoUrl;
            logoPreview.style.display = 'block';

            const invoiceLogo = document.getElementById('invoice-logo');
            invoiceLogo.src = profile.logoUrl;
            invoiceLogo.style.display = 'block';
        }

        // Update invoice display
        document.getElementById('invoice-shop-name').textContent = profile.shopName || "";
        document.getElementById('invoice-shop-phone').textContent = profile.shopPhone || "";
    }
}

// Load profile when the page loads
document.addEventListener("DOMContentLoaded", loadProfile);


function selectItem(itemName, itemPrice) {
    const invoiceItems = document.getElementById('invoice-items');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = itemName;
    row.appendChild(nameCell);

    const quantityCell = document.createElement('td');
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = 1;
    quantityInput.min = 1;
    quantityInput.onchange = () => updateTotal(row, itemPrice);
    quantityCell.appendChild(quantityInput);
    row.appendChild(quantityCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = itemPrice.toFixed(2);
    row.appendChild(priceCell);

    const totalCell = document.createElement('td');
    totalCell.textContent = itemPrice.toFixed(2);
    row.appendChild(totalCell);

    invoiceItems.appendChild(row);
    updateGrandTotal();
}

function updateTotal(row, itemPrice) {
    const quantity = row.querySelector('input').value;
    const totalCell = row.lastElementChild;
    totalCell.textContent = (quantity * itemPrice).toFixed(2);
}
////////////


////////////


// Set current date for the invoice
document.getElementById('invoice-date').textContent = new Date().toLocaleDateString();



function markAsPaid(row, paymentStatusCell) {
    paymentStatusCell.textContent = "Paid";  // Change payment status to "Paid"

    // You can also update the status in the savedInvoices array
    const invoiceId = row.children[0].textContent;
    const invoice = savedInvoices.find(invoice => invoice.invoiceId === invoiceId);
    if (invoice) {
        invoice.paymentStatus = "Paid";
    }
}

function searchInvoices() {
    const searchValue = document.getElementById("invoice-search").value.toLowerCase();
    const rows = document.querySelectorAll("#saved-invoice-list tr");

    rows.forEach(row => {
        const invoiceId = row.children[0].textContent.toLowerCase();
        const customer = row.children[1].textContent.toLowerCase();
        const date = row.children[2].textContent.toLowerCase();
        const paymentStatus = row.children[5].textContent.toLowerCase();

        if (
            invoiceId.includes(searchValue) || 
            customer.includes(searchValue) || 
            date.includes(searchValue) || 
            paymentStatus.includes(searchValue)
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Fetch invoices when the page loads
document.addEventListener("DOMContentLoaded", fetchInvoices);
// edit and delete on inventoryList
async function editInventoryItem(id, currentName, currentPrice) {
    const newName = prompt('Enter new item name:', currentName);
    const newPrice = parseFloat(prompt('Enter new item price:', currentPrice));

    if (newName && !isNaN(newPrice)) {
        try {
            const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, price: newPrice }),
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            // Refresh the inventory table
            fetchAndDisplayInventory();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    } else {
        alert('Invalid input');
    }
}

// Function to delete an inventory item
async function deleteInventoryItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            // Refresh the inventory table
            fetchAndDisplayInventory();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }
}
//dropdown inventory in invoice
////
function updateTotal(row, itemPrice) {
    const quantity = row.querySelector('input').value;
    const totalCell = row.lastElementChild;  // The last cell holds the total for the row
    totalCell.textContent = (quantity * itemPrice).toFixed(2);

    // After updating the row, recalculate the grand total
    updateGrandTotal();
}


////
function addSelectedInventoryItem() {
    const inventoryDropdown = document.getElementById('inventory-dropdown');
    const selectedItem = JSON.parse(inventoryDropdown.value);

    const invoiceItemsTable = document.getElementById('invoice-items');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${selectedItem.name}</td>
        <td><input type="number" value="1" min="1" oninput="updateTotal(this.parentElement.parentElement, ${selectedItem.price})"></td>
        <td>${parseFloat(selectedItem.price).toFixed(2)}</td>
        <td class="totalInRow">${parseFloat(selectedItem.price).toFixed(2)}</td>
    `;

    invoiceItemsTable.appendChild(newRow);

    // After adding a new item, update the grand total
    updateGrandTotal();
}
////////////////////////////////////fucntion section
async function populateInventoryDropdown() {
    try {
        // Fetch inventory data from the backend
        const response = await fetch(`${API_BASE_URL}/inventory`, {
            headers: {
                'Authorization': `Bearer ${authToken}`, // Include auth token if required
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch inventory data');
        }

        const inventory = await response.json();
        const inventoryDropdown = document.getElementById('inventory-dropdown');
        inventoryDropdown.innerHTML = '<option value="">Select Item</option>'; // Clear previous options

        // Loop through the inventory and create dropdown options
        inventory.forEach(item => {
            const option = document.createElement('option');
            option.value = JSON.stringify({ name: item.name, price: item.price }); // Store item as JSON string
            option.textContent = `${item.name} - $${item.price.toFixed(2)}`; // Display item name and price
            inventoryDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        alert('Failed to load inventory. Please try again.');
    }
}

// Call this function to populate the dropdown after the page loads or when inventory changes
document.addEventListener('DOMContentLoaded', populateInventoryDropdown);
// Recalculate the grand total
function updateGrandTotal() {
    let grandTotal = 0;

    // Loop through all rows in the invoice items table    
    document.querySelectorAll('#invoice-items tr').forEach(row => {
        const totalInRow = parseFloat(row.querySelector('td:last-child').textContent);
        grandTotal += totalInRow;
    });

    // Update the grand total field
    document.getElementById('grand-total').textContent = grandTotal.toFixed(2);
}
// Function to update the total for a row and recalculate grand total
function updateTotal(row, itemPrice) {
    const quantity = row.querySelector('input').value;
    const totalCell = row.lastElementChild;  // The last cell holds the total for the row
    totalCell.textContent = (quantity * itemPrice).toFixed(2);

    // After updating the row, recalculate the grand total
    updateGrandTotal();
}
function printInvoice() {
    // Get the elements to hide
    const sidebar = document.querySelector('.sidebar');
    const invoiceItems = document.getElementById('hideitem');
    const buttons = document.querySelectorAll('button');

    // Hide the sidebar, invoice items, and buttons
    sidebar.style.display = 'none';
    invoiceItems.style.display = 'none';
    buttons.forEach(button => button.style.display = 'none');

    // Get the invoice section to print
    const invoiceSection = document.getElementById('invoice');

    // Create a temporary window to print the invoice
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    // Create the HTML content for the print window
    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write('<link rel="stylesheet" type="text/css" href="invoiceStyle.css">');  // Include the stylesheet for print styles
    printWindow.document.write('</head><body>');

    // Copy the content of the invoice section into the print window
    printWindow.document.write(invoiceSection.innerHTML);

    printWindow.document.write('</body></html>');

    // Wait for the document to load before printing
    printWindow.document.close();
    printWindow.onload = function () {
        // Trigger the print dialog
        printWindow.print();
        printWindow.close();

        // After printing, make everything visible again
        sidebar.style.display = 'block';

        invoiceItems.style.display = 'table-row-group'; // or 'block' depending on your layout
        buttons.forEach(button => button.style.display = 'inline-block');
    };
}
function searchInvoices() {
    const searchValue = document.getElementById('invoice-search').value.toLowerCase();
    const rows = document.querySelectorAll('#saved-invoice-list tr');

    rows.forEach(row => {
        const invoiceId = row.children[0].textContent.toLowerCase();
        const customer = row.children[1].textContent.toLowerCase();
        const date = row.children[2].textContent.toLowerCase();
        const paymentStatus = row.children[5].textContent.toLowerCase();

        if (
            invoiceId.includes(searchValue) ||
            customer.includes(searchValue) ||
            date.includes(searchValue) ||
            paymentStatus.includes(searchValue)
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/////////////////////////////////////// done api
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const hamburger = document.querySelector('.hamburger');

    // Toggle 'show' class on the sidebar
    sidebar.classList.toggle('show');

    // Adjust content visibility or positioning based on sidebar state
    if (sidebar.classList.contains('show')) {
        sidebar.style.marginLeft = '0'; // Adjust content margin when sidebar is shown
        hamburger.innerHTML = '&#10005;'; // Change hamburger to a close (×) symbol
    } else {
        sidebar.style.marginLeft = '-80%'; // Adjust content margin when sidebar is hidden
        hamburger.innerHTML = '&#9776;'; // Change close symbol back to hamburger (≡)
    }
}

function logout() {
    // Confirm logout
    if (confirm("Are you sure you want to log out?")) {
        // Remove JWT token from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = "index.html";
    }
}
function saveInvoice() {
    const invoiceId = document.getElementById('invoice-id').textContent;
    const customer = document.getElementById('customer-select').value;
    const date = document.getElementById('invoice-date').textContent;
    const items = [];
    let total = 0;
   
    document.querySelectorAll('#invoice-items tr').forEach(row => {
        const itemName = row.children[0].textContent;
        const quantity = row.children[1].querySelector('input').value;
        const price = parseFloat(row.children[2].textContent);
        const itemTotal = parseFloat(row.children[3].textContent);
        
        items.push({ name: itemName, quantity: parseFloat(quantity), price: parseFloat(price), total: itemTotal });
    total += itemTotal;
    });

    const invoiceData = { invoiceId, customer, date, items, total, paymentStatus: "Pending" };
    submitInvoice(invoiceData);
    const savedInvoiceList = document.getElementById('saved-invoice-list');
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = invoiceId;
    row.appendChild(idCell);

    const customerCell = document.createElement('td');
    customerCell.textContent = customer;
    row.appendChild(customerCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = date;
    row.appendChild(dateCell);

    const itemsCell = document.createElement('td');
    itemsCell.textContent = items.map(item => `${item.name} (${item.quantity})`).join(', ');
    row.appendChild(itemsCell);

    const totalCell = document.createElement('td');
    totalCell.textContent = total.toFixed(2);
    row.appendChild(totalCell);

    const paymentStatusCell = document.createElement('td');
    paymentStatusCell.textContent = "Pending";  // Default payment status is "Pending"
    row.appendChild(paymentStatusCell);

    const actionCell = document.createElement('td');
    const markPaidButton = document.createElement('button');
    markPaidButton.textContent = "Mark as Paid";
    markPaidButton.onclick = () => markAsPaid(row, paymentStatusCell);
    actionCell.appendChild(markPaidButton);
    row.appendChild(actionCell);

    savedInvoiceList.appendChild(row);

    alert('Invoice saved successfully!');

}

// ✅ Populate customers in dropdown
async function addCustomer() {
    const customerName = prompt("Enter customer name:");
    const customerEmail = prompt("Enter customer email:");
    const customerPhone = prompt("Enter customer phone:");

    if (customerName && customerEmail && customerPhone) {
        try {
            const response = await fetch("http://localhost:5000/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: customerName, email: customerEmail, phone: customerPhone }),
            });

            if (!response.ok) {
                throw new Error("Failed to add customer");
            }

            // Refresh the customer list after adding a new customer
            fetchAndDisplayCustomers();
            alert("Customer added successfully!");
        } catch (error) {
            console.error("Error adding customer:", error);
            alert("Failed to add customer. Please try again.");
        }
    } else {
        alert("All fields are required!");
    }
}

async function addInventoryItem() {
    const itemName = prompt('Enter item name:');
    const itemPrice = parseFloat(prompt('Enter item price:'));

    if (itemName && !isNaN(itemPrice)) {
        try {
            const response = await fetch(`${API_BASE_URL}/inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, // Include auth token if required
                },
                body: JSON.stringify({ name: itemName, price: itemPrice }),
            });

            if (!response.ok) {
                throw new Error('Failed to add inventory item');
            }

            // Refresh the inventory dropdown after adding a new item
            populateInventoryDropdown();
            alert('Item added successfully!');
        } catch (error) {
            console.error('Error adding inventory item:', error);
            alert('Failed to add item. Please try again.');
        }
    } else {
        alert('Invalid item name or price!');
    }
}
////////////////////Profile
function saveProfile() {
    const shopName = document.getElementById('shop-name').value;
    const shopPhone = document.getElementById('shop-phone').value;
    const logoPreview = document.getElementById('logo-preview');

    const shopProfile = {
        shopName,
        shopPhone,
        logoUrl: logoPreview.src || ""
    };

    // Store profile in localStorage
    localStorage.setItem("shopProfile", JSON.stringify(shopProfile));

    // Update UI
    if (shopName) {
        document.getElementById('invoice-shop-name').textContent = shopName;
    }

    if (shopPhone) {
        document.getElementById('invoice-shop-phone').textContent = shopPhone;
    }

    if (logoPreview.src) {
        const invoiceLogo = document.getElementById('invoice-logo');
        invoiceLogo.src = logoPreview.src;
        invoiceLogo.style.display = 'block';
    }

    alert('Profile saved successfully!');
}
