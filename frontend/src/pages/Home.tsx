import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEstatisticas } from "../api/rickAndMortyApi";
import { getMeusPersonagens } from "../api/backendLocal";
import { useAuth } from "../contexts/AuthContext";
import { type SavedCharacter } from "../types";
import CardPersonagem from "../components/CardPersonagem";
import RickAndMortyIcone from "../assets/rickAndMortyIcone.png";

interface Estatisticas {
  totalPersonagens: number;
  totalEpisodios: number;
  totalLocais: number;
}
export default function Home() {
  const { estaLogado, usuario } = useAuth();
  const [stats, setStats] = useState<Estatisticas | null>(null);
  const [meusPersonagens, setMeusPersonagens] = useState<SavedCharacter[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const estatisticas = await getEstatisticas();
        setStats(estatisticas);

        if (estaLogado) {
          const { data } = await getMeusPersonagens();
          setMeusPersonagens(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [estaLogado]);

  const ultimos3 = meusPersonagens.slice(0, 3);

  return (
    <main className="pagina">
      {/* titulo */}
      <div style={{ marginBottom: 48 }}>
        <h1 className="titulo-pagina">
          Bem-vindo{estaLogado && `, ${usuario?.name}`}
        </h1>
        <p className="subtitulo-pagina">
          Explore o multiverso e salve seus personagens favoritos
        </p>
      </div>

      {/* estatisticas da api */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-titulo)",
            fontSize: "1.3rem",
            letterSpacing: "0.06em",
            color: "var(--texto2)",
            marginBottom: 18,
          }}
        >
          Estatísticas da API
        </h2>

        {carregando ? (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            {[
              {
                valor: stats?.totalPersonagens,
                label: "Personagens",
                cor: "var(--verde-claro-texto)",
              },
              {
                valor: stats?.totalEpisodios,
                label: "Episódios",
                cor: "var(--azul)",
              },
              {
                valor: stats?.totalLocais,
                label: "Localizações",
                cor: "var(--amarelo)",
              },
              ...(estaLogado
                ? [
                    {
                      valor: meusPersonagens.length,
                      label: "Meus salvos",
                      cor: "var(--roxo)",
                    },
                  ]
                : []),
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--borda)",
                  borderRadius: "var(--raio)",
                  padding: "22px 24px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--texto3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 8,
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-titulo)",
                    fontSize: "2.4rem",
                    letterSpacing: "0.04em",
                    color: item.cor,
                  }}
                >
                  {item.valor?.toLocaleString("pt-BR") ?? "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ultimos salvos */}
      {estaLogado && (
        <section style={{ marginBottom: 48 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-titulo)",
                fontSize: "1.3rem",
                letterSpacing: "0.06em",
                color: "var(--texto2)",
              }}
            >
              Meus Favoritos
            </h2>
            <Link
              to="/meus-personagens"
              style={{
                color: "var(--verde-claro-texto)",
                fontSize: "0.875rem",
                fontWeight: 700,
              }}
            >
              Ver todos →
            </Link>
          </div>

          {ultimos3.length === 0 ? (
            <div className="vazio">
              <img
                src={RickAndMortyIcone}
                alt="Rick e Morty"
                style={{
                  width: "120px",
                  height: "auto",
                  marginBottom: "16px",
                  filter: "drop-shadow(0 0 10px rgba(0, 197, 227, 0.3))",
                }}
              />
              <p className="vazio-texto">
                Você não salvou nenhum personagem ainda
              </p>
              <Link
                to="/personagens"
                className="btn btn-verde"
                style={{ display: "inline-flex", marginTop: 16 }}
              >
                Explorar personagens
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: 16,
              }}
            >
              {ultimos3.map((p) => (
                <CardPersonagem key={p.id} personagem={p} origem="local" />
              ))}
            </div>
          )}
        </section>
      )}

      {/* cta para quem nao ta logado */}
      {!estaLogado && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--borda2)",
            borderRadius: "var(--raio)",
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-titulo)",
                fontSize: "1.8rem",
                letterSpacing: "0.05em",
                marginBottom: 6,
              }}
            >
              Crie sua conta
            </h3>
            <p style={{ color: "var(--texto2)", maxWidth: 380 }}>
              Faça login para salvar seus personagens favoritos e acessar sua
              coleção.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/login" className="btn btn-verde">
              Criar conta
            </Link>
            <Link to="/personagens" className="btn btn-outline">
              Explorar
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
