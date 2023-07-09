import { Text, View, SafeAreaView, FlatList, Pressable, Alert } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { styles } from './styled';
import { useNavigation } from '@react-navigation/native';
import { fetchRemovals, selectRemovals } from "./removalsSlice";
import { closeRemovalOrder } from "./callsToDatabase";


const Removals = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRemovals())
    }, [dispatch]);

    const { removals } = useSelector(selectRemovals);

    
    const RemovalDetails = (ID, KLIENT, ODBIORCA, KLIENT_ID) => {
        navigation.navigate('RemovalsDetails', { ID: ID, KLIENT: KLIENT, ODBIORCA: ODBIORCA, K_ID: KLIENT_ID });
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
        closeRemovalOrder(ID)
        dispatch(fetchRemovals())
    };

    return (
        <View style={styles.root} >
            <Text style={styles.topic} >WYDANIA</Text>
            <SafeAreaView>
                <FlatList
                    data={removals}
                    renderItem={({ item }) => {
                        return (
                            <Pressable onPress={() => RemovalDetails(item.ID, item.KLIENT, item.ODBIORCA, item.KLIENT_ID)} onLongPress={() => createTwoButtonAlert(item.ID)} >
                                <View style={styles.viewContainer} key={item.ID}>
                                    <View>
                                        <Text style={styles.text} >{item.KLIENT} - {item.ODBIORCA}</Text>
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

export default Removals;


