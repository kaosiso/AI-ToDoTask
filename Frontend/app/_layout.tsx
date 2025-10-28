import { Stack } from "expo-router";
import { TodoProvider } from "../context/TodoContext";

export default function Layout() {
  return (
    <TodoProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TodoProvider>
  );
}
