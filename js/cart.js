// cart.js

// Add item to cart
function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement("div");
    cartRow.classList.add("cart-row");
    var cartItems = document.getElementsByClassName("cart-items")[0];
    var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert("This item is already added to the cart");
            return;
        }
    }
    var cartRowContents = `
          <div class="cart-item cart-column">
              <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
              <span class="cart-item-title">${title}</span>
          </div>
          <span class="cart-price cart-column">${price}</span>
          <div class="cart-quantity cart-column">
              <input class="cart-quantity-input" type="number" value="1">
              <button class="btn btn-danger" type="button">REMOVE</button>
          </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow
      .getElementsByClassName("btn-danger")[0]
      .addEventListener("click", removeCartItem);
    cartRow
      .getElementsByClassName("cart-quantity-input")[0]
      .addEventListener("change", quantityChanged);
    
    saveCartToCookie(); // Save cart to cookie after adding item
}

// Remove item from cart
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
    saveCartToCookie(); // Save cart to cookie after removing item
}

// Change Qty in cart
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updateCartTotal();
    saveCartToCookie(); // Save cart to cookie after changing quantity
}

// Purchase items will link this to a QR paymend page module!!
function purchaseClicked() {
    alert('Thank you for your purchase');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
    setCookie('cart', '', -1); // Clear cart cookie
}

// Save cart state to cookie
function saveCartToCookie() {
    var cartItems = document.getElementsByClassName("cart-items")[0];
    var cartRows = cartItems.getElementsByClassName("cart-row");
    var cartArray = [];
    
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var title = cartRow.getElementsByClassName("cart-item-title")[0].innerText;
        var price = cartRow.getElementsByClassName("cart-price")[0].innerText;
        var quantity = cartRow.getElementsByClassName("cart-quantity-input")[0].value;
        cartArray.push({title: title, price: price, quantity: quantity});
    }
    
    setCookie('cart', JSON.stringify(cartArray), 7); // Save cart to cookie for 7 days
}

// Update cart total
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    if (!cartItemContainer) return; // Add check for null reference
    var cartRows = cartItemContainer.getElementsByClassName("cart-row");
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
      var cartRow = cartRows[i];
      var priceElement = cartRow.getElementsByClassName("cart-price")[0];
      var quantityElement = cartRow.getElementsByClassName(
        "cart-quantity-input"
      )[0];
      if (!priceElement || !quantityElement) continue; // Add check for null reference
      var price = parseFloat(priceElement.innerText.replace("$", "")); // Remove $ so calculation can be done.
      var quantity = parseInt(quantityElement.value); // Ensure quantity is parsed as an integer
      total += price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("cart-total-price")[0].innerText =
      "$" + total; // $ added back after it was removed for the calculation.
}
