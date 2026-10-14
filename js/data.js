// Data master penilaian Takbiran.
// Kriteria skor 1-5 pada DATA_7LANGKAH berasal dari
// "Form Penilaian 7 langkah pelayanan Labbaik Chicken dengan kriteria.xlsx".

const TOKO_LIST = [
  "LC CIPASIR",
  "LC Cileunyi",
  "LC PANDANWANGI",
  "LC Jatos",
  "LC SIMPANG LIMA",
  "LC CIMANUK",
  "LC Indihiang",
  "LC Siliwangi Tasik",
  "LC Singaparna",
  "LC Bulak Laut",
  "LC Margaasih",
  "LC Katapang",
  "LC Gading Tutuka",
  "LC Alfathu",
  "LC Ciwidey",
  "LC Sukamenak",
  "LC RANCAMANYAR",
  "LC Baleendah",
  "LC Bojongsoang",
  "LC Perumnas Cirebon",
  "LC PERJUANGAN",
  "LC Sumber",
  "LC Weru",
  "LC Sudirman Indramayu",
  "LC MAJALENGKA",
  "LC Angkrek",
  "LC Tegal",
  "LC Cibaraja",
  "LC Palabuhan Ratu",
  "LC Caringin",
  "LC Cidahu",
  "LC Cimanggu",
  "LC Cibinong",
  "LC CAGAR ALAM",
  "LC Antapani",
  "LC Babakansari",
  "LC Derwati",
  "LC Batununggal",
  "LC Sukagalih",
  "LC TUBAGUS ISMAIL",
  "LC Ujung berung",
  "LC Margahayu",
  "LC BANTENG",
  "LC Ahmad Yani",
  "LC Munjul",
  "LC Galuhmas",
  "LC Mega Regency",
  "LC cihampelas",
  "LC PERMATA CIMAHI",
  "LC Sarimanah",
  "LC GEGERKALONG",
  "LC BHAYANGKARA",
  "LC Lopang",
  "LC Cipocok",
  "LC Ciwaru",
  "LC Kaligandu",
  "LC Pakupatan",
  "LC Ciruas",
  "LC Pipitan",
  "LC Kragilan",
  "LC Cikande",
  "LC Kasemen",
  "LC Ciracas",
  "LC Legok",
  "LC Kelapa Dua",
  "LC Baros",
  "LC Petir",
  "LC WARUNG GUNUNG",
  "LC Multatuli",
  "LC Juanda",
  "LC ONA SILIWANGI",
  "LC Gardu Tanjak",
  "LC Majasari",
  "LC Taktakan",
  "LC PCI",
  "LC Taman Cilegon Indah",
  "LC Cibeber",
  "LC Kalitimbang",
  "LC Serdang",
  "LC Waringin Kurung",
  "LC Lebak Indah",
  "LC Seneja",
  "LC Anyer",
  "LC BBS",
  "LC Kramatwatu",
  "LC Warnasari",
  "LC Krenceng",
  "LC Kebon Dalam",
  "LC Jombang",
  "LC Bojonegara",
  "LC Merak",
  "LC Grogol",
  "LC Temu Putih",
  "LC Tegal Cabe",
  "LC Menes",
  "LC Labuan",
  "LC Panimbang",
  "LC Bukit Barisan",
  "LC Rumbai",
  "LC Panam Simpang Satria",
  "OFC legok jabar",
  "OFC Cibatu",
  "OFC CiCURUG"
];

