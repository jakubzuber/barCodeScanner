import { useState, useEffect } from "react";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, StyleSheet, Text, View } from "react-native";

const barCodeScanner = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet scanned');

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status == 'granted')
        })()
    };

    const handleBarCodeScanner = ({ type, data }) => {
        setScanned(true)
        setText(data)
        console.log('Type: ' + type + '\nData: ' + data)
    };

    useEffect(() => {
        askForCameraPermission();
    }, []);

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requestion for campra permission</Text>
            </View>
        )
    };

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>No acces to camera</Text>
                <Button title={"Allow Camera"} onPress={() => askForCameraPermission()} ></Button>
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.barCodeBox} >
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanner}
                style={{height: 400, width: 400}} />
            </View>
            <Text style={styles.container}>{data}</Text>

            {scanned && <Button title={"Scan again?"} onPress={() => setScanned(false)} color='tomato' />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    barCodeBox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: "hidden",
        borderRadius: 30,
        backgroundColor: 'tomato',
    },
    mainText: {
        fontSize: 16,
        margin: 20,
    }
});

export default barCodeScanner;