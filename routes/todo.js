const router = require('express').Router();
const Todo = require('../models/Todo');

router.post('/add/todo', (req, res) => {
        const {
            todo
        } = req.body;
        const newTodo = new Todo({
            todo
        });

        newTodo.save()
            .then(() => {
                console.log('Added a todo');
                res.redirect('/');
            })
            .catch(err => {
                console.log(err);
            });
    })
    .get('/delete/todo/:id', (req, res) => {
        const {
            id
        } = req.params;
        Todo.findByIdAndDelete(id)
            .then(() => {
                console.log('Deleted a todo');
                res.redirect('/');
            })
            .catch(err => {
                console.log(err);
            });
    })
    .get('/edit/todo/:id', (req, res) => {
        const {
            id
        } = req.params;
        Todo.findById(id)
            .then(todo => {
                res.render('edit', {
                    todo
                });
            })
            .catch(err => {
                console.log(err);
            });
    })
    .post('/edit/todo/:id', (req, res) => {
        const {
            id,
            todo
        } = req.body;
        const filter = { _id: id };
        Todo.findOneAndUpdate(filter, {
                todo
            })
            .then(() => {
                console.log('Updated a todo');
                res.redirect('/');
            })
            .catch(err => {
                console.log(err);
            });
    })

module.exports = router;