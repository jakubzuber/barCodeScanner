import { Text, View, SafeAreaView, FlatList, Pressable, Alert } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { fetchNewOrders, selectNewOrders } from "./newOrderSlice";
import { useEffect } from "react";
import { styles } from './styled';
import { useNavigation } from '@react-navigation/native';
import { closeOrder } from "./callsToDatabase";

const Entries = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchNewOrders())
    }, [dispatch]);

    const { newOrders } = useSelector(selectNewOrders);

    const OrderDetails = (ID, KLIENT, NADAWCA, KLIENT_ID) => {
        navigation.navigate('EntriesDetails', { ID: ID, KLIENT: KLIENT, NADAWCA: NADAWCA, K_ID: KLIENT_ID });
    };

    const createTwoButtonAlert = (ID) =>
    Alert.alert('Zakończenie obsługi', 'Czy na napewno chcesz zakończyć obsługę tego zlecenia?', [
      {
        text: 'Anuluj',
        style: 'cancel',
      },
      {text: 'Tak', onPress: () => onCloseOrder(ID)},
    ]);

    const onCloseOrder = (ID) => {
        closeOrder(ID)
        dispatch(fetchNewOrders())
    };


    return (
        <View style={styles.root} >
            <Text style={styles.topic} >PRZYJĘCIA</Text>
            <SafeAreaView>
                <FlatList
                    data={newOrders}
                    renderItem={({ item }) => {
                        return (
                            <Pressable onPress={() => OrderDetails(item.ID, item.KLIENT, item.NADAWCA, item.KLIENT_ID)} onLongPress={() => createTwoButtonAlert(item.ID)} >
                                <View style={styles.viewContainer} key={item.ID}>
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
                            </Pressable>
                        );
                    }}
                />
            </SafeAreaView>
        </View>
    );
};

export default Entries;