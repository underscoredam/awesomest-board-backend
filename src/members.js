import {generateSessionToken} from './utils/random';
export const membersList = [];


/**
 * This will be used to store the last user id. will help in addMember()
 * @type {number}
 */
let id = 0;


/**
 * Add a new member and return the member object
 */
export function addMember(admin=false, token=generateSessionToken()){
    const data = {
        token,
        id,
        admin,
        socket:null
    };

    if(admin && membersList.some((x) => x.admin)){
        throw new Error("there can not be multiple admins");
    }

    id++;

    membersList.push(data);

    return data;
}


/**
 * Delete member from the membersList.
 * Custom work needs to be done in order to remove the user.
 *
 * This function is expected to called by the express HTTP /kill method.
 * After calling this method, also explicitly pass KILL signal over socket.
 * @param id
 */
export function deleteMember(id){

    const memberIndex = membersList.findIndex((x) => x.id == id);

    if(membersList[memberIndex].admin)
        throw new Error("Can not delete admin");

    membersList.splice(memberIndex, 1);
}

/**
 * Get the member object by his/her token
 * @param token
 * @returns {*}
 */
export function getMemberByToken(token){

    return membersList.find((x) => x.token == token);

}

export function getMembersCount(){
    return membersList.length;
}

export function clearAll() {
    id=0;
    membersList.splice(0, membersList.length);
}

export function getAllMembers(){
    return membersList;
}