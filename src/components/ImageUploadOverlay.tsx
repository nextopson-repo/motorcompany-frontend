import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import { clearCarImages, setCarImages } from "../store/slices/carImageSlice";

interface ImageUploadOverlayProps {
  onClose: () => void;
  carDetailsSubmit: () => void;
  defaultValues: {
    images?: string[];
  } | null;
}

export default function ImageUploadOverlay({
  onClose,
  carDetailsSubmit,
  defaultValues,
}: ImageUploadOverlayProps) {
  const dispatch = useAppDispatch();
  const storedFiles = useAppSelector((state) => state.carImage.files);

  const isEdit = !!defaultValues;
  const [selectedFiles, setSelectedFiles] = useState<File[]>(storedFiles);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [error, setError] = useState("");

  const MAX_IMAGES = 5;
  const MAX_SIZE_MB = 20;

  // Cleanup previews
  useEffect(() => {
    return () => {
      previewURLs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewURLs]);

  useEffect(() => {
    const newURLs = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewURLs(newURLs);
    dispatch(setCarImages(selectedFiles));

    return () => {
      newURLs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles, dispatch]);

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
      setError("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleFinalSubmit = () => {
    if (selectedFiles.length === 0 && !isEdit) {
      setError("Please select at least one image before posting.");
      return;
    }
    carDetailsSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center lg:justify-end z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-xl p-6 w-full lg:w-[50%] max-w-sm lg:mr-6 shadow-2xl relative overflow-y-auto max-h-[85vh] transition-all">
        {/* Close Button */}
        <button
          onClick={() => {
            dispatch(clearCarImages());
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Close upload modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isEdit ? "Update Car Images" : "Upload Car Images"}
        </h2>

        {/* Upload Section */}
        {!isEdit && (
          <>
            <label
              htmlFor="image-upload"
              className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:border-red-400 transition-all"
            >
              <Upload className="w-10 h-10 text-gray-500 mb-2" />
              <p className="text-sm text-gray-700 font-medium">
                Click or drag & drop files here
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                JPG, PNG up to {MAX_SIZE_MB} MB — max {MAX_IMAGES} images
              </p>
              <input
                id="image-upload"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {error && (
              <p className="text-red-500 mt-2 text-xs text-center">{error}</p>
            )}

            {previewURLs.length > 0 && (
              <div className="h-full grid grid-cols-2 gap-2 mt-3 overflow-y-auto">
                {previewURLs.map((url, index) => (
                  <div
                    key={index}
                    className="relative group rounded-md overflow-hidden shadow-sm"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-22 object-cover rounded-md"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Edit Mode View */}
        {isEdit && (
          <div>
            {defaultValues?.images && defaultValues.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 mb-3">
                {defaultValues.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Existing ${index + 1}`}
                    className="rounded-md border border-gray-300 w-full h-28 object-cover shadow-sm"
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-center text-gray-600 mb-3">
                No existing images found.
              </p>
            )}

            <p className="text-center text-sm text-gray-700">
              Click <b>“Update Car Details”</b> to save your changes.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleFinalSubmit}
          className="w-full bg-red-500 text-white py-2 mt-6 rounded-md text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all"
        >
          {isEdit ? "Update Car Details" : "Post Car"}
        </button>
      </div>
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { Upload, X } from "lucide-react";
// import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
// import { clearCarImages, setCarImages } from "../store/slices/carImageSlice";

// interface ImageUploadOverlayProps {
//   onClose: () => void;
//   carDetailsSubmit: () => void;
//   defaultValues: {
//     images?: string[];
//   } | null;
// }

// export default function ImageUploadOverlay({
//   onClose,
//   carDetailsSubmit,
//   defaultValues,
// }: ImageUploadOverlayProps) {
//   const dispatch = useAppDispatch();
//   const storedFiles = useAppSelector(state => state.carImage.files);

//   const isEdit = !!defaultValues;
//   const [selectedFiles, setSelectedFiles] = useState<File[]>(storedFiles);
//   const [previewURLs, setPreviewURLs] = useState<string[]>([]);
//   const [error, setError] = useState("");

//   const MAX_IMAGES = 5;
//   const MAX_SIZE_MB = 20;

//   useEffect(() => {
//     return () => {
//       previewURLs.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [previewURLs]);

//   useEffect(() => {
//     const newURLs = selectedFiles.map((file) => URL.createObjectURL(file));
//     setPreviewURLs(newURLs);

//     dispatch(setCarImages(selectedFiles));

//     return () => {
//       newURLs.forEach(url => URL.revokeObjectURL(url));
//     };
//   }, [selectedFiles, dispatch]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files);
//       const validFiles: File[] = [];

//       for (const file of filesArray) {
//         const sizeMB = file.size / (1024 * 1024);
//         if (sizeMB > MAX_SIZE_MB) {
//           setError(`"${file.name}" exceeds ${MAX_SIZE_MB} MB limit.`);
//           return;
//         }
//         validFiles.push(file);
//       }

//       if (validFiles.length + selectedFiles.length > MAX_IMAGES) {
//         setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
//         return;
//       }

//       setSelectedFiles((prev) => [...prev, ...validFiles]);
//       setError("");
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     const updatedFiles = [...selectedFiles];
//     updatedFiles.splice(index, 1);
//     setSelectedFiles(updatedFiles);
//   };

//   const handleFinalSubmit = () => {
//     if (selectedFiles.length === 0 && !isEdit) {
//       setError("Please select at least one image before posting.");
//       return;
//     }
//     carDetailsSubmit();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center lg:justify-end z-50 overflow-hidden">
//       <div className="bg-white rounded-sm p-7 pt-10 max-w-[350px] relative shadow-lg lg:mr-12 max-h-[80vh] overflow-y-auto">
//         <button
//           onClick={() => {
//             dispatch(clearCarImages());
//             onClose();
//           }}
//           className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
//           aria-label="Close upload modal"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         {!isEdit ? (
//           <>
//             <div className="border-2 rounded-sm border-dashed border-gray-800 px-6 py-4 flex flex-col items-center justify-center mb-4">
//               <Upload className="w-7 lg:w-10 h-7 lg:h-10 text-gray-500 mb-2" />
//               <p className="text-xs lg:text-sm text-center">
//                 Choose files or drag & drop them here
//               </p>
//               <p className="text-[10px] lg:text-xs text-gray-700 mb-3 text-center">
//                 jpeg, jpg, png — max {MAX_IMAGES} images, up to {MAX_SIZE_MB} MB
//               </p>

//               <input
//                 type="file"
//                 multiple
//                 accept=".jpg,.jpeg,.png"
//                 onChange={handleFileChange}
//                 className="cursor-pointer mb-3"
//               />

//               {error && (
//                 <p className="text-red-500 mt-2 text-xs text-center">{error}</p>
//               )}
//             </div>

//             {previewURLs.length > 0 && (
//               <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-auto">
//                 {previewURLs.map((url, index) => (
//                   <div key={index} className="relative">
//                     <img
//                       src={url}
//                       alt={`Selected ${index + 1}`}
//                       className="rounded border border-gray-300 w-full h-24 object-cover"
//                     />
//                     <button
//                       onClick={() => handleRemoveImage(index)}
//                       className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full p-1"
//                     >
//                       <X size={12} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <>
//             {defaultValues?.images && defaultValues.images.length > 0 ? (
//               <div className="grid grid-cols-2 gap-3 mb-3">
//                 {defaultValues.images.map((img, index) => (
//                   <img
//                     key={index}
//                     src={img}
//                     alt={`Existing ${index + 1}`}
//                     className="rounded border border-gray-300 w-full h-24 object-cover"
//                   />
//                 ))}
//               </div>
//             ) : (
//               <p className="text-xs text-center text-gray-600 mb-3">
//                 No existing images found.
//               </p>
//             )}

//             <div className="text-center text-sm text-gray-700">
//               Click <b>“Update Car Details”</b> to save your changes.
//             </div>
//           </>
//         )}

//         <button
//           onClick={handleFinalSubmit}
//           className="w-full bg-black text-white text-xs lg:text-sm py-2 rounded-xs mt-4 hover:bg-black/80 active:bg-black/80 active:scale-95"
//         >
//           {isEdit ? "Update Car Details" : "Post Car"}
//         </button>
//       </div>
//     </div>
//   );
// }
