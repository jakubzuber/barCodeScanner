import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, View, Text, Alert, BackHandler} from "react-native";
import { useState, useEffect } from 'react';
import CustomButton from '../../../../components/CustomButton/CustomButton';
import { styles } from './styled';
import { useDispatch } from 'react-redux';
import { addScan } from './newOrdersDetailSlice';
import { addScanToWh } from '../callsToDatabase';
import { useNavigation } from '@react-navigation/native';
import { ip } from '../../../../ipconfig';

const CodeScanner = ({ definePallet, newOrdersDetails, klientId, klientName }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(true);
    const [text, setText] = useState('Zeskanuj paletę');
    const [isPalletScanned, setIsPalletScanned] = useState(false)
    const [pallet, setPallet] = useState()
    const dispatch = useDispatch();
    const navigation = useNavigation();

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

    // handle scan

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

    const scanNewPallet = () => {
        setIsPalletScanned(false)
        setText('Zeskanuj paletę')
        definePallet(null)
    };


    const handleBarCodeScanner = async ({ data }) => {
        setScanned(true)
        if (!isPalletScanned) {
            const isPalletChek = await checkingPallet(data)
            if (isPalletChek[0].KOD === 1) {
                setIsPalletScanned(true)
                setText(`Paleta: ${data}`)
                definePallet(data)
                setPallet(data)
            } else {
                return (
                    Alert.alert('Nie zeskanowałeś palety')
                )
            }
        } else {
            if (pallet === data) {
                return (
                    Alert.alert('Skanujesz ponownie paletę!')
                )
            } else {
                const order = newOrdersDetails.filter(newOrdersDetails => newOrdersDetails.KOD_KRESKOWY === data)
                dispatch(addScan(order[0].ID))
                addScanToWh({ pallet: Number(pallet), code: order[0].KOD_PRODUKTU, symbol: order[0].NAZWA_PRODUKTU, number: order[0].ZESKANOWANE, klientId: klientId, klient: klientName, przyjecie: order[0].PRZYJECIE_ID, kod_kreskowy: order[0].KOD_KRESKOWY })
            }
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