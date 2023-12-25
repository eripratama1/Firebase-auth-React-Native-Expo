import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore, storage } from '../../config/firebase'
import { Toast } from 'react-native-toast-notifications'
import getBlobFromUri from '../../utils/getBlobFromUri'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Button from '../../components/Button'
import Input from '../../components/Input'
import UploadImage from '../../components/UploadImage'

const UpdateProfile = ({ route, navigation }) => {

  // Mendapatkan userId dari parameter route
  const userId = route.params.userId

  // State untuk menyimpan URI gambar yang dipilih
  const [selectedImage, setSelectedImage] = useState('')

  // State untuk menyimpan input pengguna
  const [inputs, setInputs] = useState({
    fullname: {
      value: '', isValid: true
    }
  })

  // isLoading: Ini adalah state yang digunakan untuk mengontrol tampilan ActivityIndicator ketika proses login 
  // sedang berlangsung.
  const [isLoading, setIsLoading] = useState(false)

  // Fungsi yang dipanggil ketika nilai input berubah (onChange)
  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true }
      }
    })
  }

  // Fungsi untuk mengatur URI gambar yang dipilih
  function uploadImageHandler(imageUri) {
    setSelectedImage(imageUri)
  }

  // useLayoutEffect akan mengubah tampilan header yang ada pada screen updateProfile
  // dan akan menampilkan fullname user login yang didapat dari route.params
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Update Profile : ${route.params.fullname}`,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#164da4'
      }
    })
  }, [route.params])

  const handleUpdateData = async () => {

    /**
     * Jika tidak ada gambar yang dipilih
     * Maka lakikan proses update data tanpa upload gambar ke storage
     * 
     */

    if (!selectedImage) {

      /**
       * Mengkakses data document berdasarkan userId user yang login
       * lalu pada object dataUpdate nilai untuk fullname kita menggunakan ternary operator
       * dimana kita akan menggunakan nilai dari state inputs
       * jika user mengubah nilai yang ada pada state tersebut dan jika tidak gunakan nilai awal yang 
       * di dapat dari route.params.fullname     * 
       */
      const colRef = doc(firestore, "users", userId);
      const dataUpdate = {
        fullname: inputs.fullname.value ? inputs.fullname.value : route.params.fullname
      };

      setIsLoading(true)
      /**
       * Kemudian jalankan proses updateDoc jika berhasil atau gagal tampilkan toast sesuai
       * yang telah didefinisikan berikut. Lalu redirect kembali ke halaman/screen Homr
       */
      try {
        await updateDoc(colRef, dataUpdate);
        Toast.show("Profile updated", {
          duration: 3000,
          placement: 'bottom',
          type: 'success'
        })
      } catch (error) {
        Toast.show(error, {
          duration: 3000,
          placement: 'bottom',
          type: 'danger'
        })
      } finally {
        navigation.replace("home", { userId: userId });
      }

    } else {

      /**
       * Membuat object bloblFIle yang akan memanggil fungsi getBlobFromUri yang ada 
       * di folder /src/utils dan juga kita menambahkan state selectedImageyang akan menyimpan 
       * uri dari gambar yang dipilih.
       * Uri ini akan di ubah dalam bentuk blob agar lebih mudah untuk proses upload
       * file gambar ke storage.
       */
      const blobFile = await getBlobFromUri(selectedImage)

      /**
       * Jika ada gambar yang diupload oleh user jalankan proses pengecekan terlebih dulu
       * pada document sesuai dengan userId dari user yang login
       */
      if (selectedImage) {

        try {
          const colref = doc(firestore, "users", userId);
          const docSnapshot = await getDoc(colref);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();

            /**
             * Jika user sudah memiliki gambar jalankan proses untuk hapus gambar lama
             * tersebut. Setelah berhasil lakukan proses upload gambar yang baru ke storage
             */
            if (userData && userData.imageUri) {
              const imageUri = userData.imageUri;
              const imgRef = ref(storage, imageUri);
              await deleteObject(imgRef);
              Toast.show("Delete old image", {
                duration: 500,
                placement: 'bottom',
                type: 'warning'
              })
            }
          }

          setIsLoading(true)
          /**
           * Mengatur lokasi penyimpanan dan nama dari file gambar yang di upload ke storage
           * unutk penamaan gambarnya menggunakan fungsi date dari javascript
           */
          const storagePath = "imgUsers/" + new Date().getTime();

          /**
           * Membuat reference untu storage
           */
          const storageRef = ref(storage, storagePath);

          /**
           * uploadTask object yang akan menjalankan proses upload file gambar ke storage
           * dengan menggunakan uploadBytesResumeable dari firebase/storage yang didalamnya kita tambahkan 
           * 2 parameter untuk storage reference-nya (storageRef) dan file image (blobFile)
           */
          const uploadTask = uploadBytesResumable(storageRef, blobFile);

          /**
           * Untuk kode dibawah ini akan menampilkan progress dari upload file image ke storage
           * hingga proses tersebut selesai dilakukan
           * progress itu kita tampilkan menggunakan toast yang kita import
           * dari react-native-toast-notification
           */
          uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case 'paused':
                Toast.show("Progress upload" + progress.toFixed(0) + '%',
                  { duration: 1000, placement: 'bottom', type: 'warning' })
                break;
              case 'running':
                Toast.show("Progress upload" + progress.toFixed(0) + '%',
                  { duration: 1000, placement: 'bottom', type: 'warning' })
                break;
              case 'success':
                Toast.show("Progress upload" + progress.toFixed(0) + '%',
                  { duration: 3000, placement: 'bottom', type: 'success' })
                break;
            }
          }, (err) => {
            Toast.show("Progress upload" + err,
              { duration: 3000, placement: 'bottom', type: 'danger' })
          }, async () => {

            /**
             * Setelah proses upload file image berhasil panggil fungsi getDownloadURL 
             * dari firebase/storage untuk mendapatkan link url image yang sudah kita upload
             * ke storage dan kita gunakan object downloadURL yang berisi link image tersebut
             * pada proses update dokumen firestore
             */
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const colRef = doc(firestore, "users", userId);

            /**
             * Membuat object dataUpdateWithImage yang akan digunakan untuk mengupdate dokumen pada
             * collection users dimana kita menambahkan file gambar yang sudah di upload ke storage (imageUri)
             */
            const dataUpdateWithImage = {
              fullname: inputs.fullname.value ? inputs.fullname.value : route.params.fullname,
              imageUri: downloadURL
            };

            /**
             * Jalan proses update dokumen setalh berhasil tampilkan pesan dalam bentuk toast
             * lalu redirect kembali ke screen/halaman home.js
             */
            await updateDoc(colRef, dataUpdateWithImage);
            Toast.show("Profile updated", { duration: 3000, placement: 'bottom', type: 'success' })
            navigation.replace("home", { userId: userId })
          });
        } catch (error) {
          console.log(error);
        }

      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1 }}>

        {/* 
           Di komponen UploadImage passing beberapa props yang akan kita gunakan
           pada komponen tersebut yang nilainya kita dapatkan dari route.params dan 
           fungsi uploadImageHandler         
        */}
        <UploadImage
          fullname={route.params.fullname}
          imageUri={route.params.imageUri}
          onImageUpload={uploadImageHandler}
        />

        <View style={{ justifyContent: 'center', margin: 20 }}>
          <Input
            label="Fullname"
            invalid={!inputs.fullname.isValid}
            textInputConfig={{
              defaultValue: route.params.fullname,
              onChangeText: inputChangeHandler.bind(this, 'fullname')
            }}
          />
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20, width: '100%' }}>
          <Button onPress={handleUpdateData} backgroundColor="#ffc300">
            {isLoading ? (
              <ActivityIndicator color="white" size="large" />
            ) : ("Update profile")}
          </Button>
        </View>
      </ScrollView>
    </View>
  )
}

export default UpdateProfile

const styles = StyleSheet.create({})