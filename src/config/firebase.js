import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {

    // apiKey: "AIzaSyB754uO4N_W5x03Hnr8lFs1TgeU2NkUCaw",
    // authDomain: "rne-auth-firebase.firebaseapp.com",
    // projectId: "rne-auth-firebase",
    // storageBucket: "rne-auth-firebase.appspot.com",
    // messagingSenderId: "789023374361",
    // appId: "1:789023374361:web:8c0150461306a7be30fe88"

    apiKey: "AIzaSyAX_nEtIKWEbSuWUBkdZlN4kyfwnxlil6M",
    authDomain: "rn-expo-1b5c9.firebaseapp.com",
    projectId: "rn-expo-1b5c9",
    storageBucket: "rn-expo-1b5c9.appspot.com",
    messagingSenderId: "775014144107",
    appId: "1:775014144107:web:34cee25e5367f78bb9792e"
};

// fungsi initializeApp dengan objek firebaseConfig bertindak sebagai argumen untuk menginisialisasi Firebase dalam 
// aplikasi. Hasil inisialisasi disimpan dalam variabel app
const app = initializeApp(firebaseConfig);

// getFirestore digunakan untuk menginisialisasi layanan Firebase Firestore, yang merupakan basis data Firebase. 
// Hasil inisialisasi disimpan dalam variabel firestore.
export const firestore = getFirestore(app)

// getStorage ini digunakan untuk menginisialisasi layanan Firebase Storage, 
// yang digunakan untuk menyimpan dan mengelola berkas di Firebase. 
// Hasil inisialisasi disimpan dalam variabel storage. 
// Layanan ini berguna ketika kita ingin menyimpan berkas seperti gambar atau dokumen.
export const storage = getStorage(app)

// initializeAuth: digunakan untuk menginisialisasi layanan Firebase Authentication. 
// kita juga mengatur opsi persistence ke getReactNativePersistence(ReactNativeAsyncStorage). 
// menyimpan sesi otentikasi pengguna di perangkat dengan 
// menggunakan React Native Async Storage. 
export const firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})