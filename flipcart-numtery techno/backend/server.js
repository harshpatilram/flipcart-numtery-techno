const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Utility to load JSON files
const loadJSON = (filename) => JSON.parse(fs.readFileSync(filename, 'utf-8'));

// ✅ Route to get cart products (used by CartContext & Summary)
app.get('/products', (req, res) => {
  const db = loadJSON('db.json');
  const cartProducts = [...db.Appliances, ...db.Electronics, ...db.Fashion, ...db.Groceries];
  res.json(cartProducts);
});

// ✅ Route to get product details by item_id (used by Viewpage)
app.get('/all', (req, res) => {
  const { item_id } = req.query;
  const dbHome = loadJSON('dbHome.json');
  
  const allCategories = [
    ...dbHome.mobile,
    ...dbHome.electronics,
    ...dbHome.fashion,
    ...dbHome.top_offers,
    ...dbHome.appliances
  ];

  if (item_id) {
    const product = allCategories.find(item => item.item_id == item_id);
    if (product) return res.json(product);
    else return res.status(404).json({ message: 'Product not found' });
  }

  res.json(allCategories); // Return all if no item_id is passed
});

// ✅ Route to add a product to the cart (from Viewpage)
app.post('/products', (req, res) => {
  const db = loadJSON('db.json');
  const newProduct = req.body;

  const category = newProduct.category_name.toLowerCase();
  if (!db[capitalize(category)]) {
    db[capitalize(category)] = [];
  }

  const exists = db[capitalize(category)].find(item => item.item_id === newProduct.item_id);

  if (!exists) {
    db[capitalize(category)].push(newProduct);
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
    res.status(201).json({ message: 'Product added to cart', product: newProduct });
  } else {
    res.status(400).json({ message: 'Product already in cart' });
  }
});

// ✅ Route to update quantity of a product in the cart (from Summary)
app.patch('/products/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const db = loadJSON('db.json');

  let updated = false;
  ['Appliances', 'Electronics', 'Fashion', 'Groceries'].forEach(category => {
    db[category] = db[category].map(product => {
      if (product.item_id == id) {
        updated = true;
        return { ...product, quantity };
      }
      return product;
    });
  });

  if (updated) {
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
    res.json({ message: 'Product quantity updated successfully' });
  } else {
    res.status(404).json({ message: 'Product not found in cart' });
  }
});

// Capitalize helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ✅ Start the backend server
app.listen(PORT, () => {
  console.log(`✅ Backend is running at http://localhost:${PORT}`);
});
