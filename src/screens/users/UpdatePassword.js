import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Toast } from 'react-native-toast-notifications'
import { signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth'
import { firebaseAuth } from '../../config/firebase'
import { destroyKey } from '../../config/localStorage'

const UpdatePassword = ({ route, navigation }) => {

  const currentEmail = route.params.email
  const userId = route.params.userId

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Update Password',
      headerTextAlign: 'center',
      headerStyle: { backgroundColor: '#164da4' }
    })
  }, [])

  const [inputs, setInputs] = useState({
    currentPassword: { value: '', isValid: true },
    password: { value: '', isValid: true }
  })

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true }
      }
    })
  }

  // isLoading: Ini adalah state yang digunakan untuk mengontrol tampilan ActivityIndicator ketika proses login 
  // sedang berlangsung.
  const [isLoading, setIsLoading] = useState(false)

  const updatePasswordUser = async () => {
    const currentPasswordIsValid = inputs.currentPassword.value.trim() !== ""
    const passwordIsValid = inputs.password.value.trim() !== ""

    if (!currentPasswordIsValid || !passwordIsValid) {
      setInputs((currentInputs) => ({
        currentPassword: { value: currentInputs.currentPassword.value, isValid: currentPasswordIsValid },
        password: { value: currentInputs.password.value, isValid: passwordIsValid }
      }))
      Toast.show("Check your input", { duration: 3000, placement: 'bottom', type: 'error' })
      return
    }

    const dataUpdatePassword = {
      currentPassword: inputs.currentPassword.value,
      email: currentEmail,
      newPassword: inputs.password.value
    }

    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(firebaseAuth, dataUpdatePassword.email, dataUpdatePassword.currentPassword)
      await updatePassword(firebaseAuth.currentUser, dataUpdatePassword.newPassword)

      Toast.show("Password updated", { duration: 3000, placement: 'bottom', type: 'success' })
      await signOut(firebaseAuth)
      destroyKey()
      navigation.replace('login')
    } catch (error) {
      Toast.show("Error", { duration: 3000, placement: 'bottom', type: 'danger' })
    }
  }

  return (
    <View style={styles.rootContainer}>
      <KeyboardAvoidingView
        style={styles.container}
      >
        <View style={styles.inputContainer}>
          <Input
            label={"Current Password"}
            secureTextEntry
            placeholder={"Enter current password"}
            invalid={!inputs.currentPassword.isValid}
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, 'currentPassword')
            }}
          />

          <Input
            label={"New Password"}
            secureTextEntry
            placeholder={"Enter new password"}
            invalid={!inputs.password.isValid}
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, 'password')
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={updatePasswordUser}>
            {isLoading ? (
              <ActivityIndicator color="white" size="large" />
            ) : ("Update password")}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default UpdatePassword

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  container: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '90%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5
  },
  buttonContainer: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'flex-end'
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16
  }
})