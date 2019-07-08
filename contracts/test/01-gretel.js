const Gretel = artifacts.require('Gretel');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

contract('Gretel', accounts => {
  const [
    owner,
    unauthorized,
    producer1,
    producer2,
    producer3,
  ] = accounts;

  describe('Deployment', () => {
    it('should get an instance of the contract without errors', () => {
      return Gretel.deployed().then(instance => {
        gretel = instance;
        expect(gretel).not.to.be.null;
      });
    });
    it('should have registered the owner of the contract', () => {
      return gretel.owner().then(registeredOwner => {
        expect(registeredOwner).to.eq(owner);
      });
    });
  });

  describe('Admin ops', () => {
    it('should allow the owner adding producers', () => {
      return gretel.addProducers([producer1, producer2]).then(response => {
        expect(response.tx).to.match(/0x[a-fA-f0-9]{62}/);
      });
    });
    it('should avoid unauthorized accounts from adding producers', () => {
      return expect( gretel.addProducers([producer3, producer1], {from: unauthorized}) )
        .to.be.eventually.rejected;
    });
  });

  describe('Producer ops', () => {
    it('should avoid unauthorized accounst to add products', () => {
    });
    it('should allow producers to add their products', () => {
    });
  });

  describe('Killing the contract', () => {
    it('should avoid unauthorized accounts from killing the contract', () => {
      return expect( gretel.kill({from: unauthorized}) ).to.be.eventually.rejected;
    });
    it('should allow the owner of the contract to kill it', () => {
      return gretel.kill().then(response => {
        expect(response.tx).to.match(/0x[a-fA-f0-9]{62}/);
      });
    });
  });
});
