import { FlatList, SafeAreaView, Text, View, Alert } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { styles } from "./styled";
import CustomButton from "../../../../components/CustomButton/CustomButton";
import CodeScanner from "./CodeScanner";
import { addScan, fetchRemovalDetails, selectRemuvalsDetails } from "./removalsDetailSlice";
import { fetchCollection, selectCollection, removeFromWh } from './collectionSlice'
import { addToPositions } from "../callsToDatabase";

const RemovalsDetils = ({ route }) => {
    const dispatch = useDispatch();
    const [openCamera, setOpenCamera] = useState(false);
    const { ID, KLIENT, ODBIORCA, K_ID } = route.params
    const [pallet, setPallet] = useState(null);
    const [place, setPlace] = useState(false)

    const [data, setData] = useState(null);

    useEffect(() => {
        dispatch(fetchRemovalDetails(ID))
        dispatch(fetchCollection(ID))
    }, [dispatch]);

    const { removalDetails } = useSelector(selectRemuvalsDetails);
    const { collection } = useSelector(selectCollection);

    const toogleCamera = () => {
        setOpenCamera(!openCamera)
    };

    const definePallet = (data) => {
        setPallet(data)
    };

    const definePlace = (data) => {
        setPlace(true)
        setData(data)
    };

    const addPackage = (props) => {
        const placeToDeduct = data.filter(data => data.kodProduktu === props);
        const detailsToDeduct = removalDetails.filter(removalDetails => removalDetails.KOD_PROCUKTU === props);
        if (detailsToDeduct[0].ZESKANOWANE === detailsToDeduct[0].ILOSC) {
            return (
                Alert.alert('Nie możesz więcej dodać')
            )
        } else {
            const index = data.findIndex(({ kodProduktu }) => kodProduktu === props);
            dispatch(addScan(detailsToDeduct[0].ID))
            dispatch(removeFromWh(placeToDeduct[0].idMiejsca))
            addToPositions({
                detailsId: detailsToDeduct[0].ID,
                whPlace: placeToDeduct[0].idMiejsca,
                pallet: pallet,
                productCode: detailsToDeduct[0].KOD_PROCUKTU,
                idRemovals: detailsToDeduct[0].WYDANIE_ID,
                productBarcode: detailsToDeduct[0].KOD_KRESKOWY,
                klinetId: placeToDeduct[0].klientId,
                klientNazwa: placeToDeduct[0].klientNazwa,
                oldPallet: placeToDeduct[0].kodPalety,
                productName: detailsToDeduct[0].NAZWA_PRODUKTU
            })
            if (placeToDeduct[0].ilosc > 1) {
                setData(state => [...state, state[index].ilosc = state[index].ilosc - 1])
            } else {
                setData(details => details.filter((s, i) => i !== index))
            }
        }
    };


    return (
        <View style={styles.root} >
            <Text style={styles.topic} >{KLIENT} - {ODBIORCA}</Text>
            <CustomButton text={openCamera ? 'Zamknij aparat' : 'Otwórz aparat'} type="TERTIARY" onPress={() => toogleCamera()}></CustomButton>
            {openCamera &&
                <CodeScanner definePlace={definePlace} definePallet={definePallet} removalDetails={removalDetails} />}
            <SafeAreaView>
                <FlatList
                    data={removalDetails}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.viewContainer} key={item.ID} >
                                <View>
                                    <Text style={styles.text} >{item.NAZWA_PRODUKTU} ({item.KOD_PROCUKTU})</Text>
                                    <Text style={styles.text} >{item.PAKOWANIE}</Text>
                                    <Text style={styles.text} >{item.UWAGI}</Text>
                                </View>
                                <View>
                                    {place && data.map(place => place.kodProduktu).includes(item.KOD_PROCUKTU) &&
                                        <View style={styles.plusMinusContainer}>
                                            <Text style={styles.plusText} onPress={() => addPackage(item.KOD_PROCUKTU)}>+</Text>
                                        </View>
                                    }

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

export default RemovalsDetils;