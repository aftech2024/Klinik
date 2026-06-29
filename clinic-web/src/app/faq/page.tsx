import { api, type Faq } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "FAQ — aftech Klinik" };

export default async function FaqPage() {
  let faqs: Faq[] = [];
  try { faqs = await api.faqs(); } catch { faqs = []; }

  const categories = [...new Set(faqs.map(f => f.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-b from-[#0F766E] via-[#0D9488]/60 to-[#F0FDFA] pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge className="bg-white/20 text-white border-white/30 mb-4">FAQ</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Pertanyaan yang Sering Diajukan</h1>
          <p className="text-white/80">Temukan jawaban atas pertanyaan umum tentang layanan aftech Klinik.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {categories.map(cat => (
          <div key={cat} className="mb-10">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">{cat}</h2>
            <div className="space-y-3">
              {faqs.filter(f => f.category === cat).map(faq => (
                <details key={faq.id} className="bg-white rounded-2xl border border-gray-100 group">
                  <summary className="p-6 font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    {faq.question}
                    <span className="text-emerald-600 group-open:rotate-45 transition-transform text-xl ml-4 flex-shrink-0">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Uncategorized */}
        {faqs.filter(f => !f.category).length > 0 && (
          <div className="space-y-3">
            {faqs.filter(f => !f.category).map(faq => (
              <details key={faq.id} className="bg-white rounded-2xl border border-gray-100 group">
                <summary className="p-6 font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-emerald-600 group-open:rotate-45 transition-transform text-xl ml-4">+</span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">{faq.answer}</div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
