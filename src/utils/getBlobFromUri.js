// deklarasi fungsi getBlobFromUri yang menerima satu argumen, yaitu uri. 
// Fungsi ini menggunakan async, sehingga akan mengembalikan sebuah Promise.

const getBlobFromUri = async (uri) => {

    // Di dalam fungsi ini, sebuah Promise baru dibuat. 
    // Promise ini akan mengambil blob dari URI yang diberikan.
    // Kemudian, sebuah objek XMLHttpRequest (XHR) dibuat untuk mengambil data dari URI. 
    // Ini adalah objek yang digunakan untuk melakukan permintaan HTTP.
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        //Jika permintaan berhasil (xhr.onload), resolve Promise dengan xhr.response, yang berisi data blob
        xhr.onload = function () {
            resolve(xhr.response)
        }

        //Jika ada kesalahan (xhr.onerror), maka reject Promise dengan pesan kesalahan.
        xhr.onerror = function (e) {
            reject(new TypeError("Request failed"))
        }

        //Menetapkan responseType dari XHR menjadi "blob", yang menandakan bahwa kita ingin mengambil blob sebagai hasilnya.
        xhr.responseType = "blob"
        xhr.open("GET", uri, true)
        xhr.send(null)
    })
    return blob;
}
export default getBlobFromUri