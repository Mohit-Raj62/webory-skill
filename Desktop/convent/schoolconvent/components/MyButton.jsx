import { StyleSheet, TouchableOpacity, Text } from 'react-native'

const MyButton = ({ title, onPress, buttonColor, textColor }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.button,
        buttonColor ? { backgroundColor: buttonColor } : null
      ]}
      onPress={onPress}>
      <Text 
        style={[
          styles.text,
          textColor ? { color: textColor } : null
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
};

export default MyButton;

// style code
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ffcc00",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    margin: 10,
  },
  text: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  }
});