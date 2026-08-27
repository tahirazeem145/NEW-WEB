import * as THREE from 'three';

/**
 * MovieTextureGenerator
 * Creates high-DPI (1600x1000) bespoke cinematic poster textures
 * for each of the 10 requested movies/shows.
 */
export class MovieTextureGenerator {
  static createMovieTexture(movie) {
    const width = 1600;
    const height = 1000;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Base background
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, width, height);

    // Draw specific movie artwork
    switch (movie.id) {
      case 'kgf-1':
        this.drawKGF1(ctx, width, height, movie);
        break;
      case 'kgf-2':
        this.drawKGF2(ctx, width, height, movie);
        break;
      case '7g-rainbow-colony':
        this.draw7GRainbowColony(ctx, width, height, movie);
        break;
      case 'yaaradi-nee-mohini':
        this.drawYaaradiNeeMohini(ctx, width, height, movie);
        break;
      case 'vip':
        this.drawVIP(ctx, width, height, movie);
        break;
      case '3-moonu':
        this.draw3Moonu(ctx, width, height, movie);
        break;
      case 'kanchana':
        this.drawKanchana(ctx, width, height, movie);
        break;
      case 'minnale':
        this.drawMinnale(ctx, width, height, movie);
        break;
      case 'breaking-bad':
        this.drawBreakingBad(ctx, width, height, movie);
        break;
      case 'attack-on-titan':
        this.drawAttackOnTitan(ctx, width, height, movie);
        break;
      default:
        this.drawGenericMovie(ctx, width, height, movie);
    }

    // Common HUD overlays on the texture (Movie Index, Genre Tag, Rating, Arrow indicator)
    this.drawCardHUD(ctx, width, height, movie);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  static drawKGF1(ctx, width, height, m) {
    // KGF 1: Dark gold mines, glowing amber embers, gold metal typography
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.4, 50, width * 0.5, height * 0.5, 900);
    grad.addColorStop(0, '#3a2707');
    grad.addColorStop(0.5, '#191002');
    grad.addColorStop(1, '#050300');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Glowing Gold Embers
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 3 + 1;
      ctx.fillStyle = `rgba(229, 169, 60, ${Math.random() * 0.7 + 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rocky Bhai Hammer & Gold Mine Silhouettes
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width * 0.3, height * 0.65);
    ctx.lineTo(width * 0.5, height * 0.75);
    ctx.lineTo(width * 0.7, height * 0.6);
    ctx.lineTo(width, height);
    ctx.fill();

    // Central Title: K.G.F
    ctx.fillStyle = '#e5a93c';
    ctx.font = '900 130px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#e5a93c';
    ctx.shadowBlur = 30;
    ctx.fillText('K.G.F', width / 2, height * 0.42);
    ctx.shadowBlur = 0;

    // Subtitle: CHAPTER 1
    ctx.fillStyle = '#f5f0e6';
    ctx.font = '700 36px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '0.35em';
    ctx.fillText('CHAPTER 1', width / 2, height * 0.50);

    // Tagline Banner
    ctx.fillStyle = '#e5a93c';
    ctx.font = 'italic 500 22px "Playfair Display", Georgia, serif';
    ctx.fillText('“ Gang la vandha gunda... Single ah vandha Monster! ”', width / 2, height * 0.60);

    ctx.fillStyle = '#8e8271';
    ctx.font = '500 16px "Space Mono", monospace';
    ctx.fillText('DIRECTED BY PRASHANTH NEEL  •  MUSIC BY RAVI BASRUR', width / 2, height * 0.66);
  }

  static drawKGF2(ctx, width, height, m) {
    // KGF 2: Fiery crimson and black volcanic backdrop
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.45, 60, width * 0.5, height * 0.5, 950);
    grad.addColorStop(0, '#4a0b06');
    grad.addColorStop(0.5, '#1e0402');
    grad.addColorStop(1, '#060101');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Fire Sparks / Molten Splatters
    for (let i = 0; i < 110; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 4 + 1;
      ctx.fillStyle = `rgba(234, 46, 21, ${Math.random() * 0.8 + 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Title: K.G.F CHAPTER 2
    ctx.fillStyle = '#ea2e15';
    ctx.font = '900 130px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ea2e15';
    ctx.shadowBlur = 40;
    ctx.fillText('K.G.F', width / 2, height * 0.40);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px "Space Grotesk", sans-serif';
    ctx.fillText('CHAPTER 2', width / 2, height * 0.48);

    // Iconic Dialogue Banner
    ctx.fillStyle = '#ff6b4a';
    ctx.font = 'italic 700 24px "Playfair Display", Georgia, serif';
    ctx.fillText('“ Violence... Violence... Violence! I Avoid, But Violence Likes Me! ”', width / 2, height * 0.59);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 18px "Space Grotesk", sans-serif';
    ctx.fillText('YASH  •  SANJAY DUTT (ADHEERA)  •  RAVEENA TANDON', width / 2, height * 0.66);
  }

  static draw7GRainbowColony(ctx, width, height, m) {
    // 7G Rainbow Colony: Nostalgic cyan/teal twilight sky & colony flats
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0a2c28');
    grad.addColorStop(0.6, '#041513');
    grad.addColorStop(1, '#010605');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Colony Window Lights & Wireframe
    ctx.strokeStyle = 'rgba(60, 212, 197, 0.15)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      ctx.strokeRect(120 + i * 110, height * 0.2, 80, 480);
    }

    // Title
    ctx.fillStyle = '#3cd4c5';
    ctx.font = 'italic 400 96px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#3cd4c5';
    ctx.shadowBlur = 25;
    ctx.fillText('7G Rainbow Colony', width / 2, height * 0.42);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '400 24px "Space Grotesk", sans-serif';
    ctx.fillText('A SELVARAGHAVAN MASTERPIECE  •  MUSIC BY YUVAN SHANKAR RAJA', width / 2, height * 0.52);

    ctx.fillStyle = '#88ddd4';
    ctx.font = 'italic 400 22px "Playfair Display", serif';
    ctx.fillText('“ Ninaithu Ninaithu Paarthen... An Unfiltered Symphony of Eternal Love ”', width / 2, height * 0.62);

    ctx.fillStyle = '#559990';
    ctx.font = '500 16px "Space Mono", monospace';
    ctx.fillText('STARRING RAVI KRISHNA & SONIA AGARWAL', width / 2, height * 0.70);
  }

