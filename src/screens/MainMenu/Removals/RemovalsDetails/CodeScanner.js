import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, View, Text, Alert } from "react-native";
import { useState, useEffect } from 'react';
import CustomButton from '../../../../components/CustomButton/CustomButton';
import { styles } from './styled';
import { useSelector } from 'react-redux';
import { selectCollection } from './collectionSlice';

const CodeScanner = ({ definePallet, removalDetails, definePlace }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(true);
    const [text, setText] = useState('Zeskanuj paletę');
    const [isPalletScanned, setIsPalletScanned] = useState(false);
    const [pallet, setPallet] = useState();
    const [place, setPlace] = useState('aaaa');

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

    // funkcje skanera

    const scanNewPallet = () => {
        setIsPalletScanned(false)
        setText('Zeskanuj paletę')
        definePallet(null)
    };

    const checkingPallet = async (pallet) => {
        const palletCheck = await fetch('http://192.168.0.191:4999/palletCheck', {
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
        const places = collection.map(col => col.PALETA_NUMER)
        if (!isPalletScanned) {
            const isPalletChek = await checkingPallet(data)
            if (isPalletChek[0].KOD === 1) {
                setIsPalletScanned(true)
                setText(`Paleta: ${data}`)
                definePallet(data)
                setPallet(data)
                setPlace(collection[0].placeOpis)
            } else {
                return (
                    Alert.alert('Nie zeskanowałeś palety')
                )
            }
        } else {
            if (pallet === data) {
                return (
                    Alert.alert('Skanujesz ponownie tą samą paletę!')
                )
            } else {
                if (data === collection[0].PALETA_NUMER) {
                    const dataToScan = collection.filter(col => col.PALETA_NUMER === data).map(col => ({kodProduktu: col.KOD_PRODUKTU, ilosc: col.ILOSC, idMiejsca: col.whId}))
                    definePlace(dataToScan)
                } else { 
                   if (places.includes(data)) {
                        return (
                            Alert.alert('Ta paleta również ma towar do tego pobrania')
                        )
                   } else {
                        Alert.alert('Zeskanowano błędną paletę. Nie ma na niej towaru do pobrania')
                   }
                }
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
                {!isPalletScanned && <Text style={styles.barCodeInfo}>Zeskanuj paletę na którą chcesz pobrać towar.</Text>}
                {isPalletScanned && <Text style={styles.barCodeInfo}>Kieruj się do:</Text>}
                {isPalletScanned && <Text style={styles.barCodeInfo}>{place}</Text>}
                {isPalletScanned && <Text style={styles.barCodeInfo}>Pobranie na: {pallet}</Text>}
                {isPalletScanned && <CustomButton text={"Skanuj na inną paletę"} type='INFO' onPress={() => scanNewPallet()} />}
            </View>
        </View>
    );
};

export default CodeScanner;