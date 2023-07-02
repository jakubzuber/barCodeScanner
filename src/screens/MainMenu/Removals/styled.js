import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        marginTop: 40,
    },
    text: {
        fontSize: 15,
        color: 'white',
        maxWidth: 250,
        padding: 1,
    },
    topic: {
        fontSize: 30,
        fontWeight: '600',
        marginBottom: 20
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
});