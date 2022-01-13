import React, { FormEvent } from 'react'
import { Area, Container, Header, PhotoList, ScreenWarning, UploadForm } from './style'
import * as photos from '../../../services/photos'
import PhotoItem from '../../components/PhotoItem'
type Photo = {
    name: string,
    url: string
}
const Home = () => {
    const [loading, setLoading] = React.useState(false)
    const [uploading, setUploading] = React.useState(false);
    const [photosList, setPhotosList] = React.useState<Photo[]>([])

    const getPhotos = async () => {
        setLoading(true)

        await photos.getAllPhotos()
        .then(response => setPhotosList(response))

        setLoading(false)
        
    }
    React.useEffect(() => {
        getPhotos()
    }, [])
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const formData = new FormData(e.currentTarget);
        const file = formData.get('image') as File
    
        if(file && file.size > 0) {
          setUploading(true);
          let result = await photos.insertPhoto(file);
          setUploading(false);
    
          if(result instanceof Error) {
            alert(`${result.name} - ${result.message}`);
          } else {
            //setPhotosList([...photosList, result]);
          }
        }
      }

    const handleDelete = async (name: string) => {
        await photos.deletePhoto(name);
        getPhotos();
    }
    return (
        <Container>
            <Area>
                <Header>
                    Galeria de Fotos
                </Header>
                <UploadForm method="POST" onSubmit={handleSubmit}>
                <input type="file" name="image" />
                <input type="submit" value="Enviar" disabled={uploading} />
                {uploading && "Enviando..."}
                </UploadForm>
                {loading && 
                <ScreenWarning>
                    Carregando...
                </ScreenWarning>}
                {!loading && photosList?.length > 0 &&
                    <PhotoList>
                        {photosList?.map((photo: Photo, index: number) => (
                            <PhotoItem key={index} name={photo.name} url={photo.url} onDelete={handleDelete} />
                        ))}
                    </PhotoList>
                }
                {!loading && photosList?.length < 1 && 
                <>
                    Não há imagens para serem exibidas.
                </>}
            </Area>
        </Container>
    )
}

export default Home
