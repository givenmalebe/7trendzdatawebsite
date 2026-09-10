import type { ProductFeature } from "@/lib/products"

export function FeaturesGrid({ features, accentColor }: { features: ProductFeature[]; accentColor: string }) {
  return (
    <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-label-corporate mb-4 mx-auto w-fit">Key Features</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What It Does</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl ${accentColor} flex items-center justify-center mb-4 shadow-md`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}