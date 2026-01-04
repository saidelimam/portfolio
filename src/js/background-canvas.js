/**
 * Canvas-based Cinematic Background Animation
 * Replaces heavy CSS pseudo-elements and many DOM nodes with a single high-performance canvas.
 * This prevents flickering on high-resolution devices by using a single GPU layer.
 */

export class BackgroundAnimation {
  constructor(canvasId = 'background-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      // Prepend to hero section or body
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.insertBefore(this.canvas, hero.firstChild);
      } else {
        document.body.insertBefore(this.canvas, document.body.firstChild);
      }
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.lights = [];
    this.width = 0;
    this.height = 0;
    this.animationId = null;
    this.isPaused = false;
    this.lastTime = 0;

    this.init();
    this.animate = this.animate.bind(this);
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Initialize Spotlights (Lights)
    // Light 1 - Duration 20s
    this.lights.push({
      duration: 20000,
      startTime: 0,
      opacity: 0.7,
      gradients: [
        { x: 0.2, y: 0.3, radius: 400, color: 'rgba(255, 255, 255, 0.3)' },
        { x: 0.8, y: 0.7, radius: 800, color: 'rgba(233, 41, 118, 0.3)' }
      ],
      // lightMovement1 keyframes logic
      getPosition: (progress) => {
        let tx = 0, ty = 0, scale = 1;
        if (progress < 0.33) {
          const p = progress / 0.33;
          tx = p * 0.15; ty = p * 0.15; scale = 1 + p * 0.25;
        } else if (progress < 0.66) {
          const p = (progress - 0.33) / 0.33;
          tx = 0.15 - p * 0.30; ty = 0.15 - p * 0.30; scale = 1.25 - p * 0.40;
        } else {
          const p = (progress - 0.66) / 0.34;
          tx = -0.15 + p * 0.15; ty = -0.15 + p * 0.15; scale = 0.85 + p * 0.15;
        }
        return { tx, ty, scale };
      }
    });

    // Light 2 - Duration 30s
    this.lights.push({
      duration: 30000,
      startTime: 0,
      opacity: 0.5,
      gradients: [
        { x: 0.6, y: 0.5, radius: 350, color: 'rgba(255, 255, 255, 0.15)' },
        { x: 0.4, y: 0.2, radius: 350, color: 'rgba(194, 24, 91, 0.15)' }
      ],
      // lightMovement2 keyframes logic
      getPosition: (progress) => {
        let tx = 0, ty = 0, scale = 1;
        if (progress < 0.5) {
          const p = progress / 0.5;
          tx = p * 0.25; ty = -p * 0.25; scale = 1 + p * 0.45;
        } else {
          const p = (progress - 0.5) / 0.5;
          tx = 0.25 - p * 0.25; ty = -0.25 + p * 0.25; scale = 1.45 - p * 0.45;
        }
        return { tx, ty, scale };
      }
    });

    // Initialize Dust Particles
    const PARTICLE_COUNT = 100;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        // Randomized slow drift (normalized units per ms)
        // Adjust these values to change the speed of the drift
        vx: (Math.random() - 0.5) * 0.00004, 
        vy: (Math.random() - 0.5) * 0.00004,
        size: 10 + Math.random() * 10,
        blinkDuration: 6000 + Math.random() * 4000,
        blinkDelay: Math.random() * 8000
      });
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    // Support high DPI screens
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
  }

  start() {
    if (this.animationId) return;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame(this.animate);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isPaused = true;
  }

  animate(time) {
    if (this.isPaused) return;

    // Calculate delta time for smooth movement independent of frame rate
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Spotlights
    this.lights.forEach(light => {
      const progress = (time % light.duration) / light.duration;
      const { tx, ty, scale } = light.getPosition(progress);
      
      this.ctx.save();
      this.ctx.globalAlpha = light.opacity;
      
      // We apply the movement to each gradient center
      light.gradients.forEach(g => {
        // Position relative to viewport
        const centerX = (g.x + tx) * this.width;
        const centerY = (g.y + ty) * this.height;
        const radius = g.radius * scale;

        const gradient = this.ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        gradient.addColorStop(0, g.color);
        gradient.addColorStop(0.7, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
      });
      
      this.ctx.restore();
    });

    // Draw Dust Particles
    this.particles.forEach(p => {
      // Update position based on random vector (velocity) and deltaTime
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      // Wrap around screen boundaries (normalized 0 to 1)
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;

      const blinkProgress = ((time + p.blinkDelay) % p.blinkDuration) / p.blinkDuration;
      
      // Blink opacity logic
      let opacity = 0;
      if (blinkProgress < 0.05) {
        opacity = blinkProgress / 0.05;
      } else if (blinkProgress < 0.25) {
        opacity = 1;
      } else if (blinkProgress < 0.50) {
        opacity = 1 - (blinkProgress - 0.25) / 0.25;
      } else {
        opacity = 0;
      }

      if (opacity > 0) {
        const x = p.x * this.width;
        const y = p.y * this.height;
        
        const gradient = this.ctx.createRadialGradient(
          x, y, 0,
          x, y, p.size
        );
        gradient.addColorStop(0, `rgba(251, 244, 254, ${opacity * 0.05})`);
        // gradient.addColorStop(0.7, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    this.animationId = requestAnimationFrame(this.animate);
  }
}

