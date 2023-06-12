import { FlatList, SafeAreaView, Text, View } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchNewOrdersDetails, selectNewOrdersDetails } from "./newOrdersDetailSlice";
import { styles } from "./styled";
import CustomButton from "../../../../components/CustomButton/CustomButton";
import CodeScanner from "./CodeScanner";

const EntriesDetails = ({ route }) => {
    const dispatch = useDispatch();
    const [openCamera, setOpenCamera] = useState(false);
    const { ID, KLIENT, NADAWCA } = route.params

    useEffect(() => {
        dispatch(fetchNewOrdersDetails(ID))
    }, [dispatch]);

    const { newOrdersDetails } = useSelector(selectNewOrdersDetails);

    const toogleCamera = () => {
        setOpenCamera(!openCamera)
    };

    return (
        <View style={styles.root} >
            <Text style={styles.topic} >{NADAWCA} - {KLIENT}</Text>
            <CustomButton text={openCamera ? 'Zamknij aparat' : 'Otwórz aparat'} type="TERTIARY" onPress={() => toogleCamera()}></CustomButton>

            {openCamera &&
                <CodeScanner />}
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