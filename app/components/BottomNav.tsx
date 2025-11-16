import { View, Text, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const active = (path: string) => pathname.startsWith(path);

  return (
    <View
      style={{
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#EEE",
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: "white",
      }}
    >
      {/* HOME */}
      <Pressable
        onPress={() => router.replace("/home")}
        style={{ flex: 1, alignItems: "center" }}
      >
        <Text style={{ fontSize: 24 }}>🏠</Text>
        <Text
          style={{
            fontSize: 12,
            color: active("/home") ? "#5B5FEF" : "#999",
            fontWeight: active("/home") ? "600" : "400",
          }}
        >
          Home
        </Text>
      </Pressable>

      {/* MODULES */}
      <Pressable
        onPress={() => router.replace("/modules")}
        style={{ flex: 1, alignItems: "center" }}
      >
        <Text style={{ fontSize: 24 }}>📚</Text>
        <Text
          style={{
            fontSize: 12,
            color: active("/modules") ? "#5B5FEF" : "#999",
            fontWeight: active("/modules") ? "600" : "400",
          }}
        >
          Modules
        </Text>
      </Pressable>

      {/* PROFILE */}
      <Pressable
        onPress={() => router.replace("/profile")}
        style={{ flex: 1, alignItems: "center" }}
      >
        <Text style={{ fontSize: 24 }}>👤</Text>
        <Text
          style={{
            fontSize: 12,
            color: active("/profile") ? "#5B5FEF" : "#999",
            fontWeight: active("/profile") ? "600" : "400",
          }}
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
}
