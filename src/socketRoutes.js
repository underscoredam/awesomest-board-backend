import {listen} from 'socket.io'
import {getMemberByToken, getAllMembers, deleteMember, getMembersCount} from './members'

let allDrawEvents = [];

export const killMember = (id) => {
    const members = getAllMembers();

    members.forEach(member => {
        if(member.socket){
            member.socket.emit('KILL', {
                id: id
            })
        }
    })
};

function registerEvents(socket){

    const getDataAndMember = (request) =>{
        const token = request.sess_token;
        const member = getMemberByToken(token);

        const data = request.data;

        return {
            "member": member,
            "data": data
        }
    };

    const raiseError = () => {
        socket.send("Invalid token!");
    };

    socket.on('HILO', function(request){
        const { data , member } = getDataAndMember(request);

        if(!member){
            return raiseError();
        }
        member.socket = socket;

        getAllMembers().forEach((loopMember) => {
            if (loopMember != member && loopMember.socket){
                loopMember.socket.emit('HILO', {
                    'id': member.id,
                    'admin': member.admin,
                    'name': member.name
                });
            }else if(loopMember.socket && loopMember.id == member.id){
                loopMember.socket.emit('ALL_DATA', {
                    data: allDrawEvents
                });

            }
        });

    });

    socket.on('SET_NAME', function(request){
        const { data , member } = getDataAndMember(request);

        if(member == null){
            return raiseError();
        }

        member.name = data.name;
        getAllMembers().forEach((loopMember) => {
            if (loopMember != member && loopMember.socket){
                loopMember.socket.emit('SET_NAME', {
                    'id': member.id,
                    'name': member.name
                });
            }
        });

    });

    socket.on('KILL', function(request) {
        const {data, member} = getDataAndMember(request);

        if (member == null) {
            return raiseError();
        }

        if (member.admin) {
            getAllMembers().forEach((loopMember) => {
                if (true || loopMember != member) {
                    member.socket.emit('KILL', {
                        'id': request.data
                    });
                }
            });
        }
        else {
            throw new Error ('Only the admin can kick others');
        }
    });

    socket.on('CLEAR_BOARD', function (request) {
        const {data, member} = getDataAndMember(request);
        member.socket = socket;

        if (!member.admin) {
                return raiseError();
            }

        allDrawEvents = [];
        getAllMembers().forEach((loopMember) => {
                if (loopMember.id !== member.id && loopMember.socket) {

                    loopMember.socket.emit('CLEAR_BOARD', {
                        'data': request.data
                    });

                }
            });
    });

    socket.on('DRAW_EVENT', function(request) {
        const { data , member } = getDataAndMember(request);

        if (member == null) {
            return raiseError();
        }
        allDrawEvents.push(request.data);
        getAllMembers().forEach((loopMember) => {
            if (loopMember != member && loopMember.socket) {
                loopMember.socket.emit('DRAW_EVENT', {
                    'data': request.data
                });
            }
        });
    });

}

export const activate = function(server){
    const io = listen(server);

    io.on('connection', function(socket) {
        registerEvents(socket);
    });
};