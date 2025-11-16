import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

type Props = {
  type: "email" | "sms" | "website";
};

export default function DifficultyDropdown({ type }: Props) {
  const [open, setOpen] = useState(false);

  // Difficulty levels
  const levels = [
    {
      key: "easy",
      name: "Easy",
      desc: "Basic phishing examples",
      bg: "#E8F5E9",
      border: "#4CAF50",
      color: "#2E7D32",
    },
    {
      key: "medium",
      name: "Medium",
      desc: "Moderate, tricky phishing attempts",
      bg: "#FFFDE7",
      border: "#FFB300",
      color: "#F57F17",
    },
    {
      key: "hard",
      name: "Hard",
      desc: "Advanced spear-phishing samples",
      bg: "#FFEBEE",
      border: "#D32F2F",
      color: "#C62828",
    },
  ];

  // ⭐ ROUTING FUNCTION
  const goToGame = (level: string) => {
  if (type === "email") {
    router.push(`/modules/games/email/${level}` as any);
  } 
  else if (type === "sms") {
    router.push(`/modules/games/sms/${level}` as any);
  } 
  else {
    router.push(`/modules/games/website/${level}` as any);
  }
};


  return (
    <View style={{ marginTop: 14 }}>

      {/* Header (click to open) */}
      <Pressable
        onPress={() => setOpen(!open)}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 10,
          backgroundColor: "#fff",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Select Difficulty
        </Text>
        <Text style={{ fontSize: 18 }}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      {/* Levels */}
      {open && (
        <View style={{ marginTop: 10, gap: 12 }}>
          {levels.map((lvl) => (
            <Pressable
              key={lvl.key}
              onPress={() => goToGame(lvl.key)}
              style={{
                backgroundColor: lvl.bg,
                padding: 16,
                borderRadius: 12,
                borderLeftWidth: 6,
                borderLeftColor: lvl.border,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "700",
                  color: lvl.color,
                }}
              >
                {lvl.name}
              </Text>
              <Text style={{ fontSize: 12, color: "#555" }}>{lvl.desc}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
