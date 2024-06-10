const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const dataFilePath = './data.json';

app.get('/posts', (req, res) =>{
    fs.readFile(dataFilePath, 'utf8', (err, data) =>{
        if (err) {
            res.status(500).send('Error al leer los datos');
        }else{
            res.send(JSON.parse(data));
        }
    });
});

app.post('/posts', (req, res) => {
    const newPost = req.body;
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if(err) {
            res.status(500).send('Error al leer los datos');
        }else{
            const posts = JSON.parse(data);
            newPost.id = posts.length ? posts[posts.length - 1].id + 1 : 1;
            posts.push(newPost);
            fs.writeFile(dataFilePath, JSON.stringify(posts, null, 2), (err) => {
                if(err) {
                    res.status(500).send('Error al guardar los datos');
                }else{
                    res.status(newPost);
                }
            });
        }
    });
});

app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if(err) {
            res.status(500).send('Error al leer los datos');
        }else{
            let posts = JSON.parse(data);
            posts = posts.filter(post => post.id !== postId);
            fs.writeFile(dataFilePath, JSON.stringify(posts, null, 2), (err) => {
                if(err) {
                    res.status(500).send('Error al guardar los datos');
                }else{
                    res.send({ success: true});
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`servidor ejecutandose en https://localhost:${port}`);
});