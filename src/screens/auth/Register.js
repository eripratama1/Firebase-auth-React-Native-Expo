import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Toast } from 'react-native-toast-notifications'
import { firebaseAuth, firestore } from '../../config/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { doc, setDoc } from 'firebase/firestore'

const Register = () => {

  // Disini kita melakukan hal yang sama seperti yang ada pada screen Login
  // membuat state inputs, loading, menambahkan object navigation
  // dan menambahkan callback untuk komponen inputs

  const [inputs, setInputs] = useState({
    fullname: { value: '', isValid: true },
    email: { value: '', isValid: true },
    password: { value: '', isValid: true }
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true }
      }
    })
  }

  // handleLogin mengarahkan pengguna ke halaman/screen login
  const handleLogin = () => {
    navigation.replace('login')
  }

  const handleRegister = async () => {

    // Object dataRegister yang datanya didapatkan dari state inputs
    const dataRegister = {
      fullname: inputs.fullname.value,
      email: inputs.email.value,
      password: inputs.password.value,
    };

    // Memeriksa apakah emailIsValid, fullnameIsValid, dan passwordIsValid adalah true. 
    // Ini dilakukan dengan memeriksa apakah input email, nama lengkap, dan kata sandi tidak kosong
    const emailIsValid = inputs.email.value.trim() !== "";
    const fullnameIsValid = inputs.fullname.value.trim() !== "";
    const passwordIsValid = inputs.password.value.trim() !== "";

    // Jika ada input yang tidak valid (kosong), 
    // maka status validitasnya diubah dalam state inputs. 
    // Ini dilakukan dengan mengganti nilai isValid untuk setiap input yang tidak valid menjadi false.
    // Setelah validasi input, jika ada input yang tidak valid, kita tampilkan pesan toast "Check your input" 
    // kepada pengguna. Pesan toast ini memperingatkan pengguna untuk mengisi semua input yang diperlukan.
    if (!emailIsValid || !passwordIsValid || !fullnameIsValid) {
      setInputs((currentInputs) => ({
        email: { value: currentInputs.email.value, isValid: emailIsValid },
        fullname: { value: currentInputs.fullname.value, isValid: fullnameIsValid },
        password: { value: currentInputs.password.value, isValid: passwordIsValid },
      }));

      Toast.show("Check your input", {
        duration: 3000,
        placement: 'bottom',
        type: 'danger',
      });
      return;
    }

    // Jika semua input valid ubah state isLoading menjadi true
    setIsLoading(true)
    try {
      // Pada object success kita menggunakan createUserWithEmailAndPassword dari Firebase Authentication. 
      // Jika registrasi berhasil, ambil nilau userId dari object tersebut (uid).
      const success = await createUserWithEmailAndPassword(firebaseAuth, dataRegister.email, dataRegister.password);
      const userId = success.user.uid;

      // Setelah registrasi berhasil, kita akan mengirim email verifikasi ke alamat email yang digunakan untuk registrasi 
      // dengan menggunakan sendEmailVerification(firebaseAuth.currentUser). 
      // Hal ini memastikan bahwa pengguna harus memverifikasi alamat email mereka sebelum dapat menggunakan akun mereka 
      // Jika email verifikasi berhasil terkirim, kita tampilkan pesan toast "Email verifikasi terkirim" kepada pengguna.
      await sendEmailVerification(firebaseAuth.currentUser)
      Toast.show("Email verifikasi terkirim", {
        duration: 3000,
        placement: 'bottom',
        type: 'success',
      });

      // Selanjutnya, kita membuat objek docRef yang berisi informasi pengguna, seperti userId, email, dan fullname.
      // Dengan menggunakan Firebase Firestore, kita menyimpan data pengguna ke koleksi "users" dengan menggunakan setDoc 
      // dan doc. Data ini akan disimpan dengan ID pengguna (userId) sebagai unique Id.
      const docRef = {
        userId: userId,
        email: dataRegister.email,
        fullname: dataRegister.fullname,
      };

      await setDoc(doc(firestore, "users", userId), docRef);
      //const getId = auth.currentUser;
      // const userId = getId.uid;

      console.log("Register Success");

      // Jika registrasi berhasil tampilkan pesan toast berikut
      // lalu arahkan user ke halaman/screen login
      Toast.show("Register success please login", {
        duration: 3000,
        placement: 'bottom',
        type: 'success',
      });
      navigation.replace('login')
    } catch (error) {
      const errorMessage = error.message;
      Toast.show(errorMessage, {
        duration: 3000,
        placement: 'bottom',
        type: 'danger',
      });
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registrasi</Text>
        
        <Input
          label={"Fullname"}
          placeholder={"Enter FullName"}
          invalid={!inputs.fullname.isValid}
          textInputConfig={{
            onChangeText: inputChangeHandler.bind(this, 'fullname')
          }}
        />

        <Input
          label={"Email"}
          placeholder={"Enter Email"}
          keyboardType="email-address"
          invalid={!inputs.email.isValid}
          textInputConfig={{
            onChangeText: inputChangeHandler.bind(this, 'email')
          }}
        />

        < Input
          label={"Password"}
          secureTextEntry
          placeholder={"Enter password"}
          invalid={!inputs.password.isValid}
          textInputConfig={{
            onChangeText: inputChangeHandler.bind(this, 'password'),
          }}
        />

        <View style={styles.buttonContainer}>
          <Button onPress={handleRegister}>
            {isLoading ? (
              <ActivityIndicator color="white" size="large" />
            ) :
              ('Register')
            }
          </Button>
        </View>
      </View>
      <Text style={styles.registration} onPress={handleLogin}>Login</Text>
    </View>
  )
}

export default Register

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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  resetPassword: {
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  registration: {
    textDecorationLine: 'underline',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
})