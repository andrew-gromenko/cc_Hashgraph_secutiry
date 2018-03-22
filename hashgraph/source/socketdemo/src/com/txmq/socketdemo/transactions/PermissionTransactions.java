package com.txmq.socketdemo.transactions;

import com.txmq.exo.messaging.ExoMessage;
import com.txmq.exo.transactionrouter.ExoTransaction;
import com.txmq.socketdemo.SocketDemoState;
import com.txmq.socketdemo.SocketDemoTransactionTypes;
import io.swagger.model.Permission;

public class PermissionTransactions {
    @ExoTransaction(SocketDemoTransactionTypes.ADD_PERMISSION)
    public void addPermission(ExoMessage message, SocketDemoState state) {
        System.out.println("ADD PERMISSION TRANSACTION REACHED THE NETWORK");
        Permission permission = (Permission) message.payload;
        state.addPermissions(permission.getUserIdentifier(), permission.getPermissionName());
    }
    @ExoTransaction(SocketDemoTransactionTypes.REMOVE_PERMISSION)
    public void removePermission(ExoMessage message, SocketDemoState state) {
        Permission permission = (Permission) message.payload;
        state.removePermissions(permission.getUserIdentifier(), permission.getPermissionName());
    }
}
