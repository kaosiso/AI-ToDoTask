import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Checkbox from "expo-checkbox";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTodos } from "../context/TodoContext";

export default function TaskListScreen() {
  const router = useRouter();
  const { todos, toggleTodo, deleteTodo, addTodo } = useTodos();
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // Start recording
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission required", "Microphone access needed");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  // Stop recording + send to Whisper backend
  const stopRecording = async () => {
    try {
      setIsListening(false);
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) return;

      // Send audio file to your backend
      const formData = new FormData();
      formData.append("audio", {
        uri,
        name: "recording.wav",
        type: "audio/wav",
      } as any);

      const response = await fetch("http://192.168.1.182:3000/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.text) {
        const tasks = data.text
          .split(/(?:,| and )/i)
          .map((t: string) => t.trim())
          .filter(Boolean);

        tasks.forEach((task: string) => addTodo(task, "Added via voice"));
        Alert.alert("Voice Input", `Added ${tasks.length} task(s)!`);
      } else {
        Alert.alert("Error", "No text returned from transcription");
      }

      // Safely delete the audio file (no deprecation warning)
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        await FileSystem.deleteAsync(uri);
      }
    } catch (err) {
      console.error("Transcription error:", err);
      Alert.alert("Error", "Failed to transcribe audio");
    }
  };

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "#f5f5f5",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        <Ionicons name="menu-outline" size={28} color="#333" />
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>
          My ToDo List
        </Text>
        <TouchableOpacity onPress={() => router.push("/add-task")}>
          <Ionicons name="add-circle-outline" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f1f1f1",
          marginHorizontal: 20,
          marginTop: 12,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search todos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ flex: 1, fontSize: 16, color: "#333" }}
          placeholderTextColor="#aaa"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* ToDo List */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 50,
              color: "#999",
              fontSize: 16,
            }}
          >
            No tasks found.
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#f9f9f9",
              borderRadius: 12,
              padding: 15,
              marginVertical: 6,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Checkbox
                value={item.completed}
                onValueChange={() => toggleTodo(item.id)}
                color={item.completed ? "#4CAF50" : undefined}
                style={{ marginRight: 12 }}
              />
              <View style={{ flexShrink: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textDecorationLine: item.completed
                      ? "line-through"
                      : "none",
                    color: item.completed ? "#888" : "#000",
                  }}
                >
                  {item.title}
                </Text>
                <Text style={{ color: "#666", fontSize: 13, marginTop: 3 }}>
                  {item.description}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#e53935" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 🎤 Floating Action Button */}
      <TouchableOpacity
        onPress={isListening ? stopRecording : startRecording}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: isListening ? "#E91E63" : "#4CAF50",
          borderRadius: 30,
          width: 60,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
        }}
      >
        <Ionicons
          name={isListening ? "mic" : "mic-outline"}
          size={28}
          color="#fff"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
