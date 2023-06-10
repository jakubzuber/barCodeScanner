import { Text, View } from "react-native"
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

    const OrderDetails = (ID) => {
        navigation.navigate('EntriesDetails', {ID: ID});
    };

    return (
        <View style={styles.root} >
            <Text style={styles.topic} >PRZYJĘCIA</Text>
            {newOrders.map(order => (
                <View style={styles.viewContainer} key={order.ID} onTouchEnd={() => OrderDetails(order.ID)} >
                    <View>
                        <Text style={styles.text} >{order.NADAWCA} // {order.KLIENT}</Text>
                        <Text style={styles.text} >{order.ILOSC} szt. // {order.WAGA}kg</Text>
                        <Text style={styles.text} >{order.DANE_AUTA}</Text>
                    </View>
                    <View>
                        <Text style={styles.text} >Skany:</Text>
                        <Text style={styles.text} >{order.SKANY}/{order.ILOSC}</Text>
                    </View>
                </View>
            ))}

        </View>
    );
};

export default Entries;