import React from 'react'
import { Container } from './style'

type Props = {
    url: string;
    name: string;
    onDelete: (name: string) => void;
}

const PhotoItem = ({url, name, onDelete}: Props) => {
    return (
        <Container>
            <img src={url} alt={name} />
            {name}
            <button onClick={()=>onDelete(name)}>Excluir</button>
        </Container>
    )
}

export default PhotoItem
