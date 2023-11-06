import { StyleSheet } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Login from '../screens/auth/Login'
import Register from '../screens/auth/Register'
import { NavigationContainer } from '@react-navigation/native'
import Home from '../screens/users/Home'
import ResetPassword from '../screens/auth/ResetPassword'
import UpdateProfile from '../screens/users/UpdateProfile'

// Stack  adalah tumpukan navigator yang digunakan untuk mengelola navigasi di dalam aplikasi ini. 
// Ini adalah konfigurasi awal untuk stack navigator. dengan mengimpor Modul createStackNavigator kita akan membuat 
// tumpukan navigasi (stack navigator) yang mengelola navigasi antara berbagai tampilan.
const Stack = createStackNavigator()

// Dalam komponen Routes, ada NavigationContainer yang digunakan untuk membungkus seluruh tumpukan navigator. 
// Ini diperlukan untuk menyediakan navigasi di aplikasi.

// Di dalam Stack.Navigator, kita mendefinisikan rute-rute yang akan tersedia dalam aplikasi nantinya. 
// Setiap rute memiliki beberapa properti, seperti:
// name: Nama rute yang akan digunakan untuk merujuk rute dalam aplikasi.
// component: Komponen yang akan ditampilkan ketika rute dipilih.
// options: Opsi yang dapat digunakan untuk mengatur perilaku tampilan rute, dalam hal ini, 
// headerShown diatur sebagai false untuk menghilangkan header pada rute yang menampilkan screen login dan register.
const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='login' component={Login} options={{ headerShown:false }} />
                <Stack.Screen name='register' component={Register} options={{ headerShown:false }}/>
                <Stack.Screen name='home' component={Home}/>
                <Stack.Screen name='reset-password' component={ResetPassword}/>
                <Stack.Screen name='update-profile' component={UpdateProfile}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Routes

const styles = StyleSheet.create({})