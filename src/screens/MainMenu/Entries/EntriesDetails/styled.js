import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        marginTop: 30,
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
        marginBottom: 20
    },
    viewContainer: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#1b6bd3',
        width: 300,
        borderRadius: '3px solid',
        marginTop: 10,
        padding: 8,
        justifyContent: 'space-between'
    },  
});