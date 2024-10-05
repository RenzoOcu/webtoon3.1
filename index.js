const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors'); // Agrega esta línea
const repository = require("./repositorio");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Agrega esta línea para habilitar CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/products', async (req, res) => {
  res.send(await repository.read());
});

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
    res.status(400).send("sin stock"); // Corrige la línea
  } else {
    await repository.write(productsCopy);
    res.send(productsCopy);
  }
});

app.use("/", express.static('fe'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
