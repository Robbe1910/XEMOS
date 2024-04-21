const bodyParser = require('body-parser');
express = require('express');
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
const sensorDataFilePath = 'sensor-data.json';

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
    res.status(500).send('Internal Server Error');
  }
});

// Función para enviar correo electrónico de confirmación
function sendConfirmationEmail(email, token) {
  const mailOptions = {
    from: 'rberrendoe01@informatica.iesvalledeljerteplasencia.es',
    to: email,
    subject: 'Confirm your email address',
    text: `Click the following link to confirm your email address: http://34.175.187.252:3000/confirm/${token}` // Usar el nuevo token único
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending confirmation email:', error);
    } else {
      console.log('Confirmation email sent:', info.response);
    }
  });
}


// Endpoint para registrar un nuevo usuario
app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    const token = uuid.v4();
    newUser.token = token;
    newUser.emailConfirmed = false; // Agregar una propiedad para indicar si el correo está confirmado o no
    newUser.createdAt = new Date(); // Agregar una propiedad para la fecha de creación
    const hashedPassword = bcrypt.hashSync(newUser.password, 10);
    newUser.password = hashedPassword;
    // Define el payload del loginToken con la información que deseas incluir
    const payload = {
      email: newUser.email,
      fullName: newUser.fullName,
      emailConfirmed: newUser.emailConfirmed,
      token: newUser.token
    };

    // Define la clave secreta para firmar el loginToken (debería ser una cadena segura y secreta)
    const secretKey = 'k=F##7dEKxWN:[1]+_"1L7q(5:o!6[XKdU2S[3gTr-1nu9_"zW';

    // Genera el loginToken jwt con el payload, la clave secreta y opcionalmente un tiempo de expiración
    const loginTokenJWT = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    newUser.loginToken = loginTokenJWT;

    // Leer los usuarios del archivo JSON
    const users = JSON.parse(fs.readFileSync(usersFilePath));

    // Agregar el nuevo usuario al array de usuarios
    users.push(newUser);

    // Escribir la lista de usuarios actualizada en el archivo JSON
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Enviar correo electrónico de confirmación con el loginToken
    sendConfirmationEmail(newUser.email, token);

    res.status(201).json({ message: 'User registered successfully. Check your email for confirmation.', loginToken: newUser.loginToken });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Endpoint para reenviar correo de confirmación
app.post('/resendConfirmationEmail', (req, res) => {
  const { token } = req.body;

  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const user = users.find(u => u.token === token);

    if (user) {
      sendConfirmationEmail(user.email, user.token);
      res.status(200).json({ message: 'Correo de confirmación reenviado exitosamente' });
    } else {
      res.status(400).json({ error: 'Token de inicio de sesión inválido' });
    }
  } catch (error) {
    console.error('Error al reenviar correo de confirmación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




app.get('/confirm/:loginToken', async (req, res) => {
  const token = req.params.loginToken;

  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const userIndex = users.findIndex(user => user.token === token);

    if (userIndex !== -1) {
      users[userIndex].emailConfirmed = true;
      users[userIndex].token = ''; // Limpia el loginToken después de confirmar el correo electrónico
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

      // Devuelve una respuesta indicando que el correo electrónico se confirmó correctamente
      return res.status(200).json({ message: 'Email confirmed successfully' });
    } else {
      res.status(400).json({ error: 'Invalid loginToken' });
    }
  } catch (error) {
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

    return res.status(200).json({ message: 'Cuenta confirmada correctamente.' });
  } catch (error) {
    console.error('Error al confirmar correo electrónico:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Endpoint para verificar si el correo electrónico está confirmado
app.get('/checkEmailConfirmed', (req, res) => {
  try {
    // Obtener el token JWT del encabezado de autorización
    const token = req.headers.authorization.split(' ')[1];

    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const existingUser = users.find(user => user.loginToken === token);

    console.log(token)
    console.log(existingUser)
    // Verificar si el token está presente
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verificar si la propiedad emailConfirmed está presente en el usuario existente
    const emailConfirmed = existingUser ? existingUser.emailConfirmed : false;

    // Devolver el estado de confirmación del correo electrónico
    res.status(200).json({ emailConfirmed });
  } catch (error) {
    console.error('Error checking email confirmation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

// Endpoint para iniciar sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFilePath));
  const user = authenticateUser(email, password);
  if (user) {
    const token = jwt.sign({ email, fullName: user.fullName }, 'k=F##7dEKxWN:[1]+_"1L7q(5:o!6[XKdU2S[3gTr-1nu9_"zW', { expiresIn: '1h' });
    user.loginToken = token;
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(200).json({ token, emailConfirmed: user.emailConfirmed });
  } else {
    res.status(401
).json({ message: 'Invalid credentials. Please try again.' });
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


// Endpoint to get all sensor data
app.get('/sensor-data', (req, res) => {
  try {
    // Read sensor data from file
    const sensorData = JSON.parse(fs.readFileSync(sensorDataFilePath));

    // Send the sensor data as response
    res.status(200).json(sensorData);
  } catch (error) {
    console.error('Error reading sensor data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/sensor-data', (req, res) => {
  try {
    const sensorData = req.body; // Get the sensor data from the request body
    console.log('Sensor data received:', sensorData);

    // Perform additional processing if needed

    // Write the sensor data to the sensor-data.json file
    fs.readFile(sensorDataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading sensor data file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      let sensorDataArray = [];
      try {
        sensorDataArray = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing sensor data JSON:', parseError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      sensorDataArray.push(sensorData);

      fs.writeFile(sensorDataFilePath, JSON.stringify(sensorDataArray, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing sensor data to file:', writeErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Sensor data written to file successfully');
        res.status(200).json({ message: 'Sensor data received and written to file' });
      });
    });
  } catch (error) {
    console.error('Error processing sensor data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to update the first sensor data object
app.put('/sensor-data', (req, res) => {
  try {
    const updatedSensorData = req.body; // Get the updated sensor data from the request body
    console.log('Updated sensor data:', updatedSensorData);

    // Read the sensor data file
    fs.readFile(sensorDataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading sensor data file:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      let sensorDataArray = [];
      try {
        sensorDataArray = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing sensor data JSON:', parseError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check if the sensor data array is not empty
      if (sensorDataArray.length > 0) {
        // Update the first sensor data object
        sensorDataArray[0] = updatedSensorData;

        // Write the updated sensor data back to the file
        fs.writeFile(sensorDataFilePath, JSON.stringify(sensorDataArray, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing sensor data to file:', writeErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          console.log('Sensor data updated successfully');
          res.status(200).json({ message: 'Sensor data updated successfully' });
        });
      } else {
        // If the sensor data array is empty, return an error response
        return res.status(404).json({ error: 'No sensor data found' });
      }
    });
  } catch (error) {
    console.error('Error updating sensor data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});