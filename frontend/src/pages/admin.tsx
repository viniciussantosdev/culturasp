
import { useEffect, useState, type FormEvent } from "react";

interface Categoria {
  id: number;
  nome: string;
}

export default function Admin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState({
    titulo: "",
    local: "",
    descricao: "",
    data: "",
    horario: "",
    gratuito: false,
    categorias: [] as number[],
  });

  const [status, setStatus] = useState("");
  const [mensagem, setMensagem] = useState("");

  const API = "http://localhost:8000/api";

  useEffect(() => {
    fetch(`${API}/categorias/`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar categorias");
        return res.json();
      })
      .then((dados) => setCategorias(dados))
      .catch(() => setMensagem("Não foi possível carregar as categorias."));
  }, []);

  function atualizarCampo(
    campo: string,
    valor: string | boolean
  ) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function cadastrarEvento(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("enviando");
    setMensagem("");

    if (form.categorias.length === 0) {
      setStatus("erro");
      setMensagem("Selecione pelo menos uma categoria.");
      return;
    }

    const dados = {
      ...form,
      criado_por: 1, // ID provisório do administrador
    };

    try {
      const resposta = await fetch(`${API}/eventos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro);
      }

      setStatus("sucesso");
      setMensagem("Evento cadastrado com sucesso!");

      setForm({
        titulo: "",
        local: "",
        descricao: "",
        data: "",
        horario: "",
        gratuito: false,
        categorias: [],
      });
    } catch (erro) {
      setStatus("erro");
      setMensagem(
        erro instanceof Error
          ? erro.message
          : "Erro ao cadastrar evento."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold">
          Painel do Administrador
        </h1>

        <p className="mb-6 text-gray-600">
          Cadastro de eventos culturais
        </p>

        <form onSubmit={cadastrarEvento} className="space-y-4">
          <input
            className="w-full rounded border p-3"
            placeholder="Título do evento"
            value={form.titulo}
            onChange={(e) => atualizarCampo("titulo", e.target.value)}
            required
          />

          <input
            className="w-full rounded border p-3"
            placeholder="Local do evento"
            value={form.local}
            onChange={(e) => atualizarCampo("local", e.target.value)}
            required
          />

          <textarea
            className="w-full rounded border p-3"
            placeholder="Descrição do evento"
            value={form.descricao}
            onChange={(e) => atualizarCampo("descricao", e.target.value)}
            required
          />

          <label className="block">
            Data do evento
            <input
              type="date"
              className="mt-1 w-full rounded border p-3"
              value={form.data}
              onChange={(e) => atualizarCampo("data", e.target.value)}
              required
            />
          </label>

          <label className="block">
            Horário
            <input
              type="time"
              className="mt-1 w-full rounded border p-3"
              value={form.horario}
              onChange={(e) => atualizarCampo("horario", e.target.value)}
              required
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.gratuito}
              onChange={(e) => atualizarCampo("gratuito", e.target.checked)}
            />
            Evento gratuito
          </label>

          <label className="block font-semibold">
            Categorias
            <select
              multiple
              className="mt-2 w-full rounded border p-3"
              value={form.categorias.map(String)}
              onChange={(e) =>
                setForm((anterior) => ({
                  ...anterior,
                  categorias: Array.from(
                    e.target.selectedOptions,
                    (option) => Number(option.value)
                  ),
                }))
              }
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
            <small className="text-gray-500">
              Segure Ctrl para selecionar mais de uma categoria.
            </small>
          </label>

          <button
            type="submit"
            disabled={status === "enviando"}
            className="w-full rounded bg-blue-700 p-3 font-bold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {status === "enviando" ? "Salvando..." : "Cadastrar evento"}
          </button>
        </form>

        {mensagem && (
          <p className="mt-4 rounded bg-gray-100 p-3">
            {mensagem}
          </p>
        )}
      </div>
    </main>
  );
}
