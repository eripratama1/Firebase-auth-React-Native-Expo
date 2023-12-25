import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Toast } from 'react-native-toast-notifications'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firebaseAuth, firestore } from '../../config/firebase'
import { getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut, updateEmail, verifyBeforeUpdateEmail } from 'firebase/auth'
import { destroyKey } from '../../config/localStorage'

const UpdateEmail = ({ route, navigation }) => {

  /**
   * Mengakses nilai dari parameter email yang dikirimkan melalui objek params di objek route dari 
   * screen Home
   */
  const currentEmail = route.params.email

  /**
   * Mengakses nilai dari parameter userId yang juga dikirimkan melalui objek params di objek route.
   */
  const userId = route.params.userId

  /**
   * State ini digunakan untuk menyimpan nilai input password saat ini (currentPassword) dan 
   * alamat email baru (email), bersama dengan properti isValid yang menunjukkan apakah nilai input valid atau tidak
   */
  const [inputs, setInputs] = useState({
    currentPassword: { value: '', isValid: true },
    email: { value: '', isValid: true }
  })

  // isLoading: Ini adalah state yang digunakan untuk mengontrol tampilan ActivityIndicator ketika proses login 
  // sedang berlangsung.
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Fungsi inputChangeHandler digunakan untuk menghandle perubahan nilai pada input, 
   * khususnya untuk input currentPassword dan alamat email baru.
   * 
   * Fungsi ini akan memperbarui nilai state inputs dengan nilai baru yang dimasukkan oleh pengguna, 
   * dan mengatur status validitasnya sebagai true. 
   * Pembaruan state ini kemudian akan menyebabkan re-rendering komponen dengan nilai input yang terbaru
   */
  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,  // Salin nilai state yang sudah ada

        /**
         * Perbarui nilai input yang sesuai dengan enteredValue dan tentukan isValid sebagai true
         */
        [inputIdentifier]: { value: enteredValue, isValid: true }
      }
    })
  }

  /**
   * Penggunaan useLayoutEffect disini akan merubah tampilan dari header screen
   * update email sesuai dengan opsi yang saudah ditentukan.
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Update Email',
      headerTextAlign: 'center',
      headerStyle: { backgroundColor: '#164da4' }
    })
  }, [])

  /** Jika menggunakan method updateEmail mengalami kendala atau error 
   * bisa menggunakan method verifyBeforeUpdateEmail dibawah ini
   */
  /** Update email authentication with method verifyBeforeUpdateEmail */

  const updateEmailUser = async () => {

    /**
     * Validasi input disini untuk memastikan bahwa input yang dimasukkan oleh pengguna (user)
     * tidak hanya terdiri dari spasi atau kosong.
     */
    const currentPasswordIsValid = inputs.currentPassword.value.trim() !== ''
    const emailIsValid = inputs.email.value.trim() !== ''

    /**
     * Jika input tidak valid, tampilkan pesan kesalahan menggunakan library toast
     */
    if (!currentPasswordIsValid || !emailIsValid) {
      setInputs((currentInputs) => ({
        currentPassword: { value: currentInputs.currentPassword.value, isValid: currentPasswordIsValid },
        email: { value: currentInputs.email.value, isValid: emailIsValid }
      }))
      Toast.show("Data belum lengkap", { duration: 3000, placement: 'bottom', type: 'error' })
    }

    /**
     * Persiapkan data untuk pembaruan email authentication
     */
    const dataUpdateEmail = {
      /**Nilai currentPassword didapat dari state currentPassword */
      currentPassword: inputs.currentPassword.value,

      /**
       * Nilai currentEmail didapat dari object currentEmail yang sudah diinisiasikan di atas
       * yang mana nilainya didapatkan dari passing parameter di screen Home.
       */
      currentEmail: currentEmail,

      /**Nilai newMail didapat dari state email */
      // newMail: inputs.email.value
      newMail: inputs.email.value
    }

    console.log("Result data update email", dataUpdateEmail);
    /**Membuar referensi ke collection users berdasaarkan userId pengguna(user) yang login */
    const colRef = doc(firestore, "users", userId)

    setIsLoading(true)

    try {
      /** Ambil snapshot dokumen users */
      const querySnapshot = await getDoc(colRef)

      /** Login dengan alamat email dan password saat ini */
      await signInWithEmailAndPassword(firebaseAuth, dataUpdateEmail.currentEmail, dataUpdateEmail.currentPassword)

      /** Perbarui alamat email di Firebase Authentication */
      // await updateEmail(firebaseAuth.currentUser, dataUpdateEmail.newMail)
      await verifyBeforeUpdateEmail(firebaseAuth.currentUser, dataUpdateEmail.newMail)

      /** Jika berhasil Tampilkan pesan sukses menggunakan toast */
      Toast.show("Email Updated Successfull", { duration: 3000, placement: 'bottom', type: 'success' })

      /** Jika data pada collection users ditemukan di Firestore */
      if (querySnapshot.exists()) {

        /** Perbarui alamat email di Firestore */
        await updateDoc(doc(firestore, "users", userId), {
          email: dataUpdateEmail.newMail
        })
      }
      /**
       * Logout dari Firebase Authentication, hapus key yang tersimpan di localStorage, 
       * dan navigasi ke layar login
       */
      await signOut(firebaseAuth)
      destroyKey()
      navigation.replace('login')
    } catch (error) {

      /** Jika terjasi kesalahan tampilkan pesan error menggunakan toast */
      const errMessage = error.message
      Toast.show('error', { duration: 3000, placement: 'bottom', type: 'danger', data: errMessage })
    }
  }

  /** Update email authentication with method verifyBeforeUpdateEmail */


  /** Update email authentication with method udpateEmail */

  // const updateEmailUser = async () => {

  //   /**
  //    * Validasi input disini untuk memastikan bahwa input yang dimasukkan oleh pengguna (user)
  //    * tidak hanya terdiri dari spasi atau kosong.
  //    */
  //   const currentPasswordIsValid = inputs.currentPassword.value.trim() !== ''
  //   const emailIsValid = inputs.email.value.trim() !== ''

  //   /**
  //    * Jika input tidak valid, tampilkan pesan kesalahan menggunakan library toast
  //    */
  //   if (!currentPasswordIsValid || !emailIsValid) {
  //     setInputs((currentInputs) => ({
  //       currentPassword: { value: currentInputs.currentPassword.value, isValid: currentPasswordIsValid },
  //       email: { value: currentInputs.email.value, isValid: emailIsValid }
  //     }))
  //     Toast.show("Data belum lengkap", { duration: 3000, placement: 'bottom', type: 'error' })
  //   }

  //   /**
  //    * Persiapkan data untuk pembaruan email authentication
  //    */
  //   const dataUpdateEmail = {
  //     /**Nilai currentPassword didapat dari state currentPassword */
  //     currentPassword: inputs.currentPassword.value,

  //     /**
  //      * Nilai currentEmail didapat dari object currentEmail yang sudah diinisiasikan di atas
  //      * yang mana nilainya didapatkan dari passing parameter di screen Home.
  //      */
  //     currentEmail: currentEmail,

  //     /**Nilai newMail didapat dari state email */
  //     // newMail: inputs.email.value
  //     newMail:inputs.email.value
  //   }

  //   console.log("Result data update email", dataUpdateEmail);
  //   /**Membuar referensi ke collection users berdasaarkan userId pengguna(user) yang login */
  //   const colRef = doc(firestore, "users", userId)

  //   setIsLoading(true)
  //   try {
  //     /** Ambil snapshot dokumen users */
  //     const querySnapshot = await getDoc(colRef)

  //     /** Login dengan alamat email dan password saat ini */
  //     await signInWithEmailAndPassword(firebaseAuth, dataUpdateEmail.currentEmail, dataUpdateEmail.currentPassword)

  //     /** Perbarui alamat email di Firebase Authentication */
  //     // await updateEmail(firebaseAuth.currentUser, dataUpdateEmail.newMail)
  //     await updateEmail(firebaseAuth.currentUser, dataUpdateEmail.newMail)

  //     /** Jika berhasil Tampilkan pesan sukses menggunakan toast */
  //     Toast.show("Email Updated Successfull", { duration: 3000, placement: 'bottom', type: 'success' })

  //     /** Jika data pada collection users ditemukan di Firestore */
  //     if (querySnapshot.exists()) {

  //       /** Perbarui alamat email di Firestore */
  //       await updateDoc(doc(firestore, "users", userId), {
  //         email: dataUpdateEmail.newMail
  //       })

  //       /** Lalu kirim email verifikasi */
  //       await sendEmailVerification(firebaseAuth.currentUser)
  //       Toast.show("email verification sent", { duration: 3000, placement: 'bottom', type: 'success' })
  //     }

  //     /**
  //      * Logout dari Firebase Authentication, hapus key yang tersimpan di localStorage, 
  //      * dan navigasi ke layar login
  //      */
  //     await signOut(firebaseAuth)
  //     destroyKey()
  //     navigation.replace('login')
  //   } catch (error) {

  //     /** Jika terjasi kesalahan tampilkan pesan error menggunakan toast */
  //     const errCode = error.code
  //     const errMessage = error.message
  //     console.log(errMessage);
  //     Toast.show('error', { duration: 3000, placement: 'bottom', type: 'danger', data: errMessage })
  //   }
  // }

  /** Update email authentication with method udpateEmail */

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

            // Properti invalid ini digunakan untuk menentukan apakah input currentPassword yang dimasukkan oleh 
            // pengguna valid atau tidak. 
            // Status validitas diambil dari state inputs.currentPassword.isValid. 
            // Jika isValid true, maka input dianggap valid. Jika isValid 
            // (false), maka input dianggap tidak valid.
            invalid={!inputs.currentPassword.isValid}

            // textInputConfig properti yang digunakan untuk mengkonfigurasi input teks (TextInput) yang digunakan untuk currentPassword.
            // Di dalam properti textInputConfig,kita mendefinisikan properti onChangeText, yang akan dipanggil saat pengguna 
            // memasukkan teks ke dalam input. 
            // onChangeText adalah fungsi yang akan memanggil inputChangeHandler saat pengguna memasukkan atau mengubah currentPassword. 
            // Fungsi ini akan mengubah state inputs dengan memperbarui nilai email yang dimasukkan oleh pengguna.
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, 'currentPassword')
            }}
          />

          <Input
            label={"Email"}
            keyboardType={"email-address"}
            placeholder={"Enter new email"}

            // Properti invalid ini digunakan untuk menentukan apakah input email yang dimasukkan oleh pengguna valid atau tidak. 
            // Status validitas diambil dari state inputs.email.isValid. Jika isValid true, maka input dianggap valid. Jika isValid 
            // false, maka input dianggap tidak valid.
            invalid={!inputs.email.isValid}

            // Properti invalid ini digunakan untuk menentukan apakah input email yang dimasukkan oleh pengguna valid atau tidak. 
            // Status validitas diambil dari state inputs.email.isValid. Jika isValid true, maka input dianggap valid. Jika isValid 
            // false, maka input dianggap tidak valid.
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, 'email')
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={updateEmailUser}>
            {isLoading ? (
              <ActivityIndicator color="white" size="large"/>
            ): ('Update email')}
          </Button>
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