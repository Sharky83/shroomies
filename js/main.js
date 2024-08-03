document.addEventListener("DOMContentLoaded", function() {
    fetch('./shopItems.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadItems(data);
        })
        .catch(error => console.error('Error fetching the JSON:', error));
});

function loadItems(data) {
    const sporesSection = document.getElementById('spores-items');
    const liquidCultureSection = document.getElementById('liquid-culture-items');

    if (!sporesSection || !liquidCultureSection) {
        console.error('Error: Sections for items not found.');
        return;
    }

    data.Spores.forEach(item => {
        sporesSection.appendChild(createItemElement(item));
    });

    data["Liquid Culture"].forEach(item => {
        liquidCultureSection.appendChild(createItemElement(item));
    });
}

function createItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('shop-item');

    itemElement.innerHTML = `
        <span class="shop-item-title">${item.title}</span>
        <img class="shop-item-image" src="${item.image}" alt="${item.title}">
        <div class="shop-item-details">
            <span class="shop-item-price">${item.price}</span>
            <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
        </div>
    `;

    return itemElement;
}




