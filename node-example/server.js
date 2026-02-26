const http = require('http');

const server = http.createServer((req,res) =>{

    if(req.url === '/'){
        res.writeHead(200, {'content-type' : 'text/plain'});
        res.end('Welcome to the home page');
    } else if ( req.url === '/about'){
        res.writeHead(200, {'content-type' : 'text/plain'});
        res.end('This the about page');
    } else{
        res.writeHead(404);
        res.end('Page not found');
    }
});

server.listen(3000, () =>{
    console.log("Server is running at http://localhost:3000");
});