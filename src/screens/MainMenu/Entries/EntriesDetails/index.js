import { Text, View } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchNewOrdersDetails, selectNewOrdersDetails } from "./newOrdersDetailSlice";
import { styles } from "./styled";
import CustomButton from "../../../../components/CustomButton/CustomButton";

const EntriesDetails = ({ route }) => {
    const dispatch = useDispatch();

    const { ID, KLIENT, NADAWCA } = route.params

    useEffect(() => {
        dispatch(fetchNewOrdersDetails(ID))
    }, [dispatch]);

    const { newOrdersDetails } = useSelector(selectNewOrdersDetails);

    return (
        <View style={styles.root} >
        <Text style={styles.topic} >{NADAWCA} - {KLIENT}</Text>
        <CustomButton text="Skanuj" type="SCANNER"></CustomButton>
        {newOrdersDetails.map(order => (
            <View style={styles.viewContainer} key={order.ID} >
                <View>
                    <Text style={styles.text} >{order.NAZWA_PRODUKTU} ({order.KOD_PRODUKTU})</Text>
                    <Text style={styles.text} >{order.PAKOWANIE}</Text>
                    <Text style={styles.text} >{order.UWAGI}</Text>
                </View>
                <View>
                    <Text style={styles.text} >Skany:</Text>
                    <Text style={styles.text} >{order.ZESKANOWANE}/{order.ILOSC}</Text>
                </View>
            </View>
        ))}
    </View>
    );
};

export default EntriesDetails;