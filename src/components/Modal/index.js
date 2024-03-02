import'./modal.css'
import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import {FiX} from 'react-icons/fi'
export default function Modal({conteudo, close}){

    const {} = useContext(AuthContext)
    return(
        <>
          <div className='contModal'>
            <div className='btnClose'>
                <button onClick={close}><FiX color='#1A8AE5' size={20}/></button>
            </div>
            <div className='ContInfos'>
                <h3>Detalhes do chamado</h3>
                <ul>
                    <li>
                        <span>Cliente</span>
                         <p>{conteudo.cliente}</p>
                    </li>
                    <li>
                        <span>Assunto:</span>
                         <p>{conteudo.assunto}</p>
                    </li>
                    <li>
                        <span>Cadastrado em:</span>
                         <p>{conteudo.createdFormat}</p>
                    </li>
                    <li>
                        <span>Status:</span>
                         <p style={{color:'#fff',padding:'6px',borderRadius:'3px',backgroundColor: conteudo.status === 'Aberto' ? '#83BF02' : '#ddd'}}>{conteudo.status}</p>
                    </li>
                    {
                        conteudo.complemento !== '' && (
                            <li>
                            <span>Complemento:</span>
                             <strong>{conteudo.complemento}</strong>
                        </li>
                        )
                    }

                </ul>
            </div>
          </div>
        </>
    )
}