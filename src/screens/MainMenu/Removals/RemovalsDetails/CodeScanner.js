import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, View, Text } from "react-native";
import { useState, useEffect } from 'react';
import CustomButton from '../../../../components/CustomButton/CustomButton';
import { styles } from './styled';
import { useSelector } from 'react-redux';
import { selectCollection } from './collectionSlice';

const CodeScanner = ({ definePallet, removalDetails, klientId, klientName }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(true);
    const [text, setText] = useState('Zeskanuj paletę');
    const [isPalletScanned, setIsPalletScanned] = useState(false)

    const { collection } = useSelector(selectCollection);

    //permissions 

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

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status == 'granted')
        })()
    };

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>No acces to camera</Text>
                <Button title={"Allow Camera"} onPress={() => askForCameraPermission()} ></Button>
            </View>
        )
    };

    const handleBarCodeScanner = async ({ data }) => {
       console.log(data)
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
            <View>
                <Text style={styles.barCodeInfo}>Kieruj się do:</Text>
                <Text style={styles.barCodeInfo}>{collection[0].placeOpis}</Text>
                {isPalletScanned && <CustomButton text={"Skanuj na inną paletę"} type='INFO' onPress={() => scanNewPallet()} />}
            </View>
        </View>
    );
};

export default CodeScanner;