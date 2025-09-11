"use client"
import { useToast as useToastHook, toast } from "@/hooks/use-toast"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster as ToastComponent,
} from "@/components/ui/toast"

export function Toaster() {
  return <ToastComponent />
}

export {
  useToastHook as useToast,
  toast,
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
}
