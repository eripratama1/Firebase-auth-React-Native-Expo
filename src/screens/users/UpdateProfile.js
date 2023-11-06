import { ScrollView, StyleSheet, Text, View } from 'react-native'
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

  const userId = route.params.userId
  const [selectedImage, setSelectedImage] = useState('')

  const [inputs, setInputs] = useState({
    fullname: {
      value: '', isValid: true
    }
  })

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true }
      }
    })
  }

  function uploadImageHandler(imageUri) {
    setSelectedImage(imageUri)
  }

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
    if (!selectedImage) {

      const colRef = doc(firestore, "users", userId);
      const dataUpdate = {
        fullname: inputs.fullname.value ? inputs.fullname.value : route.params.fullname
      };

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
        navigation.replace("Home", { userId: userId });
      }

    } else {

      const blobFile = await getBlobFromUri(selectedImage)

      if (selectedImage) {
        try {
          const colref = doc(firestore, "users", userId);
          const docSnapshot = await getDoc(colref);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();

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

          const storagePath = "imgUsers/" + new Date().getTime();
          const storageRef = ref(storage, storagePath);
          const uploadTask = uploadBytesResumable(storageRef, blobFile);

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
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const colRef = doc(firestore, "users", userId);

            const dataUpdateWithImage = {
              fullname: inputs.fullname.value ? inputs.fullname.value : route.params.fullname,
              imageUri: downloadURL
            };
            await updateDoc(colRef, dataUpdateWithImage);
            Toast.show("Profile updated", { duration: 3000, placement: 'bottom', type: 'success' })
            navigation.replace("home", { userId: userId })
          });
        } catch (error) {
          Toast.show({ type: 'error', text1: error });
        }
      }
    }
  }

  return (
    <View style={{ flex: 1,backgroundColor:'white' }}>
      <ScrollView style={{ flex: 1 }}>

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
          <Button onPress={handleUpdateData} backgroundColor="#ffc300">Update Profile</Button>
        </View>
      </ScrollView>
    </View>
  )
}

export default UpdateProfile

const styles = StyleSheet.create({})