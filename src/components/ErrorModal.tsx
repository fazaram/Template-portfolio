"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertCircle, X } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

export default function ErrorModal({ isOpen, onClose, message, title = "Operation Failed" }: ErrorModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-card p-8 text-left align-middle shadow-2xl transition-all border border-border relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <Dialog.Title as="h3" className="text-xl font-bold text-foreground">
                      {title}
                    </Dialog.Title>
                    <p className="text-sm text-muted-foreground mt-1">Validation or System Error</p>
                  </div>
                </div>

                <div className="mt-2 mb-8 bg-secondary/50 p-6 rounded-2xl border border-border">
                  <p className="text-sm text-foreground leading-relaxed font-medium">
                    {message}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    onClick={onClose}
                  >
                    Got it, I'll fix it
                  </button>
                </div>

                <button
                  type="button"
                  className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onClose}
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