const DATA_7LANGKAH = [
  {
    "section": "GREETING",
    "items": [
      {
        "name": "3S (Senyum, salam, sapa)",
        "bobot": 5,
        "kriteria": {
          "1": "Tidak melakukan 3S sama sekali",
          "2": "Hanya melakukan salah satu dari senyum/salam/sapa",
          "3": "Senyum dan sapa ada tetapi tidak lengkap atau masih datar",
          "4": "Senyum, salam, sapa dilakukan lengkap tetapi salah satunya kurang konsisten/kurang hangat",
          "5": "Konsisten tersenyum, eye contact, salam dan sapa terdengar jelas dengan kesan hangat"
        }
      },
      {
        "name": "Gestur tangan terbuka",
        "bobot": 4,
        "kriteria": {
          "1": "Tidak menggunakan gestur terbuka dan komunikasi cenderung tanpa gestur",
          "2": "Gestur terbatas; lebih sering menunjuk dengan jari/jempol atau tangan tidak mendukung komunikasi",
          "3": "Sesekali menggunakan gestur tangan terbuka, tetapi lebih sering tangan pasif/di area kerja",
          "4": "Menggunakan open palm saat berkomunikasi tetapi belum konsisten di setiap momen",
          "5": "Menggunakan open palm saat menyambut dan saat mengarahkan customer; gestur natural dan konsisten"
        }
      },
      {
        "name": "Menanyakan \"makan disini?\"",
        "bobot": 5,
        "kriteria": {
          "1": "Tidak menanyakan sama sekali",
          "2": "Pertanyaan dilakukan setelah customer sudah memesan/kurang tepat timing-nya",
          "3": "Menanyakan tetapi kurang jelas, kurang ramah, atau hanya formalitas",
          "4": "Menanyakan dengan jelas tetapi respons lanjutan masih standar",
          "5": "Menanyakan dengan jelas dan ramah apakah makan di tempat/take away, lalu merespons sesuai jawaban customer"
        }
      }
    ]
  },
  {
    "section": "TAKING ORDER",
    "items": [
      {
        "name": "Menanyakan nama customer",
        "bobot": 4,
        "kriteria": {
          "1": "Tidak menanyakan nama",
          "2": "Menanyakan nama hanya jika diingatkan atau dilakukan tidak konsisten",
          "3": "Menanyakan nama tetapi terdengar kaku/terburu-buru",
          "4": "Menanyakan nama dengan jelas tetapi belum dimanfaatkan dalam interaksi berikutnya",
          "5": "Menanyakan nama dengan ramah dan menggunakan nama tersebut dalam proses pelayanan"
        }
      },
      {
        "name": "Menyebut nama sendiri",
        "bobot": 4,
        "kriteria": {
          "1": "Tidak memperkenalkan nama sama sekali",
          "2": "Memperkenalkan diri sangat cepat/kaku sehingga sulit dipahami",
          "3": "Memperkenalkan diri tetapi kurang jelas atau terlalu cepat",
          "4": "Memperkenalkan nama sendiri dengan jelas tetapi masih sedikit kaku/terburu-buru",
          "5": "Memperkenalkan nama sendiri dengan jelas, natural, dan percaya diri"
        }
      },
      {
        "name": "Memberi respon ketika customer memesan",
        "bobot": 7,
        "kriteria": {
          "1": "Tidak memberi respons sama sekali",
          "2": "Respons minim atau hanya muncul pada akhir pesanan",
          "3": "Memberi respons singkat seperti 'siap/baik/oke' tanpa menunjukkan engagement kuat",
          "4": "Memberi respons positif pada sebagian besar pesanan tetapi belum konsisten",
          "5": "Setiap item pesanan mendapat respons positif yang relevan dan menunjukkan bahwa crew mendengarkan"
        }
      },
      {
        "name": "Eye contact",
        "bobot": 5,
        "kriteria": {
          "1": "Full fokus ke tab/tidak melakukan eye contact",
          "2": "Eye contact sekitar 30–50%; mayoritas fokus ke tab",
          "3": "Eye contact sekitar 60–70%; masih sering melihat tab saat berkomunikasi",
          "4": "Eye contact konsisten pada sebagian besar interaksi, sesekali fokus ke tab",
          "5": "Eye contact konsisten saat berbicara dan mendengarkan tanpa mengganggu ketepatan input order"
        }
      }
    ]
  },
  {
    "section": "SUGGESTIVE SELLING",
    "items": [
      {
        "name": "Tidak mengabsen menu",
        "bobot": 5,
        "kriteria": {
          "1": "Membacakan/menyebut menu satu per satu tanpa pendekatan kebutuhan customer",
          "2": "Sering mengabsen/menyebut banyak menu sehingga customer bingung",
          "3": "Kadang masih menyebut beberapa pilihan menu sebelum menggali kebutuhan",
          "4": "Tidak mengabsen menu, tetapi masih ada beberapa kalimat yang terasa seperti membacakan pilihan",
          "5": "Tidak membacakan daftar menu; langsung menggali kebutuhan dan memberi rekomendasi yang relevan"
        }
      },
      {
        "name": "Merekomendasikan menu yang relevan",
        "bobot": 8,
        "kriteria": {
          "1": "Tidak memberikan rekomendasi sama sekali",
          "2": "Rekomendasi kurang relevan dengan pesanan/kebutuhan customer",
          "3": "Memberi satu rekomendasi yang relevan tetapi masih umum",
          "4": "Rekomendasi relevan tetapi alasan/penjelasannya belum maksimal",
          "5": "Rekomendasi sangat relevan dengan pesanan/kebutuhan customer dan disertai alasan singkat yang meyakinkan"
        }
      },
      {
        "name": "Menggunakan bahasa suggestive \"mau coba?/sekalian\"",
        "bobot": 5,
        "kriteria": {
          "1": "Tidak melakukan suggestive selling",
          "2": "Penawaran terdengar ragu/defensif seperti 'barangkali' atau 'mungkin'",
          "3": "Menggunakan kalimat suggestive sederhana tetapi kurang natural",
          "4": "Menggunakan bahasa suggestive tetapi masih terdengar seperti hafalan",
          "5": "Menggunakan bahasa suggestive natural seperti 'sekalian' atau 'mau coba?' dan tidak memaksa"
        }
      },
      {
        "name": "Rekomendasi menu promo",
        "bobot": 8,
        "kriteria": {
          "1": "Tidak mengetahui/tidak menawarkan promo yang sedang berlaku",
          "2": "Promo disebutkan sekilas/kurang jelas dan tidak membantu keputusan customer",
          "3": "Menawarkan promo secara umum tanpa mengaitkan dengan kebutuhan customer",
          "4": "Menawarkan promo relevan tetapi belum konsisten",
          "5": "Selalu mengetahui dan menawarkan promo yang relevan dengan pesanan customer tanpa mengganggu alur pelayanan"
        }
      }
    ]
  },
  {
    "section": "REPEAT ORDER",
    "items": [
      {
        "name": "Menyebutkan menu sesuai urutan",
        "bobot": 3,
        "kriteria": {
          "1": "Tidak melakukan repeat order",
          "2": "Mengulangi pesanan tetapi urutannya acak atau ada bagian yang kurang ditegaskan",
          "3": "Mengulangi pesanan dengan benar tetapi kurang jelas/kurang detail",
          "4": "Mengulangi pesanan sesuai urutan dan request tetapi tempo bicara sedikit cepat",
          "5": "Mengulangi seluruh pesanan sesuai urutan, termasuk variasi/request, dengan jelas dan perlahan"
        }
      },
      {
        "name": "Menyebutkan harga",
        "bobot": 4,
        "kriteria": {
          "1": "Tidak menyebutkan harga sebelum menerima pembayaran",
          "2": "Menyebutkan harga sangat singkat/kurang jelas sehingga berpotensi menimbulkan salah paham",
          "3": "Menyebutkan harga secara singkat tetapi masih dapat dipahami",
          "4": "Menyebutkan total harga dengan jelas tetapi tempo sedikit cepat",
          "5": "Menyebutkan total harga dengan jelas, perlahan, lengkap, dan mudah dikonfirmasi customer"
        }
      },
      {
        "name": "Menanyakan metode pembayaran",
        "bobot": 4,
        "kriteria": {
          "1": "Tidak menanyakan/konfirmasi metode pembayaran",
          "2": "Menanyakan dengan kalimat kurang jelas atau setelah customer mulai membayar",
          "3": "Menanyakan metode pembayaran secara standar tanpa konfirmasi kebutuhan customer",
          "4": "Menanyakan metode pembayaran dengan jelas tetapi belum selalu proaktif",
          "5": "Menanyakan/konfirmasi metode pembayaran dengan jelas sebelum transaksi dan memberi arahan bila diperlukan"
        }
      }
    ]
  },
  {
    "section": "PACKING",
    "items": [
      {
        "name": "Menyiapkan fast product apabila ada",
        "bobot": 5,
        "kriteria": {
          "1": "Tidak menyiapkan fast product padahal ada pesanan",
          "2": "Fast product sering terlambat disiapkan dan customer harus menunggu",
          "3": "Fast product disiapkan setelah transaksi selesai atau mendekati waktu handover",
          "4": "Fast product disiapkan tetapi belum konsisten tepat waktu",
          "5": "Fast product langsung disiapkan sesuai standar sebelum/selama proses transaksi sehingga siap saat dibutuhkan"
        }
      }
    ]
  },
  {
    "section": "GIVING",
    "items": [
      {
        "name": "Meletakan & menyebutkan fast product yang telah disiapkan sebelumnya",
        "bobot": 5,
        "kriteria": {
          "1": "Tidak memberikan/menyebutkan fast product yang sudah disiapkan",
          "2": "Fast product diberikan kurang rapi/kurang jelas sehingga customer perlu bertanya",
          "3": "Fast product diberikan tetapi hanya diletakkan tanpa penjelasan yang kuat",
          "4": "Meletakkan dan menyebutkan fast product dengan jelas tetapi belum maksimal pada gestur/handover",
          "5": "Meletakkan fast product dengan rapi, menyebutkan produknya dengan jelas, dan memastikan customer menerima"
        }
      },
      {
        "name": "Menyelesaikan transaksi",
        "bobot": 5,
        "kriteria": {
          "1": "Transaksi tidak terselesaikan dengan benar",
          "2": "Transaksi lambat atau ada langkah yang terlewat sehingga mengganggu customer",
          "3": "Transaksi selesai tetapi masih perlu arahan/konfirmasi tambahan",
          "4": "Transaksi selesai dengan benar tetapi ada sedikit jeda/ketidakjelasan yang tidak berdampak pada customer",
          "5": "Transaksi diselesaikan cepat, akurat, customer memahami total/pembayaran, dan tidak ada langkah yang terlewat"
        }
      },
      {
        "name": "Memberikan Strook dengan 2 tangan",
        "bobot": 5,
        "kriteria": {
          "1": "Tidak memberikan struk",
          "2": "Memberikan struk dengan satu tangan atau diletakkan di meja",
          "3": "Memberikan struk dengan sopan tetapi salah satu tangan tidak konsisten",
          "4": "Memberikan struk dengan dua tangan tetapi tanpa komunikasi/gestur tambahan",
          "5": "Memberikan struk dengan dua tangan, sopan, jelas, dan memastikan customer menerima"
        }
      }
    ]
  },
  {
    "section": "CLOSING",
    "items": [
      {
        "name": "Memberi estimasi waktu & WCS apabila ada pesanan menunggu",
        "bobot": 4,
        "kriteria": {
          "1": "Tidak memberi estimasi maupun WCS",
          "2": "Informasi diberikan setelah customer bertanya/menunggu cukup lama",
          "3": "Memberi estimasi atau WCS saja; informasi belum lengkap",
          "4": "Memberi estimasi dan WCS dengan jelas tetapi belum konsisten pada setiap pesanan menunggu",
          "5": "Selalu memberi estimasi waktu yang realistis dan WCS/nomor pengambilan dengan jelas saat ada pesanan menunggu"
        }
      },
      {
        "name": "Ditutup dengan salam dan do'a",
        "bobot": 5,
        "kriteria": {
          "1": "Tidak melakukan closing sama sekali",
          "2": "Closing hanya berupa ucapan singkat/kurang ramah",
          "3": "Closing dilakukan dengan salam/doa singkat dan standar",
          "4": "Closing dengan salam/doa jelas tetapi masih sedikit kaku",
          "5": "Closing dengan salam/doa yang jelas, ramah, hangat, dan membuat customer merasa dihargai"
        }
      }
    ]
  }
];

