import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Toast } from 'react-native-toast-notifications'
import { sendPasswordResetEmail } from 'firebase/auth'
import { firebaseAuth } from '../../config/firebase'

const ResetPassword = ({ navigation }) => {

  // Dalam komponen ResetPassword, kita mendefinisikan sebuah state :
  // inputs: state yang digunakan untuk menyimpan data input, yaitu email. 
  // Setiap input memiliki nilai (value) dan status validitas (isValid).
  const [inputs, setInputs] = useState({
    email: { value: '', isValid: true }
  })

  // isLoading: Ini adalah state yang digunakan untuk mengontrol tampilan ActivityIndicator ketika proses login 
  // sedang berlangsung.
  const [isLoading, setIsLoading] = useState(false)

  // fungsi inputChangeHandler adalah fungsi yang digunakan untuk mengubah nilai input dalam state inputs ketika 
  // pengguna memasukkan teks. Ini digunakan sebagai callback untuk komponen Input.
  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true }
      }
    })
  }

  // handleLogin mengarahkan pengguna (users) ke halaman / screen login
  const handleLogin = () => {
    navigation.replace('login')
  }

  /**
   * handleResetPassword fungsi yang dipanggil ketika tombol "Reset password" ditekan. 
   * Fungsi ini melakukan validasi input, jika berhasil akan mengirimkan email reset passsword ke 
   * pengguna (user) dan jika terjadi kesalahan tampilkan pesan error dalam bentuk toast
   */
  const handleResetPassword = async () => {

    /**
     * mendefinisikan objek dataResetPassword yang berisi email yang diambil dari state inputs. 
       Ini digunakan untuk menyimpan data email user yang ingin melakukan reset password.
     */
    const dataResetPassword = {
      email: inputs.email.value
    }

    // Melakukan validasi untuk memeriksa apakah email yang dimasukkan oleh pengguna valid. 
    // Validasi ini dilakukan dengan memeriksa apakah input tersebut tidak kosong.
    const emailIsValid = inputs.email.value.trim() !== ''

    /**
    * Jika input tidak valid, kita mengatur status validitas (isValid) di state inputs sesuai 
    dengan hasil validasi dan menampilkan pesan toast yang memberi tahu pengguna untuk memeriksa input mereka. 
    Pesan toast ini akan muncul selama 3 detik di bagian bawah layar.
     */
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

    /**
     * Selanjutnya, kita akan mengirimkan email reset password ke pengguna (users).
     */
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