const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        return res.status(400).json({ message: 'The email address is already in use' });
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

// Ruta para verificar si un correo electrónico ya está registrado
app.get('/checkEmail/:email', (req, res) => {
  const { email } = req.params;
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const existingUser = users.find(user => user.email === email);
    res.json({ exists: !!existingUser });
  } catch (err) {
    console.error('Error checking email:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Método para verificar si un usuario está autenticado
function isLoggedIn(email, password) {
  try {
    // Leer el archivo users.json para obtener la lista de usuarios
    const users = JSON.parse(fs.readFileSync(usersFilePath));

    // Buscar el usuario con el correo electrónico dado
    const user = users.find(user => user.email === email);

    // Verificar si se encontró un usuario con ese correo electrónico
    if (user) {
      // Comparar la contraseña proporcionada con la contraseña almacenada en el archivo JSON
      // Para esto, puedes utilizar alguna librería de hashing como bcrypt
      if (bcrypt.compareSync(password, user.password)) {
        // Usuario autenticado correctamente
        return true;
      }
    }

    // Si no se encuentra el usuario o la contraseña es incorrecta, devolver falso
    return false;
  } catch (err) {
    console.error('Error al verificar la autenticación del usuario:', err);
    // En caso de error, también puedes devolver false o lanzar una excepción según tus necesidades
    return false;
  }
}

function getUserByEmail(email) {
  const users = JSON.parse(fs.readFileSync(usersFilePath));
  return users.find(user => user.email === email);
}

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = getUserByEmail(email); // Obtén el usuario del archivo users.json

  if (isLoggedIn(email, password)) {
    // Generación de un token JWT con una duración de 1 hora (3600 segundos)
    const token = jwt.sign({ email, fullName: user.fullName }, 'k=F##7dEKxWN:[1]+_"1L7q(5:o!6[XKdU2S[3gTr-1nu9_"zW', { expiresIn: '1h' });

    // Devuelve el token en un objeto JSON
    res.status(200).json({ token });
  } else {
    // Credenciales inválidas
    res.status(401).json({ message: 'Credenciales inválidas. Por favor, inténtalo de nuevo.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
