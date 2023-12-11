import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Toast } from 'react-native-toast-notifications'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firebaseAuth, firestore } from '../../config/firebase'
import { sendEmailVerification, signInWithEmailAndPassword, signOut, updateEmail } from 'firebase/auth'
import { destroyKey } from '../../config/localStorage'

const UpdateEmail = ({ route, navigation }) => {

  // const navigation = useNavigation()

  //console.log("result route params UpdateEmailComponent",route.params);

  const currentEmail = route.params.email
  const userId = route.params.userId
  console.log("result currentEmail", currentEmail);

  const [inputs, setInputs] = useState({
    currentPassword: { value: '', isValid: true },
    email: { value: '', isValid: true }
  })

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true }
      }
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Update Email',
      headerTextAlign: 'center',
      headerStyle: { backgroundColor: '#164da4' }
    })
  }, [])

  const updateEmailUser = async () => {
    const currentPasswordIsValid = inputs.currentPassword.value.trim() !== ''
    const emailIsValid = inputs.email.value.trim() !== ''

    if (!currentPasswordIsValid || !emailIsValid) {
      setInputs((currentInputs) => ({
        currentPassword: { value: currentInputs.currentPassword.value, isValid: currentPasswordIsValid },
        email: { value: currentInputs.email.value, isValid: emailIsValid }
      }))
      Toast.show("Data belum lengkap", { duration: 3000, placement: 'bottom', type: 'error' })
    }

    const dataUpdateEmail = {
      currentPassword: inputs.currentPassword.value,
      currentEmail: currentEmail,
      newMail: inputs.email.value
    }

    const colRef = doc(firestore, "users", userId)

    try {
      const querySnapshot = await getDoc(colRef)
      await signInWithEmailAndPassword(firebaseAuth, dataUpdateEmail.currentEmail, dataUpdateEmail.currentPassword)
      await updateEmail(firebaseAuth.currentUser, dataUpdateEmail.newMail)

      Toast.show("Email Updated Successfull", { duration: 3000, placement: 'bottom', type: 'success' })

      if (querySnapshot.exists()) {
        await updateDoc(doc(firestore, "users", userId), {
          email: dataUpdateEmail.newMail
        })

        await sendEmailVerification(firebaseAuth.currentUser)
        Toast.show("email verification sent", { duration: 3000, placement: 'bottom', type: 'success' })
      }
      await signOut(firebaseAuth)
      destroyKey()
      navigation.replace('login')
    } catch (error) {
      console.log(error);
      Toast.show('error', { duration: 3000, placement: 'bottom', type: 'error', data: error })
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
            label={"Email"}
            keyboardType={"email-address"}
            placeholder={"Enter new email"}
            invalid={!inputs.email.isValid}
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, 'email')
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={updateEmailUser}>Update Email</Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default UpdateEmail

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