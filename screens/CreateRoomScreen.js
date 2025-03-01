import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
export default function CreateRoomScreen({ navigation }) {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");


const handleCreateRoom = async () => {
  if (!roomName.trim()) {
    setError("Room name cannot be empty");
    return;
  }
  setError("");

  try {
    const response = await axios.post("https://chat-api-k4vi.onrender.com/chat/rooms", {
      name: roomName,
    });

    console.log("Room Created:", response.data); // Debugging Log

    if (response.status === 200) {
      navigation.navigate("RoomsList");
    } else {
      setError("Failed to create room");
    }
  } catch (error) {
    console.error("Error creating room:", error);
    setError("Error creating room. Please try again.");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Chat Room</Text>
      <Text style={styles.subtitle}>
        Enter a unique name for your new chat room.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Room Name"
        value={roomName}
        onChangeText={setRoomName}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateRoom}
        disabled={!roomName.trim()}
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
    alignItems: "center",
    justifyContent: "center",
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
  input: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  createButton: {
    width: "90%",
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
