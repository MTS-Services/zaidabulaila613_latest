"use client"

import { useState, useEffect } from "react"

interface UploadButtonProps {
  onUpload?: () => void
  isSubmitting?: boolean
}

const UploadButton = ({ onUpload, isSubmitting = false }: UploadButtonProps) => {
  const [checked, setChecked] = useState(isSubmitting)

  useEffect(() => {
    if (isSubmitting && !checked) {
      setChecked(true)
    }
  }, [isSubmitting, checked])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (checked && onUpload) {
      onUpload()
      timeout = setTimeout(() => setChecked(false), 6000) // Reset after animation
    }
    return () => clearTimeout(timeout)
  }, [checked, onUpload])

  return (
    <div className="relative">
      <style jsx>{`
        #check {
          display: none;
        }

        #upload {
          display: block;
          position: relative;
          margin: 0 auto;
          width: 120px;
          height: 42px;
          transition: 0.3s ease width;
          cursor: pointer;
        }

        #app {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background-color: #fff;
          border: 2px solid #143240;
          overflow: hidden;
          z-index: 2;
        }

        #app::before {
          content: "upload";
          position: absolute;
          top: 0;
          right: 0;
          padding: 12px;
          left: 0;
          color: #143240;
          font-size: 14px;
          line-height: 14px;
          font-weight: bold;
          z-index: 1;
        }

        #arrow {
          position: absolute;
          top: 0;
          right: 0;
          width: 38px;
          height: 38px;
          background-color: #fff;
          z-index: 2;
        }

        #arrow::before,
        #arrow::after {
          content: "";
          position: absolute;
          top: 18px;
          width: 10px;
          height: 2px;
          background-color: #143240;
        }

        #arrow::before {
          right: 17px;
          transform: rotateZ(-45deg);
        }

        #arrow::after {
          right: 11px;
          transform: rotateZ(45deg);
        }

        #success {
          position: absolute;
          top: 0;
          right: 0;
          width: 54px;
          height: 54px;
          margin: -8px;
          background-color: #143240;
          transform: scale(0);
          border-radius: 50%;
          z-index: 3;
        }

        #success svg {
          font-size: 20px;
          fill: #fff;
          display: block;
          width: 20px;
          height: 20px;
          margin: 17px auto;
          transform: scale(1);
        }

        #check:checked + #upload {
          width: 42px;
        }

        #check:checked + #upload #arrow::before {
          animation:
            _a 0.4s ease 0.4s forwards,
            _incHeight 4s ease 1s forwards;
        }

        #check:checked + #upload #arrow::after {
          animation:
            _b 0.4s ease 0.4s forwards,
            _incHeight 4s ease 1s forwards;
        }

        #check:checked + #upload #success {
          animation: _success 0.3s cubic-bezier(0, 0.74, 0.32, 1.21) 5.2s forwards;
        }

        @keyframes _a {
          0% {
            top: 18px;
            right: 17px;
            width: 10px;
            transform: rotateZ(-45deg);
            background-color: #143240;
          }
          100% {
            top: 36px;
            right: 19px;
            width: 19px;
            transform: rotateZ(0deg);
            background-color: #ffc107;
          }
        }

        @keyframes _b {
          0% {
            top: 18px;
            right: 11px;
            width: 10px;
            transform: rotateZ(45deg);
            background-color: #143240;
          }
          100% {
            top: 36px;
            right: 0;
            width: 19px;
            transform: rotateZ(0deg);
            background-color: #ffc107;
          }
        }

        @keyframes _incHeight {
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

        @keyframes _success {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      <input
        type="checkbox"
        id="check"
        checked={checked}
        onChange={() => !isSubmitting && setChecked(!checked)}
        className="hidden"
      />
      <label htmlFor="check" id="upload" className={isSubmitting ? "pointer-events-none" : "cursor-pointer"}>
        <div id="app">
          <div id="arrow"></div>
          <div id="success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
            </svg>
          </div>
        </div>
      </label>
    </div>
  )
}

export default UploadButton
