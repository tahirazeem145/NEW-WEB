/**
 * MoviePosterRenderer
 * Generates rich, highly detailed visual pictorial poster art
 * with character silhouettes, scenery, lighting, effects, and typography
 * for all 10 movie titles.
 */

export class MoviePosterRenderer {
  /**
   * Draw the visual poster onto canvas context
   */
  static renderPoster(ctx, width, height, movie) {
    ctx.save();
    switch (movie.id) {
      case 'kgf-1':
        this.renderKGF1(ctx, width, height);
        break;
      case 'kgf-2':
        this.renderKGF2(ctx, width, height);
        break;
      case '7g-rainbow-colony':
        this.render7GRainbowColony(ctx, width, height);
        break;
      case 'yaaradi-nee-mohini':
        this.renderYaaradiNeeMohini(ctx, width, height);
        break;
      case 'vip':
        this.renderVIP(ctx, width, height);
        break;
      case '3-moonu':
        this.render3Moonu(ctx, width, height);
        break;
      case 'kanchana':
        this.renderKanchana(ctx, width, height);
        break;
      case 'minnale':
        this.renderMinnale(ctx, width, height);
        break;
      case 'breaking-bad':
        this.renderBreakingBad(ctx, width, height);
        break;
      case 'attack-on-titan':
        this.renderAttackOnTitan(ctx, width, height);
        break;
      default:
        this.renderGeneric(ctx, width, height, movie);
    }
    ctx.restore();
  }

