import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import io from "socket.io-client";

export default function ChatScreen({ route }) {
  const { roomId } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = io("https://chat-api-k4vi.onrender.com");
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    socket.emit("joinRoom", { roomId, username: "You" }); // Send username
  
    // Listen for join/leave notifications
    socket.on("roomNotification", (msg) => {
      console.log("Room Notification:", msg);
      setMessages((prev) => [...prev, { content: msg, isSystem: true }]); // Mark as system message
    });
  
    socket.on("message", (msg) => {
      console.log("Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });
  
    fetch(`https://chat-api-k4vi.onrender.com/chat/rooms/${roomId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  
    return () => {
      socket.emit("leaveRoom", { roomId, username: "You" }); // Notify others
      socket.disconnect();
    };
  }, []);

  
  useEffect(() => {
    fetch(`https://chat-api-k4vi.onrender.com/chat/rooms/${roomId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Full Messages Data:", JSON.stringify(data, null, 2));
  
        if (data.length > 0 && data[0].user_id && data[0].user_id !== 0) {
          setUserId(data[0].user_id);
        } else {
          console.error("User ID not found in messages data");
        }
  
        setMessages(data);
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);
  

  useEffect(() => {

    socket.emit("joinRoom", { roomId });

    socket.on("message", (msg) => {
      console.log("Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    fetch(`https://chat-api-k4vi.onrender.com/chat/rooms/${roomId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        content: message, // API expects "content", not "text"
        room_id: roomId,  // Sending room_id as required
        username: "You",  // Assuming sender's name (you can replace this dynamically)
        user_id: 1,       // Replace with actual user_id from auth
      };
  
      socket.emit("sendMessage", newMessage); // Ensure event name matches API
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...newMessage, isUser: true }, // Add to UI instantly
      ]);
  
      setMessage(""); // Clear input field
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <Text style={styles.header}>Chat Room: {roomId}</Text>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.user_id === 1 ? styles.userMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#000"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#262626",
    color: "#fff",
    textAlign: "center",
  },

  chatContainer: { flexGrow: 1, padding: 10 },

  messageBubble: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "75%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#000",
    borderTopRightRadius: 0,
  },
  userMessageText: { color: "#fff", fontSize: 16 },
  messageText: { color: "#fff", fontSize: 16 },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#000",
    borderRadius: 10,
    borderTopLeftRadius: 0,
  },

  receivedMessageText: {
    color: "#000", fontSize: 16
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#fff",
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#262626",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: { color: "#fff", fontSize: 16 },
});
