// Import node module
import express from 'express';
const router = express.Router();

// Arrow functions
router.get('/', (req, res) => {
    res.send({code: 0});
});

router.get('/create', function  (req, res){
    let thereIsServer = false;

    if(thereIsServer){
        res.status(400);
        res.send({"code": 1, "message": "Server already started"});
    }else{
        res.send({
            "code": 0,
            "board_id": "c242103e-f2c0-4729-a0f7-8c6d4780b70a",
            "sess_token": "sdlfjkSDKLFJdfkljFDSLKJdfskljLKFDJ",
            "user_id": 0
        });
    }
});

router.get('/check', function (req, res){
    res.send({"code": 0, "board_id": "c242103e-f2c0-4729-a0f7-8c6d4780b70a", "members_count": 5})
});

router.post('/connect', function (req, res){
    let isTokenValid = true;

    if(isTokenValid){
        res.send({"code": 0, "user_id":10, "sess_token": "sdakfKLASFJdsaafkjSDFLKJfdsjFDKLSJ"})
    }else{
        res.status(406);
        res.send({"code": 1, "message": "Invalid token"})
    }

});

router.get('/kill', function (req, res){
    let memberAdmin = true;

    if(memberAdmin){
        res.status(403);
        res.send({"code":1, "message": "You don't have permission to do that :]."})

    }else{
        res.send({"code": 0})
    }
});

router.get('/kill/:userId', function (req, res){
    const userId = req.params.userId;
    let memberAdmin = true;

    if(memberAdmin){
        res.send({"code": 0})
    }else{
        res.status(403);
        res.send({"code":1, "message": "You don't have permissions to do that :]."})
    }
});


// Exporting an object as the default import for this module
export default router;