import * as THREE from 'three';
import { MoviePosterRenderer } from './MoviePosterRenderer.js';

/**
 * MovieTextureGenerator
 * Composites high-resolution 16:9 movie posters with minimalist editorial typography,
 * corner metadata, and circular arrow actions matching the Jesper Landberg layout.
 */
export class MovieTextureGenerator {
  static createMovieTexture(movie) {
    const width = 1920;
    const height = 1180;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Initial fallback render
    MoviePosterRenderer.renderPoster(ctx, width, height, movie);
    this.drawEditorialOverlays(ctx, width, height, movie);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.colorSpace = THREE.SRGBColorSpace;

    // 2. Load the 16:9 widescreen movie poster
    if (movie.posterUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      let posterSrc = movie.posterUrl;
      img.src = posterSrc;

      img.onload = () => {
        ctx.save();
        ctx.clearRect(0, 0, width, height);

        // Aspect-ratio cover
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;
        let drawW, drawH, drawX, drawY;

        if (imgAspect > canvasAspect) {
          drawH = height;
          drawW = height * imgAspect;
          drawX = (width - drawW) / 2;
          drawY = 0;
        } else {
          drawW = width;
          drawH = width / imgAspect;
          drawX = 0;
          drawY = (height - drawH) / 2;
        }

        // Draw the full-bleed 16:9 movie poster
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Cinematic Atmospheric Vignette
        const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.3, width * 0.5, height * 0.5, width * 0.75);
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
        vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.35)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);

        // Bottom gradient for high contrast typography
        const bottomGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
        bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        bottomGrad.addColorStop(0.7, 'rgba(6, 6, 8, 0.65)');
        bottomGrad.addColorStop(1, 'rgba(6, 6, 8, 0.95)');
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, height * 0.55, width, height * 0.45);

        // Top gradient for header tags
        const topGrad = ctx.createLinearGradient(0, 0, 0, 160);
        topGrad.addColorStop(0, 'rgba(6, 6, 8, 0.8)');
        topGrad.addColorStop(1, 'rgba(6, 6, 8, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, width, 160);

        // Draw Minimalist Editorial Overlays matching Jesper Landberg reference
        this.drawEditorialOverlays(ctx, width, height, movie);

        ctx.restore();
        texture.needsUpdate = true;
      };

      img.onerror = () => {
        console.warn(`Could not load primary poster at ${posterSrc}, attempting relative fallback.`);
        const fallbackSrc = `./posters/${posterSrc.split('/').pop()}`;
        if (img.src !== fallbackSrc) {
          img.src = fallbackSrc;
        }
      };
    }

    return texture;
  }

  static drawEditorialOverlays(ctx, width, height, movie) {
    // A. Top-Left Minimalist Breadcrumb Meta Tag
    ctx.font = '700 19px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const metaTag = `● ${movie.index}  •  ${movie.certification.toUpperCase()}  •  ${movie.year}`;
    ctx.fillText(metaTag, 64, 52);

    // B. Top-Right IMDb Rating Pill & Duration
    ctx.font = '700 19px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = movie.accentColor;
    ctx.fillText(`★ ${movie.rating} / 10`, width - 64, 52);

    // C. Bottom-Left Jesper Landberg Large Serif Display Title
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    
    // Massive Hero Title
    ctx.font = '900 84px "Playfair Display", "Cinzel", "Syne", serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.fillText(movie.title, 64, height - 108);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Subtitle / Dialogue Quote
    ctx.font = 'italic 500 24px "Playfair Display", "Inter", serif';
    ctx.fillStyle = 'rgba(240, 240, 245, 0.9)';
    const quoteText = movie.iconicDialogue.length > 75 
      ? `“ ${movie.iconicDialogue.slice(0, 72)}... ”`
      : `“ ${movie.iconicDialogue} ”`;
    ctx.fillText(quoteText, 64, height - 66);

    // Director & Score line
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillStyle = movie.accentColor;
    ctx.fillText(`DIR.  ${movie.director.toUpperCase()}   |   MUSIC.  ${movie.musicDirector.toUpperCase()}`, 64, height - 34);

    // D. Bottom-Right Jesper Landberg Circular Action Button with Arrow
    const btnRadius = 38;
    const btnCenterX = width - 64 - btnRadius;
    const btnCenterY = height - 60;

    // Outer subtle glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(btnCenterX, btnCenterY, btnRadius + 4, 0, Math.PI * 2);
    ctx.fillStyle = `${movie.accentColor}22`;
    ctx.fill();

    // Dark solid button circle with accent border
    ctx.beginPath();
    ctx.arc(btnCenterX, btnCenterY, btnRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(12, 12, 16, 0.88)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.stroke();

    // Arrow icon '→'
    ctx.font = '600 32px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('→', btnCenterX, btnCenterY - 1);
    ctx.restore();
  }
}
