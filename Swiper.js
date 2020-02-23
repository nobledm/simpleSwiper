import React, { useState } from "react";
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  Animated,
  PanResponder
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "./components/Button";
import Data from "./data.json";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.375 * SCREEN_WIDTH;
const OUT_DURATION = 400;
const BASE_IMG_URI = "http://dbergeron2.dmitstudent.ca/img/";

export default function Swiper() {
  const position = new Animated.ValueXY();

  const [homes, setHomes] = useState(Data);
  const [currentIndex, setIndex] = useState(0);
  const [liked, setLiked] = useState(0);
  const [discarded, setDiscarded] = useState(0);

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp"
  });

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
      direction === "left"
        ? swipedLeft(homes[currentIndex])
        : swipedRight(homes[currentIndex]);

      setIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const swipedLeft = listing => {
    console.log(`Discarded #${listing.mls} (Total: ${discarded + 1})`);

    setDiscarded(discarded + 1);
  };

  const swipedRight = listing => {
    console.log(`Liked #${listing.mls} (Total: ${liked + 1})`);

    setLiked(liked + 1);
  };

  if (homes) {
    return (
      <View style={styles.swiperBoundary}>
        <View style={styles.cardContainer}>
          {homes
            .map((listing, i) => {
              if (i < currentIndex) {
                return null;
              } else if (i == currentIndex) {
                return (
                  <Animated.View
                    {...panResponder.panHandlers}
                    key={listing.mls}
                    style={[
                      styles.cards,
                      {
                        transform: [
                          { rotate: rotate },
                          ...position.getTranslateTransform()
                        ]
                      }
                    ]}
                  >
                    <ImageBackground
                      imageStyle={{ borderRadius: 10, resizeMode: "cover" }}
                      style={styles.imageBg}
                      source={{
                        uri: BASE_IMG_URI + listing.images[0].split("/")[2]
                      }}
                    >
                      <Animated.View
                        style={[
                          styles.actionOverlayColor,
                          {
                            opacity: likeOpacity,
                            right: -10
                          }
                        ]}
                      >
                        <LinearGradient
                          start={[0.0, 0.5]}
                          end={[1.0, 0.5]}
                          locations={[0.0, 1.0]}
                          colors={["transparent", "rgba(18,167,101,1)"]}
                          style={{
                            flex: 1
                          }}
                        />
                      </Animated.View>

                      <Animated.View
                        style={[
                          styles.actionOverlayColor,
                          {
                            opacity: dislikeOpacity,
                            left: -10
                          }
                        ]}
                      >
                        <LinearGradient
                          start={[0.0, 0.5]}
                          end={[1.0, 0.5]}
                          locations={[0.0, 1.0]}
                          colors={["rgba(243,81,81,1)", "transparent"]}
                          style={{
                            flex: 1
                          }}
                        />
                      </Animated.View>

                      <View style={styles.label}>
                        <Text style={styles.community}>
                          {listing.community}
                        </Text>

                        <View style={styles.listingHighlights}>
                          <View style={styles.detail}>
                            <FontAwesome name="star-o" size={20} />
                            <Text
                              style={{ fontSize: 20 }}
                            >{`${listing.beds}`}</Text>
                          </View>

                          <View style={styles.detail}>
                            <FontAwesome name="star-o" size={20} />
                            <Text
                              style={{ fontSize: 20 }}
                            >{`${listing.bath}`}</Text>
                          </View>

                          <View style={styles.detail}>
                            <FontAwesome name="star-o" size={20} />
                            <Text
                              style={{ fontSize: 20 }}
                            >{`${listing.sqft}`}</Text>
                          </View>
                        </View>
                      </View>
                    </ImageBackground>
                  </Animated.View>
                );
              } else {
                return (
                  // The cards stacked below
                  <Animated.View
                    key={listing.mls}
                    style={[
                      styles.cards,
                      { transform: [{ scale: nextCardScale }] }
                    ]}
                  >
                    <ImageBackground
                      imageStyle={{ borderRadius: 10, resizeMode: "cover" }}
                      source={{
                        uri: BASE_IMG_URI + listing.images[0].split("/")[2]
                      }}
                      style={styles.imageBg}
                    >
                      <View style={styles.label}>
                        <Text style={styles.community}>
                          {listing.community}
                        </Text>

                        <View style={styles.listingHighlights}>
                          <View style={styles.detail}>
                            <FontAwesome name="star-o" size={20} />
                            <Text
                              style={{ fontSize: 20 }}
                            >{`${listing.beds}`}</Text>
                          </View>

                          <View style={styles.detail}>
                            <FontAwesome name="star-o" size={20} />
                            <Text
                              style={{ fontSize: 20 }}
                            >{`${listing.bath}`}</Text>
                          </View>

                          <View style={styles.detail}>
                            <FontAwesome name="star-o" size={20} />
                            <Text
                              style={{ fontSize: 20 }}
                            >{`${listing.sqft}`}</Text>
                          </View>
                        </View>
                      </View>
                    </ImageBackground>
                  </Animated.View>
                );
              }
            })
            .reverse()}
        </View>

        <View style={styles.btnContainer}>
          <Button
            text={<FontAwesome name="remove" size={48} />}
            fontSize={62}
            width="30%"
            bgColor="#F35151"
            onClick={() => forceSwipe("left")}
          />

          <Button
            text={<FontAwesome name="undo" size={48} />}
            fontSize={62}
            width="30%"
            bgColor="#FFC700"
            onClick={() => null}
          />

          <Button
            text={<FontAwesome name="check" size={48} />}
            fontSize={62}
            width="30%"
            onClick={() => forceSwipe("right")}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  swiperBoundary: {
    height: "100%"
  },
  cardContainer: {
    flex: 1
  },
  cards: {
    height: "100%",
    width: SCREEN_WIDTH,
    padding: 10,
    position: "absolute"
  },
  imageBg: {
    flex: 1
  },
  actionOverlayColor: {
    position: "absolute",
    zIndex: 1000,
    top: -SCREEN_HEIGHT / 4,
    height: SCREEN_HEIGHT * 1.5,
    width: "95%"
  },
  actionText: {
    borderWidth: 1,
    fontSize: 32,
    fontWeight: "bold",
    padding: 10
  },
  label: {
    position: "absolute",
    bottom: "3%",
    alignItems: "flex-start",
    alignSelf: "center",
    paddingHorizontal: 7,
    paddingBottom: 5,
    width: "93%",
    borderRadius: 10,
    backgroundColor: "#fff"
  },
  listingHighlights: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between"
  },
  community: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 36
  },
  detail: {
    width: "30%",
    flexDirection: "row"
  },
  btnContainer: {
    height: 80,
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  }
};