  static drawYaaradiNeeMohini(ctx, width, height, m) {
    // Yaaradi Nee Mohini: Warm rose & golden sunlit palette
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#381228');
    grad.addColorStop(0.5, '#1a0813');
    grad.addColorStop(1, '#080206');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#e582b8';
    ctx.font = 'italic 400 90px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#e582b8';
    ctx.shadowBlur = 25;
    ctx.fillText('Yaaradi Nee Mohini', width / 2, height * 0.42);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 24px "Space Grotesk", sans-serif';
    ctx.fillText('DHANUSH  •  NAYANTHARA  •  RAGHUVARAN', width / 2, height * 0.52);

    ctx.fillStyle = '#f3a9d2';
    ctx.font = 'italic 400 22px "Playfair Display", serif';
    ctx.fillText('“ Engeyo Paartha Mayakkam... Unconditional Love & Pure Heart ”', width / 2, height * 0.62);

    ctx.fillStyle = '#8f5778';
    ctx.font = '500 16px "Space Mono", monospace';
    ctx.fillText('STORY BY SELVARAGHAVAN  •  MUSIC BY YUVAN SHANKAR RAJA', width / 2, height * 0.70);
  }

  static drawVIP(ctx, width, height, m) {
    // VIP: Amber gold & fiery orange city construction youth anthem
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.45, 50, width * 0.5, height * 0.5, 900);
    grad.addColorStop(0, '#3d2003');
    grad.addColorStop(0.6, '#1a0d01');
    grad.addColorStop(1, '#060300');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // City Construction Crane Silhouettes
    ctx.strokeStyle = 'rgba(255, 152, 0, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, height * 0.75);
    ctx.lineTo(400, height * 0.25);
    ctx.lineTo(800, height * 0.25);
    ctx.stroke();

    ctx.fillStyle = '#ff9800';
    ctx.font = '900 110px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff9800';
    ctx.shadowBlur = 30;
    ctx.fillText('V.I.P', width / 2, height * 0.40);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 32px "Space Grotesk", sans-serif';
    ctx.fillText('VELAIILLA PATTADHARI', width / 2, height * 0.48);

    ctx.fillStyle = '#ffb74d';
    ctx.font = 'italic 700 24px "Playfair Display", serif';
    ctx.fillText('“ Raghuvaran B.Tech! Amma kitta kaatradhu dhaan da Gethu! ”', width / 2, height * 0.59);

