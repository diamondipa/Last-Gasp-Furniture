"use strict";

/* 
STEPS
0 Load page with inventory and purchase button
1 Prompt for item
2 Prompt for quantity
3 Ask continue shopping
4 Prompt for state
5 Perform calculations
6 Display invoice
7 Reset button returns to initial state
*/

// ===== GLOBAL CONSTANTS =====
const items = ["chair", "recliner", "table", "umbrella"];
const prices = [25.50, 37.75, 49.95, 24.89];

const states = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const taxRate = 0.15;

document.getElementById("purchaseBtn").addEventListener("click", makePurchase);

// ===== MAIN FUNCTION =====
function makePurchase() {

  let purchasedItems = [];
  let quantities = [];

  let shopping = true;

  while (shopping) {

    let itemInput = prompt("What item would you like to buy today: Chair, Recliner, Table or Umbrella?");
    if (itemInput === null) return;

    itemInput = itemInput.toLowerCase();

    if (!items.includes(itemInput)) {
      alert("Invalid item. Please try again.");
      continue;
    }

    let quantityInput = prompt("How many " + itemInput + " would you like to buy?");
    if (quantityInput === null) return;

    quantityInput = parseInt(quantityInput);

    if (isNaN(quantityInput) || quantityInput <= 0) {
      alert("Invalid quantity. Please enter a positive number.");
      continue;
    }

    purchasedItems.push(itemInput);
    quantities.push(quantityInput);

    let continueInput = prompt("Continue shopping? y/n");
    if (continueInput === null) return;

    continueInput = continueInput.toLowerCase();

    if (continueInput !== "y") {
      shopping = false;
    }
  }

  let stateInput = prompt("Enter two letter state abbreviation:");
  if (stateInput === null) return;

  stateInput = stateInput.toUpperCase();

  if (!states.includes(stateInput)) {
    alert("Invalid state abbreviation.");
    return;
  }

  // ===== CALCULATIONS =====
  let subtotal = 0;

  for (let i = 0; i < purchasedItems.length; i++) {
    let index = items.indexOf(purchasedItems[i]);
    subtotal += prices[index] * quantities[i];
  }

  let shipping = calculateShipping(stateInput, subtotal);
  let tax = subtotal * taxRate;
  let total = subtotal + tax + shipping;

  displayInvoice(purchasedItems, quantities, stateInput, subtotal, tax, shipping, total);
}

// ===== SHIPPING FUNCTION =====
function calculateShipping(state, subtotal) {

  const zone = determineZone(state);

  let shippingCost;

  switch (zone) {
    case 1: shippingCost = 0; break;
    case 2: shippingCost = 20; break;
    case 3: shippingCost = 30; break;
    case 4: shippingCost = 35; break;
    case 5: shippingCost = 45; break;
    case 6: shippingCost = 50; break;
    default: shippingCost = 50;
  }

  return subtotal > 100 ? 0 : shippingCost;
}

// ===== ZONE DETERMINATION =====
function determineZone(state) {

  if (["WA","OR","CA","NV","ID","UT","AZ"].includes(state)) return 1;
  if (["MT","WY","CO","NM"].includes(state)) return 2;
  if (["ND","SD","NE","KS","OK","TX"].includes(state)) return 3;
  if (["MN","IA","MO","AR","LA","WI","IL","MS"].includes(state)) return 4;
  if (["MI","IN","OH","KY","TN","AL","GA","FL","SC","NC","VA","WV"].includes(state)) return 5;
  return 6; // includes AK & HI
}

// ===== INVOICE DISPLAY =====
function displayInvoice(itemsPurchased, quantities, state, subtotal, tax, shipping, total) {

  const invoiceDiv = document.getElementById("invoice");

  let output = "<h2>Invoice</h2>";
  output += "<p>Shipping State: " + state + "</p>";

  output += "<table><tr><th>Item</th><th>Quantity</th><th>Price</th></tr>";

  for (let i = 0; i < itemsPurchased.length; i++) {
    let index = items.indexOf(itemsPurchased[i]);
    output += "<tr><td>" + capitalize(itemsPurchased[i]) + "</td><td>" 
      + quantities[i] + "</td><td>$" 
      + (prices[index] * quantities[i]).toFixed(2) + "</td></tr>";
  }

  output += "</table>";

  output += "<hr>";

  output += "<p>Subtotal: $" + subtotal.toFixed(2) + "</p>";
  output += "<p>Tax (15%): $" + tax.toFixed(2) + "</p>";
  output += "<p>Shipping: $" + shipping.toFixed(2) + "</p>";
  output += "<p><strong>Total: $" + total.toFixed(2) + "</strong></p>";

  output += "<button onclick='resetPage()'>Shop Again</button>";

  invoiceDiv.innerHTML = output;
}

// ===== RESET =====
function resetPage() {
  location.reload();
}

// ===== HELPER =====
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
