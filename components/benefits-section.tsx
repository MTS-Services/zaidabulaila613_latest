"use client"
import { TruckIcon, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react"
// import { benefitsContent } from "@/constants/benefits/benefits"
import { useTranslation } from "@/hooks/use-translation"

const BenefitsSection = () => {

const {t} = useTranslation();
 const benefits = [
{
  icon: t('benefit.fast.fasticon'),
  iconBg: t('benefit.fast.fasticonbgcolor'),
  iconColor: t('benefit.fast.fasticoncolor'),
  title: t('benefit.fast.title'),
  description: t('benefit.fast.description'),
},
{
  icon: t('benefit.easy.icon'),
  iconBg: t('benefit.easy.iconbgcolor'),
  iconColor: t('benefit.easy.iconcolor'),
  title: t('benefit.easy.title'),
  description: t('benefit.easy.description'),
},
{
  icon: t('benefit.quantity.icon'),
  iconBg: t('benefit.quantity.iconbgcolor'),
  iconColor: t('benefit.quantity.iconcolor'),
  title: t('benefit.quantity.title'),
  description: t('benefit.quantity.description'),
},
];
  // const { title, benefits } = benefitsContent

  const iconComponents = {
    TruckIcon,
    RefreshCw,
    ShieldCheck,
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          {t('benefit.title')}
        </h2>

        <div className="grid gap-8 sm:grid-cols-3 place-items-center">
          {benefits.map((benefit, index) => {
            const IconComponent = iconComponents[benefit.icon as keyof typeof iconComponents]
            
            return (
              <div key={index} className="benefit-card">
                <div className="benefit-card-inner">
                  <div className={`p-4 rounded-full ${benefit.iconBg} mb-4`}>
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
