import { useState } from "react";

const locais = [
  {
    id: 1,
    nome: "Museu do Ipiranga",
    categoria: "Museus",
    descricao:
      "Conheça a história do Brasil e explore exposições em um espaço histórico de São Paulo.",
    imagem:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    nome: "Theatro Municipal",
    categoria: "Teatros",
    descricao:
      "Descubra apresentações musicais, espetáculos e a arquitetura de um dos teatros mais famosos da cidade.",
    imagem:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    nome: "Pinacoteca de São Paulo",
    categoria: "Arte",
    descricao:
      "Explore exposições e descubra obras de artistas brasileiros.",
    imagem:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    nome: "Espaços culturais",
    categoria: "Eventos",
    descricao:
      "Descubra atividades, oficinas e experiências culturais para diferentes públicos.",
    imagem:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    nome: "Arte e exposições",
    categoria: "Arte",
    descricao:
      "Conheça exposições, instalações artísticas e novas formas de expressão.",
    imagem:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    nome: "Música e apresentações",
    categoria: "Eventos",
    descricao:
      "Explore apresentações musicais e experiências culturais em São Paulo.",
    imagem:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=900&q=80",
  },
];

const categorias = ["Todos", "Museus", "Teatros", "Arte", "Eventos"];

export default function App() {
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("Todos");

  const resultados = locais.filter((local) => {
    const correspondeBusca = (
      local.nome +
      " " +
      local.categoria +
      " " +
      local.descricao
    )
      .toLowerCase()
      .includes(busca.toLowerCase());

    const correspondeCategoria =
      categoriaSelecionada === "Todos" ||
      local.categoria === categoriaSelecionada;

    return correspondeBusca && correspondeCategoria;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-red-700 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <a href="#" className="text-3xl font-extrabold">
            Cultura <span className="text-yellow-300">SP</span>
          </a>

          <nav className="flex flex-wrap gap-5 text-sm font-semibold md:text-base">
            <a href="#inicio" className="hover:text-yellow-300">
              Início
            </a>
            <a href="#explorar" className="hover:text-yellow-300">
              Explorar
            </a>
            <a href="#sobre" className="hover:text-yellow-300">
              Sobre
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="inicio"
          className="bg-gradient-to-br from-red-800 via-red-700 to-red-500 text-white"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
            <div>
              <span className="mb-5 inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                ARTE • HISTÓRIA • CULTURA
              </span>

              <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
                Viva a cultura paulista.
              </h1>

              <p className="mb-8 max-w-xl text-lg leading-relaxed text-red-50">
                Descubra museus, teatros, exposições e eventos
                culturais espalhados pelo estado de São Paulo.
              </p>

              <a
                href="#explorar"
                className="inline-block rounded-xl bg-yellow-300 px-6 py-3 font-bold text-red-900 transition hover:bg-yellow-200"
              >
                Explorar lugares
              </a>
            </div>

            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=85"
                alt="Espaço de arte e cultura"
                className="h-72 w-full object-cover md:h-96"
              />
            </div>
          </div>
        </section>

        <section
          id="explorar"
          className="mx-auto max-w-7xl px-6 py-14 md:py-20"
        >
          <div className="mb-8">
            <p className="mb-2 font-bold uppercase tracking-widest text-red-700">
              Descubra São Paulo
            </p>

            <h2 className="text-3xl font-extrabold md:text-4xl">
              Explore a cultura
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              Encontre lugares e experiências para conhecer,
              aprender e se inspirar.
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="busca"
              className="mb-2 block font-semibold"
            >
              Buscar atrações culturais
            </label>

            <input
              id="busca"
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Digite museu, teatro, arte ou evento..."
              className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-200"
            />
          </div>

          <div className="mb-10 flex flex-wrap gap-3">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                type="button"
                onClick={() => setCategoriaSelecionada(categoria)}
                className={`rounded-full px-5 py-2.5 font-semibold transition ${
                  categoriaSelecionada === categoria
                    ? "bg-red-700 text-white shadow"
                    : "border border-gray-300 bg-white text-gray-700 hover:border-red-500 hover:text-red-700"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-bold">
              Lugares para conhecer
            </h3>

            <span className="text-sm text-gray-500">
              {resultados.length}{" "}
              {resultados.length === 1
                ? "resultado"
                : "resultados"}
            </span>
          </div>

          {resultados.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((local) => (
                <article
                  key={local.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={local.imagem}
                    alt={local.nome}
                    loading="lazy"
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">
                    <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-700">
                      {local.categoria}
                    </span>

                    <h4 className="mb-3 mt-4 text-xl font-bold">
                      {local.nome}
                    </h4>

                    <p className="leading-relaxed text-gray-600">
                      {local.descricao}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
              <p className="mb-2 text-xl font-bold">
                Nenhum resultado encontrado
              </p>
              <p className="text-gray-600">
                Tente outra pesquisa ou selecione a categoria
                Todos.
              </p>

              <button
                type="button"
                onClick={() => {
                  setBusca("");
                  setCategoriaSelecionada("Todos");
                }}
                className="mt-5 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>

        <section id="sobre" className="bg-red-50 px-6 py-14">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold">
              Cultura para todos
            </h2>

            <p className="text-lg leading-relaxed text-gray-700">
              O Cultura SP tem como objetivo aproximar as pessoas
              da arte, da história e das experiências culturais
              do estado de São Paulo.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 px-6 py-8 text-center text-white">
        <h2 className="mb-2 text-2xl font-extrabold">
          Cultura SP
        </h2>

        <p className="text-gray-300">
          Arte, história e cultura para todos.
        </p>

        <p className="mt-5 text-sm text-gray-500">
          Projeto demonstrativo de portal cultural.
        </p>
      </footer>
    </div>
  );
}