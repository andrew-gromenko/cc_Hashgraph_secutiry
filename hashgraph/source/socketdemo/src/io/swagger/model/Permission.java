/*
 * Hashgraph Zoo API
 * This is a simple API
 *
 * OpenAPI spec version: 1.0.0
 * Contact: craig.drabik@txmq.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


package io.swagger.model;

import org.apache.commons.lang3.ArrayUtils;

import java.util.HashMap;
import java.io.Serializable;
import java.util.Objects;

/**
 * Permissions
 */
public class Permission implements Serializable  {
    private String userIdentifier = null;
    private String permissionName = null;

  public String getPermissionName() {
    return permissionName;
  }

  public Permission setPermissionName(String permName) {
    this.permissionName = permName;
    return this;
  }

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public Permission setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
    return this;
  }

  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Permission permission = (Permission) o;
    return Objects.equals(this.permissionName, permission.permissionName) &&
            Objects.equals(this.userIdentifier, permission.userIdentifier);
  }

  @Override
  public int hashCode() {
    return Objects.hash(permissionName, userIdentifier);
  }


  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Animal {\n");

    sb.append("    permissionName: ").append(toIndentedString(permissionName)).append("\n");
    sb.append("    species: ").append(toIndentedString(userIdentifier)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

