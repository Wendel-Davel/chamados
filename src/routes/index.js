import {Routes,Route} from 'react-router-dom'
import Dashboard from '../pages/Dashboard';
import SignIn from '../pages/SingIn'
import SignUp from '../pages/SingUp'
import Profile from '../pages/Profile';
import Private from './Private';
import Customers from '../pages/Customers';
import New from '../pages/New';

function RoutesApp(){
    return(
       <Routes>
        <Route path='/' element={<SignIn/>}/>
        <Route path='/register' element={<SignUp/>}/>
        <Route path='/dashboard' element={<Private><Dashboard/></Private>}/>
        <Route path='/perfil' element={<Private><Profile/></Private>}/>
        <Route path='/clientes' element={<Private><Customers/></Private>}/>
        <Route path='/novo-chamado' element={<Private><New/></Private>}/>
        <Route path='/novo-chamado/:id' element={<Private><New/></Private>}/>
       </Routes>
    )
}

export default RoutesApp;