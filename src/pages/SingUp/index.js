import {useState, useContext} from 'react'

import '../SingIn/signin.css'
import Logo from '../../assets/logo.png'
import Thumb from '../../assets/thumb.png'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export default function SignUp(){
        const [nome, setNome] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const {signUp,loadingAuth} = useContext(AuthContext);

        async function handleSubmit(e){
            e.preventDefault();
        
            if(nome !== '' && email !== '' && password !== ''){
             await signUp(email, password, nome)
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
            
                    <form onSubmit={handleSubmit}>
                        <input className='campo' type="text" placeholder='Digite seu nome' value={nome} onChange={(e) => setNome(e.target.value)}/>
                        <input className='campo' type="text" placeholder='Digite seu Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input className='campo' type="password" placeholder='Crie uma senha' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <button className='btn-logar' type="submit">
                        {loadingAuth ? 'Criando Conta' : 'Criar minha conta'}
                        </button>
                    </form>
                    <div className='criar-conta'>
                        <span>já tem uma conta?</span>
                        <Link to='/'>Fazer Login</Link>
                    </div>
                </div>
            </div>
            
        )
    
}