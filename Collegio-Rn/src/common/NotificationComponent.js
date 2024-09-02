// NotificationComponent.js
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import SignalRService from './SignalRService';

const NotificationComponent = () => {
    useEffect(() => {
        // Optionally start the connection if not started in the constructor
        SignalRService.connection.start()
            .then(() => console.log('SignalR connected in NotificationComponent'))
            .catch(err => console.log('Error connecting to SignalR in NotificationComponent', err));

        return () => {
            SignalRService.connection.stop()
                .then(() => console.log('SignalR disconnected in NotificationComponent'))
                .catch(err => console.log('Error disconnecting SignalR in NotificationComponent', err));
        };
    }, []);

    const sendTestNotification = () => {
        const recipientId = '123'; // Replace with actual recipient ID
        const notificationMessage = 'This is a test notification';
        SignalRService.sendNotification(recipientId, notificationMessage);
    };

    return (
            <View style={styles.container}>
                <Text style={styles.title}>Notification Component</Text>
                <Button
                    title="Send Test Notification"
                    onPress={sendTestNotification}
                    color="#841584"
                />
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#841584',
        borderRadius: 5,
    },
});

export default NotificationComponent;