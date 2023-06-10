import { View, Text } from 'react-native';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styled';

const ForgetPasswordScreen = () => {

    const navigation = useNavigation();

    const goBackToLogInScreen = () => {
        navigation.navigate('SingIn')
    }
 
    return (
        <View style={styles.root}>
            <Text style={styles.subText}>Skontaktuj się z jakub.zuber19@gmail.com</Text>
            <CustomButton text={'Powrót do ekranu głównego'} onPress={() => goBackToLogInScreen()} />
        </View>
    );
};



export default ForgetPasswordScreen;