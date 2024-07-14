const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

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

let dishes = [
  { dishId: '1', dishName: 'Jeera Rice', imageUrl: 'https://nosh-assignment.s3.ap-south-1.amazonaws.com/jeera-rice.jpg', isPublished: true },
  { dishId: '2', dishName: 'Paneer Tikka', imageUrl: 'https://nosh-assignment.s3.ap-south-1.amazonaws.com/paneer-tikka.jpg', isPublished: true },
  { dishId: '3', dishName: 'Rabdi', imageUrl: 'https://nosh-assignment.s3.ap-south-1.amazonaws.com/rabdi.jpg', isPublished: true },
  { dishId: '4', dishName: 'Chicken Biryani', imageUrl: 'https://nosh-assignment.s3.ap-south-1.amazonaws.com/chicken-biryani.jpg', isPublished: true },
  { dishId: '5', dishName: 'Alfredo Pasta', imageUrl: 'https://nosh-assignment.s3.ap-south-1.amazonaws.com/alfredo-pasta.jpg', isPublished: true }
];

app.get('/api/dishes', (req, res) => {
  res.json(dishes);
});

app.post('/api/dishes/:id/toggle', (req, res) => {
  const dishId = req.params.id;
  dishes = dishes.map(dish => {
    if (dish.dishId === dishId) {
      dish.isPublished = !dish.isPublished;
      io.emit('dishUpdated', dish);
    }
    return dish;
  });
  res.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit initial data to the connected client
  socket.emit('initialData', dishes);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
