import * as THREE from 'three';
import { MoviePosterRenderer } from './MoviePosterRenderer.js';

/**
 * MovieTextureGenerator
 * Dynamically loads and renders official high-resolution photographic movie posters
 * onto high-DPI (1600x1000) canvas textures with cinematic lighting, vignette, and HUD overlays.
 */
export class MovieTextureGenerator {
  static createMovieTexture(movie) {
    const width = 1600;
    const height = 1000;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Render immediate stylized artwork as base
    MoviePosterRenderer.renderPoster(ctx, width, height, movie);
    this.drawCardHUD(ctx, width, height, movie);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.colorSpace = THREE.SRGBColorSpace;

    // 2. Load the official photographic movie poster
    if (movie.posterUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = movie.posterUrl;

      img.onload = () => {
        // Redraw canvas with full-bleed real movie poster image
        ctx.save();
        ctx.clearRect(0, 0, width, height);

        // Aspect-ratio cover calculation
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

        // Draw real movie poster image
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Cinematic Atmospheric Vignette & Contrast Overlay
        const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.25, width * 0.5, height * 0.5, width * 0.75);
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
        vignette.addColorStop(0.6, 'rgba(0, 0, 0, 0.35)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);

        // Bottom & Right Gradient Bar for crisp typography contrast
        const bottomGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
        bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        bottomGrad.addColorStop(0.7, 'rgba(4, 4, 6, 0.7)');
        bottomGrad.addColorStop(1, 'rgba(4, 4, 6, 0.95)');
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, height * 0.5, width, height * 0.5);

        // Title & Dialogue Overlay at bottom left
        ctx.fillStyle = movie.accentColor;
        ctx.font = '900 68px "Syne", sans-serif';
        ctx.textAlign = 'left';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 20;
        ctx.fillText(movie.title, 60, height - 120);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'italic 500 20px "Playfair Display", Georgia, serif';
        ctx.fillText(`“ ${movie.iconicDialogue} ”`, 60, height - 70);

        ctx.fillStyle = '#a0a0a5';
        ctx.font = '500 14px "Space Mono", monospace';
        ctx.fillText(`${movie.director.toUpperCase()}  •  ${movie.musicDirector.toUpperCase()}`, 60, height - 40);

        // Draw Top HUD (Rating, Index, Certification)
        this.drawCardHUD(ctx, width, height, movie);

        ctx.restore();

        // Notify Three.js that texture is ready
        texture.needsUpdate = true;
      };
    }

    return texture;
  }

  static drawCardHUD(ctx, width, height, movie) {
    ctx.save();
    // Top-left: Index & Certification Pill
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.roundRect(ctx, 50, 45, 230, 48, 24);
    ctx.fill();
    ctx.strokeStyle = `${movie.accentColor}88`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = movie.accentColor;
    ctx.font = '700 16px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${movie.index} • ${movie.certification}`, 165, 75);

    // Top-right: IMDb Rating Badge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.roundRect(ctx, width - 210, 45, 160, 48, 24);
    ctx.fill();
    ctx.strokeStyle = movie.accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★ ${movie.rating} / 10`, width - 130, 75);

    // Bottom-right: Fluid Liquid Explore Indicator
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(width - 80, height - 75, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = movie.accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width - 88, height - 75);
    ctx.lineTo(width - 72, height - 75);
    ctx.lineTo(width - 78, height - 81);
    ctx.moveTo(width - 72, height - 75);
    ctx.lineTo(width - 78, height - 69);
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
