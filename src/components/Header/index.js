
import {useContext} from 'react'
import {AuthContext} from '../../contexts/auth'
import {FiHome, FiUser, FiSettings} from 'react-icons/fi'

import avatarImg from '../../assets/avatar.png'
import Logo from '../../assets/logo.png'
import IconExit from '../../assets/icon-exit.png'
import './header.css'
import { Link } from 'react-router-dom'


export default function Header(){
    const {user,logout} = useContext(AuthContext);
    async function handleLogout(){
        await logout();
    }
    return(
        <div className="HeaderNav">
            <div className="sideBar">
               <div className="logoNav">
               <img src={Logo} alt='ChamaDev'/>
               </div>
               <div className="usuarioDados">
               <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt='Avatar'/>
               
                 <p>{user.nome}</p>
                 <span>{user.email}</span>
               </div>
            </div>

            <div className='menu'>
                <ul>
                  <li>
                    <Link to='/dashboard'>
                      <FiHome color='rgba(26, 138, 229, 0.438)' size={18}/>
                      <p>Home</p>
                    </Link>
                    </li>
                    <li>
                    <Link to='/clientes'>
                      <FiUser color='rgba(26, 138, 229, 0.438)' size={18}/>
                      <p>Clientes</p>
                    </Link>
                    </li>
                    <li>
                    <Link to='/perfil'>
                      <FiSettings color='rgba(26, 138, 229, 0.438)' size={18}/>
                      <p>Perfil</p>
                    </Link>
                  </li>
                </ul>
            </div>

            <button onClick={handleLogout} className='deslogar-btn'><img src={IconExit} alt=''/>Sair</button>
        </div>
    )
}