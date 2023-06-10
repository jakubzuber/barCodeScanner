import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/FirstScreen/SignInScreen";
import ForgetPasswordScreen from "../screens/FirstScreen/ForgotPasswordScreen";
import HomeScreen from "../screens/FirstScreen/HomeScreen";
import NewPasswordScreen from "../screens/FirstScreen/NewPasswordScreen";
import Entries from "../screens/MainMenu/Entries";
import Inventory from "../screens/MainMenu/Inventory";
import Removals from "../screens/MainMenu/Removals";
import Transfers from "../screens/MainMenu/Transfers";

const Stack = createNativeStackNavigator();

const Navigation = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}} >
                <Stack.Screen name='SingIn' component={SignInScreen} />
                <Stack.Screen name='Forgot' component={ForgetPasswordScreen} />
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='NewPassword' component={NewPasswordScreen} />
                <Stack.Screen name='Entries' component={Entries} />
                <Stack.Screen name='Inventory' component={Inventory} />
                <Stack.Screen name='Removals' component={Removals} />
                <Stack.Screen name='Transfers' component={Transfers} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;