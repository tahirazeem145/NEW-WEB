/**
 * MoviePosterRenderer
 * Generates full-bleed, edge-to-edge cinematic editorial poster collages
 * (inspired by Jesper Landberg's Nathan Riley & Griflan boards)
 * for all 10 movie masterpieces.
 */

export class MoviePosterRenderer {
  static renderPoster(ctx, width, height, movie) {
    ctx.save();
    switch (movie.id) {
      case 'kgf-1':
        this.renderKGF1(ctx, width, height, movie);
        break;
      case 'kgf-2':
        this.renderKGF2(ctx, width, height, movie);
        break;
      case '7g-rainbow-colony':
        this.render7GRainbowColony(ctx, width, height, movie);
        break;
      case 'yaaradi-nee-mohini':
        this.renderYaaradiNeeMohini(ctx, width, height, movie);
        break;
      case 'vip':
        this.renderVIP(ctx, width, height, movie);
        break;
      case '3-moonu':
        this.render3Moonu(ctx, width, height, movie);
        break;
      case 'kanchana':
        this.renderKanchana(ctx, width, height, movie);
        break;
      case 'minnale':
        this.renderMinnale(ctx, width, height, movie);
        break;
      case 'breaking-bad':
        this.renderBreakingBad(ctx, width, height, movie);
        break;
      case 'attack-on-titan':
        this.renderAttackOnTitan(ctx, width, height, movie);
        break;
      default:
        this.renderGeneric(ctx, width, height, movie);
    }
    ctx.restore();
  }

