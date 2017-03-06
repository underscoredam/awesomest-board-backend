/**
 * Get random string of a given length
 * @param length length of the random string
 * @returns {string}
 */
const getRandomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

/**
 * Generate a random UUID.
 *
 * This will be used as a session token later.
 * @returns {string}
 */
const generateUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

/**
 * Get a token that is distributed by admin to let members join.
 * @returns {string}
 */
export const generateToken = () => {
    return getRandomString(10);
};


/**
 * Generate a session token
 */
export const generateSessionToken = generateUuid;

export const generateBoardId = generateUuid;