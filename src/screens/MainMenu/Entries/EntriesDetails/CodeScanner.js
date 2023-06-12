import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, View, Text } from "react-native";
import { useState, useEffect } from 'react';
import CustomButton from '../../../../components/CustomButton/CustomButton';
import { styles } from './styled';

const CodeScanner = () => {
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
                    style={{ height: 200, width: 350, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    {scanned && <CustomButton text={"Skanuj"} type="SCAN" onPress={() => setScanned(false)} />}
                </BarCodeScanner>
            </View>
            <Text style={styles.container}>{text}</Text>
        </View>
    );
};

export default CodeScanner;