const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); 

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const usersFilePath = 'users.json';

app.get('/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    res.json(users);
  } catch (err) {
    console.error('Error reading users file:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/users', (req, res) => {
    try {
      const newUser = req.body;
      const users = JSON.parse(fs.readFileSync(usersFilePath));
  
      // Verificar si el correo electrónico ya está en uso
      const existingUser = users.find(user => user.email === newUser.email);
      if (existingUser) {
        // El correo electrónico ya está en uso, enviar una respuesta de error
        return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
      }
  
      // El correo electrónico no está en uso, proceder a agregar el nuevo usuario
      users.push(newUser);
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      res.status(201).json(newUser); // Devuelve el nuevo usuario como JSON
    } catch (err) {
      console.error('Error writing users file:', err);
      res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
