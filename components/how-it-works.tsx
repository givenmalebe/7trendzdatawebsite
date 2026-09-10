export function HowItWorks({ steps }: { steps: { title: string; description: string }[] }) {
  return (
    <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-label-corporate mb-4 mx-auto w-fit">How It Works</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Simple & Transparent</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center bg-white rounded-2xl p-6 shadow-md border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}