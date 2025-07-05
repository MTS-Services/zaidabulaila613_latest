"use client"

import { animatedLoaderContent } from "@/constants/loaders/animated-loader"
import { useTranslation } from "@/hooks/use-translation"
import { any } from "zod"

const AnimatedLoader = () => {
  const { prefix, words, styles } = animatedLoaderContent
const {t} = useTranslation()
const animatedWords = [t('animatedloaderContent.buy'), t('animatedloaderContent.sell'), t('animatedloaderContent.rent'), t('animatedloaderContent.browse')];

  return (
    <div className="card bg-white w-full max-w-none mx-auto flex justify-center items-center h-[60px]">
      <style jsx>{`
        .card {
          --bg-color: ${styles.backgroundColor};
          margin: 0;
          padding: 20px;
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }
        .loader {
          color: white;
          font-family: var(--font-inter), sans-serif;
          font-weight: 600;
          font-size: ${styles.fontSize};
          box-sizing: border-box;
          height: ${styles.height.container};
          display: flex;
          align-items: center;
          text-align: left;
          margin: 0;
          padding: 0;
        }
        .words {
          overflow: hidden;
          position: relative;
          height: ${styles.height.words};
        }
        .words::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            var(--bg-color) ${styles.gradient.top},
            transparent ${styles.gradient.topMiddle},
            transparent ${styles.gradient.bottomMiddle},
            var(--bg-color) ${styles.gradient.bottom}
          );
          z-index: 20;
        }
        .word {
          display: block;
          height: 100%;
          padding-left: 10px;
          color: ${styles.wordColor};
          animation: spin_4991 ${styles.animationDuration} infinite;
          font-weight: 700;
        }
        @keyframes spin_4991 {
          0% { transform: translateY(0); }
          10% { transform: translateY(-102%); }
          25% { transform: translateY(-100%); }
          35% { transform: translateY(-202%); }
          50% { transform: translateY(-200%); }
          60% { transform: translateY(-302%); }
          75% { transform: translateY(-300%); }
          85% { transform: translateY(-402%); }
          100% { transform: translateY(-400%); }
        }
      `}</style>

      <div className="loader px-4 md:px-12 lg:px-24">
        <p className="text-black font-bold m-0 p-0">{t('animatedloaderContent.prefix')}</p>
        <div className="words">
          {animatedWords.map((word, index) => (
            <div key={index} className="word">{word}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnimatedLoader
