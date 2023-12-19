import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getKey, storeKey } from '../../config/localStorage'
import { Toast } from 'react-native-toast-notifications'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../../config/firebase'
import Input from '../../components/Input'
import Button from '../../components/Button'

const Login = () => {

  // Dalam komponen Login, kita mendefinisikan dua state :
  // inputs: state yang digunakan untuk menyimpan data input, termasuk email dan kata sandi. 
  // Setiap input memiliki nilai (value) dan status validitas (isValid).

  const [inputs, setInputs] = useState({
    email: { value: '', isValid: true },
    password: { value: '', isValid: true }
  })

  // isLoading: Ini adalah state yang digunakan untuk mengontrol tampilan ActivityIndicator ketika proses login 
  // sedang berlangsung.
  const [isLoading, setIsLoading] = useState(false)

  //objek navigation digunakan untuk mendapatkan objek navigasi yang di import dari react-navigation/native, 
  // yang akan digunakan untuk mengarahkan pengguna ke halaman lain setelah login.
  const navigation = useNavigation()

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

  // Pada useEffect hook, kita mencoba mengambil data yang disimpan di localStorage dengan kunci 'LOGGED_IN' 
  // saat komponen dimuat. Jika ada data yang ditemukan, kita arahkan pengguna ke halaman/screen 'home' dan meneruskan 
  // ID pengguna (userId) sebagai prop.
  useEffect(() => {
    getKey('LOGGED_IN').then(res => {
      const data = res
      console.log(data);
      if (data) {
        navigation.replace('home', { userId: data })
      }
    })
  }, [])

  // handleSignUp mengarahkan pengguna ke halaman / screen register
  const handleSignUp = () => {
    navigation.replace('register')
  }

  // handleResetPassword mengarahkan pengguna ke halaman / screen reset password
  const handleResetPassword = () => {
    navigation.replace('reset-password')
  }

  // handleLogin fungsi yang dipanggil ketika tombol "Login" ditekan. 
  // Fungsi ini melakukan validasi input, mencoba login dengan Firebase Authentication, 
  // dan mengarahkan pengguna ke halaman/screen 'home' jika login berhasil. 
  // Jika ada kesalahan, pesan kesalahan akan ditampilkan sebagai pesan toast.
  const handleLogin = async () => {

    // mendefinisikan objek dataLogin yang berisi email dan kata sandi yang diambil dari state inputs. 
    // Ini digunakan untuk menyimpan data login yang akan digunakan dalam proses autentikasi
    const dataLogin = {
      email: inputs.email.value,
      password: inputs.password.value,
    };

    // melakukan validasi untuk memeriksa apakah email dan kata sandi yang dimasukkan oleh pengguna valid. 
    // Validasi ini dilakukan dengan memeriksa apakah kedua input tersebut tidak kosong.
    const emailIsValid = inputs.email.value.trim() !== '';
    const passwordIsValid = inputs.password.value.trim() !== '';

    // Jika salah satu atau kedua input tidak valid, kita mengatur status validitas (isValid) di state inputs sesuai 
    // dengan hasil validasi dan menampilkan pesan toast yang memberi tahu pengguna untuk memeriksa input mereka. 
    // Pesan toast ini akan muncul selama 3 detik di bagian bawah layar.
    if (!emailIsValid || !passwordIsValid) {
      setInputs((currentInputs) => ({
        email: { value: currentInputs.email.value, isValid: emailIsValid },
        password: { value: currentInputs.password.value, isValid: passwordIsValid },
      }));
      Toast.show('Check your input', {
        duration: 3000,
        placement: 'bottom',
        type: 'danger',
      });
      return;
    }

    // Jika kedua input valid, kita mengatur isLoading menjadi true untuk menunjukkan bahwa proses login telah dimulai.
    setIsLoading(true);

    // Selanjutnya, kita mencoba melakukan login menggunakan signInWithEmailAndPassword dari Firebase Authentication. 
    // Jika proses login berhasil, kita akan mendapatkan objek userCredential, 
    // yang berisi informasi pengguna yang berhasil login, 
    // termasuk ID pengguna (userId) dan 
    // status email yang terverifikasi (emailVerified).

    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, dataLogin.email, dataLogin.password);
      const userId = userCredential.user.uid;
      const emailVerified = userCredential.user.email

      // Jika email pengguna belum terverifikasi, pesan toast "Email belum terverifikasi" ditampilkan, 
      // dan proses login dihentikan.
      if (!emailVerified) {
        Toast.show('Email belum terverifikasi', {
          duration: 3000,
          placement: 'bottom',
          type: 'danger',
        });
        return
      } else {

        // Jika email pengguna sudah terverifikasi, data login berupa userId disimpan di penyimpanan lokal 
        // dengan menggunakan storeKey, dan pengguna diarahkan ke halaman 'home' dengan membawa userId 
        // sebagai parameter.
        storeKey('LOGGED_IN', userId);
        navigation.replace('home', { userId: userId });
      }
    } catch (error) {
      // Jika ada kesalahan dalam proses login (misalnya, kata sandi salah), 
      // kesalahan ditangani dalam blok catch, dan pesan kesalahan ditampilkan sebagai pesan toast.
      const errorMessage = error.message;
      Toast.show(errorMessage, {
        duration: 3000,
        placement: 'bottom',
        type: 'danger',
      });
    } finally {
      // Terakhir, kita mengatur isLoading kembali menjadi false dalam blok finally untuk menandakan bahwa proses login telah 
      // selesai, dan ActivityIndicator loading dihilangkan.
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <Input
          label={"Email"}
          placeholder={"Enter Email"}
          keyboardType="email-address"

          // Properti invalid ini digunakan untuk menentukan apakah input email yang dimasukkan oleh pengguna valid atau tidak. 
          // Status validitas diambil dari state inputs.email.isValid. Jika isValid true, maka input dianggap valid. Jika isValid 
          // false, maka input dianggap tidak valid.
          invalid={!inputs.email.isValid}

          // textInputConfig properti yang digunakan untuk mengkonfigurasi input teks (TextInput) yang digunakan untuk email.
          // Di dalam properti textInputConfig,kita mendefinisikan properti onChangeText, yang akan dipanggil saat pengguna 
          // memasukkan teks ke dalam input. 
          // onChangeText adalah fungsi yang akan memanggil inputChangeHandler saat pengguna memasukkan atau mengubah email. 
          // Fungsi ini akan mengubah state inputs dengan memperbarui nilai email yang dimasukkan oleh pengguna.
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
        {/* pada kode ini, tampilan tombol berubah berdasarkan status isLoading. 
         Jika sedang ada proses login yang berjalan isLoading(true), maka ActivityIndicator akan ditampilkan pada button. 
         Jika tidak ada proses login yang berjalan, maka tampilan akan menampilkan teks "Login" 
         sebagai label tombol yang dapat ditekan oleh pengguna untuk memulai proses login. */}
          <Button onPress={handleLogin}>
            {isLoading ? (
              <ActivityIndicator color="white" size="large" />
            ) :
              ('Login')
            }
          </Button>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.resetPassword} onPress={handleResetPassword}>Reset Password</Text>
        <Text style={styles.resetPassword} onPress={handleSignUp}>Registrasi</Text>
      </View>

    </View>
  )
}

export default Login

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
    marginHorizontal: 40,
    fontSize: 18,
    fontWeight: 'bold'
  },
  registration: {
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
})