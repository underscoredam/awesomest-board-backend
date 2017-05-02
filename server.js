import routes from './src/routes'
import {createServer} from 'http';
import express from 'express';
import {activate} from './src/socketRoutes'

const app = express();
const server = createServer(app);
activate(server);
app.use('/', routes);


server.once('error', function(err) {
    if (err.code === 'EADDRINUSE') {
        console.log('Not starting backend because EADDRINUSE');
    }
});

server.listen(34576, () => {
    const {address, port} = server.address();

    console.log(`Server listening at http://${address}${port}`);
});
