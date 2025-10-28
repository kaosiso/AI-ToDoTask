import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTodos } from "../context/TodoContext";

export default function AddTaskScreen() {
  const router = useRouter();
  const { addTodo } = useTodos();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Task title cannot be empty!");
      return;
    }
    addTodo(title, description);
    setTitle("");
    setDescription("");
    Keyboard.dismiss();
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 12 }}>
          Add New Task
        </Text>
      </View>

      {/* Inputs */}
      <TextInput
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
        style={{
          fontSize: 16,
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="Task Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          fontSize: 14,
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      {/* Add Button */}
      <TouchableOpacity
        onPress={handleAdd}
        style={{
          backgroundColor: "#4CAF50",
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Add Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
