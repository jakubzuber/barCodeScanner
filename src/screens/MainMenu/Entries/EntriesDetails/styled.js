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
        maxWidth: 300,
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
        borderRadius: '3px solid',
        marginTop: 10,
        width: 300,
        padding: 8,
        justifyContent: 'space-between'
    },
    container: {
        backgroundColor: '#fff',
    },
    barCodeBox: {
        height: 300,
        width: 350,
        overflow: "hidden",
        borderRadius: 20,
        backgroundColor: 'tomato',
    },
    mainText: {
        fontSize: 16,
        margin: 20,
    }
});
