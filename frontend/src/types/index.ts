export interface Categoria {
    id: number 
    nome: string
}

export interface Evento {
    id: number
    titulo: string
    data: string
    horario: string
    local: string
    descricao: string
    gratuito: boolean
    criado_por: number
    categorias: number[]
}
//dados necessarios para cadastrar um novo evento
export interface NovoEvento {
    titulo: string
    data: string
    horario: string 
     local: string  
    descricao: string
    gratuito: boolean
    categorias: number[]
    criado_por: number
}