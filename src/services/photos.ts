import {storage} from './firebase'
import {v4 as createId} from 'uuid'
import {ref, listAll, getDownloadURL, uploadBytes, deleteObject} from 'firebase/storage'

type Photo = {
    name: string,
    url: string
}
export const getAllPhotos = async () => {

    let list: Photo[] = [];

    //referenciando a pasta do firebase
    const imagesFolder = ref(storage, 'images')

    //pegando items daquele arquivo
    const AllPhotos = await listAll(imagesFolder)

    //montando um array com os items
    for(let i in AllPhotos.items) {
        let photoUrl = await getDownloadURL(AllPhotos.items[i]);

        list.push({
            name: AllPhotos.items[i].name,
            url: photoUrl
        });
    }
    /*const photoList = AllPhotos.items.map(async (item) => {
        //pegando a url da imagem
        const photoURL = await getDownloadURL(item)
        //retornando para cada item o que eu quero de cada item
        return {
            name: item.name,
            url: photoURL
        }
    })*/  

    //a funcao vai me devolver uma lista de fotos (cada uma do jeito que eu peguei no map)
    return list
}
export const insertPhoto = async (file: File) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        const randomName = createId()
        const newFile = ref(storage, `images/${randomName}`)
        const upload = await uploadBytes(newFile, file)
        const photoURL = await getDownloadURL(upload.ref)
        return {
            name: upload.ref.name,
            url: photoURL
        } as Photo
    } else {
        return new Error(`Tipo de arquivo não permitido`)
    }
}
export const deletePhoto = async (name: string) => {
    const photoRef = ref(storage, `images/${name}`);
    await deleteObject(photoRef);
}