  /* ---------------- 1. K.G.F CHAPTER 1 ---------------- */
  static renderKGF1(ctx, w, h) {
    // Dusty gold mines canyon background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#1c1303');
    bg.addColorStop(0.4, '#2d1e05');
    bg.addColorStop(0.7, '#150d01');
    bg.addColorStop(1, '#080500');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Mountainous canyon silhouettes
    ctx.fillStyle = '#0f0a02';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.7);
    ctx.lineTo(w * 0.25, h * 0.35);
    ctx.lineTo(w * 0.45, h * 0.55);
    ctx.lineTo(w * 0.75, h * 0.3);
    ctx.lineTo(w, h * 0.65);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // Wooden scaffolding & gold mine towers
    ctx.strokeStyle = 'rgba(229, 169, 60, 0.25)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const tx = 150 + i * 240;
      ctx.beginPath();
      ctx.moveTo(tx, h * 0.7);
      ctx.lineTo(tx + 40, h * 0.38);
      ctx.lineTo(tx + 80, h * 0.7);
      ctx.moveTo(tx + 10, h * 0.5);
      ctx.lineTo(tx + 70, h * 0.5);
      ctx.stroke();
    }

    // Volumetric sunbeam rays from top-left
    const ray = ctx.createRadialGradient(w * 0.2, 0, 10, w * 0.2, 0, 900);
    ray.addColorStop(0, 'rgba(245, 185, 66, 0.35)');
    ray.addColorStop(0.5, 'rgba(229, 169, 60, 0.12)');
    ray.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ray;
    ctx.fillRect(0, 0, w, h);

    // Hero Silhouette: Rocky Bhai with Hammer
    this.drawHeroSilhouette(ctx, w * 0.5, h * 0.48, 'rocky-hammer');

    // Floating gold flakes & sparks
    this.drawSparks(ctx, w, h, '#e5a93c', 120);

    // Metallic Title
    this.drawPosterTitle(ctx, w, h, 'K.G.F', 'CHAPTER 1', '#e5a93c', '#ffffff', 'SALAM ROCKY BHAI');
  }

  /* ---------------- 2. K.G.F CHAPTER 2 ---------------- */
  static renderKGF2(ctx, w, h) {
    // Volcanic fiery battlefield
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.4, 40, w * 0.5, h * 0.5, 950);
    bg.addColorStop(0, '#5a0c05');
    bg.addColorStop(0.4, '#2c0602');
    bg.addColorStop(0.8, '#120201');
    bg.addColorStop(1, '#050000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Explosions & Fire smoke plumes
    for (let i = 0; i < 8; i++) {
      const sx = 200 + i * 180;
      const grad = ctx.createRadialGradient(sx, h * 0.65, 20, sx, h * 0.65, 180);
      grad.addColorStop(0, 'rgba(255, 90, 30, 0.45)');
      grad.addColorStop(0.5, 'rgba(234, 46, 21, 0.15)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, h * 0.65, 180, 0, Math.PI * 2);
      ctx.fill();
    }

    // Foreground warzone rubble
    ctx.fillStyle = '#080101';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.75);
    ctx.lineTo(w * 0.35, h * 0.62);
    ctx.lineTo(w * 0.65, h * 0.68);
    ctx.lineTo(w, h * 0.6);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // Dual Hero Faceoff Silhouettes: Rocky Bhai vs Adheera
    this.drawHeroSilhouette(ctx, w * 0.44, h * 0.46, 'rocky-guns');
    this.drawHeroSilhouette(ctx, w * 0.62, h * 0.45, 'adheera-sword');

    // Intense flying molten embers
    this.drawSparks(ctx, w, h, '#ff3b1e', 150);

    // Metallic Fiery Title
    this.drawPosterTitle(ctx, w, h, 'K.G.F', 'CHAPTER 2', '#ea2e15', '#ff9980', 'VIOLENCE LIKES ME');
  }

  /* ---------------- 3. 7G RAINBOW COLONY ---------------- */
  static render7GRainbowColony(ctx, w, h) {
    // Twilight rain-soaked cyan night
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#092523');
    bg.addColorStop(0.5, '#041514');
    bg.addColorStop(1, '#010807');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Apartment block silhouettes with yellow glowing windows
    for (let b = 0; b < 5; b++) {
      const bx = 80 + b * 300;
      const bh = 320 + (b % 3) * 60;
      ctx.fillStyle = '#03100f';
      ctx.fillRect(bx, h * 0.28, 220, bh);
      ctx.strokeStyle = 'rgba(60, 212, 197, 0.2)';
      ctx.strokeRect(bx, h * 0.28, 220, bh);

      // Windows
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 3; c++) {
          ctx.fillStyle = (r + c + b) % 3 === 0 ? 'rgba(255, 215, 120, 0.6)' : 'rgba(10, 40, 35, 0.8)';
          ctx.fillRect(bx + 25 + c * 60, h * 0.32 + r * 50, 35, 30);
        }
      }
    }

    // Streetlamp with glowing cyan-yellow flare
    this.drawStreetLamp(ctx, w * 0.32, h * 0.42);

    // Rain lines
    this.drawRain(ctx, w, h, 'rgba(60, 212, 197, 0.25)');

    // Lovers Under Umbrella Silhouette
    this.drawHeroSilhouette(ctx, w * 0.5, h * 0.52, 'lovers-umbrella');

    // Title
    this.drawPosterTitle(ctx, w, h, '7G RAINBOW', 'COLONY', '#3cd4c5', '#ffffff', 'A SELVARAGHAVAN MASTERPIECE');
  }

  /* ---------------- 4. YAARADI NEE MOHINI ---------------- */
  static renderYaaradiNeeMohini(ctx, w, h) {
    // Warm golden hour sunset over village estate
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#42162e');
    bg.addColorStop(0.4, '#240b19');
    bg.addColorStop(0.8, '#13040c');
    bg.addColorStop(1, '#050103');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Sunset sun glow & warm lens flare
    const sun = ctx.createRadialGradient(w * 0.7, h * 0.35, 10, w * 0.7, h * 0.35, 600);
    sun.addColorStop(0, 'rgba(255, 180, 210, 0.45)');
    sun.addColorStop(0.5, 'rgba(229, 130, 184, 0.15)');
    sun.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, w, h);

    // Traditional Chettinad courtyard arches
    ctx.strokeStyle = 'rgba(229, 130, 184, 0.25)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const ax = 120 + i * 360;
      ctx.beginPath();
      ctx.arc(ax + 140, h * 0.35, 140, Math.PI, 0);
      ctx.lineTo(ax + 280, h * 0.85);
      ctx.lineTo(ax, h * 0.85);
      ctx.closePath();
      ctx.stroke();
    }

    // Fairy lights garland
    ctx.strokeStyle = 'rgba(255, 230, 180, 0.6)';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.25);
    ctx.quadraticCurveTo(w * 0.5, h * 0.45, w, h * 0.25);
    ctx.stroke();
    for (let i = 0; i < 24; i++) {
      const t = i / 24;
      const x = t * w;
      const y = (1 - t) * (1 - t) * (h * 0.25) + 2 * (1 - t) * t * (h * 0.45) + t * t * (h * 0.25);
      ctx.fillStyle = '#ffe082';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Romantic Couple Silhouette (Vasu & Keerthi)
    this.drawHeroSilhouette(ctx, w * 0.5, h * 0.52, 'vasu-keerthi');

    // Title
    this.drawPosterTitle(ctx, w, h, 'YAARADI NEE', 'MOHINI', '#e582b8', '#ffffff', 'ENGEYO PAARTHA MAYAKKAM');
  }

  /* ---------------- 5. VIP ---------------- */
  static renderVIP(ctx, w, h) {
    // Sunset orange Chennai cityscape & construction site
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#381c03');
    bg.addColorStop(0.5, '#1e0e01');
    bg.addColorStop(1, '#080300');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Tower Crane & Skyscraper Scaffolding
    ctx.strokeStyle = 'rgba(255, 152, 0, 0.35)';
    ctx.lineWidth = 3;
    // Tower crane mast
    ctx.strokeRect(w * 0.75, h * 0.15, 30, h * 0.7);
    // Crane boom
    ctx.beginPath();
    ctx.moveTo(w * 0.45, h * 0.18);
    ctx.lineTo(w * 0.95, h * 0.18);
    ctx.moveTo(w * 0.75, h * 0.1);
    ctx.lineTo(w * 0.45, h * 0.18);
    ctx.lineTo(w * 0.78, h * 0.1);
    ctx.lineTo(w * 0.95, h * 0.18);
    ctx.stroke();

    // City Skyline Blocks
    ctx.fillStyle = '#110701';
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(40 + i * 190, h * 0.48 - (i % 4) * 40, 160, h * 0.5);
    }

    // Hero Silhouette: Raghuvaran with TVS 50 & Blueprint
    this.drawHeroSilhouette(ctx, w * 0.48, h * 0.50, 'raghuvaran-vip');

    // Electrical sparks & dust
    this.drawSparks(ctx, w, h, '#ff9800', 90);

    // Title
    this.drawPosterTitle(ctx, w, h, 'V.I.P', 'VELAIILLA PATTADHARI', '#ff9800', '#ffffff', 'RAGHUVARAN B.TECH');
  }

  /* ---------------- 6. 3 (MOONU) ---------------- */
  static render3Moonu(ctx, w, h) {
    // Deep mystical violet midnight with dark ocean
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#2e083a');
    bg.addColorStop(0.5, '#14031a');
    bg.addColorStop(1, '#050007');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Triple Moons in the Sky
    const moons = [
      { x: w * 0.32, y: h * 0.30, r: 60, phase: 'crescent' },
      { x: w * 0.50, y: h * 0.22, r: 85, phase: 'full' },
      { x: w * 0.68, y: h * 0.30, r: 60, phase: 'gibbous' }
    ];

    moons.forEach(m => {
      const moonGlow = ctx.createRadialGradient(m.x, m.y, m.r * 0.2, m.x, m.y, m.r * 2.5);
      moonGlow.addColorStop(0, 'rgba(208, 92, 227, 0.4)');
      moonGlow.addColorStop(0.5, 'rgba(156, 39, 176, 0.1)');
      moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f3e5f5';
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Ocean water reflection ripples
    ctx.strokeStyle = 'rgba(208, 92, 227, 0.2)';
    for (let y = h * 0.65; y < h; y += 12) {
      ctx.beginPath();
      ctx.moveTo(w * 0.2, y);
      ctx.lineTo(w * 0.8, y);
      ctx.stroke();
    }

    // Silhouette of Ram and Janani on the beach
    this.drawHeroSilhouette(ctx, w * 0.5, h * 0.54, 'ram-janani');

    // Title
    this.drawPosterTitle(ctx, w, h, '3', 'MOONU', '#d05ce3', '#ffffff', 'WHY THIS KOLAVERI DI');
  }

  /* ---------------- 7. KANCHANA ---------------- */
  static renderKanchana(ctx, w, h) {
    // Eerie crimson graveyard with blood moon
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.35, 40, w * 0.5, h * 0.5, 900);
    bg.addColorStop(0, '#520615');
    bg.addColorStop(0.5, '#220207');
    bg.addColorStop(1, '#080002');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Blood Moon
    const moon = ctx.createRadialGradient(w * 0.5, h * 0.28, 20, w * 0.5, h * 0.28, 160);
    moon.addColorStop(0, '#ff4d6d');
    moon.addColorStop(0.6, '#b80024');
    moon.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = moon;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.28, 160, 0, Math.PI * 2);
    ctx.fill();

    // Spooky temple gopuram & graveyard trees
    ctx.fillStyle = '#0e0104';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    ctx.lineTo(w * 0.2, h * 0.5);
    ctx.lineTo(w * 0.35, h * 0.65);
    ctx.lineTo(w * 0.7, h * 0.48);
    ctx.lineTo(w, h * 0.75);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // Fierce Kanchana (Sarathkumar) Trishul Silhouette
    this.drawHeroSilhouette(ctx, w * 0.5, h * 0.50, 'kanchana-trishul');

    // Lightning flashes
    this.drawLightning(ctx, w * 0.7, 0, w * 0.65, h * 0.4);

    // Title
    this.drawPosterTitle(ctx, w, h, 'KANCHANA', 'MUNI 2', '#ff2d55', '#ffffff', 'SHE RETURNED FOR JUSTICE');
  }

  /* ---------------- 8. MINNALE ---------------- */
  static renderMinnale(ctx, w, h) {
    // Electric cyan Chennai midnight rain boulevard
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#062638');
    bg.addColorStop(0.5, '#03121c');
    bg.addColorStop(1, '#000508');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Lightning Flash piercing clouds
    this.drawLightning(ctx, w * 0.45, 0, w * 0.52, h * 0.45);
    this.drawLightning(ctx, w * 0.52, h * 0.2, w * 0.6, h * 0.4);

    // Rain lines
    this.drawRain(ctx, w, h, 'rgba(0, 210, 255, 0.4)');

    // Motorcycle headlight beam
    const headlight = ctx.createRadialGradient(w * 0.3, h * 0.7, 10, w * 0.5, h * 0.7, 400);
    headlight.addColorStop(0, 'rgba(0, 210, 255, 0.6)');
    headlight.addColorStop(0.6, 'rgba(0, 210, 255, 0.15)');
    headlight.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = headlight;
    ctx.fillRect(0, 0, w, h);

    // Silhouette of Rajesh and Reena embracing in the rain
    this.drawHeroSilhouette(ctx, w * 0.5, h * 0.52, 'minnale-embrace');

    // Title
    this.drawPosterTitle(ctx, w, h, 'MINNALE', 'GAUTHAM MENON MUSICAL', '#00d2ff', '#ffffff', 'VASEEGARA EN NENJINIKA');
  }

  /* ---------------- 9. BREAKING BAD ---------------- */
  static renderBreakingBad(ctx, w, h) {
    // Toxic chemical green & Albuquerque desert
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.4, 40, w * 0.5, h * 0.5, 950);
    bg.addColorStop(0, '#103d08');
    bg.addColorStop(0.5, '#061803');
    bg.addColorStop(1, '#010500');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Chemical smoke clouds
    for (let i = 0; i < 7; i++) {
      const cx = 200 + i * 200;
      const smoke = ctx.createRadialGradient(cx, h * 0.55, 20, cx, h * 0.55, 220);
      smoke.addColorStop(0, 'rgba(57, 255, 20, 0.3)');
      smoke.addColorStop(0.5, 'rgba(30, 150, 10, 0.1)');
      smoke.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = smoke;
      ctx.beginPath();
      ctx.arc(cx, h * 0.55, 220, 0, Math.PI * 2);
      ctx.fill();
    }

    // Periodic Table Br & Ba visual icons
    this.drawPeriodicBox(ctx, w * 0.35 - 75, h * 0.18, 'Br', 'Bromine', '35');
    this.drawPeriodicBox(ctx, w * 0.65 - 75, h * 0.18, 'Ba', 'Barium', '56');

    // Hero Silhouette: Heisenberg in hat and sunglasses
    this.drawHeroSilhouette(ctx, w * 0.5, h * 0.50, 'heisenberg');

    // Crystal blue meth shards
    this.drawSparks(ctx, w, h, '#00e5ff', 80);

    // Title
    this.drawPosterTitle(ctx, w, h, 'BREAKING BAD', 'HEISENBERG', '#39ff14', '#ffffff', 'I AM THE ONE WHO KNOCKS');
  }

  /* ---------------- 10. ATTACK ON TITAN ---------------- */
  static renderAttackOnTitan(ctx, w, h) {
    // Fiery Wall Maria & Colossal Titan steam
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.35, 40, w * 0.5, h * 0.5, 950);
    bg.addColorStop(0, '#541503');
    bg.addColorStop(0.5, '#220801');
    bg.addColorStop(1, '#080200');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Stone Wall of Wall Maria
    ctx.fillStyle = '#1c0c06';
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
    ctx.strokeStyle = '#ff3d00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.55);
    ctx.lineTo(w, h * 0.55);
    ctx.stroke();

    // Colossal Titan Silhouette peering over the wall
    ctx.fillStyle = '#0a0301';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.32, 140, Math.PI, 0); // Head
    ctx.fill();

    // Fiery Glowing Eyes of Colossal Titan
    ctx.fillStyle = '#ff3d00';
    ctx.beginPath();
    ctx.arc(w * 0.46, h * 0.28, 12, 0, Math.PI * 2);
    ctx.arc(w * 0.54, h * 0.28, 12, 0, Math.PI * 2);
    ctx.fill();

    // ODM Gear Eren mid-air silhouette
    this.drawHeroSilhouette(ctx, w * 0.32, h * 0.46, 'eren-odm');

    // Titan Lightning Transformation Sparks
    this.drawLightning(ctx, w * 0.5, 0, w * 0.5, h * 0.3);
    this.drawSparks(ctx, w, h, '#ff9100', 140);

    // Title
    this.drawPosterTitle(ctx, w, h, 'ATTACK ON TITAN', '進撃の巨人', '#ff3d00', '#ffffff', 'SHINZO WO SASAGEYO!');
  }

  /* ---------------- Helper Drawing Routines ---------------- */

  static drawHeroSilhouette(ctx, cx, cy, type) {
    ctx.save();
    ctx.fillStyle = '#050505';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 20;

    switch (type) {
      case 'rocky-hammer':
        // Head with long hair
        ctx.beginPath();
        ctx.arc(cx, cy - 80, 32, 0, Math.PI * 2);
        ctx.fill();
        // Torso / Suit
        ctx.fillRect(cx - 38, cy - 45, 76, 120);
        // Hammer
        ctx.strokeStyle = '#050505';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(cx - 40, cy - 70);
        ctx.lineTo(cx + 80, cy - 140);
        ctx.stroke();
        ctx.fillRect(cx + 60, cy - 165, 45, 35);
        break;

      case 'rocky-guns':
        ctx.beginPath();
        ctx.arc(cx, cy - 80, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - 35, cy - 48, 70, 110);
        // Dual Gun barrels
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#050505';
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy - 30);
        ctx.lineTo(cx - 90, cy - 50);
        ctx.moveTo(cx + 30, cy - 30);
        ctx.lineTo(cx + 90, cy - 50);
        ctx.stroke();
        break;

      case 'adheera-sword':
        ctx.beginPath();
        ctx.arc(cx, cy - 85, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - 45, cy - 48, 90, 120);
        // Heavy Broadsword
        ctx.lineWidth = 16;
        ctx.strokeStyle = '#050505';
        ctx.beginPath();
        ctx.moveTo(cx + 40, cy - 130);
        ctx.lineTo(cx + 40, cy + 50);
        ctx.stroke();
        break;

      case 'lovers-umbrella':
      case 'vasu-keerthi':
      case 'minnale-embrace':
        // Umbrella
        ctx.beginPath();
        ctx.arc(cx, cy - 90, 80, Math.PI, 0);
        ctx.fill();
        // Umbrella handle
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#050505';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 90);
        ctx.lineTo(cx, cy + 20);
        ctx.stroke();
        // Two heads embracing
        ctx.beginPath();
        ctx.arc(cx - 18, cy - 40, 24, 0, Math.PI * 2);
        ctx.arc(cx + 18, cy - 44, 22, 0, Math.PI * 2);
        ctx.fill();
        // Bodies
        ctx.fillRect(cx - 40, cy - 16, 80, 110);
        break;

      case 'raghuvaran-vip':
        // Helmet / Head
        ctx.beginPath();
        ctx.arc(cx, cy - 75, 30, 0, Math.PI * 2);
        ctx.fill();
        // Ray-Ban glasses reflection
        ctx.fillStyle = '#ff9800';
        ctx.fillRect(cx - 16, cy - 80, 14, 8);
        ctx.fillRect(cx + 2, cy - 80, 14, 8);
        ctx.fillStyle = '#050505';
        // Formal shirt & Lungi
        ctx.fillRect(cx - 36, cy - 42, 72, 120);
        break;

      case 'ram-janani':
        ctx.beginPath();
        ctx.arc(cx - 20, cy - 60, 26, 0, Math.PI * 2);
        ctx.arc(cx + 20, cy - 64, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - 45, cy - 35, 90, 110);
        break;

      case 'kanchana-trishul':
        // Head
        ctx.beginPath();
        ctx.arc(cx, cy - 80, 30, 0, Math.PI * 2);
        ctx.fill();
        // Flying Sari silhouette
        ctx.beginPath();
        ctx.moveTo(cx - 35, cy - 48);
        ctx.lineTo(cx + 35, cy - 48);
        ctx.lineTo(cx + 80, cy + 90);
        ctx.lineTo(cx - 80, cy + 90);
        ctx.closePath();
        ctx.fill();
        // Trishul (Trident)
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#ff2d55';
        ctx.beginPath();
        ctx.moveTo(cx - 50, cy - 140);
        ctx.lineTo(cx - 50, cy + 80);
        ctx.stroke();
        break;

      case 'heisenberg':
        // Porkpie Hat
        ctx.fillRect(cx - 48, cy - 100, 96, 12);
        ctx.fillRect(cx - 32, cy - 130, 64, 30);
        // Head & Glasses
        ctx.beginPath();
        ctx.arc(cx, cy - 65, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#39ff14';
        ctx.fillRect(cx - 20, cy - 70, 16, 10);
        ctx.fillRect(cx + 4, cy - 70, 16, 10);
        ctx.fillStyle = '#050505';
        // Trench Coat
        ctx.fillRect(cx - 45, cy - 35, 90, 130);
        break;

      case 'eren-odm':
        ctx.beginPath();
        ctx.arc(cx, cy - 60, 24, 0, Math.PI * 2);
        ctx.fill();
        // Mid-air body
        ctx.fillRect(cx - 25, cy - 35, 50, 70);
        // Twin Blades
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy - 20);
        ctx.lineTo(cx - 70, cy - 70);
        ctx.moveTo(cx + 20, cy - 20);
        ctx.lineTo(cx + 70, cy - 70);
        ctx.stroke();
        break;

      default:
        ctx.beginPath();
        ctx.arc(cx, cy - 60, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - 35, cy - 30, 70, 100);
    }
    ctx.restore();
  }

  static drawPosterTitle(ctx, w, h, mainTitle, subTitle, accentColor, textColor, tagText) {
    ctx.save();
    // Big Main Title
    ctx.fillStyle = accentColor;
    ctx.font = '900 115px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 30;
    ctx.fillText(mainTitle, w / 2, h * 0.78);
    ctx.shadowBlur = 0;

    // Subtitle
    ctx.fillStyle = textColor;
    ctx.font = '700 28px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '0.2em';
    ctx.fillText(subTitle, w / 2, h * 0.84);

    // Tag text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = 'italic 500 18px "Playfair Display", Georgia, serif';
    ctx.fillText(`“ ${tagText} ”`, w / 2, h * 0.90);
    ctx.restore();
  }

  static drawStreetLamp(ctx, lx, ly) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx, ly + 320);
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx + 50, ly - 20);
    ctx.stroke();

    const glow = ctx.createRadialGradient(lx + 50, ly - 20, 5, lx + 50, ly - 20, 140);
    glow.addColorStop(0, 'rgba(255, 240, 160, 0.8)');
    glow.addColorStop(0.4, 'rgba(60, 212, 197, 0.2)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lx + 50, ly - 20, 140, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawRain(ctx, w, h, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 90; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 15, ry + 35);
      ctx.stroke();
    }
  }

  static drawSparks(ctx, w, h, color, count) {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 3 + 1;
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  static drawLightning(ctx, x1, y1, x2, y2) {
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 15;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + 25, y1 + (y2 - y1) * 0.4);
    ctx.lineTo(x1 - 15, y1 + (y2 - y1) * 0.6);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  static drawPeriodicBox(ctx, x, y, symbol, name, num) {
    ctx.fillStyle = 'rgba(14, 58, 7, 0.8)';
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 3;
    ctx.fillRect(x, y, 75, 75);
    ctx.strokeRect(x, y, 75, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 12px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(num, x + 6, y + 16);

    ctx.fillStyle = '#39ff14';
    ctx.font = '900 32px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(symbol, x + 37, y + 48);

    ctx.fillStyle = '#a8e69c';
    ctx.font = '400 9px "Space Grotesk", sans-serif';
    ctx.fillText(name, x + 37, y + 66);
  }

  static renderGeneric(ctx, w, h, m) {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = m.accentColor;
    ctx.font = '900 80px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(m.title, w / 2, h / 2);
  }
}
