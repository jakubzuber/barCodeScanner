import { View } from "react-native"
import CustomButton from "../../../components/CustomButton/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styled";

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.view}>
            <CustomButton
             text={'Przyjęcia'} 
             onPress={() => navigation.navigate('Entries')}
             />
            <CustomButton 
            text={'Wydania'}
            onPress={() => navigation.navigate('Removals')}
            />
            <CustomButton 
            text={'Przesunięcia'}
            onPress={() => navigation.navigate('Transfers')}
            />
            <CustomButton 
            text={'Stany magazynowe'} 
            onPress={() => navigation.navigate('Inventory')}
            />
            <CustomButton 
            type="TERTIARY" 
            text={'Wyloguj'}
            onPress={() =>  navigation.navigate('SingIn')} />
        </View>
    );
};



export default HomeScreen;