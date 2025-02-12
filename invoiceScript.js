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
async function fetchCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/customers`); 
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        const customers = await response.json();
        populateCustomerDropdown(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

// ✅ Fetch and display inventory items
async function fetchInventory() {
    try {
        const response = await fetch(`${API_BASE_URL}/inventory`);
        const inventory = await response.json();
        populateInventoryDropdown(inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
    }
}
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
function editInventoryItem(button) {
    const row = button.closest('tr');
    const itemNameCell = row.cells[0];
    const itemPriceCell = row.cells[1];

    // Prompt for updated details
    const newItemName = prompt('Edit item name:', itemNameCell.textContent);
    const newItemPrice = parseFloat(prompt('Edit item price:', itemPriceCell.textContent));

    if (newItemName && !isNaN(newItemPrice)) {
        itemNameCell.textContent = newItemName;
        itemPriceCell.textContent = newItemPrice.toFixed(2);
    } else {
        alert('Invalid item name or price!');
    }

}

// Function to delete an inventory item
function deleteInventoryItem(button) {
    const row = button.closest('tr');
    row.remove();

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

// Function to populate the inventory dropdown
function populateInventoryDropdown() {
    const inventoryDropdown = document.getElementById('inventory-dropdown');
    const inventoryRows = document.querySelectorAll('#inventory-items tr');

    inventoryDropdown.innerHTML = ''; // Clear previous options

    inventoryRows.forEach(row => {
        const itemName = row.cells[0].textContent;
        const itemPrice = row.cells[1].textContent;

        const option = document.createElement('option');
        option.value = JSON.stringify({ name: itemName, price: itemPrice });
        option.textContent = `${itemName} - $${itemPrice}`;
        inventoryDropdown.appendChild(option);
    });
}

// Call this function to populate the dropdown after the page loads or when inventory changes
populateInventoryDropdown();
/////
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
                body: JSON.stringify({ name: customerName, email: customerEmail, phone: customerPhone })
            });
            
            if (!response.ok) {
                throw new Error("Failed to add customer");
            }
            
            const newCustomer = await response.json();
            
            // Update customer list in UI
            const customerList = document.getElementById("customer-list");
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = newCustomer.name;
            row.appendChild(nameCell);

            const emailCell = document.createElement("td");
            emailCell.textContent = newCustomer.email;
            row.appendChild(emailCell);

            const phoneCell = document.createElement("td");
            phoneCell.textContent = newCustomer.phone;
            row.appendChild(phoneCell);

            customerList.appendChild(row);

            // Add to customer dropdown
            const customerSelect = document.getElementById("customer-select");
            const option = document.createElement("option");
            option.value = newCustomer._id;
            option.textContent = newCustomer.name;
            customerSelect.appendChild(option);

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
    const tableBody = document.getElementById('inventory-items');

    // Prompt for item details
    const itemName = prompt('Enter item name:');
    const itemPrice = parseFloat(prompt('Enter item price:'));

    if (itemName && !isNaN(itemPrice)) {
        try {
            const response = await fetch("http://localhost:5000/api/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: itemName, price: itemPrice })
            });

            if (!response.ok) {
                throw new Error("Failed to add inventory item");
            }

            const newItem = await response.json();

            // Add new item to table
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${newItem.name}</td>
                <td>${newItem.price.toFixed(2)}</td>
                <td>
                    <button onclick="selectItem('${newItem.name}', ${newItem.price})">Select</button>
                    <button onclick="editInventoryItem(this)">Edit</button>
                    <button onclick="deleteInventoryItem(this)">Delete</button>
                </td>
            `;

            tableBody.appendChild(newRow);
            populateInventoryDropdown();
            alert("Item added successfully!");

        } catch (error) {
            console.error("Error adding inventory item:", error);
            alert("Failed to add item. Please try again.");
        }
    } else {
        alert("Invalid item name or price!");
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
