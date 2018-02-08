pragma solidity ^0.4.18;


library Permissions {
  struct Permission {
    mapping (address => bool) bearer;
  }

  function add(Permission storage perm, address addr)
    internal
  {
    perm.bearer[addr] = true;
  }

  function remove(Permission storage perm, address addr)
    internal
  {
    perm.bearer[addr] = false;
  }

  function has(Permission storage perm, address addr)
    view
    internal
    returns (bool)
  {
    return perm.bearer[addr];
  }
}
