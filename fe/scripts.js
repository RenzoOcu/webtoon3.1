let productList = [];

let carrito = [];
let total = 0;

function add(productId, price) {
    const product = productList.find(p => p.id === productId);
    product.stock--;

    carrito.push(productId);
    total += price;
    document.getElementById("checkout").innerHTML = `Pagar $${total}`;
    displayProducts();
}

async function pay() {
    try {
        const response = await fetch("/api/pay", {
            method: "POST",
            body: JSON.stringify(carrito),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error en el proceso de pago");
        }

        productList = await response.json();
        carrito = [];
        total = 0;
        document.getElementById("checkout").innerHTML = `Pagar $${total}`;
        await fetchProducts();
    } catch (error) {
        window.alert("Sin stock o error en el pago");
        console.error("Error en el pago:", error);
    }
}

function displayProducts() {
    let productsHTML = '';
    productList.forEach(p => {
        let buttonHTML = `<button class="button-add" onclick="add(${p.id}, ${p.price})">Agregar</button>`;
        if (p.stock <= 0) {
            buttonHTML = `<button disabled class="button-add disabled">Sin stock :/</button>`;
        }
        productsHTML += `
            <div class="product-container">
                <h3>${p.name}</h3>
                <img src="${p.image}" alt="${p.name}" />
                <h1>$${p.price}</h1>
                ${buttonHTML}
            </div>`;
    });
    document.getElementById('page-content').innerHTML = productsHTML;
}

async function fetchProducts() {
    try {
        const response = await fetch("/api/products");
        if (!response.ok) {
            throw new Error("Error al cargar los productos");
        }
        productList = await response.json();
        displayProducts();
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

window.onload = async () => {
    await fetchProducts();
};
