import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        marginTop: 40
    },
    text: {
        fontSize: 15,
        color: 'white',
        maxWidth: 250,
        padding: 1,
    },
    topic: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
    },
    viewContainer: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#1b6bd3',
        borderRadius: 10,
        marginTop: 10,
        width: 330,
        padding: 8,
        justifyContent: 'space-between'
    },
    container: {
        backgroundColor: '#fff',
        textAlign: 'center'
    },
    barCodeBox: {
        height: 200,
        width: 350,
        overflow: "hidden",
        borderRadius: 20,
        backgroundColor: 'tomato',
    },
    mainText: {
        fontSize: 16,
        margin: 20,
    },
});
