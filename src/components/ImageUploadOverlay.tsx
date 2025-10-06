import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadOverlayProps {
  onClose: () => void;
  carDetailsSubmit: () => void;
  onFinalSubmit: (uploadedFiles: File[]) => void;
  defaultValues: {
    brand?: string;
    model?: string;
    variant?: string;
    manufacturingYear?: string | number;
    fuelType?: string;
    transmission?: string;
    bodyType?: string;
    ownership?: string;
    price?: number | string;
    kmDriven?: number | string;
    seats?: number | string;
    images?: string[]; // existing images for edit mode
  } | null;
}

export default function ImageUploadOverlay({
  onClose,
  carDetailsSubmit,
  onFinalSubmit,
  defaultValues,
}: ImageUploadOverlayProps) {
  const isEdit = !!defaultValues;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [error, setError] = useState("");

  const MAX_IMAGES = 5;
  const MAX_SIZE_MB = 20;

  // 🧹 Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      previewURLs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewURLs]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles: File[] = [];

      for (const file of filesArray) {
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_SIZE_MB) {
          setError(`"${file.name}" exceeds ${MAX_SIZE_MB} MB limit.`);
          return;
        }
        validFiles.push(file);
      }

      if (validFiles.length + selectedFiles.length > MAX_IMAGES) {
        setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
        return;
      }

      setSelectedFiles((prev) => [...prev, ...validFiles]);

      const newURLs = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewURLs((prev) => [...prev, ...newURLs]);

      setError("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...selectedFiles];
    const updatedURLs = [...previewURLs];

    URL.revokeObjectURL(updatedURLs[index]); // cleanup this URL
    updatedFiles.splice(index, 1);
    updatedURLs.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setPreviewURLs(updatedURLs);
  };

  const handleFinalSubmit = () => {
    console.log("🚀 handleFinalSubmit triggered with:", selectedFiles); //debugging

    if (selectedFiles.length === 0 && !isEdit) {
      setError("Please select at least one image before posting.");
      return;
    } else if (selectedFiles.length === 0) {
      setError("Please select at least one image before posting.");
      return;
    }
    onFinalSubmit(selectedFiles);
    carDetailsSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center lg:justify-end z-50 overflow-hidden">
      <div className="bg-white rounded-sm p-7 pt-10 max-w-[350px] relative shadow-lg lg:mr-12 max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          aria-label="Close upload modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isEdit ? (
          <>
            {/* Upload Section */}
            <div className="border-2 rounded-sm border-dashed border-gray-800 px-6 py-4 flex flex-col items-center justify-center mb-4">
              <Upload className="w-7 lg:w-10 h-7 lg:h-10 text-gray-500 mb-2" />
              <p className="text-xs lg:text-sm text-center">
                Choose files or drag & drop them here
              </p>
              <p className="text-[10px] lg:text-xs text-gray-700 mb-3 text-center">
                jpeg, jpg, png — max {MAX_IMAGES} images, up to {MAX_SIZE_MB} MB
              </p>

              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="cursor-pointer mb-3"
              />

              {error && (
                <p className="text-red-500 mt-2 text-xs text-center">{error}</p>
              )}
            </div>

            {/* Preview Section */}
            {previewURLs.length > 0 && (
              <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-auto">
                {previewURLs.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Selected ${index + 1}`}
                      className="rounded border border-gray-300 w-full h-24 object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Edit mode preview */}
            {defaultValues?.images && defaultValues.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 mb-3">
                {defaultValues.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Existing ${index + 1}`}
                    className="rounded border border-gray-300 w-full h-24 object-cover"
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-center text-gray-600 mb-3">
                No existing images found.
              </p>
            )}

            <div className="text-center text-sm text-gray-700">
              Click <b>“Update Car Details”</b> to save your changes.
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          onClick={handleFinalSubmit}
          className="w-full bg-black text-white text-xs lg:text-sm py-2 rounded-xs mt-4 hover:bg-black/80 active:bg-black/80 active:scale-95"
        >
          {defaultValues ? "Update Car Details" : "Post Car"}
        </button>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { Upload, X } from "lucide-react";

// interface ImageUploadOverlayProps {
//   onClose: () => void;
//   carDetailsSubmit: () => void;
//   onFinalSubmit: (uploadedUrls: string[]) => void;
//   defaultValues: {
//     brand?: string;
//     model?: string;
//     variant?: string;
//     manufacturingYear?: string | number;
//     fuelType?: string;
//     transmission?: string;
//     bodyType?: string;
//     ownership?: string;
//     price?: number | string;
//     kmDriven?: number | string;
//     seats?: number | string;
//   } | null;
// }

// export default function ImageUploadOverlay({
//   onClose,
//   carDetailsSubmit,
//   onFinalSubmit,
//   defaultValues,
// }: ImageUploadOverlayProps) {
//   const isEdit = !!defaultValues;

//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
//   const [error, setError] = useState("");

//     const MAX_IMAGES = 5; // limit

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files);
//       setSelectedFiles(filesArray);
//       setUploadedUrls([]);
//       setError("");
//     }
//   };

//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) {
//       setError("Please select at least one image to upload.");
//       return;
//     }

//     const userId = localStorage.getItem("user")
//       ? JSON.parse(localStorage.getItem("user") || "{}").id
//       : null;
//     if (!userId) {
//       setError("User not logged in.");
//       return;
//     }

//     setUploading(true);
//     setError("");

//     const formData = new FormData();

//     selectedFiles.forEach((file) => {
//       formData.append("file", file);
//     });

//     formData.append("userId", userId);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center lg:justify-end z-50 overflow-hidden">
//       <div className="bg-white rounded-sm p-7 pt-10 max-w-[350px] relative shadow-lg lg:mr-12 max-h-[80vh] overflow-y-auto">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
//           aria-label="Close upload modal"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         {!isEdit ? (
//           <>
//             <div className="border-2 rounded-sm border-dashed border-gray-800 rounded-sm-lg px-6 py-4 flex flex-col items-center justify-center mb-4">
//               <Upload className="w-7 lg:w-10 h-7 lg:h-10 text-gray-500 mb-2" />
//               <p className="text-xs lg:text-sm text-center">
//                 Choose a file or drag & drop it here
//               </p>
//               <p className="text-[10px] lg:text-xs text-gray-700 mb-3 text-center">
//                 jpeg, jpg and png formats, up to 20 MB
//               </p>
//               <input
//                 type="file"
//                 multiple
//                 accept=".jpg,.jpeg,.png"
//                 onChange={handleFileChange}
//                 className="cursor-pointer mb-3"
//               />
//               <button
//                 onClick={handleUpload}
//                 disabled={uploading}
//                 className="border px-6 py-1 text-xs lg:text-sm rounded cursor-pointer text-black hover:bg-gray-200 hover:scale-[1.1] active:scale-95 active:bg-gray-200"
//               >
//                 {uploading ? "Uploading..." : "Upload"}
//               </button>
//               {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}
//             </div>
//             {uploadedUrls.length > 0 && (
//               <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-auto">
//                 {uploadedUrls.map((url, index) => (
//                   <img
//                     key={index}
//                     src={url}
//                     alt={`uploaded image ${index + 1}`}
//                     className="rounded border border-gray-300"
//                   />
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="rounded-sm-lg py-4 flex flex-col items-center justify-center">
//             <p className="text-xs lg:text-sm text-center mb-2">
//               Choose a file or drag & drop it here
//             </p>
//             <p className="text-[10px] lg:text-sm text-center">
//               Click on "Update Car Details" to save the changes
//             </p>
//           </div>
//         )}

//         <button
//           onClick={()=>{carDetailsSubmit()}}
//           className="w-full bg-black text-white text-xs lg:text-sm py-2 rounded-xs mt-4 hover:bg-black/80 active:bg-black/80 active:scale-95"
//         >
//           {defaultValues ? "Update Car Details" : "Post Car"}
//         </button>
//       </div>
//     </div>
//   );
// }