    ctx.fillStyle = '#ffcc80';
    ctx.font = '500 18px "Space Grotesk", sans-serif';
    ctx.fillText('DHANUSH 25TH FILM  •  ANIRUDH SENSATIONAL BGM', width / 2, height * 0.67);
  }

  static draw3Moonu(ctx, width, height, m) {
    // 3 (Moonu): Mystical violet moonlight and three-stage love story
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.45, 40, width * 0.5, height * 0.5, 850);
    grad.addColorStop(0, '#2d0938');
    grad.addColorStop(0.5, '#130318');
    grad.addColorStop(1, '#050106');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Three Moons Graphic
    const moonPhases = [width * 0.35, width * 0.5, width * 0.65];
    moonPhases.forEach((mx, idx) => {
      ctx.strokeStyle = 'rgba(156, 39, 176, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mx, height * 0.25, 40 + idx * 8, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.fillStyle = '#d05ce3';
    ctx.font = 'italic 400 130px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#9c27b0';
    ctx.shadowBlur = 35;
    ctx.fillText('3', width / 2, height * 0.43);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 28px "Space Grotesk", sans-serif';
    ctx.fillText('A PSYCHOLOGICAL ROMANCE BY AISHWARYA RAJINIKANTH', width / 2, height * 0.52);

    ctx.fillStyle = '#e1bee7';
    ctx.font = 'italic 400 22px "Playfair Display", serif';
    ctx.fillText('“ Why This Kolaveri Di & The Three Timeless Stages of Love ”', width / 2, height * 0.62);

    ctx.fillStyle = '#ab47bc';
    ctx.font = '500 18px "Space Grotesk", sans-serif';
    ctx.fillText('DHANUSH (RAM)  •  SHRUTI HAASAN (JANANI)  •  ANIRUDH DEBUT', width / 2, height * 0.70);
  }

  static drawKanchana(ctx, width, height, m) {
    // Kanchana: Crimson red and eerie horror shadows
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.45, 50, width * 0.5, height * 0.5, 900);
    grad.addColorStop(0, '#420713');
    grad.addColorStop(0.5, '#1c0308');
    grad.addColorStop(1, '#060002');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ff2d55';
    ctx.font = '900 110px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff2d55';
    ctx.shadowBlur = 35;
    ctx.fillText('KANCHANA', width / 2, height * 0.41);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 32px "Space Grotesk", sans-serif';
    ctx.fillText('MUNI 2  •  SHE RETURNED FOR JUSTICE', width / 2, height * 0.50);

    ctx.fillStyle = '#ff758f';
    ctx.font = 'italic 700 24px "Playfair Display", serif';
    ctx.fillText('“ The Groundbreaking Horror-Comedy Blockbuster of Tamil Cinema ”', width / 2, height * 0.60);

    ctx.fillStyle = '#c9184a';
    ctx.font = '500 18px "Space Grotesk", sans-serif';
    ctx.fillText('RAGHAVA LAWRENCE  •  SARATHKUMAR (KANCHANA)  •  KOVAI SARALA', width / 2, height * 0.68);
  }

  static drawMinnale(ctx, width, height, m) {
    // Minnale: Electric cyan rain and lightning
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#062d42');
    grad.addColorStop(0.5, '#03141e');
    grad.addColorStop(1, '#000508');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Lightning Bolt
    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, 0);
    ctx.lineTo(width * 0.53, height * 0.2);
    ctx.lineTo(width * 0.48, height * 0.28);
    ctx.lineTo(width * 0.52, height * 0.45);
    ctx.stroke();

    ctx.fillStyle = '#00d2ff';
    ctx.font = 'italic 400 120px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00d2ff';
    ctx.shadowBlur = 35;
    ctx.fillText('Minnale', width / 2, height * 0.42);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 26px "Space Grotesk", sans-serif';
    ctx.fillText('A GAUTHAM VASUDEV MENON MUSICAL CLASSIC', width / 2, height * 0.51);

    ctx.fillStyle = '#7be4ff';
    ctx.font = 'italic 400 24px "Playfair Display", serif';
    ctx.fillText('“ Vaseegara En Nenjinika... When Lightning Strikes Under Chennai Rain ”', width / 2, height * 0.61);

    ctx.fillStyle = '#008bb3';
    ctx.font = '500 18px "Space Grotesk", sans-serif';
    ctx.fillText('R. MADHAVAN  •  REEMA SEN  •  ABBAS  •  HARRIS JAYARAJ', width / 2, height * 0.69);
  }

  static drawBreakingBad(ctx, width, height, m) {
    // Breaking Bad: Toxic green chemical elements & Heisenberg silhouette
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.45, 50, width * 0.5, height * 0.5, 900);
    grad.addColorStop(0, '#0e3a07');
    grad.addColorStop(0.5, '#051803');
    grad.addColorStop(1, '#010500');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Periodic Table Element Boxes: [Br] [Ba]
    this.drawPeriodicBox(ctx, width * 0.38 - 90, height * 0.25, 'Br', 'Bromine', '35');
    this.drawPeriodicBox(ctx, width * 0.62 - 90, height * 0.25, 'Ba', 'Barium', '56');

    ctx.fillStyle = '#39ff14';
    ctx.font = '900 100px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 30;
    ctx.fillText('Breaking Bad', width / 2, height * 0.48);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 28px "Space Grotesk", sans-serif';
    ctx.fillText('I AM THE DANGER. I AM THE ONE WHO KNOCKS.', width / 2, height * 0.57);

    ctx.fillStyle = '#99ff85';
    ctx.font = 'italic 400 22px "Playfair Display", serif';
    ctx.fillText('“ Say My Name. — Heisenberg ”', width / 2, height * 0.65);

    ctx.fillStyle = '#4ca638';
    ctx.font = '500 16px "Space Mono", monospace';
    ctx.fillText('CREATED BY VINCE GILLIGAN  •  BRYAN CRANSTON & AARON PAUL', width / 2, height * 0.72);
  }

  static drawAttackOnTitan(ctx, width, height, m) {
    // Attack on Titan: Fiery Wall Maria steam & Wings of Freedom
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.45, 50, width * 0.5, height * 0.5, 900);
    grad.addColorStop(0, '#421404');
    grad.addColorStop(0.5, '#1b0701');
    grad.addColorStop(1, '#060100');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ff3d00';
    ctx.font = '900 100px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff3d00';
    ctx.shadowBlur = 40;
    ctx.fillText('ATTACK ON TITAN', width / 2, height * 0.40);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 32px "Space Grotesk", sans-serif';
    ctx.fillText('SHINGEKI NO KYOJIN  (進撃の巨人)', width / 2, height * 0.49);

    ctx.fillStyle = '#ff7a50';
    ctx.font = 'italic 700 24px "Playfair Display", serif';
    ctx.fillText('“ Shinzo wo Sasageyo! (Dedicate Your Hearts!) — Tatakae! ”', width / 2, height * 0.59);

    ctx.fillStyle = '#d84315';
    ctx.font = '500 18px "Space Grotesk", sans-serif';
    ctx.fillText('HIROYUKI SAWANO LEGENDARY SCORE  •  WIT & MAPPA STUDIOS', width / 2, height * 0.68);
  }

  static drawGenericMovie(ctx, width, height, m) {
    ctx.fillStyle = m.accentColor;
    ctx.font = '900 90px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(m.title, width / 2, height * 0.45);
  }

  static drawPeriodicBox(ctx, x, y, symbol, name, num) {
    ctx.fillStyle = '#1e3814';
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 3;
    ctx.fillRect(x, y, 90, 90);
    ctx.strokeRect(x, y, 90, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(num, x + 8, y + 20);

    ctx.fillStyle = '#39ff14';
    ctx.font = '900 38px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(symbol, x + 45, y + 58);

    ctx.fillStyle = '#a8e69c';
    ctx.font = '400 10px "Space Grotesk", sans-serif';
    ctx.fillText(name, x + 45, y + 80);
  }

  static drawCardHUD(ctx, width, height, movie) {
    // Top Left: Index & Certification
    ctx.fillStyle = movie.accentColor;
    ctx.font = '700 18px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${movie.index}  •  ${movie.certification}`, 60, 80);

    // Top Right: Rating Pill
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.roundRect(ctx, width - 210, 50, 150, 44, 22);
    ctx.fill();
    ctx.strokeStyle = movie.accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★ ${movie.rating} / 10`, width - 135, 78);

    // Bottom Left: Movie Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 38px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(movie.title, 60, height - 60);

    // Bottom Right: Liquid Explore Action
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(width - 80, height - 75, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width - 88, height - 75);
    ctx.lineTo(width - 72, height - 75);
    ctx.lineTo(width - 77, height - 81);
    ctx.moveTo(width - 72, height - 75);
    ctx.lineTo(width - 77, height - 69);
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
