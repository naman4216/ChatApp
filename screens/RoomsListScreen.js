import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";

export default function RoomsListScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "https://chat-api-k4vi.onrender.com/chat/rooms"
      );
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a Chat Room</Text>
      <Text style={styles.subtitle}>
        Select a room to start chatting with others.
      </Text>

      {rooms.length === 0 ? (
        <Text style={styles.noRooms}>No rooms available. Try refreshing.</Text>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.room}
              onPress={() => navigation.navigate("Chat", { roomId: item.id })}
            >
              <Text style={styles.roomName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.createRoomButton}
        onPress={() => navigation.navigate("CreateRoom")}
      >
        <Text style={styles.buttonText}>Create Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  noRooms: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
  room: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  createRoomButton: {
    marginBottom: 20,
    backgroundColor: "#262626",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
