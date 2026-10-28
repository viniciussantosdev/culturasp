// importa os tipos de eventos
import type { Evento, NovoEvento } from '../types'

// importa a funcao que envia dados para API
import { enviar } from './cliente'

// funcao para cadastrar um novo evento
export function criarEvento(dados: NovoEvento): Promise<Evento> {
    return enviar<Evento>('/api/eventos/', dados)
}