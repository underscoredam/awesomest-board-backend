import express from 'express';
const router = express.Router();
import cors from 'cors';
import bodyParser from 'body-parser'
import * as members from './members'
import {generateBoardId, generateToken} from './utils/random'
import {killMember} from './socketRoutes'

router.all('*', cors());
router.use(bodyParser.json());

let boardId = null;
const validTokens = [];

router.get('/', (req, res) => {
    res.send({code: 0});
});

router.get('/create', (req, res) => {
    let thereIsServer = !!boardId;

    if (thereIsServer) {
        res.status(400);
        res.send({
            code: 1,
            message: 'Server already started'
        });
    } else {
        boardId = generateBoardId();
        const admin = members.addMember(true);

        res.send({
            code: 0,
            board_id: boardId,
            sess_token: admin.token,
            user_id: admin.id,
            name: admin.name
        });
    }
});

router.get('/check', (req, res) => {
    res.send({
        code: 0,
        running: !!boardId,
        board_id: boardId,
        members_count: members.getMembersCount()
    });
});

router.post('/createCode', (req, res) => {
    const sess_token = req.body.sess_token;

    const member = members.getMemberByToken(sess_token);

    if (!member || !member.admin) {
        res.status(403);
        res.send({
            code: 1,
            message: 'You don\'t have admin access. -_-'
        });
    } else {
        const token = generateToken();
        validTokens.push(token);
        res.send({
            code: 0,
            token: token
        });
    }


});

router.post('/connect', (req, res) => {
    const token = req.body.token;

    let isTokenValid = validTokens.indexOf(token) >= 0;

    if (isTokenValid) {
        validTokens.splice(validTokens.indexOf(token), 1);

        const member = members.addMember();

        res.send({
            code: 0,
            user_id: member.id,
            sess_token: member.token,
            name: member.name,
            members: members.getAllMembers().map(x => ({
                name: x.name,
                id: x.id,
                admin: x.admin
            }))
        })
    } else {
        res.status(406);
        res.send({
            code: 1,
            message: 'Invalid token'
        });
    }

});

router.post('/kill', (req, res) => {
    const token = req.body.sess_token;

    const member = members.getMemberByToken(token);

    if (member.admin) {
        //admin can not remove himself/herself

        res.status(403);
        res.send({
            code: 1,
            message: 'You don\'t have permission to do that :].'
        });

    } else {
        killMember(member.id);
        members.deleteMember(member.id);

        res.send({
            'code': 0
        });
    }
});

router.post('/kill/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const token = req.body.sess_token;
    const member = members.getMemberByToken(token);


    if (member.admin) {
        // only admin can remove other members

        killMember(userId);
        members.deleteMember(userId);

        res.send({
            code: 0
        });
    } else {
        res.status(403);
        res.send({
            code: 1,
            message: 'You don\'t have permissions to do that :].'
        });
    }
});

export default router;