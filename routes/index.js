const router = require('express').Router();
const Todo = require('../models/Todo');

router.get('/', async(req, res) => {
    // res.send('Hello World!');
    const allToDo = await Todo.find();
    res.render('index', { todos: allToDo });
});

module.exports = router;