// HologramEngine.js - Fast holographic name display engine
export class HologramEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: true });
        this.holograms = new Map();
        this.particlePool = [];
        this.maxParticles = 500;
        this.animationId = null;
        
        // Hologram colors for different themes
        this.themeColors = {
            jp: '#FF0066',      // Hot pink
            sf: '#00CED1',      // Dark turquoise  
            work: '#00FF00',    // Lime green
            pride: '#FFD700',   // Gold
            default: '#00FFFF'  // Cyan
        };
        
        this.initializeParticlePool();
    }
    
    initializeParticlePool() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particlePool.push({
                active: false,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                life: 1,
                decay: 0.01,
                color: '#00FFFF',
                size: 1
            });
        }
    }
    
    getParticle() {
        for (const particle of this.particlePool) {
            if (!particle.active) {
                particle.active = true;
                return particle;
            }
        }
        return null;
    }
    
    returnParticle(particle) {
        particle.active = false;
    }
    
    createHologram(username, x, y, theme = 'default') {
        const id = Date.now() + Math.random();
        const color = this.themeColors[theme] || this.themeColors.default;
        
        const hologram = {
            id,
            username,
            x,
            y,
            color,
            opacity: 0,
            phase: 'materializing',
            scanLines: [],
            particles: [],
            life: 1,
            size: 0,
            targetSize: 24,
            rotation: 0,
            glitchOffset: 0,
            glitchIntensity: 1,
            waveOffset: 0
        };
        
        // Create scan lines
        for (let i = 0; i < 8; i++) {
            hologram.scanLines.push({
                offset: i * 12,
                speed: 1 + Math.random() * 2,
                opacity: 0.3 + Math.random() * 0.4,
                width: 1 + Math.random()
            });
        }
        
        // Create initial particles
        for (let i = 0; i < 40; i++) {
            const particle = this.getParticle();
            if (particle) {
                Object.assign(particle, {
                    x: x + (Math.random() - 0.5) * 100,
                    y: y + (Math.random() - 0.5) * 100,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    life: 1,
                    decay: 0.015,
                    color: hologram.color,
                    size: Math.random() * 2 + 0.5
                });
                hologram.particles.push(particle);
            }
        }
        
        this.holograms.set(id, hologram);
        return id;
    }
    
    updateHologram(hologram) {
        switch (hologram.phase) {
            case 'materializing':
                hologram.opacity = Math.min(1, hologram.opacity + 0.08);
                hologram.size = Math.min(hologram.targetSize, hologram.size + 1.5);
                hologram.glitchIntensity = 2 - hologram.opacity;
                hologram.glitchOffset = Math.sin(Date.now() * 0.02) * 8 * hologram.glitchIntensity;
                
                if (hologram.opacity >= 1) {
                    hologram.phase = 'stable';
                    setTimeout(() => {
                        if (hologram.phase === 'stable') {
                            hologram.phase = 'fading';
                        }
                    }, 2500);
                }
                break;
                
            case 'stable':
                hologram.rotation += 0.015;
                hologram.glitchOffset = Math.sin(Date.now() * 0.03) * 2;
                hologram.waveOffset = Math.sin(Date.now() * 0.002) * 5;
                break;
                
            case 'fading':
                hologram.opacity = Math.max(0, hologram.opacity - 0.04);
                hologram.size = Math.max(0, hologram.size - 0.8);
                hologram.glitchIntensity = 2 - hologram.opacity;
                
                if (hologram.opacity <= 0) {
                    // Return particles to pool
                    hologram.particles.forEach(p => this.returnParticle(p));
                    this.holograms.delete(hologram.id);
                    return;
                }
                break;
        }
        
        // Update scan lines
        hologram.scanLines.forEach(line => {
            line.offset += line.speed;
            if (line.offset > 100) {
                line.offset = -100;
            }
        });
        
        // Update particles
        hologram.particles = hologram.particles.filter(particle => {
            if (!particle.active) return false;
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            // Add some drift
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;
            
            if (particle.life <= 0) {
                this.returnParticle(particle);
                return false;
            }
            
            return true;
        });
        
        // Occasionally add new particles
        if (Math.random() < 0.3 && hologram.phase !== 'fading') {
            const particle = this.getParticle();
            if (particle) {
                Object.assign(particle, {
                    x: hologram.x + (Math.random() - 0.5) * 50,
                    y: hologram.y + (Math.random() - 0.5) * 50,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -Math.random() * 3,
                    life: 1,
                    decay: 0.02,
                    color: hologram.color,
                    size: Math.random() * 1.5 + 0.5
                });
                hologram.particles.push(particle);
            }
        }
    }
    
    drawHologram(hologram) {
        this.ctx.save();
        this.ctx.globalAlpha = hologram.opacity;
        
        // Draw particles
        hologram.particles.forEach(particle => {
            if (!particle.active) return;
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.life * hologram.opacity * 0.8;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Draw scan lines
        const scanlineArea = 120;
        hologram.scanLines.forEach(line => {
            this.ctx.save();
            this.ctx.globalAlpha = line.opacity * hologram.opacity * 0.5;
            
            const gradient = this.ctx.createLinearGradient(
                hologram.x - scanlineArea, 
                hologram.y - scanlineArea + line.offset,
                hologram.x + scanlineArea, 
                hologram.y - scanlineArea + line.offset
            );
            
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.5, hologram.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = line.width;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = hologram.color;
            
            this.ctx.beginPath();
            this.ctx.moveTo(hologram.x - scanlineArea, hologram.y - scanlineArea + line.offset);
            this.ctx.lineTo(hologram.x + scanlineArea, hologram.y - scanlineArea + line.offset);
            this.ctx.stroke();
            this.ctx.restore();
        });
        
        // Draw holographic text
        this.ctx.save();
        this.ctx.translate(
            hologram.x + hologram.glitchOffset + hologram.waveOffset, 
            hologram.y
        );
        this.ctx.rotate(hologram.rotation);
        
        // Draw multiple layers for holographic effect
        const layers = [
            { offset: 2, color: '#FF0066', alpha: 0.3 },
            { offset: -2, color: '#00FFFF', alpha: 0.3 },
            { offset: 0, color: hologram.color, alpha: 1 }
        ];
        
        layers.forEach(layer => {
            this.ctx.save();
            this.ctx.translate(layer.offset * hologram.glitchIntensity, 0);
            this.ctx.font = `bold ${hologram.size}px 'Courier New', monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = layer.color;
            this.ctx.globalAlpha = layer.alpha * hologram.opacity;
            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = layer.color;
            
            this.ctx.fillText(hologram.username.toUpperCase(), 0, 0);
            this.ctx.restore();
        });
        
        this.ctx.restore();
        this.ctx.restore();
    }
    
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const hologram of this.holograms.values()) {
            this.updateHologram(hologram);
            this.drawHologram(hologram);
        }
    }
    
    start() {
        let lastTime = 0;
        const targetFPS = 60;
        const frameTime = 1000 / targetFPS;
        
        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime >= frameTime) {
                this.update();
                lastTime = currentTime - (deltaTime % frameTime);
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    clear() {
        for (const hologram of this.holograms.values()) {
            hologram.particles.forEach(p => this.returnParticle(p));
        }
        this.holograms.clear();
    }
}
