import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Toast } from 'react-native-toast-notifications'
import { sendPasswordResetEmail } from 'firebase/auth'
import { firebaseAuth } from '../../config/firebase'

const ResetPassword = ({ navigation }) => {

  const [inputs, setInputs] = useState({
    email: { value: '', isValid: true }
  })
  const [isLoading, setIsLoading] = useState(false)

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true }
      }
    })
  }

  const handleLogin = () => {
    navigation.replace('login')
  }

  const handleResetPassword = async () => {
    const dataResetPassword = {
      email: inputs.email.value
    }

    const emailIsValid = inputs.email.value.trim() !== ''

    if (!emailIsValid) {
      setInputs((currentInputs) => ({
        email: { value: currentInputs.email.value, isValid: emailIsValid }
      }))
      Toast.show('Check your input', {
        duration: 3000,
        placement: 'bottom',
        type: 'danger'
      })
      return
    }

    setIsLoading(true)

    try {
      await sendPasswordResetEmail(firebaseAuth, dataResetPassword.email)
      Toast.show('email reset has been sent, check your inbox', {
        duration: 3000,
        placement: 'bottom',
        type: 'success'
      })
      navigation.replace('login')
    } catch (error) {
      Toast.show('Error', {
        duration: 3000,
        data: error,
        placement: 'bottom',
        type: 'danger'
      })
      return
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Input
          label={"Email"}
          placeholder={"Enter email"}
          keyboardType="email-address"
          invalid={!inputs.email.isValid}
          textInputConfig={{
            onChangeText: inputChangeHandler.bind(this, 'email')
          }}
        />

        <View style={styles.buttonContainer}>
          <Button onPress={handleResetPassword}>
            {isLoading ? (
              <ActivityIndicator color="white" size="large" />
            ) : ('Reset Password')}
          </Button>
        </View>
      </View>
      <Text style={styles.resetPassword} onPress={handleLogin}>Login</Text>
    </View>
  )
}

export default ResetPassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  resetPassword: {
    marginTop: 20,
    textDecorationLine: 'underline',
    marginHorizontal: 40,
    fontSize: 18,
    fontWeight: 'bold'
  },
})