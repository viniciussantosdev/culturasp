const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const MESES_LONGOS = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

export function diaDoMes(data: string): string {
    return String(Number(data.split('-')[2]))
}

export function mesAbreviado(data:string): string {
    return MESES[Number(data.split('-')[1]) - 1]
}

export function dataLonga(data: string): string {
    const [ano, mes, dia] = data.split('-').map(Number)
    return `${dia} de  ${MESES_LONGOS[mes - 1]} de ${ano}`
}

export function horarioCurto(horario: string): string {
    const [h,m] = horario.split(':')
    return `${h}h${m}`
}

export function normalizar(texto: string): string {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}