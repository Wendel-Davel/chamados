
import './dashboard.css'

import {useState, useContext, useEffect} from 'react'
import {AuthContext} from '../../contexts/auth'
import Header from '../../components/Header';
import Title from '../../components/Title';
import {FiMessageSquare, FiPlusCircle, FiEdit, FiSearch,FiTrash2} from 'react-icons/fi'
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, startAfter, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import {format} from 'date-fns'
import Modal from '../../components/Modal';

const ListRef = collection(db, 'chamados')

export default function Dashboard(){

    const {logout} = useContext(AuthContext);
    const [chamados, setChamados] = useState([])
    const [loading, setLoading] = useState(true)
    const [ isEmpty, setIsEmpty] = useState(false)
    const [lastDocs, setLastDocs] = useState()
    const [loadingMore, setLoadingMore] = useState(false);
    const [contModal,setContModal] = useState(false)
    const [detail, setDetail] = useState()


    useEffect(() => {
        async function loadChamados(){
            const q = query(ListRef, orderBy('created', 'desc'), limit(5));

            const querySnapshot = await getDocs(q)
            setChamados([]);
            await updateState(querySnapshot);
            setLoading(false);

        }
        loadChamados();
        return () => {

        }
    }, [])

    async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;

        if( !isCollectionEmpty){
            let lista = [];
            querySnapshot.forEach((doc) => {
              lista.push({
                id: doc.id,
                assunto: doc.data().assunto,
                cliente: doc.data().cliente,
                clienteId: doc.data().clienteId,
                created: doc.data().created,
                createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                status:doc.data().status,
                complemento:doc. data().complemento,

              })
            })

            const lestDoc = querySnapshot.docs[querySnapshot.docs.length - 1] // pegando o ultimo item renderizado
            setChamados(chamados => [ ...chamados, ...lista])
            setLastDocs(lestDoc);
        }else{
            setIsEmpty(true);
        }
        setLoadingMore(false);
    }

    // async function deleteState(){
      
    //     const querySnapshot = await deleteDoc(ListRef)
    //     .then((snapshot) =>{
    //         let lista =[];
    //         snapshot.forEach((doc) => {
    //            lista.deleted({
    //              id: doc.id,
    //              nomeFantasia: doc.data().nomeFantasia
    //            })
    //         })
    //     })
    //     deleteState()

    // }

    async function handleMore(){
       setLoadingMore(true);

       const q = query(ListRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5));
       const querySnapshot = await  getDocs(q);
       await updateState(querySnapshot);
    }

 
    function handleModal(item){
        setContModal(!contModal);
        setDetail(item)
    }

    if(loading){
        return(
            <div className='contGlobal'>
                <Header/>
                <div className='LeftCont'>
                 <Title name="Atendimento">
                  <FiMessageSquare color='rgba(26, 138, 229, 0.438)' size={25}/>
                 </Title>
                 <div className='contDash'>
                    <div className='contSem'>
                    <p>Buscando chamados</p>
                    </div>
                    
                 </div>
                </div>
            </div>
        )
    }

    return(
        <>
        <div className='contGlobal'>
        <Header/>
        <div className='LeftCont'>
            <Title name="Atendimento">
                <FiMessageSquare color='rgba(26, 138, 229, 0.438)' size={25}/>
            </Title>


            <div className='contDash'>
                {chamados.length === 0 ? (
                    <div className='contSem'>
                        <p>No momento não existe nehum chamado em aberto</p>
                        <div className='contBtnChamado'>
                            <Link className='btn-chamado' to='/novo-chamado'><FiPlusCircle color='#fff' size={25}/>Novo chamado</Link>
                        </div>
                    </div>
                ) : (
                    <>
                    <div className='contBtnChamado'>
                        <Link className='btn-chamado' to='/novo-chamado'><FiPlusCircle color='#fff' size={25}/>Novo chamado</Link>
                    </div>
                    <table>
                      <thead>
                        <tr>
                            <th scope='col'>Cliente</th>
                            <th scope='col'>Assunto</th>
                            <th scope='col'>Status</th>
                            <th scope='col'>Cadastrado em</th>
                            <th scope='col'>#</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chamados.map((item,index) =>{
                            return(
                                <tr key={index}>
                                <td data-label="Cliente">{item.cliente}</td>
                                <td data-label="Assunto">{item.assunto}</td>
                                <td data-label="Status">
                                    <span className='badge' style={{background: item.status === 'Aberto' ? '#83BF02' : '#ddd', color:item.status === 'Aberto' ? '#ffff' : '#5c5c5c'} }>{item.status}</span>
                                </td>
                                <td data-label="Cadastrado">{item.createdFormat}</td>
                                <td data-label="#">
                                    <div className='contb'>
                                    <Link to={`/novo-chamado/${item.id}`} className='btn-action' style={{backgroundColor:'#1A8AE5'}}><FiEdit  color='#fff' size={18}/></Link>
                                    <button onClick={() => handleModal(item)} className='btn-action' style={{backgroundColor:'#181C2E'}}><FiSearch color='#fff' size={18}/></button>
                                    <button onClick={()=>{}} className='btn-action' style={{backgroundColor:'red'}}><FiTrash2 color='#fff' size={18}/></button>
                                    </div>
                                </td>
                            </tr>
                            )

                        })}

                     </tbody>
                    </table>

                    {loadingMore && <h3 className='text'>Buscando mais chamados...</h3>}
                    {!loadingMore && !isEmpty && <button className='btnLoad' onClick={handleMore}>Buscar mais</button>}
                    </>

                )}
  
            </div>
        </div>
        {contModal && (
            <div className='ContModal'>
                <Modal 
                  conteudo={detail}
                  close={() => setContModal(!contModal)}
                />
            </div>
        )}


        </div>

        
        </>
    )
}