const DATA_DOUBLECHECK = [
  {
    "section": "PENGECEKAN PESANAN",
    "items": [
      {
        "name": "Mengecek kualitas product"
      },
      {
        "name": "Mengecek kelengkapan condiment"
      },
      {
        "name": "Mencoret docket/check strook"
      }
    ]
  },
  {
    "section": "PERSIAPAN SEBELUM MEMANGGIL CUSTOMER",
    "items": [
      {
        "name": "Menjajarkan pesanan di atas meja pick up"
      },
      {
        "name": "Membuka setengah packaging (take away)"
      },
      {
        "name": "Menyiapkan alat makan (side menu)"
      },
      {
        "name": "Menyiapkan plastic bag (take away) / tray (Dine in)"
      }
    ]
  },
  {
    "section": "MEMANGGIL CUSTOMER",
    "items": [
      {
        "name": "Menggunakan WCS"
      },
      {
        "name": "Mengucap \"terima kasih telah menunggu\""
      },
      {
        "name": "Meminta WCS untuk dikembalikan"
      },
      {
        "name": "Meminjam strook customer untuk cek kedua"
      }
    ]
  },
  {
    "section": "MENGECEK PRODUK",
    "items": [
      {
        "name": "Menyebutkan menu sambil diperlihatkan pada customer"
      },
      {
        "name": "Mencoret strook customer di bagian produk yang sudah siap diberikan"
      },
      {
        "name": "Mengembalikan strook sebelum memberikan pesanan"
      },
      {
        "name": "Closing: Memberikan pesanan sambil mengucap terima kasih & do'a"
      }
    ]
  }
];

