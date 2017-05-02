import routes from './src/routes'
import {createServer} from 'http';
import express from 'express';
import {activate} from './src/socketRoutes'

const app = express();
const server = createServer(app);
activate(server);
app.use('/', routes);

server.listen(34576, () => {
    const {address, port} = server.address();

    console.log(`Server listening at http://${address}${port}`);
});
