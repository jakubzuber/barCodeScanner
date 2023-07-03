import { Text, View, SafeAreaView, FlatList, Alert } from "react-native"
import { styles } from './styled';
import CodeScanner from "./CodeScanner";
import { useSelector } from "react-redux";
import { selectTransfers } from "./transfersSlice";
import { useState } from "react";

const Transfers = () => {
    const { transfers } = useSelector(selectTransfers);
    const [pallet, setPallet] = useState(null);

    const [toMove, setToMove] = useState([])

    const definePallet = (data) => {
        setPallet(data)
    };

    const addPackage = (KOD_PRODUKTU) => {
        const index = toMove.findIndex(el => el.cargo === KOD_PRODUKTU)
        const indexTransfers = transfers.findIndex(el => el.KOD_PRODUKTU === KOD_PRODUKTU)

        if (toMove[index].ilosc < transfers[indexTransfers].ILOSC) {
            if (index !== -1) {
                toMove[index].ilosc = toMove[index].ilosc + 1
                setToMove(state => [...state])
                
            } else {
                setToMove(state => [...state, { cargo: KOD_PRODUKTU, ilosc: 1 }])
            }
        } else {
            return (
                Alert.alert('Nie możej więcej zeskanować')
            )
        }
    };

    const deductPackage = (KOD_PRODUKTU) => {
        const index = toMove.findIndex(el => el.cargo === KOD_PRODUKTU)

        if (toMove[index].ilosc > 1 ) {
            console.log('ilosc jest wieksza od 1 wiec usuwamy - 1')
            toMove[index].ilosc = toMove[index].ilosc - 1
            setToMove(state => [...state])
        }
        if (toMove[index].ilosc = 1) {
            console.log('wywal to z listy')
            toMove.splice(index, 1)
            setToMove(state => [...state])
        } else {
            return (
                Alert.alert('Nie można więcej odjąć')
            )
        }
    };

    return (
        <View style={styles.root} >
            <Text style={styles.topic} >PRZESUNIĘCIA</Text>
            <SafeAreaView>
                <CodeScanner definePallet={definePallet} />
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
                                        <Text style={styles.textDetails}>{item.ILOSC} szt.</Text>
                                        <Text style={styles.textDetails}>{item.KOD_KRESKOWY}</Text>
                                    </View>

                                    <View style={styles.plusMinusContainer}>
                                        <Text style={styles.plusText} onPress={() => addPackage(item.KOD_PRODUKTU)}>+</Text>
                                        <Text style={styles.minusText} onPress={() => deductPackage(item.KOD_PRODUKTU)}>-</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.textDetails}>Skany:</Text>
                                        <Text style={styles.textDetails}>
                                            {toMove.findIndex(el => el.cargo === item.KOD_PRODUKTU) === -1 ? 0 : toMove.filter(el => el.cargo === item.KOD_PRODUKTU)[0].ilosc} / {item.ILOSC}
                                        </Text>
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

export default Transfers;