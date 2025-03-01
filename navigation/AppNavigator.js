import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SetUsernameScreen from '../screens/SetUsernameScreen';
import RoomsListScreen from '../screens/RoomsListScreen';
import CreateRoomScreen from '../screens/CreateRoomScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SetUsername" component={SetUsernameScreen} />
        <Stack.Screen name="RoomsList" component={RoomsListScreen} />
        <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
