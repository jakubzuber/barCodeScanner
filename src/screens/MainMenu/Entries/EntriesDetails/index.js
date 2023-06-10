import { Text, View } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchNewOrdersDetails, selectNewOrdersDetails } from "./newOrdersDetailSlice";
import { styles } from "../styled";

const EntriesDetails = ({ route }) => {
    const dispatch = useDispatch();

    const { ID } = route.params

    useEffect(() => {
        dispatch(fetchNewOrdersDetails(ID))
    }, [dispatch]);

    const { newOrdersDetails } = useSelector(selectNewOrdersDetails);
    console.log(newOrdersDetails)

    return (
        <View style={styles.root}>
            {newOrdersDetails.map(order => (
                <Text key={order.ID} >{order.ZESKANOWANE} // {order.ILOSC} </Text>
            ))}
        </View>
    );
};

export default EntriesDetails;