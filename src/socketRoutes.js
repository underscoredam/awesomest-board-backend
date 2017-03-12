import {listen} from 'socket.io'
import {getMemberByToken, getAllMembers, deleteMember, getMembersCount} from './members'

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
    /**
     * Needs to tell everyone on the server that the person has connected;
     */
    socket.on('HILO', function(request){
        const { data , member } = getDataAndMember(request);

        if(member == null){
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
            }
        });

    });

    /**
     * Setting name for user
     */
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

    socket.on('DRAW_EVENT', function(request) {
        const { data , member } = getDataAndMember(request);

        if (member == null) {
            return raiseError();
        }
        getAllMembers().forEach((loopMember) => {
            if (loopMember != member && loopMember.socket) {
                loopMember.socket.emit('DRAW_EVENT', {
                    'data': request.data
                });
            }
        });
    });

    //The follow would list the members of the server to whomever request it
    /*socket.on('LIST_MEMBERS', function(request) {
        console.log('Starting LIST_MEMBERS');
        const { data , member } = getDataAndMember(request);
        const membersCount = getMembersCount();
        const membersList = getAllMembers();

        if (member == null)  {
            return raiseError();
        }

        while(i = 0, i < membersCount, i++) {
            member.socket.emit('LIST_MEMBERS', {
                membersList
            });
        }

    });*/
}

export const activate = function(server){
    const io = listen(server);

    io.on('connection', function(socket) {
        registerEvents(socket);
    });
};