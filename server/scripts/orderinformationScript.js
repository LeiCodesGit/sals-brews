//order-number

function getOrderNumber() {
    const orderNum = Math.floor(1000+Math.random() * 9000);
    return String(orderNum).padStart(4, '0');
}

//Date
function getCurrentDate() {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
});
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('orderNumber').textContent = getOrderNumber();
    document.getElementById('orderDate').textContent = getCurrentDate();
    document.getElementById('totalAmount').textContent = '0.00'; // Placeholder for total amount
    document.getElementById('itemImage').src = ''; // Placeholder for item image


//item

const items = {
    "americano": {
        "name": "Americano",
        "price": 120,
        "image": "../assets/americano.png",
    },
    "Spanish Latte": {
        "name": "Spanish Latte",
        "price": 150,
        "image": "../assets/spanishlatte.png",
    },
    "cafe latte": {
        "name": "Café Latte",
        "price": 130,
        "image": "../assets/cafelatte.png",
    },
    "caffe mocha": {
        "name": "Café Mocha",
        "price": 140,
        "image": "../assets/mocha.png",
    },
    "dirty matcha": {
        "name": "Dirty Matcha",
        "price": 160,
        "image": "../assets/dirtymatcha.png",
    },
    "caramel macchiato": {
        "name": "Caramel Macchiato",
        "price": 170,
        "image": "../assets/caramelmacchiato.png",
    },
    "chai latte": {
        "name": "Chai Latte",
        "price": 170,
        "image": "../assets/chailatte.png",
    },
    "ceremonial matcha latte": {
        "name": "Ceremonial Matcha Latte",
        "price": 190,
        "image": "../assets/matchalatte.png",
    },
    "honey iced tea": {
        "name": "Honey Iced Tea",
        "price": 180,
        "image": "../assets/honeyicedtea.png",
    },
    "strawberry matcha latte": {
        "name": "Strawberry Matcha Latte",
        "price": 210,
        "image": "../assets/strawberrymatchalatte.png",
    },
    "red velvet cookie": {
        "name": "Red Velvet Cookie",
        "price": 90,
        "image": "../assets/redvelvet.png",
    },
    "chocolate chip cookie": {
        "name": "Chocolate Chip Cookie",
        "price": 90,
        "image": "../assets/chocolatechip.png",
    },
    "croissant": {
        "name": "Croissant",
        "price": 180,
        "image": "../assets/croissant.png",
    },
    "pan au chocolat": {
        "name": "Pan au Chocolat",
        "price": 200,
        "image": "../assets/panau.png",
    },
    "cinnamon roll": {
        "name": "Cinnamon Roll",
        "price": 150,
        "image": "../assets/cinnamonroll.png",
    },
};


const selectedItemKey = "Spanish Latte"; //selected item key
 const item = items[selectedItemKey];

 if (item) {
    document.getElementById('itemName').textContent = item.name;
    document.getElementById('totalAmount').textContent = item.price.toFixed(2); //price with two decimal places
    document.getElementById('itemImage').src = item.image;
} else {
    console.warn('Item not found:', selectedItemKey);

}
});