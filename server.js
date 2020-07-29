const http=require('http');
const app=require('./app');


//const port=process.env.PORT || 3000;

const server = http.createServer(app);

//server.listen(port);
server.listen(3000,'192.168.43.96');