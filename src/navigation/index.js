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
import EntriesDetails from "../screens/MainMenu/Entries/EntriesDetails";
import RemovalsDetils from "../screens/MainMenu/Removals/RemovalsDetails";
import Assignment from "../screens/MainMenu/Assignment";

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
                <Stack.Screen name='EntriesDetails' component={EntriesDetails} />
                <Stack.Screen name='Inventory' component={Inventory} />
                <Stack.Screen name='Removals' component={Removals} />
                <Stack.Screen name='RemovalsDetails' component={RemovalsDetils} />
                <Stack.Screen name='Transfers' component={Transfers} />
                <Stack.Screen name='Assignment' component={Assignment} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;