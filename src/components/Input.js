import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

// Fungsional component input akan menerima beberapa props

// keyboardType: Prop ini digunakan untuk menentukan jenis keyboard yang akan muncul saat pengguna berinteraksi dengan 
// input teks.

// label: Prop Ini adalah teks yang akan ditampilkan sebagai label di atas input teks.
// style: Prop ini memungkinkan kita untuk menentukan gaya tambahan untuk komponen input.
// value: nilai yang akan ditampilkan dalam input teks.
// textInputConfig: Prop ini adalah objek yang berisi konfigurasi tambahan untuk elemen TextInput.

// secureTextEntry: Prop ini digunakan untuk menentukan apakah teks yang dimasukkan 
//harus disembunyikan (biasanya digunakan untuk kata sandi).

// invalid: Prop ini digunakan untuk menunjukkan apakah input dianggap tidak valid. 
// Jika invalid bernilai true, akan diterapkan gaya tambahan yang menunjukkan input tidak valid.


const Input = ({ keyboardType, label, style, value, textInputConfig, secureTextEntry, invalid, placeholder }) => {
  const inputStyles = [styles.input]

  // Jika invalid bernilai true, styles.invalidInput akan ditambahkan ke dalam array, 
  // sehingga input akan memiliki gaya yang menunjukkan input tidak valid.
  if (invalid) {
    inputStyles.push(styles.invalidInput)
  }

  return (
    <View style={[styles.inputContainer,style]}>
      <Text style={[styles.label, invalid && styles.invalidLabel]}>{label}</Text>
      
      {/* elemen input teks utama yang akan menampilkan nilai, placeholder, dan 
      konfigurasi lain yang diteruskan sebagai prop. */}
      <TextInput
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        {...textInputConfig}
        style={inputStyles}
        placeholder={placeholder}
      />
      
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8
  },
  label: {
    fontSize: 18,
    marginBottom: 4
  },
  input: {
    backgroundColor: '#edf2f4',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  invalidLabel: {
    color: 'red'
  },
  invalidInput: {
    backgroundColor: 'red'
  }
})