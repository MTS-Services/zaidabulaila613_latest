"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { shopTypeContent } from "@/constants/shop/shop-type"

export default function ShopByType() {
  const router = useRouter()
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const { buttons, styles } = shopTypeContent

  const handleButtonClick = (buttonId: string, link: string) => {
    setActiveButton(buttonId)
    setTimeout(() => {
      router.push(link)
    }, shopTypeContent.navigationDelay)
  }

  return (
    <section className="py-12 md:py-16 bg-white lg:hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair">
              {shopTypeContent.title}
            </h2>
            <p className="max-w-[500px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {shopTypeContent.description}
            </p>
          </div>
        </div>

        <div className="max-w-xs mx-auto">
          <div className="customCheckBoxHolder">
            {buttons.map((button) => (
              <div key={button.id} className="w-full">
                <input
                  className="customCheckBoxInput"
                  id={`type-${button.id}`}
                  type="radio"
                  name="dressType"
                  checked={activeButton === button.id}
                  onChange={() => handleButtonClick(button.id, button.link)}
                />
                <label className={`customCheckBoxWrapper ${button.className}`} htmlFor={`type-${button.id}`}>
                  <div className="customCheckBox">
                    <div className="inner">{button.title}</div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .customCheckBox {
          width: 100%;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
          padding: 2px 8px;
          background-color: ${styles.colors.default.background};
          border-radius: 0px;
          color: ${styles.colors.default.text};
          transition-timing-function: ${styles.transitions.timing};
          transition-duration: ${styles.transitions.duration};
          transition-property: color, background-color, box-shadow;
          display: flex;
          height: ${styles.dimensions.mobile.height};
          align-items: center;
          box-shadow: ${styles.shadows.default};
          outline: none;
          justify-content: center;
          min-width: 55px;
        }

        .customCheckBox:hover {
          background-color: ${styles.colors.default.hover};
          color: white;
          box-shadow: ${styles.shadows.hover};
        }

        .customCheckBoxInput:checked + .customCheckBoxWrapper .customCheckBox {
          background-color: ${styles.colors.active.background};
          color: white;
          box-shadow: ${styles.shadows.hover};
        }

        .customCheckBoxInput:checked + .customCheckBoxWrapper .customCheckBox:hover {
          background-color: ${styles.colors.active.hover};
          box-shadow: ${styles.shadows.active};
        }

        @media (min-width: 768px) {
          .customCheckBox {
            height: ${styles.dimensions.desktop.height};
          }
          
          .customCheckBox .inner {
            font-size: ${styles.dimensions.desktop.fontSize};
          }
        }
      `}</style>
    </section>
  )
}
