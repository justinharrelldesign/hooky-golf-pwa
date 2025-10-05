import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CroppedAreaPixels extends Area {}

export function ImageCropModal({ open, imageSrc, onClose, onCropComplete }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropChange = (location: { x: number; y: number }) => {
    setCrop(location);
  };

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: CroppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onZoomChange = (zoomValue: number[]) => {
    setZoom(zoomValue[0]);
  };

  const createCroppedImage = async (): Promise<Blob | null> => {
    if (!croppedAreaPixels) return null;

    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(null);
          return;
        }

        // Set canvas size to the cropped area
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        // Draw the cropped image
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg", 0.95);
      };
    });
  };

  const handleSave = async () => {
    setIsCropping(true);
    try {
      const croppedBlob = await createCroppedImage();
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-full sm:max-w-[500px] p-0 gap-0 bg-white">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="font-['Geologica:Bold',_sans-serif] font-bold text-[#282828] text-[20px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Crop Your Photo
          </DialogTitle>
          <DialogDescription className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Adjust the image to fit perfectly in your profile circle
          </DialogDescription>
        </DialogHeader>

        {/* Cropper Area */}
        <div className="relative w-full h-[400px] bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          {/* Zoom Slider */}
          <div className="space-y-2">
            <label className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Zoom
            </label>
            <Slider
              value={[zoom]}
              onValueChange={onZoomChange}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 font-['Geologica:Medium',_sans-serif] text-[#282828] border-[#517b34]"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              disabled={isCropping}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isCropping}
              className="flex-1 btn-primary text-white font-['Geologica:Bold',_sans-serif]"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              {isCropping ? "Saving..." : "Save Photo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}