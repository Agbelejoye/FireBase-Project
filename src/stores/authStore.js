import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { db, auth } from "@/stores/utility/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { ROLE_ADMIN, ROLE_USER } from "@/constants/appConstant";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref(null);
  const error = ref(null);
  const isLoading = ref(false);
  const role = ref(null);
  const initialized = ref(false);

  // ✅ Computed
  const isAuthenticated = computed(() => user.value !== null);
  const isAdmin = computed(() => role.value === ROLE_ADMIN);

  // ✅ Clear user
  const clearUser = () => {
    user.value = null;
    role.value = null;
  };

  // ✅ Initialize Auth
  const initializeAuth = async () => {
    console.log("initializeAuth");
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser;
        await fetchUserRole(firebaseUser.uid)
        initialized.value = true;
      } else {
        clearUser();
        initialized.value = true;
      }
    });
  };

  const fetchUserRole = async(uid)=>{
    const userDoc = await getDoc(doc(db, 'users', uid))
    role.value =userDoc.exists()? userDoc.data().role : ""
  }

  // ✅ Sign up user
  const signUpUser = async (email, password) => {
    isLoading.value = true;
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCredentials.user.uid), {
        email: userCredentials.user.email,
        role: ROLE_USER,
        createdAt: new Date(),
      });

      user.value = userCredentials.user;
      role.value = ROLE_USER;
      error.value = null;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ Sign in user
  const signInUser = async (email, password) => {
    isLoading.value = true;
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredentials.user;
       await fetchUserRole(user.value.uid);
      error.value = null;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ Sign out user
  const signOutUser = async () => {
    isLoading.value = true;
    try {
      await signOut(auth);
      clearUser();
      error.value = null;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    error,
    isLoading,
    role,
    initialized,
    isAuthenticated,
    isAdmin,
    signUpUser,
    signInUser,
    signOutUser,
    initializeAuth,
  };
});
