import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

// Functional component Button akan menerima tiga props yang akan digunakan

// children Ini adalah prop yang berisi konten yang akan ditampilkan pada tombol
// Biasanya, ini berisi teks atau elemen lain yang ingin ditampilkan.

// OnPress Prop adalah fungsi yang akan dipanggil ketika tombol ditekan. kita bisa menentukan tindakan atau logika yang 
// akan dijalankan ketika tombol ditekan.

// backgroundColor Ini adalah warna latar belakang tombol. Jika tidak ditentukan, 
// maka warna default yang digunakan "#1b4965".

const Button = ({ children, onPress, backgroundColor }) => {

  // buttonStyles objek yang berisi gaya atau style untuk tombol. 
  // Beberapa properti gaya yang diatur di sini termasuk warna latar belakang, ukuran teks, bayangan, dan radius sudut. 
  // Ini memungkinkan kita untuk menyesuaikan tampilan tombol sesuai dengan kebutuhan.

  const buttonStyles = {
    backgroundColor: backgroundColor || "#1b4965",
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 4,
    elevation: 2,
    shadowColor: '#003049',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    width: '80%',
    shadowRadius: 2,
    borderRadius: 6,
  };

  return (
    <Pressable
    // Pada component pressable Ini fungsi style akan menentukan gaya tombol berdasarkan kondisi jika tombol ditekan atau tidak. 
    // Jika tombol ditekan (pressed = true), maka akan diterapkan gaya dari styles.pressed, 
    // jika tidak, maka akan menggunakan styles.button dan buttonStyle
      style={({ pressed }) => [styles.button, pressed && styles.pressed, buttonStyles]}
      onPress={onPress}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    opacity: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: "white",
  },
})