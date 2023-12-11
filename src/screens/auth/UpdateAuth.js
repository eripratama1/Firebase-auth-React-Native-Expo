import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import UpdatePassword from '../users/UpdatePassword'
import UpdateEmail from '../users/UpdateEmail'
import { Ionicons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator()

const UpdateAuth = ({ route }) => {
  console.log("result route updateAuth",route);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#164da4',
          height: 60
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === 'updatePassword') {
            iconName = focused ? 'ios-key' : 'ios-key-outline';
          } else {
            iconName = focused ? 'ios-mail-sharp' : 'ios-mail-outline';
          }
          return <Ionicons name={iconName} size={24} color='white' style={{ marginTop: 8 }} />;
        },
      })}
    >
      <Tab.Screen
        name='updatePassword'
        component={UpdatePassword}
        options={{
          tabBarLabel: 'Update Password',
          tabBarLabelStyle: styles.tabBarLabel
        }}
        initialParams={route.params}
      />
      <Tab.Screen
        name='updateEmail'
        component={UpdateEmail}
        options={{
          tabBarLabel: 'Update Email',
          tabBarLabelStyle: styles.tabBarLabel
        }}
        initialParams={route.params}
      />
    </Tab.Navigator>
  )
}

export default UpdateAuth

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 14,
    margin: 4,
    fontWeight: 'bold',
    color: 'whitesmoke'
  }
})