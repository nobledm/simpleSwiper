import React from "react";
import { TouchableOpacity, Text } from "react-native";

const Button = ({
  onClick,
  text,
  bgColor = "#12a765",
  textColor = "#fff",
  fontSize = 20,
  width = "auto",
  type = "primary",
  centered = false,
  disabled = false
}) => {
  if (type == "secondary") {
    bgColor = bgColor != "#12a765" ? bgColor : "grey";
  }

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: bgColor,
          width: width,
          alignSelf: centered ? "center" : "auto"
        }
      ]}
      onPress={onClick}
      disabled={disabled}
    >
      <Text
        style={[
          styles.btnText,
          {
            color: textColor,
            fontSize: fontSize,
            alignSelf: centered ? "center" : "auto"
          }
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  btn: {
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16
  },
  btnText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 24
  }
};

export { Button };
