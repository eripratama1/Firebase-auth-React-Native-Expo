import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";

export const storeKey = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        Toast.show("Error store key", {
            data: error,
            duration: 2000,
            type: "danger"
        })
    }
}

export const getKey = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return JSON.parse(value)
        }
    } catch (error) {
        Toast.show("Error store key", {
            data: error,
            duration: 2000,
            type: "danger"
        })
    }
}

export const destroyKey = async() => {
    AsyncStorage.clear()
}