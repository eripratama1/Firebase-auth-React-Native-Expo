import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { signOut } from 'firebase/auth'
import { firebaseAuth, firestore } from '../../config/firebase'
import { destroyKey } from '../../config/localStorage'
import { Image } from 'expo-image'
import { doc, getDoc } from 'firebase/firestore';


const Home = ({ navigation, route }) => {

  // Dalam komponen Home, kita mendefinisikan state isLoading menggunakan useState untuk mengelola status 
  // tampilan ActivityIndicator. Awalnya, isLoading diatur sebagai false danjika bernilai true activity indicator 
  // akan ditampilkan.
  const [isLoading, setIsLoading] = useState(false)
  const [dataUsers, setDataUsers] = useState([])

  // handleLogout adalah fungsi yang dipanggil ketika tombol "Logout" ditekan. 
  // Fungsi ini melakukan beberapa tindakan, termasuk keluar dari sesi autentikasi Firebase dengan signOut, 
  // menghapus kunci pada localStorage dengan destroyKey, dan mengarahkan pengguna (user) 
  // kembali ke halaman login dengan menggunakan navigation.replace.
  const handleLogout = () => {
    signOut(firebaseAuth).then(() => {
      destroyKey()
      navigation.replace('login')
    })
  }

  const { userId } = route.params

  useEffect(() => {
    setIsLoading(true)
    const docRef = doc(firestore, "users", userId)
    getDoc(docRef).then((doc) => {
      setDataUsers(doc.data())
    }).finally(() => {
      setIsLoading(false)
    })
  }, [userId])


  // Dalam konten halaman Home, Kita menampilkan gambar pengguna, teks, dan daftar elemen Pressable yang 
  // menunjukkan beberapa opsi aksi, seperti "Update Profile" dan "Update Email & Password Auth". 
  // Setiap elemen Pressable memiliki tindakan yang berbeda ketika ditekan.

  // Disini kita juga menggunakan kondisional untuk menampilkan elemen ActivityIndicator (ketika isLoading adalah true) 
  // dan ketika isLoading bernilai false barulah konten screen Home ditampilkan.
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.card}>
          <Image
            source={{ uri: dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}` }}
            style={styles.userImg}
          />
          <Text style={{ margin: 18, textAlign: 'center' }}>Dashboard - {dataUsers.fullname}</Text>
          <View style={styles.cardContent}>

            <Pressable
              onPress={() => navigation.navigate('update-profile', {
                userId: userId,
                fullname: dataUsers.fullname,
                imageUri: dataUsers.imageUri
              })}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
              <Text style={styles.itemText}>Update Profile</Text>
              <AntDesign style={{ marginTop: 4, marginBottom: 4 }} name="rightsquare" size={22} color="black" />
            </Pressable>

            <Pressable

              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
              <Text style={styles.itemText}>Update Email & Password Auth</Text>
              <AntDesign style={{ marginTop: 4, marginBottom: 4 }} name="rightsquare" size={22} color="black" />
            </Pressable>

            <Pressable onPress={handleLogout}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
              <Text style={styles.itemText}>Logout</Text>
              <AntDesign style={{ marginTop: 4, marginBottom: 4 }} name="logout" size={22} color="black" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'whitesmoke'
  },
  card: {
    backgroundColor: '#ffca28',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    margin: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    width: '85%',
    justifyContent: 'center'
  },
  cardContent: {
    padding: 16
  },
  userImg: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 50,
    borderRadius: 75
  },
  item: {
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: '#e9edc9',
    shadowOpacity: 0.15,
    shadowColor: '#003049',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    justifyContent: 'space-between',
    borderRadius: 8
  },
  itemText: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 6
  },
  itemPressed: {
    opacity: 0.7
  }
})