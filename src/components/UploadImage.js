import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import Button from './Button';

const UploadImage = ({ fullname, onImageUpload,imageUri }) => {

    const [uploadImage, setUploadImage] = useState(null)

    console.log(fullname);

    async function UploadImageHandler() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        setUploadImage(result.assets[0].uri)
        onImageUpload(result.assets[0].uri)
    }

    let imagePreview = <Image style={styles.userImg} source={{ uri: imageUri ? imageUri : `https://ui-avatars.com/api/?name=${fullname}` }} />

    if (uploadImage) {
        imagePreview = <Image style={styles.userImg} source={{ uri: uploadImage }} />
    }

    return (
        <View style={{ flexDirection: 'row' }}>
            <View>
                {imagePreview}
            </View>
            <View style={{ marginTop: 45, marginHorizontal: 50, width: '60%' }}>
                <Button onPress={UploadImageHandler}>Upload Image</Button>
            </View>
        </View>
    )
}

export default UploadImage

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%'
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
        borderRadius: 4
    },
    userImg: {
        width: 100,
        height: 100,
        marginHorizontal: 25,
        marginVertical: 25,
        borderRadius: 75
    },
})