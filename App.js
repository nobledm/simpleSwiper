import React from "react";
import { View } from "react-native";
import Swiper from "./Swiper";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 70 }}></View>

      <View style={{ flex: 1 }}>
        <Swiper />
      </View>

      <View style={{ height: 40 }}></View>
    </View>
  );
}
