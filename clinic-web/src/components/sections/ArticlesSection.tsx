import Link from "next/link";
import Image from "next/image";
import { api, type Article } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, Eye } from "lucide-react";

function ArticleCard({ article }: { article: Article }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        {article.imageUrl ? (
          <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
        ) : (
          <FileText size={40} className="text-emerald-200" />
        )}
        {article.category && (
          <Badge className="absolute top-3 left-3 bg-emerald-600 text-white text-xs">
            {article.category}
          </Badge>
        )}
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-gray-500 text-sm line-clamp-2">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{date}</span>
          <div className="flex items-center gap-1">
            <Eye size={11} />
            <span>{article.viewCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function ArticlesSection() {
  let articles: Article[] = [];
  try {
    articles = (await api.articles()).slice(0, 3);
  } catch {
    articles = [];
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-emerald-100 text-emerald-700 mb-4">Artikel Kesehatan</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tips & Info Kesehatan Terkini
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Dapatkan informasi kesehatan terpercaya dari dokter dan tenaga medis kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
          >
            Baca Semua Artikel <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
