"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  variant?: "destructive" | "primary";
}

export default function ConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmLabel = "Confirm",
  variant = "destructive"
}: ConfirmModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-card p-8 text-left align-middle shadow-2xl transition-all border border-border">
                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-foreground mb-4">
                  {title}
                </Dialog.Title>
                <div className="mt-2 mb-8 text-sm text-muted-foreground leading-relaxed">
                  {message}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-6 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-all active:scale-95"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`px-6 py-3 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg ${
                      variant === "destructive" 
                        ? "bg-destructive hover:bg-destructive/90 shadow-destructive/20" 
                        : "bg-primary hover:bg-primary/90 shadow-primary/20"
                    }`}
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </button>
                </div>
                <button
                  type="button"
                  className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onCancel}
                >
                  <X size={20} />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
