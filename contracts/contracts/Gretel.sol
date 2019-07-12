pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/access/Roles.sol';

contract Gretel is Ownable {
  using Roles for Roles.Role;

  Roles.Role private transporter;
  Roles.Role private producer;
  Roles.Role private devices;

  uint[] private tripIds;
  mapping(uint => address) private tripTransporter;
  mapping(uint => address[]) private tripDevices;
  mapping(address => Trips) private transporterTrips;
  mapping(address => address) private deviceTransporter;
  mapping(uint => mapping(uint => EventRecord)) private tripEventRecords;

  event newCargo(string _name, uint _amount, string _lat, string _lon, address indexed _from);
  event newTrip(string _name, uint _tripId, address indexed _from);
  event newProducer(string _name, address indexed _address);
  event newTransporter(string _name, address indexed _address);
  event newDevice(string _name, address indexed _address);
  event closeTrip(string _name, address indexed _address);
  event deviceAssignedToTransporter(address indexed _transporter, address _device);
  event newTripEventRecord(
    string _name,
    uint _tripId,
    address indexed _from,
    string _humidity,
    string _temperature,
    string _lat,
    string _lon
  );

  struct Trips {
    uint activeTrip;
    uint[] trips;
    mapping(uint => Cargo) cargos;
  }

  struct Cargo {
    mapping(address => Item) items;
    address[] itemIds;
    address[] devices;
  }

  struct EventRecord {
    string humidity;
    string temperature;
    string lat;
    string lon;
  }

  struct Item {
    uint amount;
    string lat;
    string lon;
  }

  constructor() public {}

  modifier onlyTransport() {
    require(isTransport(), "It's not a valid transport account.");
    _;
  }

  modifier onlyDevice() {
    require(isDevice(), "It's not a valid device account.");
    _;
  }

  function isTransport() internal view returns (bool) {
    return transporter.has(msg.sender);
  }

  function isDevice() internal view returns (bool) {
    return devices.has(msg.sender);
  }

  function addDevice(address[] memory _devices) public onlyOwner {
    for (uint i = 0; i < _devices.length; i++) {
      if (!devices.has(_devices[i])) {
        devices.add(_devices[i]);
        emit newDevice("Nuevo dispositivo agregado", _devices[i]);
      }
    }
  }

  function assignDeviceToTransporter(address _device, address _transporter) public onlyOwner {
    deviceTransporter[_device] = _transporter;
    emit deviceAssignedToTransporter(_transporter, _device);
  }

  function addTransporter(address[] memory _transporters) public onlyOwner {
    for (uint i = 0; i < _transporters.length; i++) {
      if (!transporter.has(_transporters[i])) {
        transporter.add(_transporters[i]);
        transporterTrips[_transporters[i]] = Trips({
          activeTrip: 0,
          trips: new uint[](0)
        });
        emit newTransporter("Nuevo transportador agregado", _transporters[i]);
      }
    }
  }

  function addCargo(uint _amount, string memory _lat, string memory _lon, address _producer) public onlyTransport {
    Trips storage tt = transporterTrips[msg.sender];
    Cargo storage cc = tt.cargos[tt.activeTrip];
    cc.itemIds.push(_producer);
    cc.items[_producer] = Item({amount: _amount, lat: _lat, lon: _lon});
    emit newCargo("Nueva carga registrada", _amount, _lat, _lon, msg.sender);
  }

  function addTrip(address[] memory _devices) public onlyTransport {
    Trips storage tt = transporterTrips[msg.sender];
    require (tt.activeTrip == 0, "The transporter has an active trip");
    uint tripId = now;
    tripTransporter[tripId] = msg.sender;
    tripDevices[tripId] = _devices;
    tripIds.push(tripId);
    tt.activeTrip = tripId;
    tt.trips.push(tripId);
    tt.cargos[tripId] = Cargo({itemIds: new address[](0), devices: _devices});
    emit newTrip("Nuevo viaje registrado", tripId, msg.sender);
  }

  function recordEvent(
    string memory _humidity,
    string memory _temperature,
    string memory _lat,
    string memory _lon
  ) public onlyDevice {
    Trips storage tt = transporterTrips[deviceTransporter[msg.sender]];
    require (tt.activeTrip == 0, "The transporter has an active trip");
    tripEventRecords[tt.activeTrip][now] = EventRecord({humidity: _humidity, temperature: _temperature, lat: _lat, lon: _lon});
    emit newTripEventRecord("Nuevo registro de dispositivo", tt.activeTrip, msg.sender, _humidity, _temperature, _lat, _lon);
  }

  function finishTrip() public onlyTransport {
    Trips storage tt = transporterTrips[msg.sender];
    require(tt.activeTrip != 0, "There is no active trip yet");
    tt.activeTrip = 0;
    emit closeTrip("Cerrando viaje de transportador", msg.sender);
  }

  function addProducer(address[] memory _producers) public onlyOwner {
    for(uint i = 0; i < _producers.length; i++) {
      if(!producer.has(_producers[i])) {
        producer.add(_producers[i]);
        emit newProducer("Nuevo productor registrado", _producers[i]);
      }
    }
  }

  function kill() public onlyOwner {
    selfdestruct(address(int160(owner())));
  }
}
