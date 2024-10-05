const express = require('express');
const bodyParser = require("body-parser");
const repository = require("./repositorio");
const path = require('path'); // Importa el módulo path para manejar rutas
const app = express();
const port = process.env.PORT || 3000; // Usa el puerto proporcionado por Vercel o 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'fe'
app.use(express.static(path.join(__dirname, 'fe'))); // Asegúrate de que 'fe' es la carpeta donde están tus archivos estáticos

// Ruta para obtener productos
app.get('/api/products', async (req, res) => {
  res.send(await repository.read());
});

// Ruta para procesar pagos
app.post('/api/pay', async (req, res) => {
  const ids = req.body;
  const productsCopy = await repository.read();

  let error = false;

  ids.forEach((id) => {
    const product = productsCopy.find(p => p.id === id);
    if (product.stock > 0) {
      product.stock--;
    } else {
      error = true;
    }
  });

  if (error) {
    res.status(400).send("Sin stock");
  } else {
    await repository.write(productsCopy);
    res.send(productsCopy);
  }
});

// Ruta para servir el archivo index.html (opcional, ya que lo estamos sirviendo estáticamente)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'fe', '/index.html')); // Asegúrate de que 'index.html' esté en la carpeta 'fe'
});

// Escucha en el puerto especificado
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
