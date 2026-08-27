import * as THREE from 'three';
import { MoviePosterRenderer } from './MoviePosterRenderer.js';

/**
 * MovieTextureGenerator
 * Creates high-DPI (1600x1000) canvas textures by combining the
 * rich visual poster art from MoviePosterRenderer with cinema HUD overlays.
 */
export class MovieTextureGenerator {
  static createMovieTexture(movie) {
    const width = 1600;
    const height = 1000;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Render rich visual poster illustration
    MoviePosterRenderer.renderPoster(ctx, width, height, movie);

    // 2. Render Cinema HUD Overlays (Certification, IMDb Rating, Index, Explore Indicator)
    this.drawCardHUD(ctx, width, height, movie);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  static drawCardHUD(ctx, width, height, movie) {
    ctx.save();
    // Top-left: Index & Certification Pill
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.roundRect(ctx, width - 210, 45, 160, 48, 24);
    ctx.fill();
    ctx.strokeStyle = movie.accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★ ${movie.rating} / 10`, width - 130, 75);

    // Bottom-right: Fluid Liquid Indicator Icon
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
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
