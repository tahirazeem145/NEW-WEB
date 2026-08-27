export const PROJECTS = [
  {
    id: 'griflan',
    index: '01',
    title: 'Client Confessions',
    client: 'Griflan',
    category: 'Creative Agency / Digital Experience',
    year: '2024',
    role: 'Lead Creative Direction & Interaction Design',
    accentColor: '#ea2e15',
    themeClass: 'card-theme-griflan',
    description: 'An intimate, unfiltered look into what partners and founders say about collaborating with Griflan. Built with interactive confession sticky notes, tactile typography, and fluid micro-animations.',
    brief: 'Griflan wanted a bold, playful, yet editorial way to display real client testimonials that breaks away from standard corporate quote carousels. We designed "Client Confessions" — a vibrant, tactile canvas that captures candid praise through vibrant red and cream note cards.',
    technologies: ['Three.js', 'WebGL Shaders', 'GSAP', 'CSS 3D Transforms', 'Web Audio API'],
    stats: [
      { label: 'Client Retention', value: '98%' },
      { label: 'Awards Won', value: 'AOTD x4' },
      { label: 'Organic Growth', value: '+340%' },
      { label: 'Active Users', value: '65,000+' }
    ],
    confessions: [
      {
        quote: "Griflan is absolutely integral to the success of our company, authentically fusing creativity, empathy, speed, and excellence in all they do. They're true partners! We have had 65,000 users for the values bridge since 3 months of launch.",
        author: 'Guy Kawasaki',
        role: 'NYU Stern Professor & Bestselling Author',
        color: 'red'
      },
      {
        quote: 'Griflan is extremely dedicated to delivering high-quality results. From the initial conceptualization to the final product, their team demonstrated exceptional creativity and attention to detail.',
        author: 'Maya Steinberg',
        role: 'TechNexus, Member of the Board',
        color: 'beige'
      },
      {
        quote: 'Griflan is the ideal creative partner in that they can combine strong design chops with digital, and then demonstrate how pieces of the branding system come to life across even more enablement materials.',
        author: 'Mike Weiler',
        role: 'Upshop, Chief Growth Officer',
        color: 'red'
      },
      {
        quote: 'Griflan was a thoughtful, collaborative partner — helping us build on our newly refreshed brand to create a digital experience that feels true to who we are.',
        author: 'Shannon Hill',
        role: 'VP, Director of Marketing',
        color: 'beige'
      }
    ],
    tags: ['Branding', 'Art Direction', 'WebGL', 'Experimental UI']
  },
  {
    id: 'nathan-riley',
    index: '02',
    title: 'Nathan Riley',
    client: 'Nathan Riley Studio',
    category: 'Spatial Design / 3D Renders',
    year: '2024',
    role: 'Art Direction & 3D Spatial Systems',
    accentColor: '#3cd4c5',
    themeClass: 'card-theme-nathan',
    description: 'A multi-panel interactive moodboard celebrating brutalist architecture, organic rock formations, serene reflection pools, and ethereal natural lighting.',
    brief: 'A portfolio showcase for digital artist Nathan Riley, bringing together nature-inspired 3D environments, organic architectural structures, and tactile digital collages into a unified gallery.',
    technologies: ['Blender 3D', 'Three.js', 'Raymarching Shaders', 'Post-processing'],
    stats: [
      { label: 'Render Fidelity', value: '8K Ultra' },
      { label: 'Global Exhibitions', value: '12 Cities' },
      { label: 'Average Session', value: '4m 12s' },
      { label: 'Feature Index', value: 'FWA of the Day' }
    ],
    confessions: [
      {
        quote: 'Nathan creates spatial poetry. The atmosphere, light scatter, and texture interplay feel completely lifelike yet dreamy.',
        author: 'Elena Rostova',
        role: 'Curator at Modern Spatials',
        color: 'beige'
      },
      {
        quote: 'The seamless combination of brutalist stone monoliths with lush botanical foliage elevates digital architecture to new heights.',
        author: 'Marcus Vance',
        role: 'Lead Architect, Studio Form',
        color: 'dark'
      }
    ],
    tags: ['3D Architecture', 'Spatial UI', 'Raymarching', 'Editorial']
  },
  {
    id: 'casa-di-solare',
    index: '03',
    title: 'Casa Di Solare',
    client: 'Savolke Type & Architecture',
    category: 'Architectural Exhibition & Typography',
    year: '2024',
    role: 'Digital Exhibition & Editorial Typography',
    accentColor: '#e5b974',
    themeClass: 'card-theme-casa',
    description: 'Sun-drenched minimalist spaces meets haute typography. Exploring golden hour reflections, monolith curved columns, and subterranean courtyards.',
    brief: 'Casa Di Solare bridges contemporary brutalist Mediterranean architecture with haute couture editorial typography. Each spatial perspective frames typographic gestures that shift with simulated solar lighting.',
    technologies: ['WebGL PBR Materials', 'Dynamic Sun Simulator', 'GSAP ScrollTrigger', 'Custom Serif Variable Font'],
    stats: [
      { label: 'Spatial Rooms', value: '8 Environments' },
      { label: 'Solar Angles', value: 'Dynamic 360°' },
      { label: 'Typefaces', value: 'Savolke Serif' },
      { label: 'Design Merit', value: 'Site of the Month' }
    ],
    confessions: [
      {
        quote: 'Casa Di Solare redefines how typography interacts with physical and digital light. An absolute visual masterpiece.',
        author: 'Julien Laurent',
        role: 'Creative Director, Typecraft Paris',
        color: 'beige'
      }
    ],
    tags: ['Architecture', 'Serif Typography', 'PBR Materials', 'Editorial']
  },
  {
    id: 'echovoid',
    index: '04',
    title: 'Echovoid Studio',
    client: 'Echovoid Audio-Visual',
    category: 'Generative Audiovisual Lab',
    year: '2024',
    role: 'Real-time Shader Art & Audio Reactive WebGL',
    accentColor: '#7b5af5',
    themeClass: 'card-theme-echovoid',
    description: 'An experimental laboratory exploring generative wave dynamics, iridescent chromatic dispersion, and sound-driven particle topologies.',
    brief: 'Created as an ongoing interactive playground exploring real-time Fast Fourier Transform (FFT) audio analysis mapped directly into custom vertex displacement shaders and volumetric lighting.',
    technologies: ['Web Audio API', 'GLSL Custom Shaders', 'Instanced Mesh', 'FFT Frequency Analyzers'],
    stats: [
      { label: 'Audio Latency', value: '< 8ms' },
      { label: 'Particle Count', value: '150,000' },
      { label: 'Shader FPS', value: '60 FPS Solid' },
      { label: 'Interactive Nodes', value: '32 Synthesizers' }
    ],
    confessions: [
      {
        quote: 'Interacting with Echovoid feels like sculpting sound waves with light. Mesmerizing and technologically pristine.',
        author: 'Sora Tanaka',
        role: 'Audiovisual Producer, Tokyo Media Arts',
        color: 'dark'
      }
    ],
    tags: ['Audio-Reactive', 'GLSL Shaders', 'Generative', 'Sound Design']
  },
  {
    id: 'monolith',
    index: '05',
    title: 'Monolith Luxury',
    client: 'Monolith Horlogerie',
    category: 'Luxury Brand Identity & Motion',
    year: '2023',
    role: 'Brand Identity, Motion & Web Experience',
    accentColor: '#d4af37',
    themeClass: 'card-theme-monolith',
    description: 'Minimalist brutalist luxury timepiece digital experience with tactile matte finishes, golden leaf typography, and macro mechanical renders.',
    brief: 'A bespoke high-end digital journey for a Swiss artisan watchmaker. Emphasizing precision mechanical tolerances, obsidian materials, and tactile interactive micro-rotations.',
    technologies: ['High-Res GLTF Loading', 'HDRI Environment Mapping', 'Interactive Exploded Views'],
    stats: [
      { label: 'Timepiece Complications', value: '18 Modules' },
      { label: 'Titanium Finish', value: 'Grade 5 DLC' },
      { label: 'Engagement Rate', value: '+185%' },
      { label: 'VIP Waitlist', value: '4,200 Signups' }
    ],
    confessions: [
      {
        quote: 'The craftsmanship translated to the screen with astonishing precision. Every mechanical tooth and jewel reflects the timeless nature of our watches.',
        author: 'Henri de Montmirail',
        role: 'Master Watchmaker, Monolith Geneva',
        color: 'beige'
      }
    ],
    tags: ['Luxury Goods', '3D Product Showcase', 'Editorial', 'Micro-Interactions']
  },
  {
    id: 'velox-motion',
    index: '06',
    title: 'Velox Motion',
    client: 'Velox Kinematics',
    category: 'High-Speed Physics Simulation',
    year: '2023',
    role: 'Creative Direction & WebGL Engineering',
    accentColor: '#ff4d6d',
    themeClass: 'card-theme-velox',
    description: 'Cutting-edge interactive kinematics and fluid dynamics simulation crafted for aerodynamic design systems and velocity testing.',
    brief: 'An aerodynamic research interface enabling engineers and designers to visualize supersonic fluid drag, thermal displacement, and turbulent boundary layers in real time.',
    technologies: ['Compute Shaders', 'Navier-Stokes Fluid Sim', 'Three.js', 'WebAssembly'],
    stats: [
      { label: 'Fluid Grid Cells', value: '512 x 512' },
      { label: 'Simulation Step', value: '120 Hz' },
      { label: 'Drag Optimization', value: '-14.2% Drag' },
      { label: 'Global Citations', value: '38 Papers' }
    ],
    confessions: [
      {
        quote: 'Velox turned complex computational fluid dynamics into an intuitive, visually stunning real-time experience.',
        author: 'Dr. Katherine Aris',
        role: 'Aerospace Systems Lead',
        color: 'red'
      }
    ],
    tags: ['Physics Simulation', 'Compute Shaders', 'Fluid Dynamics', 'Aerodynamics']
  }
];

export const PROFILE_INFO = {
  name: 'Jesper Landberg',
  role: 'Creative Developer & Art Director',
  location: 'Stockholm, Sweden / Global Remote',
  bio: 'Specializing in award-winning interactive 3D WebGL experiences, generative motion systems, and editorial digital craft. Over a decade of pushing the boundaries of web-based spatial typography, real-time shaders, and sensory interactions.',
  awards: [
    { title: 'Awwwards Site of the Year', count: 'x 2' },
    { title: 'Awwwards Site of the Day', count: 'x 18' },
    { title: 'FWA of the Day', count: 'x 14' },
    { title: 'CSS Design Awards (WOTD)', count: 'x 22' },
    { title: 'Cannes Lions Digital Craft', count: 'Bronze' }
  ],
  services: [
    'Creative Direction & Art Direction',
    'High-End WebGL / Three.js Interactive Development',
    'Custom Shader Programming (GLSL)',
    'Motion Design & Physics Engines',
    'Interactive Sound Design & Procedural Audio'
  ],
  socials: [
    { name: 'Twitter / X', url: 'https://twitter.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' }
  ]
};
