import {expect} from 'chai'
import * as members from '../src/members'
import {generateSessionToken} from '../src/utils/random'

describe("members.js", () => {
    let adminToken;
    let member1Token;
    let member2Token;

    beforeEach(()=>{
        adminToken = generateSessionToken();
        member1Token = generateSessionToken();
        member2Token = generateSessionToken();

        members.addMember(true, adminToken);
        members.addMember(false, member1Token);
        members.addMember(false, member2Token);
        members.addMember(false);
    });

    afterEach(()=>{
        members.clearAll();
    });

    it("Members can be fetched by their session token", ()=>{
        expect(members.getMemberByToken(adminToken).admin).to.equal(true);
        expect(members.getMemberByToken(member1Token).admin).to.equal(false);
    });

    it("There can not be two admins", ()=>{
        expect(members.addMember.bind(this, member1Token)).to.throw(Error);
    });

    it("Admin can not be deleted", ()=>{
        let admin = members.getMemberByToken(adminToken);
        expect(members.deleteMember.bind(this, admin.id)).to.throw(Error);
    });

    it("Member count is correct", ()=>{
        expect(members.getMembersCount()).to.equal(4);
    });

    it("Member can be deleted", ()=>{
        members.deleteMember(members.getMemberByToken(member1Token).id);
        expect(members.getMembersCount()).to.equal(3);
    });

});