const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
    Server
} = require("socket.io");
const io = new Server(server);
const Todo = require('./models/Todo');

mongoose.connect('mongodb://localhost/todo-list', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

//routes
app.use(require('./routes/index'));
app.use(require('./routes/todo'));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('add_todo', (todo) => {
        const newTodo = new Todo({
            todo: todo.todo
        });
        newTodo.save()
            .then(() => {
                io.emit('added_todo', {
                    todo: todo.todo,
                    id: newTodo._id.valueOf()
                });
            })
            .catch(err => {
                console.log(err);
            });
    });
    socket.on('delete_todo', (id) => {
        Todo.findByIdAndDelete(id.id)
            .then(() => {
                io.emit('deleted_todo', {
                    id: id.id
                })
            })
            .catch(err => {
                console.log(err);
            });
    });
    socket.on('edit_todo', (data) => {
        const filter = {
            _id: data.id
        };
        Todo.findOneAndUpdate(filter, {
                todo: data.todo
            })
            .then(() => {
                io.emit('edited_todo', {
                    id: data.id,
                    todo: data.todo
                })
            })
            .catch(err => {
                console.log(err);
            });
    })
});

server.listen(3000, () => console.log('Server started on port 3000'));