  /* ========================================================
     1. K.G.F: CHAPTER 1 (Full-Bleed Gold Mine Editorial Collage)
     ======================================================== */
  static renderKGF1(ctx, w, h, m) {
    // 1. Dark textured canyon base
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#1c1404');
    bg.addColorStop(0.5, '#0e0a02');
    bg.addColorStop(1, '#050300');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // 2. Multi-Panel Cinematic Scene Grid (filling full frame)
    const panels = [
      { x: 50, y: 110, w: 320, h: 480, title: 'Kolar Gold Mines', type: 'canyon' },
      { x: 390, y: 110, w: 420, h: 320, title: 'Rocky in 1970s Bombay', type: 'bombay' },
      { x: 830, y: 110, w: 340, h: 400, title: 'Garuda Royal Palace', type: 'palace' },
      { x: 390, y: 450, w: 420, h: 420, title: 'Mother Sacred Vow', type: 'vow' },
      { x: 50, y: 610, w: 320, h: 260, title: 'Slaves Liberation', type: 'revolt' }
    ];

    panels.forEach(p => {
      ctx.save();
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 14);
      ctx.clip();

      // Cinematic scene illustration per panel
      if (p.type === 'canyon') {
        const cg = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
        cg.addColorStop(0, '#4a3206');
        cg.addColorStop(0.6, '#241702');
        cg.addColorStop(1, '#0c0701');
        ctx.fillStyle = cg;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        // Mining towers & sun rays
        ctx.strokeStyle = 'rgba(229, 169, 60, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x + 40, p.y + p.h);
        ctx.lineTo(p.x + 80, p.y + 60);
        ctx.lineTo(p.x + 120, p.y + p.h);
        ctx.moveTo(p.x + 50, p.y + 180);
        ctx.lineTo(p.x + 110, p.y + 180);
        ctx.stroke();

        this.drawSparks(ctx, p.x, p.y, p.w, p.h, '#e5a93c', 40);
      } else if (p.type === 'bombay') {
        const bg = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
        bg.addColorStop(0, '#2e1c07');
        bg.addColorStop(1, '#0f0801');
        ctx.fillStyle = bg;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        // Rocky silhouette in 70s suit
        ctx.fillStyle = '#050301';
        ctx.beginPath();
        ctx.arc(p.x + p.w * 0.5, p.y + 90, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(p.x + p.w * 0.5 - 40, p.y + 130, 80, 150);

        // Gold chain gleam
        ctx.strokeStyle = '#e5a93c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x + p.w * 0.5, p.y + 140, 24, 0, Math.PI);
        ctx.stroke();
      } else if (p.type === 'palace') {
        ctx.fillStyle = '#1e1104';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        // Garuda Palace Gates
        ctx.strokeStyle = 'rgba(229, 169, 60, 0.3)';
        ctx.strokeRect(p.x + 30, p.y + 40, p.w - 60, p.h - 60);
      } else {
        ctx.fillStyle = '#180e03';
        ctx.fillRect(p.x, p.y, p.w, p.h);
      }

      // Panel subtle inner border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x, p.y, p.w, p.h);

      // Panel label
      ctx.fillStyle = 'rgba(240, 230, 210, 0.7)';
      ctx.font = '500 13px "Space Grotesk", sans-serif';
      ctx.fillText(p.title.toUpperCase(), p.x + 16, p.y + p.h - 16);

      ctx.restore();
    });

    // 3. Right Side Editorial Card Overlay
    ctx.save();
    ctx.fillStyle = 'rgba(14, 10, 3, 0.94)';
    this.roundRect(ctx, w - 460, 110, 410, 760, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(229, 169, 60, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Metallic Gold Carved Title
    ctx.fillStyle = '#e5a93c';
    ctx.font = '900 76px "Syne", sans-serif';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#e5a93c';
    ctx.shadowBlur = 20;
    ctx.fillText('K.G.F', w - 420, 210);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px "Space Grotesk", sans-serif';
    ctx.fillText('CHAPTER 1', w - 420, 255);

    ctx.fillStyle = '#e5a93c';
    ctx.font = 'italic 400 19px "Playfair Display", Georgia, serif';
    ctx.fillText('“ Gang la vandha gunda... Single ah vandha Monster! ”', w - 420, 315, 340);

    // Metadata lines
    ctx.fillStyle = '#9e9282';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillText('DIRECTOR: PRASHANTH NEEL', w - 420, 380);
    ctx.fillText('MUSIC: RAVI BASRUR', w - 420, 410);
    ctx.fillText('STARRING: YASH (ROCKY BHAI)', w - 420, 440);
    ctx.fillText('YEAR: 2018  •  IMDb: 8.2/10', w - 420, 470);

    // Story summary snippet
    ctx.fillStyle = '#d0c6b6';
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, m.synopsis, w - 420, 525, 330, 22);

    ctx.restore();
  }

  /* ========================================================
     2. K.G.F: CHAPTER 2 (Full-Bleed Warzone Fire Editorial)
     ======================================================== */
  static renderKGF2(ctx, w, h, m) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#2d0603');
    bg.addColorStop(0.5, '#150201');
    bg.addColorStop(1, '#060000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const panels = [
      { x: 50, y: 110, w: 380, h: 420, title: 'Adheera Death March', type: 'adheera' },
      { x: 450, y: 110, w: 360, h: 360, title: 'Rocky Kalashnikov Fire', type: 'guns' },
      { x: 830, y: 110, w: 340, h: 440, title: 'Ramika Sen Parliament', type: 'parliament' },
      { x: 50, y: 550, w: 380, h: 320, title: 'Molten Gold Mines', type: 'lava' },
      { x: 450, y: 490, w: 360, h: 380, title: 'Rocky Final Voyage', type: 'ship' }
    ];

    panels.forEach(p => {
      ctx.save();
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 14);
      ctx.clip();

      const grad = ctx.createRadialGradient(p.x + p.w * 0.5, p.y + p.h * 0.5, 20, p.x + p.w * 0.5, p.y + p.h * 0.5, p.w * 0.6);
      grad.addColorStop(0, '#5a0d05');
      grad.addColorStop(0.7, '#240402');
      grad.addColorStop(1, '#090101');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      this.drawSparks(ctx, p.x, p.y, p.w, p.h, '#ff3b1e', 50);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x, p.y, p.w, p.h);

      ctx.fillStyle = '#ff8870';
      ctx.font = '500 13px "Space Grotesk", sans-serif';
      ctx.fillText(p.title.toUpperCase(), p.x + 16, p.y + p.h - 16);
      ctx.restore();
    });

    // Right Side Dark Crimson Card
    ctx.save();
    ctx.fillStyle = 'rgba(18, 4, 3, 0.94)';
    this.roundRect(ctx, w - 460, 110, 410, 760, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(234, 46, 21, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ea2e15';
    ctx.font = '900 76px "Syne", sans-serif';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#ea2e15';
    ctx.shadowBlur = 24;
    ctx.fillText('K.G.F', w - 420, 210);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px "Space Grotesk", sans-serif';
    ctx.fillText('CHAPTER 2', w - 420, 255);

    ctx.fillStyle = '#ff755a';
    ctx.font = 'italic 700 18px "Playfair Display", Georgia, serif';
    ctx.fillText('“ Violence Violence Violence! I Avoid, But Violence Likes Me! ”', w - 420, 315, 340);

    ctx.fillStyle = '#9e8282';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillText('DIRECTOR: PRASHANTH NEEL', w - 420, 380);
    ctx.fillText('MUSIC: RAVI BASRUR', w - 420, 410);
    ctx.fillText('CAST: YASH • SANJAY DUTT', w - 420, 440);
    ctx.fillText('BOX OFFICE: ₹1,250+ CRORE', w - 420, 470);

    ctx.fillStyle = '#d0b6b6';
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, m.synopsis, w - 420, 525, 330, 22);

    ctx.restore();
  }

  /* ========================================================
     3. 7G RAINBOW COLONY (Nostalgic Cyan Twilight Moodboard)
     ======================================================== */
  static render7GRainbowColony(ctx, w, h, m) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0a2725');
    bg.addColorStop(0.5, '#041513');
    bg.addColorStop(1, '#010605');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const panels = [
      { x: 50, y: 110, w: 340, h: 460, title: '7G Colony Balcony', type: 'balcony' },
      { x: 410, y: 110, w: 400, h: 320, title: 'Rainy Night Bus Stop', type: 'rain-bus' },
      { x: 830, y: 110, w: 340, h: 420, title: 'Kathir Red Motorcycle', type: 'bike' },
      { x: 410, y: 450, w: 400, h: 420, title: 'Ninaithu Ninaithu Melodies', type: 'yuvan' },
      { x: 50, y: 590, w: 340, h: 280, title: 'Anitha Final Memory', type: 'memory' }
    ];

    panels.forEach(p => {
      ctx.save();
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 14);
      ctx.clip();

      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#0d3a36');
      grad.addColorStop(1, '#031210');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      // Rain overlay in panel
      ctx.strokeStyle = 'rgba(60, 212, 197, 0.25)';
      for (let r = 0; r < 25; r++) {
        const rx = p.x + Math.random() * p.w;
        const ry = p.y + Math.random() * p.h;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 10, ry + 25);
        ctx.stroke();
      }

      ctx.fillStyle = '#78e5da';
      ctx.font = '500 13px "Space Grotesk", sans-serif';
      ctx.fillText(p.title.toUpperCase(), p.x + 16, p.y + p.h - 16);
      ctx.restore();
    });

    // Right Side Cyan Editorial Card
    ctx.save();
    ctx.fillStyle = 'rgba(4, 18, 17, 0.94)';
    this.roundRect(ctx, w - 460, 110, 410, 760, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(60, 212, 197, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#3cd4c5';
    ctx.font = 'italic 400 58px "Playfair Display", Georgia, serif';
    ctx.fillText('7G Rainbow', w - 420, 200);
    ctx.fillText('Colony', w - 420, 260);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Space Grotesk", sans-serif';
    ctx.fillText('A SELVARAGHAVAN MASTERPIECE', w - 420, 310);

    ctx.fillStyle = '#8cefe5';
    ctx.font = 'italic 400 18px "Playfair Display", serif';
    ctx.fillText('“ Ninaithu Ninaithu Paarthen... Eternal Symphony of Devotion ”', w - 420, 360, 340);

    ctx.fillStyle = '#7a9f9c';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillText('MUSIC: YUVAN SHANKAR RAJA', w - 420, 430);
    ctx.fillText('STARRING: RAVI KRISHNA • SONIA', w - 420, 460);
    ctx.fillText('STATUS: IMMORTAL CULT CLASSIC', w - 420, 490);

    ctx.fillStyle = '#c0deda';
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, m.synopsis, w - 420, 545, 330, 22);

    ctx.restore();
  }

  /* ========================================================
     4. YAARADI NEE MOHINI (Pastel Rose Heritage Editorial)
     ======================================================== */
  static renderYaaradiNeeMohini(ctx, w, h, m) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#321226');
    bg.addColorStop(0.5, '#1a0713');
    bg.addColorStop(1, '#080206');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const panels = [
      { x: 50, y: 110, w: 360, h: 420, title: 'Chettinad Heritage Courtyard' },
      { x: 430, y: 110, w: 380, h: 340, title: 'Keerthi Silk Sari Glow' },
      { x: 830, y: 110, w: 340, h: 440, title: 'Vasu & Raghuvaran Bonds' },
      { x: 50, y: 550, w: 360, h: 320, title: 'Village Marigold Fest' },
      { x: 430, y: 470, w: 380, h: 400, title: 'Engeyo Paartha Mayakkam' }
    ];

    panels.forEach(p => {
      ctx.save();
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 14);
      ctx.clip();
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#4a1b38');
      grad.addColorStop(1, '#150610');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      ctx.fillStyle = '#f09ac7';
      ctx.font = '500 13px "Space Grotesk", sans-serif';
      ctx.fillText(p.title.toUpperCase(), p.x + 16, p.y + p.h - 16);
      ctx.restore();
    });

    // Right Side Rose Card
    ctx.save();
    ctx.fillStyle = 'rgba(20, 6, 16, 0.94)';
    this.roundRect(ctx, w - 460, 110, 410, 760, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(229, 130, 184, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#e582b8';
    ctx.font = 'italic 400 56px "Playfair Display", Georgia, serif';
    ctx.fillText('Yaaradi Nee', w - 420, 200);
    ctx.fillText('Mohini', w - 420, 260);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Space Grotesk", sans-serif';
    ctx.fillText('WHERE UNCONDITIONAL LOVE MEETS DESTINY', w - 420, 310);

    ctx.fillStyle = '#f5b5d8';
    ctx.font = 'italic 400 18px "Playfair Display", serif';
    ctx.fillText('“ Engeyo Paartha Mayakkam... Pure Heart & Redemption ”', w - 420, 360, 340);

    ctx.fillStyle = '#9f7a90';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillText('STORY: SELVARAGHAVAN', w - 420, 430);
    ctx.fillText('MUSIC: YUVAN SHANKAR RAJA', w - 420, 460);
    ctx.fillText('CAST: DHANUSH • NAYANTHARA', w - 420, 490);

    ctx.fillStyle = '#dec0d2';
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, m.synopsis, w - 420, 545, 330, 22);

    ctx.restore();
  }

  /* ========================================================
     5. VELAI ILLA PATTADHARI - VIP (Industrial Youth Moodboard)
     ======================================================== */
  static renderVIP(ctx, w, h, m) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#351902');
    bg.addColorStop(0.5, '#1a0b01');
    bg.addColorStop(1, '#060200');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const panels = [
      { x: 50, y: 110, w: 380, h: 420, title: 'Chennai Skyscraper Cranes' },
      { x: 450, y: 110, w: 360, h: 340, title: 'Raghuvaran B.Tech Engineering' },
      { x: 830, y: 110, w: 340, h: 440, title: 'Mother Saranya Home Vows' },
      { x: 50, y: 550, w: 380, h: 320, title: 'TVS 50 Youth Brotherhood' },
      { x: 450, y: 470, w: 360, h: 400, title: 'Government Hospital Mission' }
    ];

    panels.forEach(p => {
      ctx.save();
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 14);
      ctx.clip();
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#4e2804');
      grad.addColorStop(1, '#180a01');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      this.drawSparks(ctx, p.x, p.y, p.w, p.h, '#ff9800', 35);

      ctx.fillStyle = '#ffb347';
      ctx.font = '500 13px "Space Grotesk", sans-serif';
      ctx.fillText(p.title.toUpperCase(), p.x + 16, p.y + p.h - 16);
      ctx.restore();
    });

    // Right Side Amber Card
    ctx.save();
    ctx.fillStyle = 'rgba(18, 9, 1, 0.94)';
    this.roundRect(ctx, w - 460, 110, 410, 760, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 152, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ff9800';
    ctx.font = '900 78px "Syne", sans-serif';
    ctx.fillText('V.I.P', w - 420, 205);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px "Space Grotesk", sans-serif';
    ctx.fillText('VELAIILLA PATTADHARI', w - 420, 255);

    ctx.fillStyle = '#ffb74d';
    ctx.font = 'italic 700 18px "Playfair Display", Georgia, serif';
    ctx.fillText('“ Raghuvaran B.Tech! Amma kitta kaatradhu dhaan da Gethu! ”', w - 420, 315, 340);

    ctx.fillStyle = '#9e8a78';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillText('DIRECTOR: VELRAJ', w - 420, 380);
    ctx.fillText('MUSIC: ANIRUDH (VIRAL ANTHEM)', w - 420, 410);
    ctx.fillText('DHANUSH 25TH BLOCKBUSTER', w - 420, 440);

    ctx.fillStyle = '#decab8';
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, m.synopsis, w - 420, 495, 330, 22);

    ctx.restore();
  }

  /* ========================================================
     6. 3 (MOONU) (Psychological Romance Violet Vignettes)
     ======================================================== */
  static render3Moonu(ctx, w, h, m) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#270832');
    bg.addColorStop(0.5, '#130318');
    bg.addColorStop(1, '#050106');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const panels = [
      { x: 50, y: 110, w: 360, h: 420, title: 'Phase I: School Rain & Cycles' },
      { x: 430, y: 110, w: 380, h: 340, title: 'Phase II: College Beach Sunset' },
      { x: 830, y: 110, w: 340, h: 440, title: 'Phase III: Midnight Candle Room' },
      { x: 50, y: 550, w: 360, h: 320, title: 'Why This Kolaveri Di Debut' },
      { x: 430, y: 470, w: 380, h: 400, title: 'Janani Eternal Love Memory' }
    ];

    panels.forEach(p => {
      ctx.save();
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 14);
      ctx.clip();
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#3e104e');
      grad.addColorStop(1, '#110216');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      ctx.fillStyle = '#d587e6';
      ctx.font = '500 13px "Space Grotesk", sans-serif';
      ctx.fillText(p.title.toUpperCase(), p.x + 16, p.y + p.h - 16);
      ctx.restore();
    });

    // Right Side Violet Card
    ctx.save();
    ctx.fillStyle = 'rgba(16, 4, 20, 0.94)';
    this.roundRect(ctx, w - 460, 110, 410, 760, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(156, 39, 176, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#d05ce3';
    ctx.font = 'italic 400 84px "Playfair Display", Georgia, serif';
    ctx.fillText('3', w - 420, 210);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px "Space Grotesk", sans-serif';
    ctx.fillText('A PSYCHOLOGICAL ROMANCE', w - 420, 260);

    ctx.fillStyle = '#e8a9f4';
    ctx.font = 'italic 400 18px "Playfair Display", serif';
    ctx.fillText('“ Why This Kolaveri Di & The Three Timeless Stages of Love ”', w - 420, 315, 340);

    ctx.fillStyle = '#9e7ea6';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillText('DIRECTOR: AISHWARYA RAJINIKANTH', w - 420, 380);
    ctx.fillText('MUSIC: ANIRUDH SENSATIONAL DEBUT', w - 420, 410);
    ctx.fillText('CAST: DHANUSH • SHRUTI HAASAN', w - 420, 440);

    ctx.fillStyle = '#dec0e6';
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, m.synopsis, w - 420, 495, 330, 22);

    ctx.restore();
  }

  /* ========================================================
     7. KANCHANA (Gothic Crimson Horror-Comedy Moodboard)
     ======================================================== */
  static renderKanchana(ctx, w, h, m) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#36050e');
    bg.addColorStop(0.5, '#160206');
    bg.addColorStop(1, '#060002');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const panels = [
      { x: 50, y: 110, w: 380, h: 420, title: 'Kanchana Flying Red Sari Trishul' },
      { x: 450, y: 110, w: 360, h: 340, title: 'Lawrence & Kovai Sarala Comedy' },
      { x: 830, y: 110, w: 340, h: 440, title: 'Haunted Ground Blood Moon' },
      { x: 50, y: 550, w: 380, h: 320, title: 'Triguna Vengeance Possession' },
      { x: 450, y: 470, w: 360, h: 400, title: 'Temple Climax Fire Festival' }
    ];

    panels.forEach(p => {
      ctx.save();
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 14);
      ctx.clip();
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#560917');
      grad.addColorStop(1, '#180206');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      this.drawSparks(ctx, p.x, p.y, p.w, p.h, '#ff2d55', 40);

      ctx.fillStyle = '#ff6b87';
      ctx.font = '500 13px "Space Grotesk", sans-serif';
      ctx.fillText(p.title.toUpperCase(), p.x + 16, p.y + p.h - 16);
      ctx.restore();
    });

    // Right Side Crimson Card
    ctx.save();
    ctx.fillStyle = 'rgba(20, 3, 7, 0.94)';
    this.roundRect(ctx, w - 460, 110, 410, 760, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 45, 85, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ff2d55';
    ctx.font = '900 68px "Syne", sans-serif';
    ctx.fillText('KANCHANA', w - 420, 205);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px "Space Grotesk", sans-serif';
    ctx.fillText('MUNI 2 • HORROR COMEDY', w - 420, 255);

    ctx.fillStyle = '#ff8299';
    ctx.font = 'italic 700 18px "Playfair Display", Georgia, serif';
    ctx.fillText('“ She Returned For Justice — Transgender Heroic Icon ”', w - 420, 315, 340);

    ctx.fillStyle = '#9e7880';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillText('DIRECTOR: RAGHAVA LAWRENCE', w - 420, 380);
    ctx.fillText('MUSIC: S. THAMAN', w - 420, 410);
    ctx.fillText('CAST: SARATHKUMAR • LAWRENCE', w - 420, 440);

    ctx.fillStyle = '#dec0c6';
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, m.synopsis, w - 420, 495, 330, 22);

    ctx.restore();
  }

  /* ========================================================
     8. MINNALE (Electric Cyan Neon Rain Boulevard)
     ======================================================== */
  static renderMinnale(ctx, w, h, m) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#06293d');
    bg.addColorStop(0.5, '#02121c');
    bg.addColorStop(1, '#000508');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const panels = [
      { x: 50, y: 110, w: 380, h: 420, title: 'Midnight Rain Lightning Embrace' },
      { x: 450, y: 110, w: 360, h: 340, title: 'Ooty Campus Rivalry with Rajiv' },
      { x: 830, y: 110, w: 340, h: 440, title: 'Vaseegara En Nenjinika Melody' },
      { x: 50, y: 550, w: 380, h: 320, title: 'Phone Booth Rainy Confession' },
      { x: 450, y: 470, w: 360, h: 400, title: 'Motorcycle Headlight Glow' }
    ];

    panels.forEach(p => {
      ctx.save();
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 14);
      ctx.clip();
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#0a3d5c');
      grad.addColorStop(1, '#02121a');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      ctx.fillStyle = '#68dcff';
      ctx.font = '500 13px "Space Grotesk", sans-serif';
      ctx.fillText(p.title.toUpperCase(), p.x + 16, p.y + p.h - 16);
      ctx.restore();
    });

    // Right Side Electric Cyan Card
    ctx.save();
    ctx.fillStyle = 'rgba(2, 16, 26, 0.94)';
    this.roundRect(ctx, w - 460, 110, 410, 760, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#00d2ff';
    ctx.font = 'italic 400 78px "Playfair Display", Georgia, serif';
    ctx.fillText('Minnale', w - 420, 205);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px "Space Grotesk", sans-serif';
    ctx.fillText('GAUTHAM MENON MUSICAL CLASSIC', w - 420, 255);

    ctx.fillStyle = '#7de5ff';
    ctx.font = 'italic 400 18px "Playfair Display", serif';
    ctx.fillText('“ Vaseegara En Nenjinika... Lightning Under Chennai Rain ”', w - 420, 315, 340);

    ctx.fillStyle = '#709ba8';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillText('DIRECTOR: GAUTHAM MENON', w - 420, 380);
    ctx.fillText('MUSIC: HARRIS JAYARAJ (EVERGREEN)', w - 420, 410);
    ctx.fillText('CAST: R. MADHAVAN • REEMA SEN', w - 420, 440);

    ctx.fillStyle = '#bce6f2';
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, m.synopsis, w - 420, 495, 330, 22);

    ctx.restore();
  }

  /* ========================================================
     9. BREAKING BAD (Albuquerque Hazmat Chemistry Editorial)
     ======================================================== */
  static renderBreakingBad(ctx, w, h, m) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#103507');
    bg.addColorStop(0.5, '#061603');
    bg.addColorStop(1, '#010500');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const panels = [
      { x: 50, y: 110, w: 380, h: 420, title: 'Fleetwood Bounder RV Desert Lab' },
      { x: 450, y: 110, w: 360, h: 340, title: 'Heisenberg Hat & Trench Coat' },
      { x: 830, y: 110, w: 340, h: 440, title: 'Jesse Pinkman Blue Crystal Meth' },
      { x: 50, y: 550, w: 380, h: 320, title: 'Los Pollos Hermanos Gus Fring' },
      { x: 450, y: 470, w: 360, h: 400, title: 'I Am The One Who Knocks' }
    ];

    panels.forEach(p => {
      ctx.save();
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 14);
      ctx.clip();
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#19540c');
      grad.addColorStop(1, '#061a03');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      this.drawSparks(ctx, p.x, p.y, p.w, p.h, '#39ff14', 40);

      ctx.fillStyle = '#7eff63';
      ctx.font = '500 13px "Space Grotesk", sans-serif';
      ctx.fillText(p.title.toUpperCase(), p.x + 16, p.y + p.h - 16);
      ctx.restore();
    });

    // Right Side Toxic Green Card
    ctx.save();
    ctx.fillStyle = 'rgba(6, 20, 3, 0.94)';
    this.roundRect(ctx, w - 460, 110, 410, 760, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#39ff14';
    ctx.font = '900 64px "Syne", sans-serif';
    ctx.fillText('Breaking Bad', w - 420, 205);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px "Space Grotesk", sans-serif';
    ctx.fillText('I AM THE ONE WHO KNOCKS', w - 420, 255);

    ctx.fillStyle = '#8eff78';
    ctx.font = 'italic 400 18px "Playfair Display", serif';
    ctx.fillText('“ Say My Name. — Heisenberg ”', w - 420, 315, 340);

    ctx.fillStyle = '#7aa874';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillText('CREATOR: VINCE GILLIGAN', w - 420, 380);
    ctx.fillText('IMDb: 9.5/10 (#1 ALL TIME)', w - 420, 410);
    ctx.fillText('CAST: BRYAN CRANSTON • AARON PAUL', w - 420, 440);

    ctx.fillStyle = '#c7dec5';
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, m.synopsis, w - 420, 495, 330, 22);

    ctx.restore();
  }

  /* ========================================================
     10. ATTACK ON TITAN (Wall Maria Battle Collage)
     ======================================================== */
  static renderAttackOnTitan(ctx, w, h, m) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#381003');
    bg.addColorStop(0.5, '#180601');
    bg.addColorStop(1, '#060100');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const panels = [
      { x: 50, y: 110, w: 380, h: 420, title: '50m Colossal Titan Steam Wall' },
      { x: 450, y: 110, w: 360, h: 340, title: 'Scout Regiment ODM Blade Rush' },
      { x: 830, y: 110, w: 340, h: 440, title: 'Captain Levi Thunder Spears' },
      { x: 50, y: 550, w: 380, h: 320, title: 'Wings of Freedom Golden Crest' },
      { x: 450, y: 470, w: 360, h: 400, title: 'Shinzo wo Sasageyo! Tatakae!' }
    ];

    panels.forEach(p => {
      ctx.save();
      this.roundRect(ctx, p.x, p.y, p.w, p.h, 14);
      ctx.clip();
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, '#5a1d07');
      grad.addColorStop(1, '#180601');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      this.drawSparks(ctx, p.x, p.y, p.w, p.h, '#ff3d00', 50);

      ctx.fillStyle = '#ff7b52';
      ctx.font = '500 13px "Space Grotesk", sans-serif';
      ctx.fillText(p.title.toUpperCase(), p.x + 16, p.y + p.h - 16);
      ctx.restore();
    });

    // Right Side Fiery Orange Card
    ctx.save();
    ctx.fillStyle = 'rgba(20, 6, 2, 0.94)';
    this.roundRect(ctx, w - 460, 110, 410, 760, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 61, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ff3d00';
    ctx.font = '900 62px "Syne", sans-serif';
    ctx.fillText('ATTACK ON', w - 420, 200);
    ctx.fillText('TITAN', w - 420, 260);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px "Space Grotesk", sans-serif';
    ctx.fillText('SHINGEKI NO KYOJIN (進撃の巨人)', w - 420, 310);

    ctx.fillStyle = '#ffa082';
    ctx.font = 'italic 700 18px "Playfair Display", Georgia, serif';
    ctx.fillText('“ Shinzo wo Sasageyo! Dedicate Your Hearts! ”', w - 420, 360, 340);

    ctx.fillStyle = '#a68278';
    ctx.font = '500 13px "Space Mono", monospace';
    ctx.fillText('CREATOR: HAJIME ISAYAMA', w - 420, 430);
    ctx.fillText('MUSIC: HIROYUKI SAWANO', w - 420, 460);
    ctx.fillText('IMDb: 9.1/10 (MASTERPIECE)', w - 420, 490);

    ctx.fillStyle = '#dec7c0';
    ctx.font = '400 14px "Space Grotesk", sans-serif';
    this.wrapText(ctx, m.synopsis, w - 420, 545, 330, 22);

    ctx.restore();
  }

  static renderGeneric(ctx, w, h, m) {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = m.accentColor;
    ctx.font = '900 80px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(m.title, w / 2, h / 2);
  }

  static drawSparks(ctx, px, py, pw, ph, color, count) {
    for (let i = 0; i < count; i++) {
      const x = px + Math.random() * pw;
      const y = py + Math.random() * ph;
      const r = Math.random() * 3 + 1;
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  static wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
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
