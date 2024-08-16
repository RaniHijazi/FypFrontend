import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, StyleSheet, TouchableOpacity, View, Image, LogBox } from 'react-native';
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
  'Failed to complete negotiation with the server: TypeError: Network request failed',
  'Failed to start the connection: Error: Failed to complete negotiation with the server: TypeError: Network request failed',
  'Warning: Error from HTTP request. TypeError: Network request failed'
]);
class SignalRService {
  constructor() {
    this.connection = null;
    this.notificationHandler = null;
    this.messageHandler = null;
  }

  start = async (messageHandler, notificationHandler) => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.log('SignalRService: User ID not found');
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(`http://192.168.1.140:7210/chatHub?userId=${userId}`, {
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log('SignalRService: SignalR Connected.');
      this.registerNotificationHandler(notificationHandler);
      this.registerMessageHandler(messageHandler); // Register message handler after connection starts
    } catch (err) {
      console.log('SignalRService: SignalR Connection Error:', err);
      ogBox.ignoreLogs([`SignalRService: SignalR Connection Error: ${err.message}`]);
      setTimeout(() => this.start(messageHandler, notificationHandler), 5000); // Retry connection after 5 seconds
    }

    this.connection.onclose(async () => {
      console.warn('SignalRService: Connection closed. Reconnecting...');
      await this.start(messageHandler, notificationHandler);
    });

    this.connection.onreconnecting((error) => {
      console.warn('SignalRService: Reconnecting...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalRService: Reconnected with connectionId:', connectionId);
    });
  };

  registerNotificationHandler = (handler) => {
    if (!this.connection) {
      console.log('SignalRService: Connection not established yet');
      return;
    }
    this.notificationHandler = handler;
    console.log('SignalRService: Notification handler registered');
    this.connection.on('ReceiveNotification', (message) => {
      console.log('SignalRService: Notification received:', message);
      if (this.notificationHandler) {
        console.log('SignalRService: Calling notification handler with message:', message);
        this.notificationHandler(message);
      } else {
        console.log('SignalRService: Notification handler is not set');
      }
    });
  };

  registerMessageHandler = (handler) => {
    if (!this.connection) {
      console.log('SignalRService: Connection not established yet');
      return;
    }
    this.messageHandler = handler;
    console.log('SignalRService: Message handler registered');
    this.connection.on('ReceiveMessage', (senderId, recipientId, messageContent, timestamp) => {
      const message = {
        content: messageContent,
        senderId: senderId,
        recipientId: recipientId,
        timestamp: new Date(timestamp)
      };
      console.log('SignalRService: Message received:', message);
      if (this.messageHandler) {
        console.log('SignalRService: Calling message handler with message:', message);
        this.messageHandler(message);
      } else {
        console.log('SignalRService: Message handler is not set');
      }
    });
  };

  sendMessage = async (recipientId, messageContent) => {
    if (!this.connection) {
      console.log('SignalRService: Connection not established yet');
      return;
    }
    const senderId = await AsyncStorage.getItem('userId');
    if (!senderId) {
      console.log('SignalRService: Sender ID not found');
      return;
    }
    try {
      await this.connection.invoke('SendMessage', parseInt(senderId), recipientId, messageContent);
      console.log(`SignalRService: Message sent from ${senderId} to ${recipientId} with content: ${messageContent}`);
    } catch (err) {
      console.log('SignalRService: SendMessage Error:', err);
    }
  };
}

const signalRService = new SignalRService();
export default signalRService;
