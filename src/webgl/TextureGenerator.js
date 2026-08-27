import * as THREE from 'three';

/**
 * TextureGenerator
 * Dynamically renders high-resolution 2D canvas textures for each project card
 * to perfectly match the visual aesthetic of the Jesper Landberg portfolio.
 */
export class TextureGenerator {
  static createCardTexture(project) {
    const width = 1600;
    const height = 1000;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background base
    ctx.fillStyle = '#0f0f10';
    ctx.fillRect(0, 0, width, height);

    // Subtle grain / gradient backdrop
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (project.id === 'griflan') {
      grad.addColorStop(0, '#1c1716');
      grad.addColorStop(1, '#0e0b0b');
    } else if (project.id === 'nathan-riley') {
      grad.addColorStop(0, '#121817');
      grad.addColorStop(1, '#0a0e0d');
    } else if (project.id === 'casa-di-solare') {
      grad.addColorStop(0, '#1e1a14');
      grad.addColorStop(1, '#0d0b09');
    } else if (project.id === 'echovoid') {
      grad.addColorStop(0, '#141224');
      grad.addColorStop(1, '#090812');
    } else if (project.id === 'monolith') {
      grad.addColorStop(0, '#181818');
      grad.addColorStop(1, '#0c0c0c');
    } else {
      grad.addColorStop(0, '#1a1318');
      grad.addColorStop(1, '#0c090c');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle card border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Render specific card contents
    if (project.id === 'griflan') {
      this.drawGriflanCard(ctx, width, height, project);
    } else if (project.id === 'nathan-riley') {
      this.drawNathanRileyCard(ctx, width, height, project);
    } else if (project.id === 'casa-di-solare') {
      this.drawCasaDiSolareCard(ctx, width, height, project);
    } else {
      this.drawGenericEditorialCard(ctx, width, height, project);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  static drawGriflanCard(ctx, width, height, project) {
    // Top-left breadcrumbs / subnav
    ctx.fillStyle = '#6e6e73';
    ctx.font = '500 18px "Space Grotesk", sans-serif';
    ctx.fillText('Client Stories', 60, 80);
    ctx.fillText('Agency', 60, 110);
    ctx.fillText('Services', 60, 140);
    ctx.fillText('Brand Guide', 60, 170);

    // Big Center Title: "Client Confessions" in vintage elegant italic serif
    ctx.fillStyle = '#f0e6d2';
    ctx.font = 'italic 400 96px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Client', width / 2, 130);
    ctx.fillText('Confessions', width / 2, 220);

    // "Let's Connect" pill button on top right
    ctx.fillStyle = '#ea2e15';
    this.roundRect(ctx, width - 260, 60, 190, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("Let's Connect", width - 165, 91);

    // Interactive Confession Sticky Notes
    // Note 1: Left Red Sticky Note
    ctx.fillStyle = '#c52714';
    this.roundRect(ctx, 60, 290, 320, 260, 12);
    ctx.fill();
    this.drawQuoteContent(
      ctx,
      60,
      290,
      320,
      260,
      "Griflan is absolutely integral to the success of our company, authentically fusing creativity, speed, and excellence in all they do.",
      "Guy Kawasaki",
      "NYU Stern Professor",
      '#ffffff'
    );

    // Note 2: Center-Left Beige Sticky Note
    ctx.fillStyle = '#f1ebd9';
    this.roundRect(ctx, 420, 260, 340, 230, 12);
    ctx.fill();
    this.drawQuoteContent(
      ctx,
      420,
      260,
      340,
      230,
      "Griflan is extremely dedicated to delivering high-quality results. From initial concept to final product, their team demonstrated exceptional creativity.",
      "Maya Steinberg",
      "TechNexus Board",
      '#1a1a1a'
    );

    // Note 3: Right Red Sticky Note
    ctx.fillStyle = '#ea2e15';
    this.roundRect(ctx, 800, 250, 360, 270, 12);
    ctx.fill();
    this.drawQuoteContent(
      ctx,
      800,
      250,
      360,
      270,
      "Griflan is the ideal creative partner combining strong design chops with digital, demonstrating how pieces of the branding system come to life.",
      "Mike Weiler",
      "Upshop, CGO",
      '#ffffff'
    );

    // Note 4: Bottom-Left Beige Note
    ctx.fillStyle = '#eae3ce';
    this.roundRect(ctx, 360, 520, 340, 220, 12);
    ctx.fill();
    this.drawQuoteContent(
      ctx,
      360,
      520,
      340,
      220,
      "Griflan was a thoughtful partner helping us build on our refreshed brand to create a digital experience true to who we are.",
      "Shannon Hill",
      "VP Director of Marketing",
      '#1a1a1a'
    );

    // Note 5: Bottom-Right Red Note
    ctx.fillStyle = '#b72211';
    this.roundRect(ctx, 740, 550, 320, 200, 12);
    ctx.fill();
    this.drawQuoteContent(
      ctx,
      740,
      550,
      320,
      200,
      "Huge surge in organic reach from zero to launching nationwide.",
      "Client Feedback",
      "National Campaign",
      '#ffffff'
    );

    // Bottom Left Brand Signature: "Griflan"
    ctx.fillStyle = '#f0e6d2';
    ctx.font = '700 36px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Griflan', 60, height - 60);

    // Arrow Nav Circle Right
    this.drawArrowCircle(ctx, width - 80, height - 70);
  }

  static drawNathanRileyCard(ctx, width, height, project) {
    // 3D Moodboard Multi-panel Collage Grid
    const panels = [
      { x: 60, y: 60, w: 260, h: 320, hue: 150, title: 'Lush Foliage' },
      { x: 340, y: 60, w: 320, h: 260, hue: 190, title: 'Lagoon Pool' },
      { x: 680, y: 60, w: 240, h: 340, hue: 35, title: 'Subterranean Monolith' },
      { x: 940, y: 60, w: 300, h: 280, hue: 210, title: 'Atrium Glass' },
      { x: 60, y: 400, w: 300, h: 340, hue: 280, title: 'Desert Flora' },
      { x: 380, y: 340, w: 280, h: 400, hue: 45, title: 'Brutalist Arch' }
    ];

    panels.forEach(p => {
      ctx.save();
      ctx.fillStyle = `hsl(${p.hue}, 30%, 25%)`;
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 12);
      ctx.fill();
      ctx.clip();

      // Draw artistic gradient representation of 3D renders
      const grad = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
      grad.addColorStop(0, `hsl(${p.hue}, 40%, 35%)`);
      grad.addColorStop(0.5, `hsl(${p.hue + 20}, 50%, 20%)`);
      grad.addColorStop(1, `hsl(${p.hue - 20}, 30%, 10%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      // Geometric architectural shapes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y + p.h / 2, p.w * 0.3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    });

    // Dark Editorial Overlay Card with Nathan Riley Title
    ctx.fillStyle = 'rgba(15, 17, 18, 0.92)';
    this.roundRect(ctx, 680, 420, 560, 320, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 400 64px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('Nathan', 720, 500);
    ctx.fillText('Riley', 720, 565);

    ctx.fillStyle = '#8e9297';
    ctx.font = '400 18px "Space Grotesk", sans-serif';
    ctx.fillText('CREATIVE DIRECTION & SPATIAL SYSTEMS', 720, 615);
    ctx.fillText('Explorations in light scatter and brutalist architecture.', 720, 645);

    // Bottom left title
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 36px "Space Grotesk", sans-serif';
    ctx.fillText('Nathan Riley', 60, height - 60);

    this.drawArrowCircle(ctx, width - 80, height - 70);
  }

  static drawCasaDiSolareCard(ctx, width, height, project) {
    // Warm brutalist architectural render backdrop
    const grad = ctx.createRadialGradient(width * 0.7, height * 0.4, 50, width * 0.7, height * 0.4, 900);
    grad.addColorStop(0, '#4a3825');
    grad.addColorStop(0.5, '#221a12');
    grad.addColorStop(1, '#0e0b09');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Architectural Pillar Graphic & Sun Rays
    ctx.strokeStyle = 'rgba(229, 185, 116, 0.25)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(width * 0.75, height * 0.5, 120 + i * 50, -Math.PI * 0.4, Math.PI * 0.6);
      ctx.stroke();
    }

    // Large Artistic Serif Typography "S" and "Casa Di Solare"
    ctx.fillStyle = 'rgba(245, 235, 220, 0.15)';
    ctx.font = 'italic 400 480px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('S', width * 0.72, height * 0.75);

    ctx.fillStyle = '#f5ebd9';
    ctx.font = 'italic 400 84px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('Casa Di Solare', 80, height * 0.45);

    ctx.fillStyle = '#e5b974';
    ctx.font = '500 20px "Space Grotesk", sans-serif';
    ctx.fillText('SAVOLKE TYPE & ARCHITECTURE EXHIBITION', 80, height * 0.45 + 50);

    ctx.fillStyle = '#a89c8d';
    ctx.font = '400 18px "Space Grotesk", sans-serif';
    ctx.fillText('Sun-drenched minimalist spaces meets haute typography.', 80, height * 0.45 + 85);
    ctx.fillText('Exploring golden hour reflections & subterranean light.', 80, height * 0.45 + 115);

    // Bottom Left Brand
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 36px "Space Grotesk", sans-serif';
    ctx.fillText('Casa Di Solare', 60, height - 60);

    this.drawArrowCircle(ctx, width - 80, height - 70);
  }

  static drawGenericEditorialCard(ctx, width, height, project) {
    // Category & Year
    ctx.fillStyle = project.accentColor;
    ctx.font = '700 16px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${project.index} — ${project.category.toUpperCase()}`, 80, 100);

    // Big Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 400 84px "Playfair Display", Georgia, serif';
    ctx.fillText(project.title, 80, 220);

    // Role & Year
    ctx.fillStyle = '#888888';
    ctx.font = '500 20px "Space Grotesk", sans-serif';
    ctx.fillText(`${project.role}  •  ${project.year}`, 80, 280);

    // Card Visual Center Graphic
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    this.roundRect(ctx, 80, 320, width - 160, 380, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();

    // Decorative Rings
    ctx.strokeStyle = project.accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, 510, 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '300 22px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(project.description, width / 2, 515);

    ctx.restore();

    // Bottom Left Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 36px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(project.title, 60, height - 60);

    this.drawArrowCircle(ctx, width - 80, height - 70);
  }

  static drawQuoteContent(ctx, x, y, w, h, quote, author, role, textColor) {
    ctx.fillStyle = textColor;
    ctx.font = 'Georgia, serif';
    ctx.font = 'bold 28px Georgia';
    ctx.fillText('“', x + 16, y + 36);

    // Multi-line quote text
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, quote, x + 20, y + 60, w - 40, 20);

    // Author
    ctx.font = '700 13px "Space Grotesk", sans-serif';
    ctx.fillText(author, x + 20, y + h - 36);

    // Role
    ctx.font = '400 11px "Space Grotesk", sans-serif';
    ctx.fillStyle = textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
    ctx.fillText(role, x + 20, y + h - 18);
  }

  static wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  static drawArrowCircle(ctx, cx, cy) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy);
    ctx.lineTo(cx + 6, cy);
    ctx.lineTo(cx + 1, cy - 5);
    ctx.moveTo(cx + 6, cy);
    ctx.lineTo(cx + 1, cy + 5);
    ctx.stroke();
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
