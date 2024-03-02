import {useState, useContext} from 'react'

import './signin.css'
import Logo from '../../assets/logo.png'
import Thumb from '../../assets/thumb.png'
import { Link } from 'react-router-dom'
import {AuthContext} from '../../contexts/auth'



export default function SignIn(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signIn,loadingAuth} = useContext(AuthContext);

    function handleLogar(e){
       e.preventDefault();
       
       if(email !== '' && password !== ''){
         signIn(email, password);
       }

    }
    return(
       
        <div className='container-center'>
            <div className='thumbnail'>
             <div className='foto'>
             <img src={Thumb}  alt=""/>
             </div>
             <div className='Info'>
                <h2>Resolvendo sempre seu problema da maneira mais rápida e eficiente. </h2>
             </div>
                
            </div>

            <div className='login'>
                <div className='login-area'>
                    <img src={Logo} alt="Logo do sistema de chamados"/>
                </div>
        
                <form onSubmit={handleLogar}>
                    <input className='campo' type="text" placeholder='Digite seu Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input className='campo' type="password" placeholder='Digite sua Senha' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button className='btn-logar' type="submit">{loadingAuth ? 'Logando' : 'Entrar na minha conta'}</button>
                    
                </form>
                <div className='criar-conta'>
                    <span>Ainda não tem uma conta?</span>
                    <Link to='/register'>Criar uma conta</Link>
                
                </div>
            </div>
        </div>
        
    )
}
