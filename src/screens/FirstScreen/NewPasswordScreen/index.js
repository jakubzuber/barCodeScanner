import { View, Alert } from "react-native";
import { styles } from "./styled";
import { useForm } from 'react-hook-form';
import CustomInput from '../../../components/CustomInput/CustomInput';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';


const NewPasswordScreen = ({route}) => {
    const navigation = useNavigation();
    const { login, password } = route.params;
    
     const sendNewPassword = async(newDetails) => {
        await fetch('http://10.0.0.153:4999/valideLogIn/newPasswrod', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                USERNAME: newDetails.username,
                PASSWORD: newDetails.password
                })
            })
        };    
    

    const {
        control, 
        handleSubmit, 
        formState: {errors}
    } = useForm();

    const onSubmit = async(data) => {
        if (password === data.oldPassword) {
            if ((data.oldPassword === data.newPassword) || (data.oldPassword === data.newPasswordx2)) {
                Alert.alert('Hasło jes takie same jak wcześniej')
            } else {
                if (data.newPassword === data.newPasswordx2) {
                    sendNewPassword({password: data.newPassword, username: login})
                    Alert.alert('Hasło zostało zaaktualizowane', 'Nastąpi przekierowanie do strony logowania')
                    setTimeout(() => {
                        navigation.navigate('SingIn')
                    }, 2000)
                    
                } else {
                    return (
                        Alert.alert('Nowe hasła się nie zgadzają')
                    )}
            }
        } else {
            return (
                Alert.alert('Stare hasło jest nieprawidłowe')
            )
        }
        

    };

    const goBack = () => {
        navigation.navigate('SingIn')
    };

    return (
        <View style={styles.root}>
             <CustomInput 
            placeholder="Stare hasło" 
            name='oldPassword'
            secureTextEntry={true} 
            control={control}
            rules={{required: 'Podanie hasła jest wymagane'}}
            />
             <CustomInput 
            placeholder="Nowe hasło" 
            name='newPassword'
            secureTextEntry={true} 
            control={control}
            rules={{required: 'Podanie hasła jest wymagane'}}
            />
             <CustomInput 
            placeholder="Powtórz nowe hasło" 
            name='newPasswordx2'
            secureTextEntry={true} 
            control={control}
            rules={{required: 'Podanie hasła jest wymagane'}}
            />
             <CustomButton
            text={'Potwierdź'}
            onPress={handleSubmit(onSubmit)}
             />
             <CustomButton
            text={'Powrót'}
            onPress={() => goBack()}
            type={'TERTIARY'}
             />
        </View>
    );
};

export default NewPasswordScreen;