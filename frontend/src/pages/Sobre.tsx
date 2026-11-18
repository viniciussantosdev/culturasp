import { Link } from 'react-router'
import equipe from '../assets/foto-colaboradores.jpg'
import teatro from '../assets/foto-teatro.jpg'

export default function Sobre() {
  const categorias = [
    {
      titulo: 'Música e shows',
      descricao: 'Apresentações musicais, festivais e eventos ao vivo.',
    },
    {
      titulo: 'Exposições e arte',
      descricao: 'Mostras artísticas, galerias e experiências visuais.',
    },
    {
      titulo: 'Teatro e dança',
      descricao: 'Espetáculos, apresentações e expressões artísticas.',
    },
    {
      titulo: 'Cinema',
      descricao: 'Sessões, mostras e experiências audiovisuais.',
    },
    {
      titulo: 'Cultura e história',
      descricao: 'Atividades culturais, museus e espaços históricos.',
    },
    {
      titulo: 'Muito mais',
      descricao: 'Novas experiências para descobrir e aproveitar.',
    },
  ]

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <section className="mb-16">
        <span className="mb-4 inline-block rounded-full bg-destaque px-3 py-1 text-sm font-semibold text-black">
          Sobre a Casa de Cultura São Mateus
        </span>

        <h1 className="mb-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          A cultura está mais perto do que você imagina.
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-texto-suave">
          A Casa de Cultura São Mateus é um espaço dedicado à valorização da
          arte, da cultura e das manifestações artísticas da região. Um lugar
          de encontro, expressão e oportunidades para artistas e toda a
          comunidade.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-borda">
          <img
            src={equipe}
            alt="Colaboradores reunidos"
            className="max-h-[480px] w-full object-cover"
          />
        </div>

        <Link
          to="/"
          className="mt-7 inline-block rounded bg-destaque px-5 py-3 font-semibold text-black transition hover:bg-yellow-300"
        >
          Explorar eventos
        </Link>
      </section>

      <section className="mb-16 grid gap-10 border-y border-borda py-10 sm:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-destaque">
            Nossa missão
          </h2>

          <p className="leading-relaxed text-texto-suave">
            Promover o acesso à cultura, incentivar a produção artística e
            oferecer à comunidade um espaço aberto para atividades,
            apresentações e experiências culturais.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-destaque">
            Nosso propósito
          </h2>

          <p className="leading-relaxed text-texto-suave">
            Acreditamos que a cultura transforma, inspira e conecta pessoas.
            Queremos valorizar os talentos locais, fortalecer a comunidade e
            ampliar o acesso às diferentes expressões artísticas.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-8">
          <h2 className="mb-3 text-2xl font-bold">
            Arte e cultura em movimento
          </h2>

          <p className="max-w-2xl leading-relaxed text-texto-suave">
            A Casa de Cultura São Mateus é palco de diferentes manifestações
            artísticas, apresentações e encontros que celebram a criatividade
            e a diversidade cultural da comunidade.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-borda bg-superficie">
          <img
            src={teatro}
            alt="Apresentação teatral realizada na Casa de Cultura São Mateus"
            className="max-h-[500px] w-full object-cover"
          />

          <div className="p-5">
            <h3 className="mb-2 text-lg font-bold text-destaque">
              Apresentações artísticas
            </h3>

            <p className="text-sm leading-relaxed text-texto-suave">
              Espetáculos e atividades culturais que valorizam os artistas,
              incentivam a expressão artística e aproximam a comunidade da
              cultura.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-3 text-2xl font-bold">
          O que você encontra aqui?
        </h2>

        <p className="mb-8 max-w-2xl leading-relaxed text-texto-suave">
          Um espaço para descobrir diferentes manifestações culturais e
          encontrar novas experiências.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((item) => (
            <div
              key={item.titulo}
              className="rounded-xl border border-borda bg-superficie p-5 transition hover:border-destaque"
            >
              <h3 className="mb-2 font-bold">{item.titulo}</h3>

              <p className="text-sm leading-relaxed text-texto-suave">
                {item.descricao}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 rounded-2xl border border-borda bg-superficie px-6 py-10 text-center sm:px-12">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
          Acompanhe a Casa de Cultura São Mateus
        </h2>

        <p className="mx-auto mb-7 max-w-xl leading-relaxed text-texto-suave">
          Conheça nosso trabalho, acompanhe as atividades e descubra mais
          sobre os espaços culturais da cidade de São Paulo.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.instagram.com/ccm.saomateus/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded bg-destaque px-5 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black"
          >
            Instagram
          </a>

          <a
            href="https://prefeitura.sp.gov.br/web/cultura/w/casas-de-cultura-1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border border-destaque px-5 py-3 font-semibold text-destaque transition-colors duration-300 hover:bg-destaque hover:text-black"
          >
            Saiba mais
          </a>
        </div>
      </section>

      <section className="rounded-2xl bg-destaque px-6 py-10 text-center text-black sm:px-12">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
          Descubra sua próxima experiência cultural.
        </h2>

        <p className="mx-auto mb-7 max-w-xl leading-relaxed text-black/75">
          Explore eventos, conheça novos espaços e aproveite tudo o que a
          cultura tem a oferecer.
        </p>

        <Link
          to="/"
          className="inline-block rounded bg-black px-5 py-3 font-semibold text-white transition hover:bg-neutral-800"
        >
          Ver eventos disponíveis
        </Link>
      </section>
    </main>
  )
}