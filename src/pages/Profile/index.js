import './profile.css';

import {useContext, useState} from 'react'
import {doc, updateDoc} from 'firebase/firestore'
import {db, storage} from '../../services/firebaseConnection'
import {toast} from 'react-toastify';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'

import Title from '../../components/Title';
import Header from '../../components/Header';
import {FiSettings, FiUpload} from 'react-icons/fi'
import Avatar from '../../assets/avatar.png'
import {AuthContext} from '../../contexts/auth'

export default function Profile(){
    const {user,storageUser,setUser } = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null)
    const [avatarNome, setAvatarNome] = useState(user && user.nome)
    const [avatarEmail, setAvatarEmail] = useState(user && user.email);

    function handleFile(e){
      if(e.target.files[0]){
        const image = e.target.files[0];

        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            setImageAvatar(image)
            setAvatarUrl(URL.createObjectURL(image))
        }else{
            alert('Envie um imagem do tipo PNG ou JPEG');
            setImageAvatar(null)
            return; 
        }
      }
    }

    async function handleUpload(){
        const currentUid = user.uid;

        const uploadRef = ref(storage,`images/${currentUid}/${imageAvatar}.name`)
        const uploadTask = uploadBytes(uploadRef,imageAvatar)
        .then((snapshot) =>{
            getDownloadURL(snapshot.ref).then( async (downloadURL) =>{
                let urlFoto = downloadURL;
                const docRef = doc(db, 'users', user.uid)
                await updateDoc(docRef,{
                    avatarUrl: urlFoto,
                    nome:avatarNome,
                })
                .then(() =>{
                    let data = {
                        ...user,
                        nome: avatarNome,
                        avatarUrl: urlFoto,
                    }
                    setUser(data);
                    storageUser(data);
                    toast.success('Atualizado com sucesso');
                })
            })
        })
    }

    async function handleSubmit(e){
       e.preventDefault();

       if(imageAvatar === null && avatarNome !== ''){
        // atualizar apenas nome
        const docRef = doc(db, 'users', user.uid)
        await updateDoc(docRef, {
            nome: avatarNome,
        })
        .then(() =>{
            let data ={
                ...user,
                nome: avatarNome,
            }
            setUser(data);
            storageUser(data);
            toast.success('Seu nome de usuário foi alterado com sucesso');
        })
        .catch((error) => {
            toast.error('Desculpe mais parece que algo deu errado!');
          })


       } else if(avatarNome !== '' || imageAvatar !== null ){
        // atualizar nome e foto
        handleUpload()
       }
    }

    return(
        <>
        <div className='contGlobal'>
        <Header/>
          
        <div className='LeftCont'>
            <Title name="Minha conta">
                <FiSettings color='rgba(26, 138, 229, 0.438)' size={25}/>
            </Title>
            <div className='ContPerfil'>
                <form className='formPerfil' onSubmit={handleSubmit}>
                     <label className='labelAvatar'>
                       
                            <span><FiUpload color='#fff' size={25}/></span>
                      
                        <input type='file' accept='image/*' onChange={handleFile} />
                        { avatarUrl === null ?(
                            <img src={Avatar} alt='Avatar' width={250} height={250}/>
                        ) : (
                            <img src={avatarUrl} alt='Avatar' width={250} height={250}/>  
                        )}
                     </label>
                     <div className='InputsAvatar'>
                     <input type='text' placeholder='Digite seu nome' value={avatarNome}  onChange={(e) => setAvatarNome(e.target.value)}/>
                     <input type='email'  value={avatarEmail} disabled={true} />
                     <button type="submit">Salvar</button>
                     </div>

                </form>
            </div>
        </div>
        </div>
        </>
    )
}