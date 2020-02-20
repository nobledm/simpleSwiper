import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  PanResponder
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.3 * SCREEN_WIDTH;
const OUT_DURATION = 250;

const Users = [
  { id: "1", uri: require("./assets/1.jpg") },
  { id: "2", uri: require("./assets/2.jpg") },
  { id: "3", uri: require("./assets/3.jpg") },
  { id: "4", uri: require("./assets/4.jpg") },
  { id: "5", uri: require("./assets/5.jpg") }
];

export default function App() {
  const position = new Animated.ValueXY();
  const [currentIndex, setIndex] = useState(0);

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp"
  });

  const rotateAndTranslate = {
    transform: [{ rotate: rotate }, ...position.getTranslateTransform()]
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 1],
    extrapolate: "clamp"
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: "clamp"
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: "clamp"
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: "clamp"
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (e, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe("right");
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe("left");
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4
        }).start();
      }
    }
  });

  const forceSwipe = direction => {
    const x = direction === "right" ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;

    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: OUT_DURATION
    }).start(() => {
      setIndex(currentIndex + 1);
      () => {
        position.setValue({ x: 0, y: 0 });
      };
    });
  };

  const renderListings = () => {
    return Users.map((item, i) => {
      if (i < currentIndex) {
        return null;
      } else if (i == currentIndex) {
        return (
          <Animated.View
            {...panResponder.panHandlers}
            key={item.id}
            style={[styles.cards, rotateAndTranslate]}
          >
            <Animated.View
              style={[
                styles.actionTextContainer,
                {
                  opacity: likeOpacity,
                  left: 40,
                  transform: [{ rotate: "-30deg" }]
                }
              ]}
            >
              <Text
                style={[
                  styles.actionText,
                  {
                    borderColor: "green",
                    color: "green"
                  }
                ]}
              >
                LIKE
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.actionTextContainer,
                {
                  opacity: dislikeOpacity,
                  right: 25,
                  transform: [{ rotate: "30deg" }]
                }
              ]}
            >
              <Text
                style={[
                  styles.actionText,
                  {
                    borderColor: "red",
                    color: "red"
                  }
                ]}
              >
                DISCARD
              </Text>
            </Animated.View>

            <Image style={styles.imageBg} source={item.uri} />
          </Animated.View>
        );
      } else {
        return (
          // The cards stacked below
          <Animated.View
            key={item.id}
            style={[
              styles.cards,
              {
                opacity: nextCardOpacity,
                transform: [{ scale: nextCardScale }]
              }
            ]}
          >
            <Image style={styles.imageBg} source={item.uri} />
          </Animated.View>
        );
      }
    }).reverse();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60 }}></View>
      <View style={{ flex: 1 }}>{renderListings()}</View>
      <View style={{ height: 60 }}></View>
    </View>
  );
}

const styles = {
  cards: {
    height: SCREEN_HEIGHT - 120,
    width: SCREEN_WIDTH,
    padding: 10,
    position: "absolute"
  },
  imageBg: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: "cover",
    borderRadius: 20
  },
  actionTextContainer: {
    position: "absolute",
    top: 50,
    zIndex: 1000
  },
  actionText: {
    borderWidth: 1,
    fontSize: 32,
    fontWeight: "bold",
    padding: 10
  }
};
