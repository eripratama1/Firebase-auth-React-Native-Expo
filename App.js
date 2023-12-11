import Routes from './src/routes';
import { ToastProvider } from 'react-native-toast-notifications';
import React from 'react';

export default function App() {
  return (
    // Dalam kode ini, komponen ToastProvider dan Routes dikelompokkan bersama dalam <React.Fragment>, 
    // sehingga mereka akan digunakan bersamaan dalam tampilan utama aplikasi. Jadi, ketika aplikasi dijalankan, 
    // komponen ini akan dirender, dan pengguna akan dapat berinteraksi dengan antarmuka pengguna yang 
    // ditentukan di dalam komponen Routes. Jika ada notifikasi yang ingin ditampilkan, 
    // kita juga dapat menggunakan ToastProvider untuk menampilkannya.

    // React.Fragment adalah komponen pembungkus yang memungkinkan kita untuk mengelompokkan beberapa komponen bersama 
    // dalam satu elemen. Biasanya digunakan ketika kita ingin mengembalikan beberapa elemen tanpa mengelilinginya dengan 
    // elemen induk yang sebenarnya. Dalam kasus ini, ini digunakan untuk mengelompokkan beberapa komponen bersama
    <React.Fragment>

      {/* ToastProvider adalah komponen yang diberikan oleh pustaka 'react-native-toast-notifications' 
        untuk menampilkan notifikasi toast kepada user. 
        */}
      <ToastProvider>
      
      {/* Routes komponen yang diimpor dari file './src/routes' yang akan digunakan untuk menavigasi antarmuka pengguna 
      aplikasi Ini adalah tempat utama di mana tampilan aplikasi akan diatur. */}
        <Routes />
      </ToastProvider>
    </React.Fragment>
  );
}
