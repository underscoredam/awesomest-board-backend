import {expect} from 'chai';

import {generateToken, generateSessionToken} from '../../src/utils/random';
import uuid_validate from 'uuid-validate';

describe("utils/random.js", ()=>{

    it("can generate random tokens", () => {
        expect(generateToken()).to.not.equal(undefined);
    });

    it("session tokens are uuids", () => {
        expect(uuid_validate(generateSessionToken())).to.equal(true);
    });

});
