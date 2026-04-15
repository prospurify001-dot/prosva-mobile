import { View, Text, Button, Alert } from "react-native";
import axios from "axios";

export default function HomeScreen() {
  const requestRide = async () => {
    console.log("BUTTON CLICKED 🚗");

    try {
      const res = await axios.post(
        "https://prosva-backend-3.onrender.com/api/rides/request",
        {
          pickupLat: 9.0579,
          pickupLng: 7.4951,
        }
      );

      console.log("SUCCESS:", res.data);
      Alert.alert("Success 🚗", "Ride requested successfully!");
    } catch (error: any) {
      console.log("ERROR:", error?.response?.data || error.message);
      Alert.alert("Error", "Failed to request ride");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Prosva Home 🚗
      </Text>

      <Button title="Request Ride" onPress={requestRide} />
    </View>
  );
}