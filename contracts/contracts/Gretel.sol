pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/access/Roles.sol';

contract Gretel is Ownable {
  using Roles for Roles.Role;

  Roles.Role private transport;

  constructor() public {}

  function addProducers(address[] memory _producers) public onlyOwner {
    for (uint i = 0; i < _producers.length; i++) {
      if (!transport.has(_producers[i])) {
        transport.add(_producers[i]);
      }
    }
  }

  function kill() public onlyOwner {
    selfdestruct(address(int160(owner())));
  }
}
