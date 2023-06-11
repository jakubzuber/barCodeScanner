import { FlatList, SafeAreaView, ScrollView, Text, View } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchNewOrdersDetails, selectNewOrdersDetails } from "./newOrdersDetailSlice";
import { styles } from "./styled";
import CustomButton from "../../../../components/CustomButton/CustomButton";


import { useState } from "react";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, StyleSheet } from "react-native";

const EntriesDetails = ({ route }) => {

    const [openCamera, setOpenCamera] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet scanned');
    console.log(text + '\n' + scanned)

    const dispatch = useDispatch();

    const { ID, KLIENT, NADAWCA } = route.params

    useEffect(() => {
        dispatch(fetchNewOrdersDetails(ID))
    }, [dispatch]);

    const { newOrdersDetails } = useSelector(selectNewOrdersDetails);

    const toogleCamera = () => {
        setOpenCamera(!openCamera)
    }

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
        <View style={styles.root} >
            <Text style={styles.topic} >{NADAWCA} - {KLIENT}</Text>
            <CustomButton text={openCamera ? 'Zamknij aparat' : 'Otwórz aparat'} type="TERTIARY" onPress={() => toogleCamera()}></CustomButton>

            {openCamera &&
                <View style={styles.container}>
                    <View style={styles.barCodeBox} >
                        <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : handleBarCodeScanner}
                            style={{ height: 400, width: 400 }}>
                                {scanned && <Button title={"Skanuj"} onPress={() => setScanned(false)} color='tomato' />}
                            </BarCodeScanner>
                    </View>
                    <Text style={styles.container}>{text}</Text>
                </View>}
            <SafeAreaView>
                <FlatList
                    data={newOrdersDetails}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.viewContainer} key={item.ID} >
                                <View>
                                    <Text style={styles.text} >{item.NAZWA_PRODUKTU} ({item.KOD_PRODUKTU})</Text>
                                    <Text style={styles.text} >{item.PAKOWANIE}</Text>
                                    <Text style={styles.text} >{item.UWAGI}</Text>
                                </View>
                                <View>
                                    <Text style={styles.text} >Skany:</Text>
                                    <Text style={styles.text} >{item.ZESKANOWANE}/{item.ILOSC}</Text>
                                </View>
                            </View>
                        );
                    }}
                />
            </SafeAreaView>
        </View>
    );
};

/*
                   
*/


export default EntriesDetails;