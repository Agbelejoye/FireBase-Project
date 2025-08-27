import { db } from "@/stores/utility/firebaseConfig";
import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const productCollection = collection(db, "products");

export default {
  async createProduct(productData) {
    const docRef = await addDoc(productCollection, productData);
    return { id: docRef.id, ...productData };
  },

  async getProducts() {
    const snapshot = await getDocs(productCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getProductById(id) {
    if (!id) throw new Error("Product id is required");
    const productRef = doc(db, "products", id);
    const snapshot = await getDoc(productRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  },

  async updateProduct(id, productData) {
    if (!id) throw new Error("Product id is required to update");
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, productData);
    return { id, ...productData };
  },

  async deleteProduct(id) {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  },
};
