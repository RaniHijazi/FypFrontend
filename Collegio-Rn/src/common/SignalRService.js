import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SignalRService {
  constructor() {
    this.connection = null;
    this.notificationHandler = null;
  }

  start = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.log('SignalRService: User ID not found');
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(`http://172.20.10.3:7210/chatHub?userId=${userId}`, {
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .build();

    try {
      await this.connection.start();
      console.log('SignalRService: SignalR Connected.');
      this.registerNotificationHandler();
    } catch (err) {
      console.log('SignalRService: SignalR Connection Error:', err);
      setTimeout(this.start, 5000); // Retry connection after 5 seconds
    }

    this.connection.onclose(async () => {
      await this.start();
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
}

const signalRService = new SignalRService();
export default signalRService;
