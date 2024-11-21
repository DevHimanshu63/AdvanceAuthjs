import {create} from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth'
axios.defaults.withCredentials = true;   
export const useAuthStore = create((set)=>({
    user:null ,
    isAuthenticated:false, 
    error:null,
    isLoading:false,
    isCheckingAuth:false,

    signup: async(name , email , password)=>{
        set({isLoading:true, error:null})
        try{
            const response = await axios.post(`http://localhost:4000/api/auth/signup`,{name,email,password})
            console.log('response from signup',response);
            set({user:response.data.user, isAuthenticated:true, isLoading:false})
        }catch(error){
            console.log(error);
            set({error:error.response.data.message || "Error sigining up", isLoading:false})
            throw error ;
        }
    } ,

    verifyEmail : async(code)=>{
        set({isLoading:true, error:null})
        try{
            const response = await axios.post(`${API_URL}/verify-email`,{code})
            set({user:response.data.user, isAuthenticated:true, isLoading:false})
            return response.data ;
        }catch(error){
            set({error:error.response.data.message || "Error verifying email", isLoading:false})
            throw error ;
        }
    },

    checkAuth: async ()=>{
        set({isCheckingAuth:true, error:null})
        try{
            const response = await axios.get(`${API_URL}/check-auth`)
            console.log(response);
            set({user:response.data.user, isAuthenticated:true, isCheckingAuth:false})
        }catch(error){
            set({error:error.response.data.message || "Error checking authentication", isAuthenticated:true, isCheckingAuth:false})
        }
    } 
,
    login: async(email , password)=>{
        set({isLoading:true, error:null})
        try{
            const response = await axios.post(`${API_URL}/login`,{email , password})
            set({user:response.data.user, isAuthenticated:true, isLoading:false , error:null})
        }catch(error){
            set({error:error.response?.data?.message || "Error logging in", isLoading:false})
            throw error ;
        }
    }



}))