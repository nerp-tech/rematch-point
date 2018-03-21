const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/todos', (req, res) => {
    if (req.query.type === 'dog') {
        return setTimeout(() => {
            res.json({
                items: [
                    { uuid: '2', text: 'Woof!', type: 'dog' },
                    { uuid: '4', text: 'Woof!', type: 'dog' },
                    { uuid: '12', text: 'Woof!', type: 'dog' },
                ],
            });
        }, 4000);
    }

    setTimeout(() => {
        res.json({
            items: [
                { uuid: '1', text: 'Wow!', type: 'cat' },
                { uuid: '2', text: 'Woof!', type: 'dog' },
                { uuid: '3', text: 'Wow!', type: 'cat' },
                { uuid: '4', text: 'Woof!', type: 'dog' },
                { uuid: '5', text: 'Wow!', type: 'cat' },
                { uuid: '6', text: 'Wow!', type: 'cat' },
                { uuid: '7', text: 'Wow!', type: 'cat' },
            ],
        });
    }, 1000);
});

app.get('/todos/:id', (req, res) => {
    if (Math.random() > 0.5) {
        return res.status(403).send({
            error: 'Yikes!',
        });
    }
    return res.json({
        uuid: req.params.id,
        text: 'Wow!',
    });
});

app.put('/todos/:id', (req, res) => {
    const { text } = req.body;

    setTimeout(() => {
        return res.json({
            uuid: req.params.id,
            text,
        });
    }, 3000);
});

app.delete('/todos/:id', (req, res) => {
    setTimeout(() => {
        return res.json({
            message: 'gg',
        });
    }, 3000);
});

app.post('/todos', (req, res) => {
    const { text } = req.body;

    setTimeout(() => {
        return res.json({
            uuid: '12391',
            text,
        });
    }, 3000);
});


app.listen(8999, () => console.log('Example app listening on port 8999!'));