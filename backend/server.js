const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const usersFilePath = 'users.json';

// Configurar nodemailer (reemplaza con tus credenciales SMTP)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'rberrendoe01@informatica.iesvalledeljerteplasencia.es',
    pass: 'icpa dkvq owqh sffs'
  }
});

app.get('/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    res.json(users);
  } catch (err) {
    console.error('Error reading users file:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Función para enviar correo electrónico de confirmación
function sendConfirmationEmail(email, token) {
  const mailOptions = {
    from: 'rberrendoe01@informatica.iesvalledeljerteplasencia.es',
    to: email,
    subject: 'Confirm your email address',
    text: `Click the following link to confirm your email address: http://34.175.187.252:3000/confirm/${token}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending confirmation email:', error);
    } else {
      console.log('Confirmation email sent:', info.response);
    }
  });
}

app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    const token = uuid.v4();
    newUser.token = token;
    newUser.emailConfirmed = false; // Agregar una propiedad para indicar si el correo está confirmado o no
    newUser.createdAt = new Date(); // Agregar una propiedad para la fecha de creación
    // Define el payload del token con la información que deseas incluir
    const payload = {
      email: newUser.email,
      fullName: newUser.fullName
    };

    // Define la clave secreta para firmar el token (debería ser una cadena segura y secreta)
    const secretKey = 'k=F##7dEKxWN:[1]+_"1L7q(5:o!6[XKdU2S[3gTr-1nu9_"zW';

    // Genera el token JWT con el payload, la clave secreta y opcionalmente un tiempo de expiración
    const tokenJWT = jwt.sign(payload, secretKey, { expiresIn: '24h' }); 
    newUser.loginToken = tokenJWT;

    // Leer los usuarios del archivo JSON
    const users = JSON.parse(fs.readFileSync(usersFilePath));

    // Agregar el nuevo usuario al array de usuarios
    users.push(newUser);

    // Escribir la lista de usuarios actualizada en el archivo JSON
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Enviar correo electrónico de confirmación con el token
    sendConfirmationEmail(newUser.email, token);

    res.status(201).json({ message: 'User registered successfully. Check your email for confirmation.', loginToken: token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/resendConfirmationEmail', async (req, res) => {
  const { loginToken } = req.body;
  console.log(loginToken)
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const existingUser = users.find(user => user.loginToken === loginToken);

    const token = existingUser.token;

    // Envía el correo electrónico de confirmación con el nuevo token
    sendConfirmationEmail(existingUser.email, token);

    res.status(200).json({ message: 'Confirmation email resent successfully' });
  } catch (error) {
    console.error('Error resending confirmation email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/confirm/:token', async (req, res) => {
  const token = req.params.token;

  try {

    // Leer los usuarios del archivo JSON y asignarlos a la variable users
    const users = JSON.parse(fs.readFileSync(usersFilePath));

    // 1. Buscar el usuario en el array de usuarios utilizando el token proporcionado
    const user = users.find(user => user.token === token);

    // 2. Si se encuentra un usuario con el token proporcionado
    if (user) {
      // 3. Actualizar el estado de confirmación del correo electrónico y eliminar el token
      user.emailConfirmed = true;
      user.token = '';
      await fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2)); // Guardar el usuario actualizado en el archivo JSON

      // 4. Redirigir al usuario a una página de confirmación en la aplicación
      res.redirect('http://localhost:8100/confirmation-page');
    } else {
      // 5. Si el token es inválido, devolver un error
      res.status(400).json({ error: 'Invalid token' });
    }
  } catch (error) {
    // 6. Manejar cualquier error que ocurra durante el proceso
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Endpoint para confirmar el correo electrónico
app.get('/confirmEmail/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Leer los usuarios del archivo JSON y asignarlos a la variable users
    const users = JSON.parse(fs.readFileSync(usersFilePath));

    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Marcar el correo electrónico como confirmado en la base de datos
    user.emailConfirmed = true;
    await user.save();

    return res.redirect('http://localhost:8100/login'); // Redirigir a la página de inicio de sesión
  } catch (error) {
    console.error('Error al confirmar correo electrónico:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
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
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const user = users.find(user => user.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
      console.log('User found:', user);
      return user;
    }
    console.log('User not found or password incorrect');
    return null;
  } catch (err) {
    console.error('Error al verificar la autenticación del usuario:', err);
    return null;
  }
}


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const users = JSON.parse(fs.readFileSync(usersFilePath));

  // Autenticar al usuario
  const user = authenticateUser(email, password);

  if (user) {
    // Generar un nuevo token para el usuario autenticado
    const token = jwt.sign({ email, fullName: user.fullName }, 'k=F##7dEKxWN:[1]+_"1L7q(5:o!6[XKdU2S[3gTr-1nu9_"zW', { expiresIn: '24h' });
    
    // Guardar el token en el usuario
    user.loginToken = token;
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Devolver el token y cualquier otra información relevante
    res.status(200).json({ token, emailConfirmed: user.emailConfirmed });
  } else {
    // Si las credenciales son inválidas, devolver un mensaje de error
    res.status(401).json({ message: 'Invalid credentials. Please try again.' });
  }
});


// Endpoint para actualizar el correo electrónico del usuario
app.put('/users/email', (req, res) => {
  const { email, newEmail } = req.body;
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex !== -1) {
      users[userIndex].email = newEmail;
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      res.status(200).json({ message: 'Email updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating email:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para actualizar la contraseña del usuario
app.put('/users/password', (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex !== -1) {
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      users[userIndex].password = hashedPassword;
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Agregar una nueva ruta DELETE para eliminar un usuario
app.delete('/users/:email', (req, res) => {
  const { email } = req.params; // Obtener el correo electrónico del usuario a eliminar
  try {
    // Leer el archivo users.json para obtener la lista de usuarios
    let users = JSON.parse(fs.readFileSync(usersFilePath));

    // Filtrar los usuarios para excluir al usuario a eliminar
    users = users.filter(user => user.email !== email);

    // Escribir la lista de usuarios actualizada de vuelta al archivo users.json
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Devolver una respuesta exitosa
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function authenticateUser(email, password) {
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const user = users.find(user => user.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    console.log('User not found or password incorrect');
    return null;
  } catch (err) {
    console.error('Error verifying user authentication:', err);
    return null;
  }
}


// Método para verificar si un usuario está autenticado y devolver el usuario con su token
function loginToken(email, password) {
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const user = users.find(user => user.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
      let token = user.loginToken;
      if (token) {
        // Borrar el token existente si lo tiene
        user.loginToken = '';
      }
      // Generar un nuevo token
      token = jwt.sign({ email, fullName: user.fullName }, 'k=F##7dEKxWN:[1]+_"1L7q(5:o!6[XKdU2S[3gTr-1nu9_"zW', { expiresIn: '24h' });
      user.loginToken = token;
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      return { user, token };
    }
    console.log('User not found or password incorrect');
    return null;
  } catch (err) {
    console.error('Error al verificar la autenticación del usuario:', err);
    return null;
  }
}



app.post('/loginToken', (req, res) => {
  const { email, password } = req.body;

  const userWithToken = loginToken(email, password);

  if (userWithToken) {
    res.status(200).json(userWithToken);
  } else {
    res.status(401).json({ message: 'Invalid credentials. Please try again.' });
  }
});

app.post('/sensor-data', (req, res) => {
  const sensorData = req.body; // Obtener los datos del cuerpo de la solicitud
  console.log('Datos de los sensores recibidos:', sensorData);

  // Aquí puedes realizar cualquier procesamiento adicional con los datos recibidos

  // Enviar una respuesta al ESP32 para confirmar que los datos se recibieron correctamente
  res.status(200).json({ message: 'Datos de los sensores recibidos correctamente' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});