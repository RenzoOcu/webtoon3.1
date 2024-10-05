addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname === '/api/pay' && request.method === 'POST') {
    return handlePayRequest(request);
  }

  if (pathname === '/api/products' && request.method === 'GET') {
    return handleProductsRequest();
  }

  return new Response('Not Found', { status: 404 });
}

async function handlePayRequest(request) {
  const carrito = await request.json();
  
  // Simulación de procesamiento del carrito (se puede conectar a una base de datos o API real)
  carrito.forEach(id => {
    const product = productList.find(p => p.id === id);
    if (product && product.stock > 0) {
      product.stock--;
    }
  });

  return new Response(JSON.stringify(productList), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleProductsRequest() {
  // Simulación de una lista de productos
  const productList = [
    { id: 1, name: 'Producto 1', price: 10, stock: 5, image: '/images/product1.jpg' },
    { id: 2, name: 'Producto 2', price: 15, stock: 3, image: '/images/product2.jpg' },
    { id: 3, name: 'Producto 3', price: 20, stock: 0, image: '/images/product3.jpg' }
  ];

  return new Response(JSON.stringify(productList), {
    headers: { 'Content-Type': 'application/json' }
  });
}
