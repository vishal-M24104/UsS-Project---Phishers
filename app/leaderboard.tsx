import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLeaderboard } from "../app/services/scoreApi";

export default function Leaderboard() {
  const [list, setList] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await getLeaderboard();
      if (res.success) setList(res.leaderboard);
    }
    load();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Leaderboard 🏆</Text>

        {list.map((u, idx) => (
          <View
            key={u.id}
            style={[
              styles.card,
              idx === 0 && styles.topCard,
            ]}
          >
            <View style={styles.left}>
              <Text style={[styles.rank, idx === 0 && styles.topRank]}>
                {idx + 1}
              </Text>

              <View style={{ maxWidth: "70%" }}>
                <Text style={[styles.name, idx === 0 && styles.topName]}>
                  {u.name || "Unknown User"}
                </Text>
                <Text 
                  style={styles.email}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {u.email}
                </Text>
              </View>
            </View>

            <Text style={[styles.points, idx === 0 && styles.topPoints]}>
              {u.total}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "white",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },

  title: {
    fontSize: width * 0.065, // responsive
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "#F7F7FB",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  topCard: {
    backgroundColor: "#EDEAFF",
    borderWidth: 1,
    borderColor: "#5B5FEF",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "75%",
  },

  rank: {
    fontSize: width * 0.06,
    fontWeight: "700",
    width: 40,
    color: "#666",
  },

  topRank: {
    color: "#5B5FEF",
  },

  name: {
    fontSize: width * 0.045,
    fontWeight: "600",
  },

  topName: { color: "#5B5FEF" },

  email: {
    fontSize: width * 0.032,
    color: "#777",
  },

  points: {
    fontSize: width * 0.055,
    fontWeight: "700",
    color: "#333",
  },

  topPoints: {
    color: "#5B5FEF",
    fontSize: width * 0.065,
  },
});
