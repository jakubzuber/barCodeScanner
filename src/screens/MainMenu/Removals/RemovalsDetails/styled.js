import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
    text: {
        fontSize: 10,
        color: 'white',
        maxWidth: 170,
        padding: 1,
    },
    topic: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 5,
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
        textAlign: 'center',
        padding: 20
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
    barCodeInfo: {
        backgroundColor: '#fff',
        textAlign: 'center',
        padding: 2,
        fontSize: 18
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
    }
});
