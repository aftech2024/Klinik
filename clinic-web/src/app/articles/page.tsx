import { api, type Article } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { FileText, Eye, ArrowRight, Calendar, Sparkles } from "lucide-react";

export const metadata = { title: "Artikel & Edukasi Kesehatan — aftech Klinik" };

export default async function ArticlesPage() {
  let articles: Article[] = [];
  try { articles = await api.articles(); } catch { articles = []; }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-[#0F766E] via-[#0D9488]/60 to-[#F0FDFA] pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs font-bold rounded-full uppercase tracking-widest border border-white/20 mb-5">Edukasi Kesehatan</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Artikel & Tips <span className="text-[#CCFBF1]">Kesehatan Terkini</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Wawasan terpercaya seputar gaya hidup sehat, pencegahan penyakit, dan perkembangan medis langsung dari para dokter spesialis kami.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Sparkles className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-800 mb-1">Belum Ada Artikel</h3>
            <p className="text-gray-500 text-sm">Nantikan artikel dan tips kesehatan menarik segera dari tim kami.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const date = article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                : null;

              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#0D9488] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1]/50 overflow-hidden">
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText size={48} className="text-[#0D9488]/40" />
                        </div>
                      )}
                      {article.category && (
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#0D9488] font-bold px-3 py-1 rounded-full text-xs shadow-sm">
                          {article.category}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        {date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={13} /> {date}
                          </span>
                        )}
                        <span className="flex items-center gap-1 ml-auto">
                          <Eye size={13} /> {article.viewCount} Dilihat
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#134E4A] group-hover:text-[#0D9488] transition-colors mb-3 line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[#0D9488] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    <span>Baca Artikel</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
