
import { Link } from 'react-router'

export default function Sobre() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <section className="mb-16">
        <span className="mb-4 inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-marca-vermelho">
          Sobre o CulturaSP
        </span>

        <h1 className="mb-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          A cultura está mais perto do que você imagina.
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-tinta-suave">
          O CulturaSP é uma plataforma criada para conectar pessoas a
          experiências culturais em São Paulo. Nosso objetivo é facilitar a
          descoberta de eventos e aproximar o público da diversidade cultural
          presente em nossa cidade.
        </p>

        <Link
          to="/"
          className="mt-7 inline-block rounded bg-tinta px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Explorar eventos
        </Link>
      </section>

      <section className="mb-16 grid gap-10 border-y border-borda py-10 sm:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Nossa missão</h2>
          <p className="leading-relaxed text-tinta-suave">
            Tornar o acesso à cultura mais simples e acessível, reunindo
            informações sobre eventos culturais em um só lugar e ajudando
            pessoas a encontrarem experiências que combinem com seus
            interesses.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold">Nosso propósito</h2>
          <p className="leading-relaxed text-tinta-suave">
            Acreditamos que a cultura transforma, inspira e conecta pessoas.
            Queremos incentivar a participação em atividades culturais e
            valorizar a diversidade artística de São Paulo.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-3 text-2xl font-bold">O que você encontra aqui?</h2>

        <p className="mb-8 max-w-2xl leading-relaxed text-tinta-suave">
          Um espaço para descobrir diferentes manifestações culturais e
          encontrar novas experiências.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
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
          ].map((item) => (
            <div
              key={item.titulo}
              className="rounded-xl border border-borda p-5 transition hover:border-tinta"
            >
              <h3 className="mb-2 font-bold">{item.titulo}</h3>
              <p className="text-sm leading-relaxed text-tinta-suave">
                {item.descricao}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-tinta px-6 py-10 text-center text-white sm:px-12">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
          Descubra sua próxima experiência cultural.
        </h2>

        <p className="mx-auto mb-7 max-w-xl leading-relaxed text-white/75">
          Explore eventos, conheça novos espaços e aproveite tudo o que a
          cultura tem a oferecer.
        </p>

        <Link
          to="/"
          className="inline-block rounded bg-white px-5 py-3 font-semibold text-tinta transition hover:bg-gray-100"
        >
          Ver eventos disponíveis
        </Link>
      </section>
    </main>
  )
}
