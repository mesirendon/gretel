const Gretel = artifacts.require('Gretel');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

contract('Gretel', accounts => {
  const [
    owner,
    unauthorized,
    transporter1,
    transporter2,
    transporter3,
    producer1,
    producer2,
    producer3,
    device1,
    device2,
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

  describe('Admin', () => {
    it('should allow the owner adding transporters', () => {
      return gretel.addTransporter([transporter1, transporter2])
        .then(response => {
          expect(response.tx).to.match(/0x[a-fA-f0-9]{62}/);
        });
    });
    it('should avoid unauthorized accounts from adding transporters', () => {
      return expect( gretel.addTransporter([transporter3, transporter1], {from: unauthorized}) )
        .to.be.eventually.rejected;
    });
    it('should allow the owner adding producers', () => {
      return gretel.addProducer([producer1, producer2]).then(response =>{
        expect(response.tx).to.match(/0x[a-fA-f0-9]{62}/);
      });
    });
    it('should avoid unauthorized accounts from adding producers', () => {
      return expect( gretel.addProducer([producer1, producer2], {from: unauthorized}) )
        .to.be.eventually.rejected;
    });
    it('should allow the owner adding new sensor devices', () => {
      return gretel.addDevice([device1]).then(response => {
        expect(response.tx).to.match(/0x[a-fA-f0-9]{62}/);
      });
    });
    it('should avoid unauthorized accounts from adding devices', () => {
      return expect(gretel.addDevice([device1, device2], {from: unauthorized}))
        .to.be.eventually.rejected;
    });
    it('should allow the owner to link a device with a transporter', () => {
      return gretel.assignDeviceToTransporter(device1, transporter1).then(response => {
        expect(response.tx).to.match(/0x[a-fA-f0-9]{62}/);
      });
    });
  });

  describe('Transporter', () => {
    it('should allow the transporter to add a new trip', () => {
      return gretel.addTrip([device1], {from: transporter1}).then(response => {
        expect(response.tx).to.match(/0x[a-fA-f0-9]{62}/);
      });
    });
    it('should avoid adding trips for other accounts that are not transporters', () => {
      return expect( gretel.addTrip({from: producer1}) )
        .to.be.eventually.rejected;
    });
    it('should avoid the transporter to add a new trip if they are in an active trip', () => {
      return expect( gretel.addTrip({from: transporter1}) )
        .to.be.eventually.rejected;
    });
    it('should allow the transporter to add a new cargo', () => {
      return gretel.addCargo(30, '20', '20', producer1, {from: transporter1}).then(response => {
        expect(response.tx).to.match(/0x[a-fA-f0-9]{62}/);
      });
    });
    it('should allow the transporter to finish a trip', () => {
      return gretel.finishTrip({from: transporter1}).then(response => {
        expect(response.tx).to.match(/0x[a-fA-f0-9]{62}/);
      });
    });
    it('should avoid the transporter to finish an inactive trip', () => {
      return expect( gretel.finishTrip({from: transporter1}) )
        .to.be.eventually.rejected;
    });
  });

  describe('Device', () => {
    it('should record an event', () => {
      return gretel.recordEvent('24', '20', '20', {from: device1}).then(response => {
        expect(response.tx).to.match(/0x[a-fA-f0-9]{62}/);
      });
    });
    it('should avoid other accounts different to devices to record events', () => {
      return expect(gretel.recordEvent('24', '20', '20', {from: device2}))
        .to.be.eventually.rejected;
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
