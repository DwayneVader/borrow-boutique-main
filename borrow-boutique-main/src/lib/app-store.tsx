import * as React from "react";
import { books as seedBooks, type Book, type Review, reviews as seedReviews } from "./mock-data";

export type User = {
  id: string;
  name: string;
  email: string;
  isStoreOwner: boolean;
  storeId?: string;
  role?: "penyewa" | "store_owner" | "super_admin";
};

export type OrderStatus =
  | "menunggu_pembayaran"
  | "menunggu_verifikasi"
  | "diproses"
  | "dikirim"
  | "dipinjam"
  | "proses_pengembalian"
  | "selesai"
  | "ditolak";

export type Order = {
  id: string;
  bookId: string;
  userId: string;
  storeId: string;
  startDate: string;
  durationDays: number;
  address: string;
  courier: string;
  shipping: number;
  rentTotal: number;
  deposit: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentProof?: string;
  trackingForward?: string;
  trackingReturn?: string;
  returnCourier?: string;
  returnProof?: string;
  fine?: number;
  refunded?: number;
};

type Mode = "user" | "store" | "admin";

type Ctx = {
  user: User | null;
  mode: Mode;
  setMode: (m: Mode) => void;
  login: (email: string, name?: string, asStoreOwner?: boolean, isAdmin?: boolean) => void;
  register: (name: string, email: string, asStoreOwner: boolean) => void;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  cart: { bookId: string }[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  addBook: (b: Omit<Book, "id">) => void;
  // 🟢 PERBAIKAN: Mendaftarkan tipe data updateBookStatus ke dalam Context
  updateBookStatus: (id: string, status: "approved" | "rejected", rejectionReason?: string) => void;
  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "date">) => void;
  updateReview: (id: string, text: string, rating: number) => void;
  deleteReview: (id: string) => void;
  orders: Order[];
  createOrder: (o: Omit<Order, "id" | "status" | "createdAt">) => Order;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  authPrompt: { open: boolean; reason?: string };
  requireAuth: (reason?: string) => boolean;
  closeAuthPrompt: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const AppContext = React.createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [mode, setMode] = React.useState<Mode>("user");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [cart, setCart] = React.useState<{ bookId: string }[]>([]);
  const [books, setBooks] = React.useState<Book[]>(seedBooks);
  const [reviews, setReviews] = React.useState<Review[]>(seedReviews);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [authPrompt, setAuthPrompt] = React.useState<{ open: boolean; reason?: string }>({ open: false });
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    if (user) {
      if (user.role === "super_admin") setMode("admin");
      else if (user.role === "store_owner") setMode("store");
      else setMode("user");
    }
  }, [user]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const login: Ctx["login"] = (email, name = "Pembaca", asStoreOwner = false, isAdmin = false) => {
    let ditentukanRole: User["role"] = "penyewa";
    if (isAdmin) ditentukanRole = "super_admin";
    else if (asStoreOwner) ditentukanRole = "store_owner";

    const u: User = {
      id: isAdmin ? "admin-01" : "u1",
      name: isAdmin ? "Super Admin" : name,
      email,
      isStoreOwner: isAdmin ? false : asStoreOwner,
      storeId: asStoreOwner ? "s1" : undefined,
      role: ditentukanRole
    };
    setUser(u);
    setAuthPrompt({ open: false });
  };

  const register: Ctx["register"] = (name, email, asStoreOwner) => {
    login(email, name, asStoreOwner);
  };

  const logout = () => {
    setUser(null);
    setMode("user");
  };

  const toggleFavorite = (id: string) => {
    if (!user) return setAuthPrompt({ open: true, reason: "Tambahkan ke favorit" });
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };

  const addToCart = (id: string) => {
    if (!user) return setAuthPrompt({ open: true, reason: "Tambahkan ke keranjang" });
    setCart((c) => (c.some((x) => x.bookId === id) ? c : [...c, { bookId: id }]));
  };
  const removeFromCart = (id: string) => setCart((c) => c.filter((x) => x.bookId !== id));
  const clearCart = () => setCart([]);

  const addBook: Ctx["addBook"] = (b) => {
    setBooks((bs) => [{ ...b, id: "b" + (bs.length + 1 + Math.floor(Math.random() * 1000)) }, ...bs]);
  };

  // 🟢 PERBAIKAN: Menambahkan logika updateBookStatus untuk memproses moderasi
  const updateBookStatus: Ctx["updateBookStatus"] = (id, status, rejectionReason) => {
    setBooks((bs) =>
      bs.map((book) =>
        book.id === id ? { ...book, status, rejectionReason } : book
      )
    );
  };

  const addReview: Ctx["addReview"] = (r) =>
  setReviews((rs) => [
    { ...r, id: "r" + (rs.length + 1 + Math.floor(Math.random() * 1000)), date: new Date().toISOString().slice(0, 10) },
    ...rs,
  ]);
  const updateReview: Ctx["updateReview"] = (id, text, rating) =>
    setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, text, rating } : r)));
  const deleteReview: Ctx["deleteReview"] = (id) => setReviews((rs) => rs.filter((r) => r.id !== id));

  const createOrder: Ctx["createOrder"] = (o) => {
    const order: Order = {
      ...o,
      id: "ord-" + Date.now(),
      status: "menunggu_pembayaran",
      createdAt: new Date().toISOString(),
    };
    setOrders((os) => [order, ...os]);
    setBooks((bs) => bs.map((b) => (b.id === o.bookId ? { ...b, stock: Math.max(0, b.stock - 1) } : b)));
    return order;
  };

  const updateOrder: Ctx["updateOrder"] = (id, patch) => {
    setOrders((os) =>
      os.map((o) => {
        if (o.id !== id) return o;
        const next = { ...o, ...patch };
        if (patch.status === "selesai") {
          setBooks((bs) => bs.map((b) => (b.id === o.bookId ? { ...b, stock: b.stock + 1 } : b)));
        }
        return next;
      })
    );
  };

  const requireAuth = (reason?: string) => {
    if (user) return true;
    setAuthPrompt({ open: true, reason });
    return false;
  };
  const closeAuthPrompt = () => setAuthPrompt({ open: false });

  return (
    <AppContext.Provider
      value={{
        user, mode, setMode, login, register, logout,
        favorites, toggleFavorite, cart, addToCart, removeFromCart, clearCart,
        // 🟢 PERBAIKAN: Memasukkan updateBookStatus ke value provider agar bisa diakses komponen lain
        books, setBooks, addBook, updateBookStatus, reviews, addReview, updateReview, deleteReview,
        orders, createOrder, updateOrder,
        authPrompt, requireAuth, closeAuthPrompt,
        theme, toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const c = React.useContext(AppContext);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}