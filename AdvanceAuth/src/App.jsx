import './App.css'
import { Routes , Route, Navigate } from'react-router-dom'
import SignUpPage from './Pages/SignUpPage'
import FloatingShape from './components/FloatingShape'
import LoginPage from './Pages/LoginPage'
import EmailVerificationPage from './Pages/EmailVerificationPage'
import Home from './Pages/Home'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import ForgotPassword from './Pages/ForgotPassword'

//protected routes that require authentication

const ProtectedRoutes = ({children})=>{
  const { isAuthenticated , user } = useAuthStore();
  if(!isAuthenticated){
    return <Navigate to='/login' replace/>
  }
  if(!user.isVarified){
    return <Navigate to='/verify-email' replace/>
  }
  return children;
}


//redirected authenticated users to the home page
const RedirectedAuthenticatedUser = ({children})=>{
  const { isAuthenticated , user} = useAuthStore();
  if(isAuthenticated && user?.isVarified){ // there should be user condition like { isAuthenticated && user} 
    return <Navigate to='/home' replace/>
  }
  return children;
}

function App() {
  const  { isCheckingAuth , checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log(isCheckingAuth);
 
  
  
  return (
    <div  
    className='min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'
    >
    <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
    <Routes>
      <Route path='/login' element={
        <RedirectedAuthenticatedUser>
          <LoginPage />
        </RedirectedAuthenticatedUser>
      } />
      <Route path='/Signup' element={
        <RedirectedAuthenticatedUser>
          <SignUpPage />
        </RedirectedAuthenticatedUser>
      }/>
      <Route path='/verify-email' element={<EmailVerificationPage />} />
      <Route path='/home' element={
        <ProtectedRoutes>
          <Home/>    
        </ProtectedRoutes>
      }/>
      <Route path='/forgot-password' element={
        <RedirectedAuthenticatedUser>
          <ForgotPassword/>
      </RedirectedAuthenticatedUser>} />
    </Routes>
    <Toaster/>
    </div>
  )
}

export default App
