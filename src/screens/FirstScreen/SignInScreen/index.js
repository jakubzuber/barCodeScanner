import { View, Text, Alert } from 'react-native';
import CustomInput from '../../../components/CustomInput/CustomInput';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { styles } from './styled';

const SignInScreen = () => {
    const navigation = useNavigation();

    const fetchLoginData = async(username) => {
        const returnedPassword = await fetch('http://10.0.0.153:4999/valideLogIn', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    USERNAME: username
                })
            })
        .then(res => res.json())
        return returnedPassword
        };

    const {
        control, 
        handleSubmit, 
        formState: {errors}
    } = useForm();

    const onSingInPress = async(data) => {
        const fetchedData = await fetchLoginData(data.username)
        const password = fetchedData[0].PASSWORD
        const newPasswordRequired = fetchedData[0].ONE_TIME_PASSWORD

        if (password === data.password){
            if (newPasswordRequired === 1) {
                    navigation.navigate('NewPassword', {login: data.username, password: data.password})
            } else {navigation.navigate('Home')}
        } else {
            return (
                Alert.alert('Nieprawidłowe hasło')
            )
        }
    };

    const onForgotPassword = () => {
        navigation.navigate('Forgot')
    };

    return (
        <View style={styles.root}>
            <Text style={styles.text} >Witaj!</Text>
            <CustomInput 
            placeholder='Nazwa użytkownika'
            name='username'
            control={control}
            rules={{required: 'Nazwa użytkownika jest wymagana'}}
            />
            <CustomInput 
            placeholder="Hasło" 
            name='password'
            secureTextEntry={true} 
            control={control}
            rules={{required: 'Hasło jest wymagane'}}
            />

            <CustomButton
            text={'Zaloguj'}
            onPress={handleSubmit(onSingInPress)} />
            <CustomButton
            text={'Zapomniałeś hasła?'}
            onPress={onForgotPassword}
            type={'TERTIARY'} />
        </View>
    );
};

export default SignInScreen;