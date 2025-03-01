import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";

export default function SetUsernameScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSetUsername = async () => {
    setError(""); // Clear previous errors
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        "https://chat-api-k4vi.onrender.com/chat/username",
        { username }
      );

      if (response.status === 200 && response.data.username) {
        navigation.navigate("RoomsList");
      } else {
        setError("Failed to set username. Try again.");
      }
    } catch (error) {
      console.error("Error setting username:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ChatApp</Text>
      <Text style={styles.subtitle}>Set a unique username to start chatting</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.button} onPress={handleSetUsername}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#262626",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
