import './new.css'
import { useState, useContext, useEffect } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import {FiPlusCircle} from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import {db} from '../../services/firebaseConnection'
import {collection, getDocs, getDoc, doc, addDoc, updateDoc} from'firebase/firestore'
import { toast } from 'react-toastify';
import { useParams,useNavigate } from 'react-router-dom'
import { set } from 'date-fns'

const listRef = collection(db, 'customers');

export default function New(){

  const {user} = useContext(AuthContext);
  const {id} = useParams();
  const Navigate = useNavigate()

  const [custumers, setCustumers ] = useState([]);
  const [ customersSelected, setCustomersSelected ] = useState(0)
  const [loadCustumer, setLoadCustumer ] = useState(true)
  const [assunto, setAssunto ] = useState('Suporte');
  const [ status, setStatus ] = useState('Aberto');
  const [complemento, setComplemento ] = useState('');
  const [ idCustomer , setIdCustomer ] = useState(false)


  useEffect(() => {
      async function loadCustumers(){
        const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
           let lista =[];
           snapshot.forEach((doc) => {
              lista.push({
                id: doc.id,
                nomeFantasia: doc.data().nomeFantasia
              })
           })

           if(snapshot.docs.size === 0){
            setCustumers([{id:'1', nomeFantasia:'Freela'}])
            setLoadCustumer(false);
            return
           }

           setCustumers(lista);
           setLoadCustumer(false)

           if(id){
            loadId(lista);
           }
        })
        .catch((error) => {
          console.log('Erro ao fazer busca',error)
          setLoadCustumer(false);
          setCustumers([{id:'1', nomeFantasia:'Freela'}])
        })
      }
      loadCustumers();
  }, [id])
 
  async function loadId(lista){
    const docRef = doc(db,"chamados", id);
    await getDoc(docRef)
    .then((snapshot)=>{
          setAssunto(snapshot.data().assunto)
          setStatus(snapshot.data().status)
          setComplemento(snapshot.data().complemento);

          let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
          setCustomersSelected(index);
          setIdCustomer(true)

    })
    .catch((error)=>{
       console.log(error)
       setIdCustomer(false)
    })
  }


  function handleOptionChange(e){
     setStatus(e.target.value);
  }
  function handleChangeSelect(e){
    setAssunto(e.target.value)
  }

  function handleChangeCustomer(e){
    setCustomersSelected(e.target.value)
  }
  //teste

  async function handleRegister(e){
    e.preventDefault();
    if(idCustomer){
       //atualizando chamado
       const docRef = doc(db,'chamados',id)
        await updateDoc(docRef, {
          cliente:custumers[customersSelected].nomeFantasia,
          clienteId: custumers[customersSelected].id,
          assunto: assunto,
          complemento:complemento,
          status:status,
          userId:user.uid,
        })
        .then(()=>{
          toast.success('Chamado atualizado com sucesso')
          setCustomersSelected(0)
          setComplemento('')
          Navigate('/dashboard')
        }).catch((error)=>{
          toast.error('Erro au atualizar chamado')
        })
       
       return;
    }
    await addDoc(collection(db,'chamados'), {
      created:new Date(),
      cliente:custumers[customersSelected].nomeFantasia,
      clienteId: custumers[customersSelected].id,
      assunto: assunto,
      complemento:complemento,
      status:status,
      userId:user.uid,
    })
    .then(()=>{
      toast.success('Chamado registrado com sucesso');
      setComplemento('')
      setCustomersSelected(0)
    }).catch((error)=>{
      toast.error('Opss!! Erro ao registrar')
    })
  }
 
    return(
        <>
        <div className='contGlobal'>
        <Header/>
        
        <div className='LeftCont'>
            <Title name={id ? "Editando chamado" : 'Novo Chamado'}>
             <FiPlusCircle color='rgba(26, 138, 229, 0.438)' size={18}/>
            </Title>
   

        <div className='ContForm'>
            <form className='FormAdd' onSubmit={handleRegister}>
                <label>Cliente</label>
                {
                  loadCustumer ? (
                    <input type='text' disabled={true}  value='Carregando...'/>
                  ): (
                    <select value={customersSelected} onChange={handleChangeCustomer} >
                          {custumers.map((item, index) =>{
                              return(
                                <option key={index} value={index}>{item.nomeFantasia}</option>
                              )
                          })}
                    </select>
                  )
                }

                <label>Assunto</label>
                <select value={assunto} onChange={handleChangeSelect}>
                  <option value='Suporte'>Suporte</option>
                  <option value='Visita Tecnica'>Visita Tecnica</option>
                  <option value='Financeiro'>Financeiro</option>
                </select>

                <label>Status</label>
                 <div className='status'>
                    <input
                      type='radio'
                      name='radio'
                      value='Aberto'
                      onChange={handleOptionChange}
                      checked={status === 'Aberto'}
                    />
                    <span>Em aberto</span>
                    <input
                      type='radio'
                      name='radio'
                      value='Atendido'
                      onChange={handleOptionChange}
                      checked={status === 'Atendido'}
                    />
                    <span>Atendido</span>
                    <input
                      type='radio'
                      name='radio'
                      value='progresso'
                      onChange={handleOptionChange}
                      checked={status === 'progresso'}
                    />
                    <span>Em Progresso</span>
                 </div>

                 <label>Complemento</label>
                 <textarea type="text"
                   placeholder='Descreva seu problema'
                   value={complemento}
                   onChange={(e) => setComplemento(e.target.value)}
                 />

                 <button type='submit' >Registrar</button>
            </form>
        </div>
            
        </div>
        
        </div>
        </>
    )
}