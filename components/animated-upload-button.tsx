"use client"

import { useState } from "react"

interface AnimatedUploadButtonProps {
  onUpload: () => void
  isSubmitting?: boolean
}

export default function AnimatedUploadButton({ onUpload, isSubmitting = false }: AnimatedUploadButtonProps) {
  const [isChecked, setIsChecked] = useState(isSubmitting)

  const handleClick = () => {
    if (!isChecked) {
      setIsChecked(true)
      onUpload()
    }
  }

  return (
    <div className="relative">
      <input type="checkbox" id="check" className="hidden" checked={isChecked} readOnly />
      <button
        onClick={handleClick}
        disabled={isChecked}
        className={`relative block mx-auto ${
          isChecked ? "w-[42px]" : "w-[120px]"
        } h-[42px] transition-[width] duration-300 ease-in-out cursor-pointer rounded-md`}
        type="button"
      >
        <div className="absolute inset-0 bg-white border-2 border-[#143240] overflow-hidden z-[2] rounded-md">
          {!isChecked && (
            <div className="absolute inset-0 py-3 text-center text-[#143240] text-sm font-bold z-[1]">upload</div>
          )}

          <div className="absolute top-0 right-0 w-[38px] h-[38px] bg-white z-[2]">
            <div
              className={`absolute ${
                isChecked ? "animate-arrow-a" : "top-[18px] right-[17px] w-[10px] h-[2px] bg-[#143240] rotate-[-45deg]"
              }`}
            ></div>
            <div
              className={`absolute ${
                isChecked ? "animate-arrow-b" : "top-[18px] right-[11px] w-[10px] h-[2px] bg-[#143240] rotate-[45deg]"
              }`}
            ></div>
          </div>

          <div
            className={`absolute top-0 right-0 w-[54px] h-[54px] -m-2 bg-[#143240] rounded-full z-[3] ${
              isChecked ? "animate-success" : "scale-0"
            }`}
          >
            <svg className="w-5 h-5 fill-white mx-auto mt-4" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
            </svg>
          </div>
        </div>
      </button>

      <style jsx>{`
        @keyframes arrow-a {
          0% {
            top: 18px;
            right: 17px;
            width: 10px;
            height: 2px;
            transform: rotateZ(-45deg);
            background-color: #143240;
          }
          100% {
            top: 36px;
            right: 19px;
            width: 19px;
            height: 2px;
            transform: rotateZ(0deg);
            background-color: #ffc107;
          }
        }

        @keyframes arrow-b {
          0% {
            top: 18px;
            right: 11px;
            width: 10px;
            height: 2px;
            transform: rotateZ(45deg);
            background-color: #143240;
          }
          100% {
            top: 36px;
            right: 0;
            width: 19px;
            height: 2px;
            transform: rotateZ(0deg);
            background-color: #ffc107;
          }
        }

        @keyframes inc-height {
          0% {
            top: 36px;
            height: 2px;
          }
          25% {
            top: 31px;
            height: 8px;
          }
          50% {
            top: 21px;
            height: 18px;
          }
          80% {
            top: 11px;
            height: 28px;
          }
          100% {
            top: 0;
            height: 39px;
          }
        }

        @keyframes success {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-arrow-a {
          animation: arrow-a 0.4s ease 0.4s forwards, inc-height 4s ease 1s forwards;
          position: absolute;
          top: 18px;
          right: 17px;
          width: 10px;
          height: 2px;
          transform: rotateZ(-45deg);
          background-color: #143240;
        }

        .animate-arrow-b {
          animation: arrow-b 0.4s ease 0.4s forwards, inc-height 4s ease 1s forwards;
          position: absolute;
          top: 18px;
          right: 11px;
          width: 10px;
          height: 2px;
          transform: rotateZ(45deg);
          background-color: #143240;
        }

        .animate-success {
          animation: success 0.3s cubic-bezier(0, 0.74, 0.32, 1.21) 5.2s forwards;
        }
      `}</style>
    </div>
  )
}
