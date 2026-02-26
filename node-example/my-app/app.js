const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req,res) =>{

    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname,filePath);

    const ext = path.extname(filePath);
    const contentType = ext === '.css' ? 'text/css' : 'text/html';

    fs.readFile(filePath, (err,data) =>{
        if(err){
            res.writeHead(404);
            res.end("File not found");
            return;
        }
        res.writeHead(200, {'Content-Type' : contentType});
        res.end(data);
    });
});

server.listen(3000, () =>{
    console.log("Server is running at http://localhost:3000");
});