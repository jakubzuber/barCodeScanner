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
    barCodeInfo: {
        backgroundColor: '#fff',
        textAlign: 'center',
        padding: 5,
        fontSize: 20
    },
    plusMinusContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    plusText: {
        fontSize: 45,
        marginHorizontal: 15, 
        color: '#09ec28',
        height: '100%'
    },
    minusText: {
        fontSize: 45,
        color: '#eb0a0a',
        height: '100%'
    },
    textDetails: {
        fontSize: 11,
        color: 'white',
        maxWidth: 170,
        padding: 1,
    },
});