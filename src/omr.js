// OMR Detection using OpenCV.js
export const detectBubbles = (imageSrc) => {
  return new Promise((resolve, reject) => {
    if (!window.cv) {
      reject('OpenCV not loaded');
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        const src = window.cv.imread(img);
        const gray = new window.cv.Mat();
        const thresh = new window.cv.Mat();
        const contours = new window.cv.MatVector();
        const hierarchy = new window.cv.Mat();

        // Convert to grayscale
        window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
        
        // Apply Gaussian blur
        window.cv.GaussianBlur(gray, gray, new window.cv.Size(5, 5), 0);
        
        // Threshold
        window.cv.threshold(gray, thresh, 0, 255, window.cv.THRESH_BINARY_INV + window.cv.THRESH_OTSU);
        
        // Find contours
        window.cv.findContours(thresh, contours, hierarchy, window.cv.RETR_EXTERNAL, window.cv.CHAIN_APPROX_SIMPLE);
        
        const bubbles = [];
        for (let i = 0; i < contours.size(); i++) {
          const contour = contours.get(i);
          const area = window.cv.contourArea(contour);
          const rect = window.cv.boundingRect(contour);
          
          // Filter circles by area and aspect ratio
          if (area > 100 && area < 2000) {
            const aspectRatio = rect.width / rect.height;
            if (aspectRatio > 0.7 && aspectRatio < 1.3) {
              // Calculate fill percentage
              const roi = thresh.roi(rect);
              const filled = window.cv.countNonZero(roi);
              const total = rect.width * rect.height;
              const fillPercent = (filled / total) * 100;
              
              bubbles.push({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                fillPercent: fillPercent,
                isFilled: fillPercent > 50
              });
              
              roi.delete();
            }
          }
          contour.delete();
        }
        
        // Sort bubbles by position (top to bottom, left to right)
        bubbles.sort((a, b) => {
          if (Math.abs(a.y - b.y) < 20) return a.x - b.x;
          return a.y - b.y;
        });
        
        // Group into rows (4 bubbles per row)
        const answers = [];
        for (let i = 0; i < bubbles.length; i += 4) {
          const row = bubbles.slice(i, i + 4);
          const filled = row.findIndex(b => b.isFilled);
          if (filled !== -1) {
            const answer = ['A', 'B', 'C', 'D'][filled];
            answers.push(`${Math.floor(i / 4) + 1}.${answer}`);
          }
        }
        
        // Cleanup
        src.delete();
        gray.delete();
        thresh.delete();
        contours.delete();
        hierarchy.delete();
        
        resolve(answers.join('\n'));
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject('Image load failed');
    img.src = imageSrc;
  });
};
