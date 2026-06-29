import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Eye, User, Calendar } from "lucide-react";

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let article;
  try { article = await api.article(slug); } catch { return notFound(); }

  const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/articles" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-8 text-sm">
          <ArrowLeft size={16} /> Semua Artikel
        </Link>

        {article.category && (
          <Badge className="bg-emerald-100 text-emerald-700 mb-4">{article.category}</Badge>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h1>

        <div className="flex items-center gap-6 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          {article.authorName && <div className="flex items-center gap-1"><User size={14} /> {article.authorName}</div>}
          {date && <div className="flex items-center gap-1"><Calendar size={14} /> {date}</div>}
          <div className="flex items-center gap-1"><Eye size={14} /> {article.viewCount} tayangan</div>
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed text-lg">{article.content}</p>
        </div>
      </div>
    </div>
  );
}
