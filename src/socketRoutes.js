import {listen} from 'socket.io'

function registerEvents(socket){

    /**
     * Needs to tell everyone on the server that the person has connected;
     */
    socket.on('HILO', function(data){
        console.log('socket said hilo', data);
    });

    /**
     * Need to find a way to prompt user to enter name;
     */
    socket.on('SET_NAME', function(){
        console.log('Setting name...');

    });

    socket.on('KILL', function(){
        console.log('Kicking user...')
    });

}

export const activate = function(server){
    const io = listen(server);

    io.on('connection', function(socket) {
        registerEvents(socket);
    });
};