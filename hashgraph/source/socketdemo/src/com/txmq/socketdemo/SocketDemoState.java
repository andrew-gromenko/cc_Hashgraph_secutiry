package com.txmq.socketdemo;

/*
 * This file is public domain.
 *
 * SWIRLDS MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF 
 * THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE, OR NON-INFRINGEMENT. SWIRLDS SHALL NOT BE LIABLE FOR 
 * ANY DAMAGES SUFFERED AS A RESULT OF USING, MODIFYING OR 
 * DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
 */

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;

import com.swirlds.platform.Address;
import com.swirlds.platform.AddressBook;
import com.swirlds.platform.FCDataInputStream;
import com.swirlds.platform.FCDataOutputStream;
import com.swirlds.platform.FastCopyable;
import com.swirlds.platform.Platform;
import com.swirlds.platform.SwirldState;
import com.txmq.exo.core.ExoState;


/**
 * This holds the current state of the swirld. For this simple "hello swirld" code, each transaction is just
 * a string, and the state is just a list of the strings in all the transactions handled so far, in the
 * order that they were handled.
 */
public class SocketDemoState extends ExoState implements SwirldState {
	public HashMap<String, ArrayList<String>> permissions = new HashMap <>();

	public boolean hasPermissions(String userIdentifier, String permName) {
	    System.out.println("ARGUMENTS: " + userIdentifier + permName);
		ArrayList<String> permArr = permissions.getOrDefault(userIdentifier, new ArrayList<>());
		System.out.println("PERMISSIONS: " + permArr);
		return permArr.contains(permName);
	}

	public void addPermissions(String userIdentifier, String permName) {
	    System.out.println("ADD PERMISSION" + userIdentifier + permName);
		ArrayList<String> permArr = permissions.getOrDefault(userIdentifier, new ArrayList<>());
		permArr.add(permName);
        permissions.put(userIdentifier, permArr);
		System.out.println("PERMISSION AFTER ADDITION: " + this.permissions + permArr);
	}
	public void removePermissions(String userIdentifier, String permName) {
		ArrayList<String> permArr = permissions.getOrDefault(userIdentifier, new ArrayList<>());
		permArr.remove(permName);
		permissions.put(userIdentifier, permArr);
        System.out.println("PERMISSION AFTER REMOVE: " + this.permissions + permArr);
	}

	// ///////////////////////////////////////////////////////////////////

	@Override
	public synchronized AddressBook getAddressBookCopy() {
		return addressBook.copy();
	}

	@Override
	public synchronized FastCopyable copy() {
		SocketDemoState copy = new SocketDemoState();
		copy.copyFrom(this);
		return copy;
	}

	@Override
	public void copyTo(FCDataOutputStream outStream) {
		/*
		try {
			Utilities.writeStringArray(outStream,
					strings.toArray(new String[0]));
		} catch (IOException e) {
			e.printStackTrace();
		}*/
	}

	@Override
	public void copyFrom(FCDataInputStream inStream) {
		/*
		try {
			strings = new ArrayList<String>(
					Arrays.asList(Utilities.readStringArray(inStream)));
		} catch (IOException e) {
			e.printStackTrace();
		}
		*/
	}

	@Override
	public synchronized void copyFrom(SwirldState old) {
		super.copyFrom(old);
		permissions = (HashMap<String, ArrayList<String>>) ((SocketDemoState) old).permissions.clone();
	}

	@Override
	public synchronized void handleTransaction(long id, boolean consensus,
			Instant timeCreated, byte[] transaction, Address address) {
		
		super.handleTransaction(id, consensus, timeCreated, transaction, address);		
	}

	@Override
	public void noMoreTransactions() {
	}

	@Override
	public synchronized void init(Platform platform, AddressBook addressBook) {
		super.init(platform, addressBook);
	}
}	