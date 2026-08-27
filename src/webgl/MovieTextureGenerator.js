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
      img.src = movie.posterUrl;

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
    }

    return texture;
  }

  static drawEditorialOverlays(ctx, width, height, movie) {
    ctx.save();

    // 1. Top-Left: Minimalist dot & metadata breadcrumb
    ctx.fillStyle = movie.accentColor;
    ctx.beginPath();
    ctx.arc(60, 60, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 15px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.letterSpacing = '0.08em';
    ctx.fillText(`${movie.index}  •  ${movie.certification.toUpperCase()}  •  ${movie.year}`, 80, 65);

    // 2. Top-Right: Rating Badge Pill
    ctx.fillStyle = 'rgba(10, 10, 12, 0.75)';
    this.roundRect(ctx, width - 200, 40, 140, 42, 21);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 15px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`★ ${movie.rating}`, width - 130, 66);

    // 3. Bottom-Left: Large Modern Title & Subtitle (matching "Casa Di Solare" style)
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 64px "Syne", "Playfair Display", sans-serif';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 24;
    ctx.fillText(movie.title, 60, height - 120);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '400 20px "Space Grotesk", sans-serif';
    ctx.shadowBlur = 12;
    ctx.fillText(`“ ${movie.iconicDialogue} ”`, 60, height - 74);

    ctx.fillStyle = movie.accentColor;
    ctx.font = '500 14px "Space Mono", monospace';
    ctx.shadowBlur = 0;
    ctx.fillText(`DIR. ${movie.director.toUpperCase()}   |   MUSIC: ${movie.musicDirector.toUpperCase()}`, 60, height - 42);

    // 4. Bottom-Right: Circular dark button with white arrow → (exact Jesper Landberg button)
    const btnX = width - 85;
    const btnY = height - 80;
    const btnRadius = 32;

    ctx.fillStyle = '#0a0a0c';
    ctx.beginPath();
    ctx.arc(btnX, btnY, btnRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw Arrow →
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(btnX - 10, btnY);
    ctx.lineTo(btnX + 8, btnY);
    ctx.lineTo(btnX + 2, btnY - 6);
    ctx.moveTo(btnX + 8, btnY);
    ctx.lineTo(btnX + 2, btnY + 6);
    ctx.stroke();

    ctx.restore();
  }

  static roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
