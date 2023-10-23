const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    let url = req.url;
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html')
        res.statusCode = 200;
        res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>');
        res.end();
        return;
    }

    if (url === '/message' && req.method === 'POST') {
        fs.writeFileSync('message.txt', "asdads");
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
        return;
    }

    res.setHeader('Content-Type', 'text/html')
    res.statusCode = 200;
    res.write('<h1>Hello World</h1>');
    res.end();
});

server.listen(process.env.PORT || 3000);