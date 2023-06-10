import { Text, StyleSheet, Pressable } from "react-native";

const CustomButton = ({ onPress, text, type="PRIMARY" }) => {

    return (
        <Pressable onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
            <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
    },

    container_PRIMARY: {
        backgroundColor: '#296ff0',
    },

    container_TERTIARY: {},
    text_TERTIARY: {
        color: '#949292'
    }
})

export default CustomButton;