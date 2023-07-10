import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, View, Text, Alert } from "react-native";
import { useState, useEffect } from 'react';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { styles } from './styled';
import { useDispatch } from 'react-redux';
import { fetchTransfers } from '../Transfers/transfersSlice';
import { fetchDiscription, submitPlaceAssignment } from './callToDatabase';

const CodeScanner = ({ definePallet }) => {
    const dispatch = useDispatch()
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(true);
    const [text, setText] = useState('Zeskanuj paletę');
    const [isPalletScanned, setIsPalletScanned] = useState(false)
    const [pallet, setPallet] = useState();

    const initailDiscription = {
        id: 0, 
        opis: 'Nie przypisane'
    };
    const [ discription, setDiscription ] = useState(initailDiscription);


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
        const palletCheck = await fetch('http://10.0.0.153:4999/palletCheck', {
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

    const checkingPlace = async (place) => {
        const placeCheck = await fetch('http://10.0.0.153:4999/placeCheck', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                placeCode: place
            })
        })
            .then(res => res.json())
        return placeCheck
    };

    const handleBarCodeScanner = async ({ data }) => {
        setScanned(true)
        const isPalletChek = await checkingPallet(data)
        if (isPalletChek[0].KOD === 1) {
            setIsPalletScanned(true)
            setText(`Paleta: ${data}`)
            setPallet(data)
            definePallet(data)
            dispatch(fetchTransfers({ pallet: data }))
            const disc = await fetchDiscription(data)
            if (disc[0].id !== 0) {
                setDiscription({id: disc[0].id, opis: disc[0].opis})
            } else {
                setDiscription({id: 0, opis: 'Nie przypisano'})
            }
        } else {
            const isPlaceChecked = await checkingPlace(data)
            if (isPlaceChecked[0].KOD === 1) {
                submitPlaceAssignment(pallet, data)
                scanNewPallet()
            } else {
                return (
                    Alert.alert('Zeskanowany obiekt nie jest paletą ani miejscem w magazynie')
                )
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
                {isPalletScanned &&  <Text style={styles.barCodeInfo}>{discription.opis}</Text>}
                {isPalletScanned && <CustomButton text={"Skanuj inną paletę"} type='INFO' onPress={() => scanNewPallet()} />}
            </View>
        </View>
    );
};

export default CodeScanner;