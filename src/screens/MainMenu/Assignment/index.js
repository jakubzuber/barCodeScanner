import { Text, View, SafeAreaView, FlatList } from "react-native"
import { styles } from './styled';
import CodeScanner from "./CodeScanner";
import { useSelector } from "react-redux";
import { selectTransfers } from "../Transfers/transfersSlice";
import { useState } from "react";


const Assignment = () => {
    const { transfers } = useSelector(selectTransfers);
    const [pallet, setPallet] = useState(null);

    const definePallet = (data) => {
        setPallet(data)
    };

    return (
        <View style={styles.root} >
            <Text style={styles.topic} >PRZYPISYWANIE</Text>
            <SafeAreaView>
                <CodeScanner definePallet={definePallet}/>
            </SafeAreaView>
            {pallet !== null &&
                <SafeAreaView>
                    <FlatList
                        data={transfers}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.viewContainer} key={item.ID} >
                                    <View>
                                        <Text style={styles.textDetails}>{item.NAZWA_PRODUKTU} ({item.KOD_PRODUKTU})</Text>
                                        <Text style={styles.textDetails}>Ilość: {item.ILOSC} szt.</Text>
                                        <Text style={styles.textDetails}>Kod kreskowy: {item.KOD_KRESKOWY}</Text>
                                    </View>
                                </View>
                            );
                        }}
                    />
                </SafeAreaView>
            }
        </View>
    );
};


export default Assignment;