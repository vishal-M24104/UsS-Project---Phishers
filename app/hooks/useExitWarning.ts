import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";

export default function useExitWarning(exitPath: string) {
  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert(
        "Exit?",
        "Your progress will be lost.",
        [
          { text: "Stay", style: "cancel" },
          {
            text: "Exit",
            style: "destructive",
            onPress: () => {
              router.dismissAll();
              router.replace(exitPath);  // ⬅ FIX: clears old stack
            },
          },
        ]
      );
      return true; // block default back
    });

    return () => handler.remove();
  }, [exitPath]);
}
