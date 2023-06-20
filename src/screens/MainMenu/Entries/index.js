import { Text, View, SafeAreaView, FlatList } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { fetchNewOrders, selectNewOrders } from "./newOrderSlice";
import { useEffect } from "react";
import { styles } from './styled';
import { useNavigation } from '@react-navigation/native';



const Entries = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchNewOrders())
    }, [dispatch]);

    const { newOrders } = useSelector(selectNewOrders);

    const OrderDetails = (ID, KLIENT, NADAWCA) => {
        navigation.navigate('EntriesDetails', { ID: ID, KLIENT: KLIENT, NADAWCA: NADAWCA });
    };

    return (
        <View style={styles.root} >
            <Text style={styles.topic} >PRZYJĘCIA</Text>
            <SafeAreaView>
                <FlatList
                    data={newOrders}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.viewContainer} key={item.ID} onTouchEnd={() => OrderDetails(item.ID, item.KLIENT, item.NADAWCA)}>
                                <View>
                                    <Text style={styles.text} >{item.NADAWCA} - {item.KLIENT}</Text>
                                    <Text style={styles.text} >{item.ILOSC} szt. / {item.WAGA} kg</Text>
                                    <Text style={styles.text} >{item.DANE_AUTA}</Text>
                                </View>
                                <View>
                                    <Text style={styles.text} >Skany:</Text>
                                    <Text style={styles.text} >{item.SKANY} / {item.ILOSC}</Text>
                                </View>
                            </View>
                        );
                    }}
                />
            </SafeAreaView>
        </View>
    );
};

export default Entries;