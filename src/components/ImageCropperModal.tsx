"use client";

import { useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Crop, ZoomIn, ZoomOut, Check } from "lucide-react";
import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCrop: (file: File) => void;
  aspectRatio?: number;
}

export default function ImageCropperModal({ isOpen, onClose, onCrop, aspectRatio = 1 }: ImageCropperModalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          const file = new File([blob], fileName || "cropped-image.jpg", { type: "image/jpeg" });
          onCrop(file);
          setImage(null);
          onClose();
        }
      }, "image/jpeg");
    }
  };

  return (
    <Transition grow show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-card border border-border shadow-2xl transition-all">
                <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                  <Dialog.Title as="h3" className="text-xl font-bold flex items-center gap-2">
                    <Crop size={24} className="text-primary" />
                    Adjust Image
                  </Dialog.Title>
                  <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  {!image ? (
                    <div className="group relative border-2 border-dashed border-border rounded-3xl p-12 text-center hover:border-primary transition-all bg-secondary/10">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                          <Crop size={48} />
                        </div>
                        <div>
                          <p className="text-lg font-bold">Select an image to adjust</p>
                          <p className="text-muted-foreground mt-1">PNG, JPG or WebP (Max 5MB)</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-2xl overflow-hidden border border-border bg-black">
                        <Cropper
                          src={image}
                          style={{ height: 400, width: "100%" }}
                          initialAspectRatio={aspectRatio}
                          aspectRatio={aspectRatio}
                          guides={true}
                          ref={cropperRef}
                          viewMode={1}
                          background={false}
                          responsive={true}
                          autoCropArea={1}
                          checkOrientation={false}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                         <div className="flex gap-2">
                            <button onClick={() => cropperRef.current?.cropper.zoom(0.1)} className="p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-all">
                              <ZoomIn size={20} />
                            </button>
                            <button onClick={() => cropperRef.current?.cropper.zoom(-0.1)} className="p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-all">
                              <ZoomOut size={20} />
                            </button>
                         </div>
                         <div className="flex gap-3">
                            <button onClick={() => setImage(null)} className="px-6 py-3 font-semibold text-muted-foreground hover:text-foreground transition-all">
                              Cancel
                            </button>
                            <button onClick={getCroppedImage} className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg flex items-center gap-2 active:scale-95 transition-all">
                              <Check size={20} />
                              Apply Crop
                            </button>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
