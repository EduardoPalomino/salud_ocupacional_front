const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// IMPORTANTE: Cambia 'mi-app-angular' por el nombre exacto que aparece en tu angular.json > projects
app.use(express.static(path.join(__dirname, 'dist/frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/index.html'));
});

app.listen(port, () => console.log(`✅ Servidor listo en http://localhost:${port}`));
