import { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://prosva-backend-11.onrender.com");

type Ride = {
  _id: string;
  status: string;
};

export default function RideScreen() {
  const [rides, setRides] = useState<Ride[]>([]);

  const fetchRides = async () => {
    try {
      const res = await axios.get(
        "https://prosva-backend-11.onrender.com/api/rides/available"
      );
      setRides(res.data);
    } catch (err: any) {
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  const acceptRide = async (rideId: string) => {
    try {
      const res = await axios.put(
        `https://prosva-backend-11.onrender.com/api/rides/accept/${rideId}`
      );

      console.log("ACCEPTED:", res.data);
    } catch (err: any) {
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchRides();

    // 🚖 join drivers room
    socket.emit("joinDrivers");

    // 🔔 listen for new ride
    socket.on("newRide", (ride: Ride) => {
      console.log("NEW RIDE:", ride);

      setRides((prev) => [ride, ...prev]);
    });

    // 🔄 listen for ride updates
    socket.on("rideUpdated", (updatedRide: Ride) => {
      setRides((prev) =>
        prev.map((r) =>
          r._id === updatedRide._id ? updatedRide : r
        )
      );
    });

    return () => {
      socket.off("newRide");
      socket.off("rideUpdated");
    };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        🚖 Live Rides
      </Text>

      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              marginTop: 10,
              borderWidth: 1,
              borderRadius: 8
            }}
          >
            <Text>Ride ID: {item._id}</Text>
            <Text>Status: {item.status}</Text>

            {item.status === "pending" && (
              <Button
                title="Accept Ride 🚗"
                onPress={() => acceptRide(item._id)}
              />
            )}
          </View>
        )}
      />
    </View>
  );
}