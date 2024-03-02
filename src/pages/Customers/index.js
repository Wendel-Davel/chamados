
import './customers.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import {useState, useContext} from 'react'
import {FiUser} from 'react-icons/fi'
import {addDoc, collection} from 'firebase/firestore'
import {db} from '../../services/firebaseConnection'
import {toast} from 'react-toastify'



export default function Customers(){

    const [cliente, setCliente] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleRegister(e){
      e.preventDefault();
      if( cliente !== '' || cnpj !== '' || endereco !== ''){
            await addDoc(collection(db,'customers'), {
                nomeFantasia: cliente,
                cnpj:cnpj,
                endereco:endereco,
            })
            .then(()=>{
                toast.success('Cliente cadastrado com sucesso');
                setCliente('')
                setCnpj('')
                setEndereco('')
            })
            .catch((error) =>{
                toast.error('Ops algo deu errado')
            })
      }
      else{
        toast.error('Preencha todos os campos')
      }
    }

    return(
        <>
         <div className='contGlobal'>
          <Header/>
           <div className='LeftCont'>
            <Title name="Novo Cliente"> 
              <FiUser color='rgba(26, 138, 229, 0.438)' size={25}/>
            </Title>

            <div className='ContClient'>
                <form className='ClientForm' onSubmit={handleRegister}>
                    <label>
                    <p>Nome do cliente</p>
                    <input type='text' placeholder='Nome do cliente' value={cliente} onChange={(e) => setCliente(e.target.value)}/>
                    </label>
                    <label>
                    <p>CNPJ</p>
                    <input type='text' placeholder='Digite o CNPJ'  value={cnpj} onChange={(e) => setCnpj(e.target.value)}/>
                    </label>
                    <label>
                    <p>Endereço</p>
                    <input type='text' placeholder='Digite seu Endereço'  value={endereco} onChange={(e) => setEndereco(e.target.value)}/>
                    </label>
                    <button type='submit'>Cadastrar</button>
                </form>
            </div>
           </div>
         </div>
        </>
    )

}