/**
 * Processes an image file: resizes it to a max dimension and converts it to WebP/PNG
 * to ensure optimal storage performance and compatibility.
 */
export const processImageForWeb = (file: File, maxDimension: number = 2048): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 1. Validate File Type
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo no es una imagen.'));
      return;
    }

    // 2. Load Image
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // 3. Calculate new dimensions (maintain aspect ratio)
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      // 4. Draw to Canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('No se pudo crear el contexto del canvas.'));
        return;
      }

      // Optional: Add white background in case of transparent PNGs being converted to JPEG (though we use WebP which supports transparency)
      // ctx.fillStyle = '#FFFFFF';
      // ctx.fillRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);

      // 5. Export as WebP (Modern standard, high compression, transparency support)
      // Fallback to image/jpeg if browser doesn't support webp (very rare nowadays)
      const mimeType = 'image/webp';
      const quality = 0.85; // Good balance for blueprints

      const dataUrl = canvas.toDataURL(mimeType, quality);

      // Cleanup
      URL.revokeObjectURL(objectUrl);
      resolve(dataUrl);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
};