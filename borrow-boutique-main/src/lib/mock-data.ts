export type Genre =
  | "Fiksi"
  | "Non-Fiksi"
  | "Sastra"
  | "Sejarah"
  | "Psikologi"
  | "Bisnis"
  | "Romansa"
  | "Filsafat"
  | "Sains";

export const GENRES: Genre[] = [
  "Fiksi",
  "Non-Fiksi",
  "Sastra",
  "Sejarah",
  "Psikologi",
  "Bisnis",
  "Romansa",
  "Filsafat",
  "Sains",
];

export type Store = {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  cover: string;
  banner: string;
  description: string;
  joined: string;
  totalBooks: number;
  totalRented: number;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  cover: string;
  rating: number;
  reviewsCount: number;
  pricePerDay: number;
  deposit: number;
  stock: number;
  storeId: string;
  synopsis: string;
  pages: number;
  year: number;
  publisher: string;
  // TAMBAHKAN DUA PROPERTI INI:
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
};

export type Review = {
  id: string;
  bookId: string;
  user: string;
  rating: number;
  text: string;
  date: string;
};

export type EventItem = {
  id: string;
  title: string;
  poster: string;
  city: string;
  date: string;
  description: string;
  contact: string;
};

const cover = (seed: string, hue = 30) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=600&q=80&hue=${hue}`;

export const stores: Store[] = [
  {
    id: "s1",
    name: "Pustaka Senja",
    city: "Yogyakarta",
    rating: 4.9,
    reviews: 312,
    cover: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=80",
    description:
      "Toko buku independen di sudut Malioboro. Menyewakan koleksi sastra klasik dan kontemporer pilihan.",
    joined: "2022",
    totalBooks: 248,
    totalRented: 1820,
    
  },
  {
    id: "s2",
    name: "Kedai Aksara",
    city: "Bandung",
    rating: 4.8,
    reviews: 218,
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80",
    description: "Sudut kecil di Dago. Spesialis non-fiksi, filsafat, dan psikologi terapan.",
    joined: "2023",
    totalBooks: 167,
    totalRented: 1102,
  },
  {
    id: "s3",
    name: "Rak Pagi",
    city: "Jakarta",
    rating: 4.7,
    reviews: 421,
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1400&q=80",
    description: "Perpustakaan rental modern. Koleksi bisnis, self-development, dan biografi.",
    joined: "2021",
    totalBooks: 412,
    totalRented: 3210,
  },
  {
    id: "s4",
    name: "Bilik Cerita",
    city: "Surabaya",
    rating: 4.6,
    reviews: 156,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=80",
    description: "Toko buku anak dan keluarga. Cerita rakyat, ilustrasi, dan komik edukatif.",
    joined: "2024",
    totalBooks: 134,
    totalRented: 540,
  },
];

const _covers = [
  "https://i.postimg.cc/Ghk5T8fN/30-Best-Classic-Fall-Books-for-a-Cozy-Autumn-Read.jpg",
  "https://i.postimg.cc/pdmCZwpf/Demon-Slayer.jpg",
  "https://i.postimg.cc/fWHLnyC2/negotiate.jpg",
  "https://i.postimg.cc/G2R7zMGr/As-Long.jpg",
  "https://i.postimg.cc/J0Ys4zLX/Nieztche.jpg",
  "https://i.postimg.cc/SKwFq05H/parasites.jpg",
  "https://i.postimg.cc/ncLddRSQ/war.jpg",
  "https://i.postimg.cc/zGypSy2y/perks.jpg",
  "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1606900518i/56136945.jpg",
  "https://i.postimg.cc/k580s1Y7/madilog.jpg",
  "https://i.postimg.cc/kX3ndS8L/orientalism-edward-said.jpg",
  "https://i.postimg.cc/mDng96Ps/heaven.jpg",
  "https://i.pinimg.com/736x/11/5a/89/115a8900fdbd62a4492bd1b2c8030b9f.jpg",
  "https://i.pinimg.com/736x/8e/17/6a/8e176a8b0c8755ac425c1abe143cefed.jpg",
  "https://i.pinimg.com/1200x/6d/df/b4/6ddfb43335137ffec54449ed6019b467.jpg", //franken
  "https://i.pinimg.com/736x/2f/41/1a/2f411acef3a5bbd2ecd50cdcde7fa9db.jpg",
  "https://i.pinimg.com/1200x/47/21/90/472190af22c23d86becd2af14fe3c5f8.jpg",//albert camus
  "https://i.pinimg.com/736x/6c/1d/c4/6c1dc479b4820a264b54970d8be3a63e.jpg",
  "https://i.pinimg.com/1200x/69/28/0a/69280a52a4e9d7e7fe92e0c585fa13a0.jpg",
  "https://i.pinimg.com/736x/75/d1/b3/75d1b35d444211e48ba591a1c75b266c.jpg", //gantz
  "https://i.pinimg.com/736x/fd/f4/53/fdf4538a04bacaad6eeee3183f236322.jpg",
  "https://i.pinimg.com/1200x/d8/6c/41/d86c414137b94d94064c34207bee747d.jpg", //midnight
  "https://i.pinimg.com/736x/df/a3/f4/dfa3f456848cdfb8af316746a45e26d9.jpg",
  "https://i.pinimg.com/736x/ee/c3/7c/eec37c45c2b005f960546946d242308a.jpg",
  "https://i.pinimg.com/1200x/3b/5a/0f/3b5a0fbce8a9246201471c81e616b6fc.jpg",
  "https://i.pinimg.com/736x/01/7e/af/017eaf66f43313542e22f61e42e26083.jpg",
  "https://i.pinimg.com/1200x/46/8e/78/468e78cad39cda099a5e39f9f5d6e5ab.jpg",
  "https://i.pinimg.com/736x/af/41/e8/af41e8659b26ad8741a3d9af867a5ac8.jpg",
  "https://i.pinimg.com/1200x/6d/51/8d/6d518d9cd50668ccd015b4ac1072719d.jpg",
  "https://i.pinimg.com/1200x/c4/ed/10/c4ed104fa29fdd30c6bdeb596930d98a.jpg",
  "https://i.pinimg.com/1200x/b6/1b/f7/b61bf7325168ea08becd57eecf85ee8f.jpg",
];

// 🔴 SEBELUMNYA:
// type RawBook = Omit<Book, "cover" | "pages" | "year" | "publisher" | "reviewsCount"> & { ... }

// 🟢 UBAH MENJADI SEPERTI INI:
type RawBook = Omit<
  Book, 
  "cover" | "pages" | "year" | "publisher" | "reviewsCount" | "status" | "rejectionReason"
> & {
  reviewsCount?: number;
  cover?: string;
  pages?: number;
};

const seed: RawBook[] = [
  { id: "b1", title: "Jane Eyre", author: "Charlotte Bronthe", genre: "Sastra", rating: 4.8, pricePerDay: 4000, deposit: 75000, stock: 1, storeId: "s1", cover: "https://i.postimg.cc/Ghk5T8fN/30-Best-Classic-Fall-Books-for-a-Cozy-Autumn-Read.jpg", pages: 624, synopsis: "Jane Eyre karya Charlotte Brontë menceritakan tentang Jane, seorang gadis yatim piatu yang tumbuh dalam kehidupan penuh penderitaan dan kesepian, hingga akhirnya bekerja sebagai governess di Thornfield Hall milik Edward Rochester yang misterius. Di tengah hubungan cinta yang perlahan tumbuh di antara mereka, Jane harus menghadapi rahasia kelam yang menguji harga diri, prinsip hidup, dan keberaniannya untuk memilih antara cinta atau kebebasan dirinya sendiri." },
  { id: "b2", title: "Demon Slayer Vol 12", author: "Reza Ananta", genre: "Fiksi", rating: 4.6, pricePerDay: 5000, deposit: 85000, stock: 2, storeId: "s3", cover: "https://i.postimg.cc/pdmCZwpf/Demon-Slayer.jpg", pages: 192, synopsis: "Demon Slayer: Kimetsu no Yaiba Vol. 12 menceritakan kelanjutan setelah pertarungan sengit melawan Gyutaro dan Daki. Untuk pertama kalinya dalam lebih dari 100 tahun, salah satu iblis Upper Moon berhasil dikalahkan, membuat Muzan Kibutsuji murka dan memerintahkan para iblis kuat lainnya untuk memburu para Demon Slayer." },
  { id: "b3", title: "Negotiate Like a CEO", author: "Jotham Stein", genre: "Bisnis", rating: 4.7, pricePerDay: 6000, deposit: 100000, stock: 0, storeId: "s3", cover: "https://i.postimg.cc/fWHLnyC2/negotiate.jpg", pages: 260, synopsis: "buku bisnis karya Jotham Stein yang membahas strategi negosiasi ala CEO dan eksekutif untuk membangun pengaruh, mencapai kesepakatan, dan menghadapi konflik bisnis." },
  { id: "b4", title: "As Long As The Lemon Trees Grow", author: "Zolfa Katouh", genre: "Romansa", rating: 4.9, pricePerDay: 4500, deposit: 80000, stock: 5, storeId: "s1", cover: "https://i.postimg.cc/G2R7zMGr/As-Long.jpg", pages: 450, synopsis: "As Long as the Lemon Trees Grow karya Zoulfa Katouh adalah novel tentang Salama, seorang mahasiswi farmasi di Suriah yang hidupnya berubah total akibat perang saudara. Setelah kehilangan banyak orang yang ia cintai, Salama bekerja di rumah sakit sambil berjuang bertahan hidup dan melindungi adik iparnya. Di tengah trauma, ketakutan, dan keinginannya untuk melarikan diri dari negaranya, ia bertemu seorang pemuda bernama Kenan yang perlahan membuatnya kembali melihat harapan dan alasan untuk tetap bertahan. Novel ini mengangkat tema kehilangan, cinta, perang, dan harapan dengan suasana emosional yang sangat kuat." },
  { id: "b5", title: "Thus Spoke Zarathusta", author: "Friedrich Nietzche", genre: "Filsafat", rating: 4.5, pricePerDay: 5000, deposit: 90000, stock: 4, storeId: "s2", cover: "https://i.postimg.cc/J0Ys4zLX/Nieztche.jpg", pages: 350, synopsis: "Thus Spoke Zarathustra adalah karya filsafat sastra dari Friedrich Nietzsche yang mengikuti perjalanan Zarathustra, seorang pertapa yang turun dari gunung setelah bertahun-tahun menyendiri untuk membagikan pemikirannya kepada manusia. Melalui pidato dan perumpamaan puitis, Zarathustra membahas gagasan tentang kebebasan, kehendak untuk berkuasa, kematian Tuhan, serta konsep “Übermensch” atau manusia unggul yang mampu menciptakan makna hidupnya sendiri. Buku ini terkenal karena gaya penulisannya yang filosofis, simbolis, dan penuh refleksi eksistensial." },
  { id: "b6", title: "Parasite in Love Vol 1", author: "Sugaru Miyaki", genre: "Fiksi", rating: 4.8, pricePerDay: 3500, deposit: 60000, stock: 6, storeId: "s4", cover: "https://i.postimg.cc/SKwFq05H/parasites.jpg", pages: 196, synopsis: "Parasite in Love volume 1 menceritakan tentang Kengo Kosaka, seorang pria yang mengalami gangguan obsesif terhadap kebersihan, dan Hijiri Sanagi, siswi SMA yang mengisolasi diri dari dunia luar. Keduanya dipertemukan melalui sebuah program rehabilitasi sosial, lalu perlahan menjadi dekat karena sama-sama merasa tidak cocok dengan masyarakat. Namun, hubungan mereka terasa aneh dan misterius karena dikaitkan dengan teori tentang “parasit” yang memengaruhi pikiran dan emosi manusia, membuat kisah romansa ini terasa psikologis, melankolis, dan unsettling di saat yang sama." },
  { id: "b7", title: "War and Peace", author: "Leo Tolstoy", genre: "Sejarah", rating: 4.7, pricePerDay: 5500, deposit: 95000, stock: 2, storeId: "s2", cover: "https://i.postimg.cc/ncLddRSQ/war.jpg", pages: 1400, synopsis: "War and Peace adalah novel epik karya Leo Tolstoy yang berlatar Rusia pada masa perang Napoleon, mengikuti kehidupan beberapa keluarga bangsawan—terutama Pierre Bezukhov, Andrei Bolkonsky, dan Natasha Rostova—yang hidupnya berubah di tengah kekacauan perang, cinta, dan pencarian makna hidup. Cerita ini tidak hanya menyoroti pertempuran besar antara Rusia dan Prancis, tetapi juga menggali perjalanan batin para tokohnya dalam memahami kebahagiaan, moralitas, dan tujuan hidup. Melalui gabungan sejarah dan drama pribadi, novel ini menunjukkan bagaimana peristiwa besar dunia dan kehidupan individu saling memengaruhi secara mendalam." },
  { id: "b8", title: "The Perks of Being a Wallflower", author: "Stephen Chbosky", genre: "Psikologi", rating: 4.6, pricePerDay: 4500, deposit: 80000, stock: 3, storeId: "s2", cover: "https://i.postimg.cc/zGypSy2y/perks.jpg", pages: 240, synopsis: "The Perks of Being a Wallflower adalah novel coming-of-age karya Stephen Chbosky yang menceritakan Charlie, seorang remaja introvert dan pendiam yang mencoba menjalani kehidupan SMA sambil bergulat dengan trauma, kesepian, kesehatan mental, dan pencarian jati diri. Melalui surat-surat yang ia tulis secara anonim, Charlie menceritakan pengalaman pertamanya tentang persahabatan, cinta, kehilangan, dan bagaimana rasanya ingin diterima di dunia yang terasa begitu membingungkan baginya. Novel ini terkenal karena emosional, relatable, dan menyentuh tema-theme remaja dengan sangat jujur." },
  { id: "b9", title: "Cosmos: Possible Worlds", author: "Ann Druyan", genre: "Sains", rating: 4.7, pricePerDay: 5000, deposit: 85000, stock: 4, storeId: "s3", pages: 384, synopsis: "Cosmos: Possible Worlds adalah buku sains populer karya Ann Druyan yang mengajak pembaca menjelajahi sejarah alam semesta, perkembangan ilmu pengetahuan, dan masa depan umat manusia. Dengan gaya naratif yang puitis namun mudah dipahami, buku ini membahas evolusi kehidupan, pencarian makhluk luar angkasa, penemuan ilmiah penting, hingga tantangan yang dihadapi peradaban modern seperti perubahan iklim dan ancaman terhadap sains. Druyan menekankan bahwa rasa ingin tahu, pemikiran kritis, dan kerja sama manusia adalah kunci untuk membangun masa depan yang lebih baik di tengah luasnya kosmos." },
  { id: "b10", title: "Madilog", author: "Tan Malaka", genre: "Non-Fiksi", rating: 4.5, pricePerDay: 4000, deposit: 70000, stock: 1, storeId: "s1", cover: "https://i.postimg.cc/k580s1Y7/madilog.jpg", pages: 544, synopsis: "Madilog adalah buku filsafat dan pemikiran karya Tan Malaka yang terbit pada 1943. Judul “Madilog” merupakan singkatan dari Materialisme, Dialektika, dan Logika. Dalam buku ini, Tan Malaka mengajak masyarakat Indonesia meninggalkan cara berpikir mistis dan takhayul, lalu beralih ke pola pikir rasional, ilmiah, dan logis agar bangsa bisa maju dan merdeka. Ia juga membahas hubungan antara ilmu pengetahuan, masyarakat, politik, dan perjuangan kemerdekaan dengan gaya yang kritis dan filosofis." },
  { id: "b11", title: "Orientalism", author: "Edward Said", genre: "Sejarah", rating: 4.8, pricePerDay: 5500, deposit: 95000, stock: 3, storeId: "s2", cover: "https://i.postimg.cc/kX3ndS8L/orientalism-edward-said.jpg", pages: 340, synopsis: "Orientalism adalah buku karya Edward Said yang membahas bagaimana dunia Barat selama berabad-century menggambarkan “Timur” — terutama Timur Tengah dan Asia — sebagai sesuatu yang eksotis, terbelakang, misterius, dan inferior. Said menjelaskan bahwa pandangan tersebut bukan sekadar stereotip budaya, tetapi juga berkaitan dengan kekuasaan kolonial dan cara Barat membenarkan dominasi terhadap negara-negara Timur. Buku ini menjadi salah satu karya paling berpengaruh dalam kajian postkolonial dan kritik budaya." },
  { id: "b12", title: "Heaven", author: "Mieko Kawakami", genre: "Romansa", rating: 4.6, pricePerDay: 3500, deposit: 55000, stock: 0, storeId: "s4", cover: "https://i.postimg.cc/mDng96Ps/heaven.jpg", pages: 196, synopsis: "Heaven karya Mieko Kawakami adalah novel yang menceritakan seorang anak laki-laki SMP yang terus-menerus mengalami bullying brutal di sekolah karena matanya juling. Ia kemudian mulai berhubungan dengan Kojima, seorang siswi perempuan yang juga menjadi korban perundungan. Melalui surat dan pertemuan diam-diam, keduanya membangun hubungan yang penuh rasa sakit, kesepian, dan pencarian makna tentang kenapa manusia bisa begitu kejam terhadap orang lain. Novel ini terkenal karena suasananya yang sunyi, emosional, dan filosofis." },
  { 
    id: "b13", 
    title: "Pride and Prejudice", 
    author: "Jane Austen", 
    genre: "Sastra", 
    rating: 4.9, 
    pricePerDay: 4500, 
    deposit: 85000, 
    stock: 3, 
    storeId: "s1", 
    cover: "https://i.pinimg.com/736x/8e/17/6a/8e176a8b0c8755ac425c1abe143cefed.jpg",
    pages: 432,
    synopsis: "Mengisahkan gejolak hubungan antara Elizabeth Bennet, seorang gadis keras kepala yang cerdas, dan Fitzwilliam Darcy, seorang aristokrat kaya yang angkuh, di Inggris abad ke-19. Ketika pesona awal terhalang oleh prasangka buruk dan kesombongan kelas sosial, keduanya harus belajar menundukkan ego masing-masing demi menemukan arti cinta sejati yang melintasi batas status sosial dan ekspektasi keluarga." 
  },
  { 
    id: "b14", 
    title: "The Great Gatsby", 
    author: "F. Scott Fitzgerald", 
    genre: "Sastra", 
    rating: 4.8, 
    pricePerDay: 4000, 
    deposit: 75000, 
    stock: 4, 
    storeId: "s1", 
    cover: "https://i.pinimg.com/736x/11/5a/89/115a8900fdbd62a4492bd1b2c8030b9f.jpg",
    pages: 180,
    synopsis: "Berlatar tahun 1920-an yang glamor, penuh pesta pora, dan musik jazz, novel ini dinarasikan oleh Nick Carraway yang menyaksikan obsesi misterius tetangganya, Jay Gatsby. Gatsby membangun kekayaan luar biasa hanya demi memenangkan kembali hati Daisy Buchanan, cinta masa lalunya yang kini telah bersuami. Sebuah mahakarya tragis tentang pengejaran impian semu, kekosongan moral kaum elite, dan keputusasaan cinta yang tak sampai." 
  },
  { 
    id: "b15", 
    title: "Wuthering Heights", 
    author: "Emily Bronte", 
    genre: "Sastra", 
    rating: 4.7, 
    pricePerDay: 4000, 
    deposit: 80000, 
    stock: 2, 
    storeId: "s1", 
    cover: "https://i.pinimg.com/736x/2f/41/1a/2f411acef3a5bbd2ecd50cdcde7fa9db.jpg",
    pages: 416,
    synopsis: "Sebuah kisah cinta gothic yang gelap, intens, dan merusak di dataran tinggi Yorkshire yang sunyi dan berkabut. Berpusat pada hubungan penuh gairah namun destruktif antara Catherine Earnshaw dan Heathcliff, seorang anak yatim piatu yang diadopsi. Ketika cinta mereka terhalang oleh status sosial, penolakan tersebut memicu dendam membara dari Heathcliff yang berlangsung hingga lintas generasi, menghancurkan siapa saja yang menghalangi jalannya." 
  },
  { 
    id: "b16", 
    title: "Frankenstein", 
    author: "Mary Shelley", 
    genre: "Sastra", 
    rating: 4.8, 
    pricePerDay: 4500, 
    deposit: 85000, 
    stock: 3, 
    storeId: "s1", 
    cover: "https://i.pinimg.com/1200x/6d/df/b4/6ddfb43335137ffec54449ed6019b467.jpg",
    pages: 280,
    synopsis: "Kisah fiksi ilmiah pertama di dunia yang lahir dari imajinasi brilian Mary Shelley. Menuturkan obsesi ilmuwan muda Victor Frankenstein yang melintasi batas kodrat dengan merangkai mayat dan menghidupkannya lewat rahasia sains. Namun, makhluk ciptaannya yang kesepian justru ditolak dan dikucilkan oleh dunia karena rupa fisiknya yang mengerikan, memicu siklus balas dendam yang tragis dan mempertanyakan esensi dari kemanusiaan." 
  },
  { 
    id: "b17", 
    title: "The Myth of Sisyphus", 
    author: "Albert Camus", 
    genre: "Filsafat", 
    rating: 4.8, 
    pricePerDay: 5000, 
    deposit: 90000, 
    stock: 3, 
    storeId: "s2", 
    cover: "https://i.pinimg.com/1200x/47/21/90/472190af22c23d86becd2af14fe3c5f8.jpg",
    pages: 160,
    synopsis: "Salah satu esai filosofis paling berpengaruh di abad ke-20. Lewat metafora mitologi Yunani tentang Sisyphus yang dihukum mendorong batu besar ke puncak gunung secara berulang-ulang, Albert Camus memperkenalkan konsep 'Absurdisme'. Buku ini menggali pertanyaan eksistensial paling mendasar: bagaimana manusia harus merayakan kehidupan dan mencari makna di tengah dunia yang dingin, kacau, dan tidak rasional." 
  },
  { 
    id: "b18", 
    title: "Meditations", 
    author: "Marcus Aurelius", 
    genre: "Filsafat", 
    rating: 4.9, 
    pricePerDay: 4500, 
    deposit: 85000, 
    stock: 5, 
    storeId: "s2", 
    cover: "https://i.pinimg.com/736x/6c/1d/c4/6c1dc479b4820a264b54970d8be3a63e.jpg",
    pages: 256,
    synopsis: "Catatan harian pribadi yang ditulis oleh kaisar Romawi kuno, Marcus Aurelius, di tengah medan perang dan tekanan memimpin imperium terbesar di dunia. Tanpa niat untuk diterbitkan, jurnal ini berisi refleksi spiritual mendalam mengenai ajaran Stoikisme (Filsafat Teras). Panduan abadi untuk menjaga kedamaian mental, disiplin diri, kerendahan hati, serta ketangguhan emosional menghadapi dinamika kehidupan." 
  },
  { 
    id: "b19", 
    title: "The Prophet", 
    author: "Kahlil Gibran", 
    genre: "Filsafat", 
    rating: 4.9, 
    pricePerDay: 4000, 
    deposit: 75000, 
    stock: 4, 
    storeId: "s2", 
    cover: "https://i.pinimg.com/1200x/69/28/0a/69280a52a4e9d7e7fe92e0c585fa13a0.jpg",
    pages: 128,
    synopsis: "Sebuah mahakarya sastra filosofis puitis yang menyentuh jiwa. Mengisahkan tentang seorang al-Mustafa yang hendak naik kapal untuk pulang ke tanah airnya setelah 12 tahun menetap di kota fiktif Orphalese. Sebelum pergi, rakyat menahannya dan memintanya membagikan kebijaksanaan hidup. Lewat 26 esai puitis, Gibran membedah filsafat eksistensi manusia yang mendalam mulai dari cinta, pernikahan, anak, pekerjaan, kegembiraan, hingga kematian." 
  },
  { 
    id: "b20", 
    title: "Gantz Vol. 1", 
    author: "Hiroya Oku", 
    genre: "Fiksi", 
    rating: 4.7, 
    pricePerDay: 3500, 
    deposit: 65000, 
    stock: 3, 
    storeId: "s4", 
    cover: "https://i.pinimg.com/1200x/80/70/12/807012bd5e2b03af09164ff88d934301.jpg",
    pages: 220,
    synopsis: "Manga sci-fi aksi legendaris karya Hiroya Oku. Berawal dari Kei Kurono dan temannya yang tewas tertabrak kereta demi menyelamatkan seorang tunawisma. Bukannya lenyap, mereka justru terbangun di sebuah apartemen misterius di Tokyo bersama orang-orang mati lainnya. Di sana terdapat sebuah bola hitam rahasia bernama Gantz yang memaksa mereka mengenakan kostum futuristik dan memburu alien mengerikan demi mengumpulkan poin agar bisa membeli kembali kebebasan hidup mereka." 
  },
  { 
    id: "b21", 
    title: "Project Hail Mary", 
    author: "Andy Weir", 
    genre: "Fiksi", 
    rating: 4.9, 
    pricePerDay: 5500, 
    deposit: 95000, 
    stock: 2, 
    storeId: "s1", 
    cover: "https://i.pinimg.com/736x/fd/f4/53/fdf4538a04bacaad6eeee3183f236322.jpg",
    pages: 476,
    synopsis: "Sebuah novel fiksi ilmiah berbahasa Inggris yang mendebarkan dari penulis laris The Martian. Ryland Grace adalah satu-satunya astronot yang selamat dari misi keputusasaan menit-menit terakhir untuk menyelamatkan bumi dari kepunahan akibat fenomena kosmik. Hanya saja, dia terbangun dari koma dalam keadaan amnesia total, tidak ingat namanya atau misinya. Berbekal sains, akal sehat, dan sekutu alien tak terduga, ia harus menyusun kembali ingatannya demi memecahkan misteri ilmiah terbesar umat manusia." 
  },
  { 
    id: "b22", 
    title: "The Midnight Library", 
    author: "Matt Haig", 
    genre: "Fiksi", 
    rating: 4.8, 
    pricePerDay: 4500, 
    deposit: 80000, 
    stock: 4, 
    storeId: "s1", 
    cover: "https://i.pinimg.com/1200x/d8/6c/41/d86c414137b94d94064c34207bee747d.jpg",
    pages: 304,
    synopsis: "Di antara kehidupan dan kematian, terdapat sebuah perpustakaan ajaib yang tak berujung. Bagi Nora Seed, perpustakaan ini menawarkan kesempatan luar biasa untuk memperbaiki semua penyesalan masa lalunya. Setiap buku di rak menyediakan lembaran baru untuk mencoba kehidupan alternatif yang mungkin ia jalani jika ia mengambil keputusan berbeda. Novel fiksi psikologis-fantasi yang hangat ini menggali arti kebahagiaan sejati dan alasan mengapa hidup ini layak dipertahankan." 
  },
  { 
    id: "b23", 
    title: "What Happened to You?", 
    author: "Oprah Winfrey & Dr. Bruce Perry", 
    genre: "Psikologi", 
    rating: 4.9, 
    pricePerDay: 4500, 
    deposit: 80000, 
    stock: 3, 
    storeId: "s2", 
    cover: "https://i.pinimg.com/736x/df/a3/f4/dfa3f456848cdfb8af316746a45e26d9.jpg",
    pages: 304,
    synopsis: "Sebuah buku psikologi transformatif yang mengubah pertanyaan mendasar dari 'Ada apa denganmu?' menjadi 'Apa yang terjadi padamu?'. Lewat obrolan intim antara Oprah Winfrey dan pakar saraf Dr. Bruce Perry, buku ini membedah bagaimana trauma masa kecil, penolakan, dan pola asuh membentuk struktur otak serta perilaku kita saat dewasa. Buku yang sangat pas untuk memahami luka emosional, membangun resiliensi diri, dan memulai proses penyembuhan psikologis secara ilmiah." 
  },
  { 
    id: "b24", 
    title: "Thinking, Fast and Slow", 
    author: "Daniel Kahneman", 
    genre: "Psikologi", 
    rating: 4.7, 
    pricePerDay: 6000, 
    deposit: 110000, 
    stock: 2, 
    storeId: "s2", 
    cover: "https://i.pinimg.com/1200x/3b/5a/0f/3b5a0fbce8a9246201471c81e616b6fc.jpg",
    pages: 499,
    synopsis: "Mahakarya psikologi kognitif dari seorang peraih Nobel Ekonomi. Daniel Kahneman membawa pembaca dalam perjalanan menakjubkan membedah dua sistem yang menggerakkan cara berpikir kita. Sistem 1 yang bersifat cepat, intuitif, dan emosional; serta Sistem 2 yang lebih lambat, deliberatif, dan logis. Buku ini mengungkap bias kognitif yang sering menjebak keputusan sehari-hari, cara mengelola intuisi, dan bagaimana kita bisa memanfaatkan kedua sistem berpikir tersebut demi efektivitas hidup." 
  },
  { 
    id: "b25", 
    title: "The Silent Patient", 
    author: "Alex Michaelides", 
    genre: "Psikologi", 
    rating: 4.8, 
    pricePerDay: 5000, 
    deposit: 85000, 
    stock: 4, 
    storeId: "s2", 
    cover: "https://i.pinimg.com/736x/ee/c3/7c/eec37c45c2b005f960546946d242308a.jpg",
    pages: 336,
    synopsis: "Novel psychological thriller internasional yang luar biasa menegangkan. Berpusat pada Alicia Berenson, pelukis terkenal yang kehidupan rumah tangganya tampak sempurna. Namun suatu malam, ia menembak suaminya sebanyak lima kali di wajah dan sejak saat itu tidak pernah mengeluarkan sepatah kata pun lagi. Theo Faber, seorang psikoterapis kriminal, berjuang mendapatkan kesempatan bekerja dengannya di sebuah fasilitas aman untuk membongkar misteri kebisuan Alicia yang menyembunyikan rahasia psikologis kelam." 
  },
  { 
    id: "b26", 
    title: "This Is How You Lose the Time War", 
    author: "Amal El-Mohtar & Max Gladstone", 
    genre: "Romansa", 
    rating: 4.9, 
    pricePerDay: 5000, 
    deposit: 90000, 
    stock: 2, 
    storeId: "s1", 
    cover: "https://i.pinimg.com/736x/af/41/e8/af41e8659b26ad8741a3d9af867a5ac8.jpg",
    pages: 208,
    synopsis: "Sebuah novel romansa fiksi ilmiah epistolari yang sangat puitis dan niche. Mengisahkan dua agen rahasia dari faksi masa depan yang saling bermusuhan, Red dan Blue, yang saling meninggalkan surat rahasia di medan perang lintas waktu. Berawal dari ejekan taktis, surat-surat itu perlahan berubah menjadi hubungan cinta terlarang yang kompleks dan berbahaya, yang bisa mengubah jalannya sejarah dan mengancam nyawa mereka berdua." 
  },
  { 
    id: "b27", 
    title: "Before the Coffee Gets Cold", 
    author: "Toshikazu Kawaguchi", 
    genre: "Romansa", 
    rating: 4.8, 
    pricePerDay: 4000, 
    deposit: 75000, 
    stock: 4, 
    storeId: "s4", 
    cover: "https://i.pinimg.com/736x/01/7e/af/017eaf66f43313542e22f61e42e26083.jpg",
    pages: 213,
    synopsis: "Berlatar di sebuah kafe kecil tersembunyi di Tokyo yang menawarkan kesempatan langka bagi pelanggannya untuk melakukan perjalanan melintasi waktu. Di antara kisah-kisah emosional di dalamnya, terdapat romansa niche tentang seorang wanita yang kembali ke masa lalu untuk berbicara dengan kekasihnya yang pergi meninggalkannya, terikat oleh aturan ketat: perjalanan waktu tidak akan mengubah masa kini, dan mereka harus kembali sebelum kopi mereka mendingin." 
  },
  { 
    id: "b28", 
    title: "The Time Traveler's Wife", 
    author: "Audrey Niffenegger", 
    genre: "Romansa", 
    rating: 4.7, 
    pricePerDay: 4500, 
    deposit: 85000, 
    stock: 3, 
    storeId: "s1", 
    cover: "https://i.pinimg.com/1200x/46/8e/78/468e78cad39cda099a5e39f9f5d6e5ab.jpg",
    pages: 546,
    synopsis: "Kisah cinta non-linear yang unik dan menguras emosi antara Henry, seorang pustakawan yang menderita kelainan genetik langka sehingga ia bisa melompat maju-mundur melintasi waktu secara tidak terkendali, dan Clare, seorang seniman yang harus menjalani kehidupan dengan garis waktu normal. Hubungan romantis mereka penuh dengan ketidakpastian psikologis karena Henry sering menghilang tiba-tiba dan muncul di masa lalu atau masa depan Clare." 
  },
  { 
    id: "b29", 
    title: "Rich Dad Poor Dad", 
    author: "Robert T. Kiyosaki", 
    genre: "Bisnis", 
    rating: 4.8, 
    pricePerDay: 4500, 
    deposit: 80000, 
    stock: 4, 
    storeId: "s3", 
    cover: "https://i.pinimg.com/1200x/6d/51/8d/6d518d9cd50668ccd015b4ac1072719d.jpg",
    pages: 336,
    synopsis: "Buku finansial personal paling populer di dunia yang melegenda. Robert Kiyosaki menceritakan pengalamannya tumbuh besar bersama dua sosok ayah: 'Ayah Miskin' (ayah kandungnya yang berpendidikan tinggi namun kesulitan finansial) dan 'Ayah Kaya' (ayah sahabatnya yang putus sekolah namun menjadi salah satu orang terkaya di Hawaii). Buku ini mendobrak mitos bahwa Anda harus berpenghasilan tinggi untuk menjadi kaya, serta mengajarkan perbedaan mendasar antara aset dan liabilitas." 
  },
  { 
    id: "b30", 
    title: "Blue Ocean Strategy", 
    author: "W. Chan Kim & Renée Mauborgne", 
    genre: "Bisnis", 
    rating: 4.8, 
    pricePerDay: 5500, 
    deposit: 90000, 
    stock: 3, 
    storeId: "s3", 
    cover: "https://i.pinimg.com/1200x/c4/ed/10/c4ed104fa29fdd30c6bdeb596930d98a.jpg",
    pages: 288,
    synopsis: "Buku strategi bisnis legendaris yang menantang pemikiran konvensional tentang persaingan pasar. Penulis berargumen bahwa persaingan ketat di pasar yang penuh sesak (Red Ocean) hanya akan menghasilkan pertumpahan darah dan keuntungan yang menipis. Alih-alih bertarung dengan kompetitor, buku ini memberikan panduan sistematis untuk menciptakan ruang pasar baru yang belum terjamah (Blue Ocean), membuat kompetisi menjadi tidak relevan dengan cara memicu inovasi nilai secara simultan." 
  },
  { 
    id: "b31", 
    title: "Creativity, Inc.", 
    author: "Ed Catmull", 
    genre: "Bisnis", 
    rating: 4.9, 
    pricePerDay: 5000, 
    deposit: 85000, 
    stock: 4, 
    storeId: "s3", 
    cover: "https://i.pinimg.com/1200x/b6/1b/f7/b61bf7325168ea08becd57eecf85ee8f.jpg",
    pages: 368,
    synopsis: "Ditulis langsung oleh salah satu pendiri Pixar Animation Studios, buku ini adalah manual wajib mengenai manajemen, kepemimpinan, dan ekosistem bisnis kreatif. Ed Catmull membedah filosofi di balik kesuksesan beruntun film-film Pixar dan bagaimana membangun budaya kerja yang transparan, melindungi gagasan-gagasan baru yang masih rapuh, serta mengatasi bias kelompok yang sering kali membunuh kreativitas di dalam sebuah perusahaan besar." 
  },
];

export const books: Book[] = seed.map((b, i) => ({
  ...b,
  // Kode di bawah ini artinya: Jika di dalam seed sudah kita beri cover sendiri, gunakan itu. 
  // Jika tidak ada, baru gunakan gambar Unsplash acak bawaan seperti biasa.
  cover: (b as any).cover || _covers[i % _covers.length],
  reviewsCount: 24 + (i * 7) % 80,
  pages: b.pages ?? (180 + (i * 23) % 220),
  year: 2018 + (i % 7),
  publisher: ["Gramedia", "Mizan", "Bentang", "KPG", "Marjin Kiri"][i % 5],
  // 🔽 TAMBAHKAN LINE INI DI SINI 🔽
  status: "approved"
}));

export const reviews: Review[] = [
  { id: "r1", bookId: "b1", user: "Sinta", rating: 5, text: "Bahasanya seperti puisi. Sayang dikembalikan.", date: "2025-04-12" },
  { id: "r2", bookId: "b1", user: "Bayu", rating: 4, text: "Bab pertengahan agak lambat, tapi penutupnya menyentuh.", date: "2025-03-30" },
  { id: "r3", bookId: "b2", user: "Maya", rating: 5, text: "Tech romance yang jujur dan tidak cringe.", date: "2025-05-02" },
  { id: "r4", bookId: "b5", user: "Rangga", rating: 4, text: "Pengantar yang ramah pemula.", date: "2025-02-18" },
  { id: "r5", bookId: "b9", user: "Lia", rating: 5, text: "Metafora cosmosnya jenius.", date: "2025-04-22" },
];

export const events: EventItem[] = [
  {
    id: "e1",
    title: "Bincang Sastra: Kota & Kenangan",
    poster: "https://i.pinimg.com/736x/c5/bb/7b/c5bb7bab9ac036347456636437b6b73e.jpg",
    city: "Yogyakarta",
    date: "2026-06-14",
    description: "Diskusi hangat bersama tiga penulis muda tentang kota, kenangan, dan bagaimana keduanya hidup dalam fiksi.",
    contact: "+62 812 3456 7890",
  },
  {
    id: "e2",
    title: "Festival Baca Anak",
    poster: "https://i.pinimg.com/1200x/51/e4/f9/51e4f9edfcde16b87f52e720029948e0.jpg",
    city: "Surabaya",
    date: "2026-06-22",
    description: "Festival keluarga untuk membaca, bercerita, dan menikmati waktu bersama anak.",
    contact: "+62 821 1111 2222",
  },
  {
    id: "e3",
    title: "Workshop Menulis Esai",
    poster: "https://i.pinimg.com/1200x/b7/b5/7a/b7b57afda2642bf90d02b713d994d6f8.jpg",
    city: "Jakarta",
    date: "2026-07-05",
    description: "Mengasah tulisan, sudut pandang, dan cara bercerita lewat workshop esai bersama editor majalah sastra nasional.",
    contact: "+62 813 9999 0000",
  },
];

export const couriers = [
  { id: "jne", name: "JNE Reguler", base: 18000, days: "2-3 hari" },
  { id: "jnt", name: "J&T Express", base: 16000, days: "2-4 hari" },
  { id: "sicepat", name: "SiCepat BEST", base: 22000, days: "1-2 hari" },
];

export const PLATFORM_BANK = {
  bank: "BCA",
  number: "8810-2266-9988",
  holder: "PT PinjamBuku Indonesia (Rekber)",
};

export function formatIDR(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}
