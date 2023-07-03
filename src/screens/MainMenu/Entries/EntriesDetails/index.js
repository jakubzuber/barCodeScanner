import { FlatList, SafeAreaView, Text, View, Alert } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchNewOrdersDetails, selectNewOrdersDetails, addScan, deductScan } from "./newOrdersDetailSlice";
import { styles } from "./styled";
import CustomButton from "../../../../components/CustomButton/CustomButton";
import CodeScanner from "./CodeScanner";
import { addScanToWh, deleteFromWh } from "../callsToDatabase";

const EntriesDetails = ({ route }) => {
    const dispatch = useDispatch();
    const [openCamera, setOpenCamera] = useState(false);
    const { ID, KLIENT, NADAWCA, K_ID } = route.params
    const [pallet, setPallet] = useState(null)


    useEffect(() => {
        dispatch(fetchNewOrdersDetails(ID))
    }, [dispatch]);

    const { newOrdersDetails } = useSelector(selectNewOrdersDetails);

    const toogleCamera = () => {
        setOpenCamera(!openCamera)
    };

    const definePallet = (data) => {
        setPallet(data)
    };

    const addPackage = (props) => {
        const order = newOrdersDetails.filter(newOrdersDetails => newOrdersDetails.ID === props)
        if (order[0].ZESKANOWANE < order[0].ILOSC) {
            dispatch(addScan(props))
            addScanToWh({pallet: Number(pallet), code: order[0].KOD_PRODUKTU, symbol: order[0].NAZWA_PRODUKTU, number: order[0].ZESKANOWANE, klientId: K_ID, klient: KLIENT, przyjecie: ID, kod_kreskowy: order[0].KOD_KRESKOWY})
        } else {
            return (
                Alert.alert('Wszystko zostało zeskanowane')
            )
        }   
    };

    const deductPackage = (props) => {
        const order = newOrdersDetails.filter(newOrdersDetails => newOrdersDetails.ID === props)
        if (order[0].ZESKANOWANE > 0) {
            dispatch(deductScan(props))
            deleteFromWh({pallet: Number(pallet), code: order[0].KOD_PRODUKTU, klientId: K_ID, przyjecie: ID})
        } else {
            return (
                Alert.alert('Nie możesz więcej odjąć')
            )
        }   
    };


    return (
        <View style={styles.root} >
            <Text style={styles.topic} >{NADAWCA} - {KLIENT}</Text>
            <CustomButton text={openCamera ? 'Zamknij aparat' : 'Otwórz aparat'} type="TERTIARY" onPress={() => toogleCamera()}></CustomButton>

            {openCamera &&
                <CodeScanner definePallet={definePallet} newOrdersDetails={newOrdersDetails} klientId={K_ID} klientName={KLIENT}/>}
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
                                {pallet !== null &&
                                    <View style={styles.plusMinusContainer}>
                                        <Text style={styles.plusText} onPress={() => addPackage(item.ID)}>+</Text>
                                        <Text style={styles.minusText} onPress={() => deductPackage(item.ID)}>-</Text>
                                    </View>
                                }
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

export default EntriesDetails;