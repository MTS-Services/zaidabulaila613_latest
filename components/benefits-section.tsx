"use client"
import { TruckIcon, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react"
import { benefitsContent } from "@/constants/benefits/benefits"

const BenefitsSection = () => {
  const { title, benefits } = benefitsContent

  const iconComponents = {
    TruckIcon,
    RefreshCw,
    ShieldCheck,
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          {title}
        </h2>

        <div className="grid gap-8 sm:grid-cols-3 place-items-center">
          {benefits.map((benefit) => {
            const IconComponent = iconComponents[benefit.icon as keyof typeof iconComponents]
            
            return (
              <div key={benefit.id} className="benefit-card">
                <div className="benefit-card-inner">
                  <div className={`p-4 rounded-full ${benefit.iconBgColor} mb-4`}>
                    <IconComponent className={`h-7 w-7 ${benefit.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                  <div className="go-corner">
                    <div className="go-arrow">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
