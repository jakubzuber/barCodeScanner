import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, View, Text, Alert } from "react-native";
import { useState, useEffect } from 'react';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { styles } from './styled';
import { useDispatch } from 'react-redux';
import { fetchInventory } from './inventorySlice';

const CodeScanner = ({ definePallet }) => {
    const dispatch = useDispatch()
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(true);
    const [text, setText] = useState('Zeskanuj paletę');
    const [isPalletScanned, setIsPalletScanned] = useState(false)
    const [pallet, setPallet] = useState();

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

    //scan functions

    const scanNewPallet = () => {
        setIsPalletScanned(false)
        setText('Zeskanuj paletę')
        setPallet()
        definePallet(null)
    };

    const checkingPallet = async (pallet) => {
        const palletCheck = await fetch(`http://${ip}:4999/palletCheck`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                palletCode: pallet
            })
        })
            .then(res => res.json())
        return palletCheck
    };

    const handleBarCodeScanner = async ({ data }) => {
        setScanned(true)
        const isPalletChek = await checkingPallet(data)
        if (isPalletChek[0].KOD === 1) {
            setIsPalletScanned(true)
            setText(`Paleta: ${data}`)
            setPallet(data)
            definePallet(data)
            dispatch(fetchInventory({ pallet: data }))
        } else {
            return (
                Alert.alert('Nie zeskanowałeś palety')
            )
        }
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
                <Text style={styles.barCodeInfo}>{text}</Text>
                {isPalletScanned && <CustomButton text={"Skanuj na inną paletę"} type='INFO' onPress={() => scanNewPallet()} />}
            </View>
        </View>
    );
};

export default CodeScanner;