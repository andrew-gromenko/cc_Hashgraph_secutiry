pragma solidity ^0.4.18;

import "./Permissions.sol";

contract RBAC {
  using Permissions for Permissions.Permission;

  mapping (string => Permissions.Permission) private permissions;
  bytes[] public permissionNames;

  event PermissionAdded(address addr, string PermissionName);
  event PermissionRemoved(address addr, string PermissionName);

  address public owner;

  function RBAC(address _owner)
    public
  {
    owner = _owner;
  }

  function hasPermission(address addr, string permissionName)
    view
    public
    returns (bool)
  {
    return permissions[permissionName].has(addr);
  }

  function adminAddPermission(address addr, string permissionName)
    onlyAdmin
    public
  {
    bytes memory permName = bytes(permissionName);
    permissionNames.push(permName);
    addPermission(addr, permissionName);
  }

  function adminRemovePermission(address addr, string permissionName)
    onlyAdmin
    public
  {
    removePermission(addr, permissionName);
  }

  function addPermission(address addr, string permissionName)
    internal
  {
    permissions[permissionName].add(addr);
    PermissionAdded(addr, permissionName);
  }

  function removePermission(address addr, string permissionName)
    internal
  {
    permissions[permissionName].remove(addr);
    PermissionRemoved(addr, permissionName);
  }


  modifier onlyAdmin()
  {
    require(msg.sender == owner);
    _;
  }
}