// Double check order: seluruh item berbobot sama.
const DC_ITEM_COUNT = DATA_DOUBLECHECK.reduce((n, s) => n + s.items.length, 0);
const DC_BOBOT = 100 / DC_ITEM_COUNT;

const DATA_KEBERSIHAN = {
  "parkir": {
    "label": "Parkir",
    "items": [
      {
        "name": "Area parkir bersih dan rapi",
        "bobot": 15
      },
      {
        "name": "Marka parkir jelas dan tidak pudar",
        "bobot": 5
      },
      {
        "name": "Tulisan \"Parkir Gratis\" tersedia",
        "bobot": 15
      },
      {
        "name": "Tempat sampah tersedia",
        "bobot": 5
      },
      {
        "name": "Tempat sampah bersih & tertutup",
        "bobot": 10
      },
      {
        "name": "Tanaman bersih & terawat",
        "bobot": 5
      },
      {
        "name": "Tidak ada bau menyengat",
        "bobot": 15
      },
      {
        "name": "CCTV tersedia",
        "bobot": 15
      },
      {
        "name": "CCTV berfungsi dengan baik",
        "bobot": 15
      }
    ]
  },
  "counter": {
    "label": "Counter Kasir",
    "items": [
      {
        "name": "Counter bersih dari debu & kotoran",
        "bobot": 12
      },
      {
        "name": "Area counter bersih & rapi",
        "bobot": 10
      },
      {
        "name": "Balon tersedia (akhir pekan)",
        "bobot": 5
      },
      {
        "name": "Payung tersedia",
        "bobot": 5
      },
      {
        "name": "Tempat sampah tersedia",
        "bobot": 5
      },
      {
        "name": "Tempat sampah bersih & tertutup",
        "bobot": 8
      },
      {
        "name": "Lampu chicken warm menyala semua",
        "bobot": 12
      },
      {
        "name": "Menu board jelas & tidak pudar",
        "bobot": 10
      },
      {
        "name": "Media promosi terbaru terpasang",
        "bobot": 10
      },
      {
        "name": "Menu TV Board menyala",
        "bobot": 8
      },
      {
        "name": "Menu TV Board menampilkan menu relevan",
        "bobot": 7
      },
      {
        "name": "Tempat menunggu pesanan tersedia",
        "bobot": 8
      }
    ]
  },
  "dining": {
    "label": "Dining",
    "items": [
      {
        "name": "Kaca & pintu bersih tanpa noda",
        "bobot": 3
      },
      {
        "name": "Lantai bersih",
        "bobot": 5
      },
      {
        "name": "Tidak ada ubin pecah membahayakan",
        "bobot": 5
      },
      {
        "name": "Dinding bersih & cemerlang",
        "bobot": 3
      },
      {
        "name": "Meja bersih & tidak lengket",
        "bobot": 6
      },
      {
        "name": "Kursi bersih & kokoh",
        "bobot": 5
      },
      {
        "name": "Langit-langit bersih (tanpa sarang laba-laba)",
        "bobot": 3
      },
      {
        "name": "Tempat sampah tersedia",
        "bobot": 2
      },
      {
        "name": "Tempat sampah bersih & tertutup",
        "bobot": 3
      },
      {
        "name": "Suhu udara nyaman",
        "bobot": 5
      },
      {
        "name": "Tidak ada bau menyengat",
        "bobot": 5
      },
      {
        "name": "Pengharum ruangan tersedia",
        "bobot": 2
      },
      {
        "name": "Wi-Fi tersedia",
        "bobot": 3
      },
      {
        "name": "Kecepatan internet baik",
        "bobot": 3
      },
      {
        "name": "Colokan listrik berfungsi",
        "bobot": 3
      },
      {
        "name": "Colokan listrik terpasang rapi & aman",
        "bobot": 3
      },
      {
        "name": "Lampu menyala semua",
        "bobot": 3
      },
      {
        "name": "Nasyid diputar dengan volume sesuai",
        "bobot": 5
      },
      {
        "name": "Bebas serangga, kucing, pengamen",
        "bobot": 5
      },
      {
        "name": "Baby chair tersedia",
        "bobot": 2
      },
      {
        "name": "Baby chair bersih & berfungsi",
        "bobot": 3
      },
      {
        "name": "Playland tersedia",
        "bobot": 2
      },
      {
        "name": "Playland bersih & aman",
        "bobot": 4
      },
      {
        "name": "Wastafel tersedia",
        "bobot": 2
      },
      {
        "name": "Wastafel bersih",
        "bobot": 4
      },
      {
        "name": "Kaca wastafel bersih",
        "bobot": 2
      },
      {
        "name": "Sabun cuci tangan tersedia",
        "bobot": 5
      },
      {
        "name": "Pengering/tisu tangan tersedia",
        "bobot": 4
      }
    ]
  },
  "toilet": {
    "label": "Toilet",
    "items": [
      {
        "name": "Toilet bersih & tidak berbau",
        "bobot": 14
      },
      {
        "name": "Lantai bersih & tidak licin",
        "bobot": 10
      },
      {
        "name": "Dinding bersih",
        "bobot": 5
      },
      {
        "name": "Langit-langit bersih",
        "bobot": 3
      },
      {
        "name": "Air mengalir lancar",
        "bobot": 10
      },
      {
        "name": "Flush toilet berfungsi",
        "bobot": 10
      },
      {
        "name": "Pintu dapat dikunci",
        "bobot": 8
      },
      {
        "name": "Sabun cuci tangan tersedia",
        "bobot": 8
      },
      {
        "name": "Tisu toilet tersedia",
        "bobot": 5
      },
      {
        "name": "Tempat sampah tersedia",
        "bobot": 3
      },
      {
        "name": "Tempat sampah bersih & tertutup",
        "bobot": 5
      },
      {
        "name": "Pengharum ruangan tersedia",
        "bobot": 5
      },
      {
        "name": "Lampu menyala baik",
        "bobot": 7
      },
      {
        "name": "Ventilasi/exhaust berfungsi",
        "bobot": 7
      }
    ]
  },
  "mushola": {
    "label": "Mushola",
    "items": [
      {
        "name": "Lantai bersih, tidak lengket/licin",
        "bobot": 13
      },
      {
        "name": "Tempat wudhu bersih",
        "bobot": 10
      },
      {
        "name": "Air wudhu mengalir lancar",
        "bobot": 10
      },
      {
        "name": "Sandal wudhu tersedia",
        "bobot": 5
      },
      {
        "name": "Sajadah tersedia",
        "bobot": 8
      },
      {
        "name": "Sarung tersedia",
        "bobot": 5
      },
      {
        "name": "Mukena tersedia",
        "bobot": 8
      },
      {
        "name": "Sajadah, sarung, mukena bersih & harum",
        "bobot": 10
      },
      {
        "name": "Al-Quran tersedia",
        "bobot": 5
      },
      {
        "name": "Rak perlengkapan rapi",
        "bobot": 3
      },
      {
        "name": "Pengharum ruangan tersedia",
        "bobot": 5
      },
      {
        "name": "Tidak ada bau menyengat",
        "bobot": 10
      },
      {
        "name": "Arah kiblat terlihat jelas",
        "bobot": 8
      }
    ]
  }
};

const AREA_ORDER = ['parkir', 'counter', 'dining', 'toilet', 'mushola'];
