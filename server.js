require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string from environment variables
const mongoURI ='mongodb+srv://sarvadnyajawle:SRJawle%40123@cluster0.t1pvzhp.mongodb.net/Data_Dashboard?retryWrites=true&w=majority&appName=Cluster0'

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define Mongoose schema and model
const dishSchema = new mongoose.Schema({
  dishId: String,
  dishName: String,
  imageUrl: String,
  isPublished: Boolean
});

const Dish = mongoose.model('Dish', dishSchema);

// Routes
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/dishes/:id/toggle', async (req, res) => {
  const dishId = req.params.id;
  try {
    const dish = await Dish.findOne({ dishId });
    if (dish) {
      dish.isPublished = !dish.isPublished;
      await dish.save();
      io.emit('dishUpdated', dish);
      res.sendStatus(200);
    } else {
      res.status(404).json({ message: 'Dish not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit initial data to the connected client
  Dish.find()
    .then(dishes => socket.emit('initialData', dishes))
    .catch(err => console.log(err));

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
