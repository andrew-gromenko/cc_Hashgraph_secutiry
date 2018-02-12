pragma solidity ^0.4.18;

import "./Permissions.sol";

contract RBAC {
  mapping (bytes32 => mapping(address => bool)) public permissions;

  event PermissionAdded(address addr, bytes32 PermissionName);
  event PermissionRemoved(address addr, bytes32 PermissionName);

  address public owner;

  function RBAC(address _owner)
    public
  {
    owner = _owner;
  }

  function hasPermission(address addr, bytes32 permissionName)
    view
    public
    returns (bool)
  {
    return permissions[permissionName][addr];
  }

  function adminAddPermission(address addr, bytes32 permissionName)
    onlyAdmin
    public
  {
    permissions[permissionName][addr] = true;
    PermissionAdded(addr, permissionName);
  }

  function adminRemovePermission(address addr, bytes32 permissionName)
    onlyAdmin
    public
  {
    permissions[permissionName][addr] = false;
    PermissionRemoved(addr, permissionName);
  }

  modifier onlyAdmin()
  {
    require(msg.sender == owner);
    _;
  }
}
