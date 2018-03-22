package com.txmq.socketdemo.rest;

import java.io.IOException;
import java.util.HashMap;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.txmq.exo.core.ExoPlatformLocator;
import com.txmq.exo.messaging.ExoMessage;
import com.txmq.socketdemo.SocketDemoState;
import com.txmq.socketdemo.SocketDemoTransactionTypes;

import io.swagger.model.Permission;

@Path("/HashgraphZoo/1.0.0")
public class PermissionsRestApi {
	@POST
	@Path("/permissions")
	@Produces(MediaType.APPLICATION_JSON)
	public Response addPermission(Permission permission) {
	    System.out.println("PERMISSION -----------------------------------------------------------------");
		ExoMessage message = new ExoMessage(new SocketDemoTransactionTypes(SocketDemoTransactionTypes.ADD_PERMISSION), permission);

		try {
			ExoPlatformLocator.getPlatform().createTransaction(message.serialize(), null);
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		SocketDemoState state = (SocketDemoState) ExoPlatformLocator.getState();
		HashMap result = state.permissions;

		return Response.status(201).entity(result).build();
	}

	@DELETE
	@Path("/permissions")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removePermission(@QueryParam("userIdentifier") String userIdentifier, @QueryParam("permissionName") String permissionName) {
	    Permission permission = new Permission();
	    permission.setPermissionName(permissionName);
        permission.setUserIdentifier(userIdentifier);
		System.out.println("REMOVE PERMISSION ENDPOINT------------------------------------------------------------");
		ExoMessage message = new ExoMessage(new SocketDemoTransactionTypes(SocketDemoTransactionTypes.REMOVE_PERMISSION), permission);

		try {
			ExoPlatformLocator.getPlatform().createTransaction(message.serialize(), null);
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		SocketDemoState state = (SocketDemoState) ExoPlatformLocator.getState();
		HashMap result = state.permissions;

		return Response.status(201).entity(result).build();
	}

	@GET
	@Path("/permissions")
	@Produces(MediaType.APPLICATION_JSON)
	public Response hasPermission(@QueryParam("userIdentifier") String userIdentifier, @QueryParam("permissionName") String permName) {
	    System.out.println("SAAAAAAAAAAAAAAAAAAASSSSSSSSSSSSUUUUUUUUUUUUUUUUKKKKKKKKKEEEEEEEEEE" + userIdentifier + permName);
	    Boolean result = false;
	    try {
			SocketDemoState state = (SocketDemoState) ExoPlatformLocator.getState();
			System.out.println("GOT STATE ----------------------------");
			result = state.hasPermissions(userIdentifier, permName);
			HashMap permissions = state.permissions;
			System.out.println(permissions);
			System.out.println("GOT PERMISSION ----------------------------");
			return Response.ok().entity(result).build();
		} catch(Throwable e) {
	    	System.out.println(e);
			return Response.ok().entity("ERROR").build();
		}
	}
}
