import { defineStore } from "pinia";
import {ref, computed} from 'vue'
import { db, auth, firebaseApp } from '@/stores/utility/firebaseConfig'
import { doc, setDoc} from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { ROLE_ADMIN, ROLE_USER } from "@/constants/appConstant";

isAuthenticated = computed(() => user.value !== null)
const isAdmin = computed(() => role.value === ROLE_ADMIN)

const initializeAuth = async ()=>{
    console.log('initializeAuth')

    onAuthStateChanged(auth, async(firebaseUser)=>{
        if(firebaseUser){
            user.value = firebaseUser
            initialized.value = true
        }

        else{
            clearUser();
        }
    })
}


export const useAuthStore = defineStore(
    "authStore", ()=>{
        const user= ref(null);
        const error = ref(null);
        const isLoading= ref(false);
        const role = ref(null);
        const initialized = ref(false)

        const signUpUser= async(email,password)=>{
            isLoading.value = true;
            try {
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

                await setDoc(doc(db, 'user', userCredentials.user.uid), {
                    email:userCredentials.user.email,
                    role: ROLE_USER,
                    createdAt: new Date()
                })
                clearUser()
                user.role=null;
                error.value = null
            } 
            
            catch (e) {
                error.value =e.message
                throw e    
            }

            finally{
                isLoading.value = false;
            }
        }

        const clearUser =()=>{
            user.value = null
            role.value = null
        }

        // SIGN IN
        const signInUser= async(email,password)=>{
            isLoading.value = true;
            try {
                const userCredentials = await signInWithEmailAndPassword(auth, email, password)

                user.value = userCredentials.user;
                user.role=ROLE_USER;
                error.value = null
            } 
            
            catch (e) {
                error.value =e.message
                throw e    
            }

            finally{
                isLoading.value = false;
            }
        }

        return{
            user,error,isLoading,role, isAdmin, isAuthenticated, signUpUser, signInUser,initializeAuth
        }
    }
)