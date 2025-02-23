const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token || token !== 'Bearer mysecrettoken') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

let items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];

app.get('/api/items', (req, res) => {
    res.json(items);
});

app.post('/api/items', express.json(), (req, res) => {
    const newItem = { id: items.length + 1, name: req.body.name };
    items.push(newItem);
    res.status(201).json(newItem);
});

app.delete('/api/items/:id', authMiddleware, (req, res) => {
    const itemId = parseInt(req.params.id);
    items = items.filter(item => item.id !== itemId);
    res.json({ message: 'Item deleted' });
});


app.get('/read-file', (req, res) => {
    fs.readFile('sample.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.send(`<pre>${data}</pre>`);
    });
    console.log('File read initiated...');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
