package com.txmq.socketdemo;

import com.txmq.exo.messaging.ExoTransactionType;

public class SocketDemoTransactionTypes extends ExoTransactionType {
	public static final String ADD_PERMISSION = "ADD_PERMISSION";
	public static final String REMOVE_PERMISSION = "REMOVE_PERMISSION";

	private static final String[] values = {
			ADD_PERMISSION,
			REMOVE_PERMISSION
	};
	
	public SocketDemoTransactionTypes() {
		super();
		if (getInitialized() == false) {
			initialize(values);
		}
	}
	
	public SocketDemoTransactionTypes(String transactionType) {
		super();
		if (getInitialized() == false) {
			initialize(values);
		}
		
		this.setValue(transactionType);
	}
}
