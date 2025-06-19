// ReactionEngine.js - Optimized fast reaction engine
export class ReactionEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false });
        
        // Object pools for performance
        this.reactionPool = [];
        this.particlePool = [];
        this.activeReactions = new Set();
        this.activeParticles = new Set();
        
        // Performance settings
        this.maxReactions = 50;
        this.maxParticles = 1000;
        this.particleBatchSize = 100;
        
        // Configuration
        this.config = {
            particleIntensity: 1,
            screenShake: 20,
            animationSpeed: 1,
            magicLevel: 5,
            quality: 'high' // 'low', 'medium', 'high'
        };
        
        // Callbacks
        this.onScreenShake = null;
        this.onScreenFlash = null;
        this.onCreateHologram = null;
        
        // Pride flag colors
        this.prideColors = [
            '#E40303', '#FF8C00', '#FFED00', '#008026', '#24408E', '#732982'
        ];
        
        // JP/SF themed emojis
        this.themes = {
            jp: ['🗾', '🍙', '🍣', '🍱', '⛩️', '🌸', '🗻', '🎌'],
            sf: ['🌉', '🚋', '🌁', '🦭', '🏳️‍🌈', '💻', '🌊', '☕'],
            work: ['💻', '📊', '💼', '📈', '🚀', '💡', '⚡', '🔥'],
            pride: ['🏳️‍🌈', '❤️', '🧡', '💛', '💚', '💙', '💜', '🏳️‍⚧️']
        };
        
        this.initializeObjectPools();
        this.setupOptimizations();
    }
    
    initializeObjectPools() {
        // Pre-allocate reaction objects
        for (let i = 0; i < this.maxReactions; i++) {
            this.reactionPool.push(this.createReactionObject());
        }
        
        // Pre-allocate particle objects
        for (let i = 0; i < this.maxParticles; i++) {
            this.particlePool.push(this.createParticleObject());
        }
    }
    
    createReactionObject() {
        return {
            active: false,
            id: 0,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            content: '',
            type: '',
            value: 0,
            size: 35,
            rotation: 0,
            rotationSpeed: 0,
            opacity: 1,
            bounces: 0,
            maxBounces: 3,
            trail: [],
            color: '#fff',
            intensity: 1,
            phase: 'rising',
            glow: 0
        };
    }
    
    createParticleObject() {
        return {
            active: false,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            size: 1,
            color: '#fff',
            life: 1,
            decay: 0.01,
            gravity: 0,
            sparkle: false,
            glow: 0
        };
    }
    
    setupOptimizations() {
        // Use will-change for better GPU performance
        this.canvas.style.willChange = 'transform';
        
        // Disable image smoothing for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        
        // Setup render batching
        this.renderBatch = {
            particles: [],
            reactions: []
        };
    }
    
    getFromPool(pool, activeSet) {
        for (const obj of pool) {
            if (!obj.active) {
                obj.active = true;
                activeSet.add(obj);
                return obj;
            }
        }
        return null;
    }
    
    returnToPool(obj, activeSet) {
        obj.active = false;
        activeSet.delete(obj);
    }
    
    addReaction(config) {
        const reaction = this.getFromPool(this.reactionPool, this.activeReactions);
        if (!reaction) return null;
        
        // Reset and configure reaction
        Object.assign(reaction, {
            id: Date.now() + Math.random(),
            x: config.x,
            y: config.y,
            vx: (Math.random() - 0.5) * 8,
            vy: -40 - Math.random() * 25 - (config.value * 1.5),
            content: config.content,
            type: config.type,
            value: config.value || 0,
            size: this.calculateSize(config),
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.4,
            opacity: 1,
            bounces: 0,
            maxBounces: 2 + Math.floor(config.value / 10),
            trail: [],
            color: config.color,
            intensity: (1 + (config.value / 15)) * this.config.particleIntensity,
            phase: 'rising',
            glow: config.value >= 10 ? 20 + config.value : 0
        });
        
        this.createLaunchEffects(reaction);
        return reaction.id;
    }
    
    calculateSize(config) {
        const baseSize = 40;
        if (config.type === 'money') {
            return baseSize + (config.value * 0.7);
        } else if (config.type === 'pride') {
            return baseSize * 1.5;
        }
        return baseSize + (config.value * 0.4);
    }
    
    createLaunchEffects(reaction) {
        const particleCount = Math.min(30 * reaction.intensity, 100);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.getFromPool(this.particlePool, this.activeParticles);
            if (!particle) break;
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 5 + Math.random() * 10;
            
            Object.assign(particle, {
                x: reaction.x,
                y: reaction.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 5,
                size: Math.random() * 3 + 1,
                color: reaction.type === 'pride' ? 
                    this.prideColors[i % this.prideColors.length] : 
                    reaction.color,
                life: 1,
                decay: 0.02,
                gravity: 0.2,
                sparkle: true,
                glow: 10
            });
        }
        
        // Trigger effects based on value
        if (reaction.value >= 50) {
            this.triggerScreenShake(35);
            this.triggerScreenFlash('#FFD700', 0.8);
        } else if (reaction.value >= 20) {
            this.triggerScreenShake(25);
            this.triggerScreenFlash(reaction.color, 0.6);
        } else if (reaction.value >= 10) {
            this.triggerScreenShake(15);
        }
    }
    
    updateReaction(reaction) {
        // Update physics
        reaction.vy += 0.5 * this.config.animationSpeed;
        reaction.x += reaction.vx * this.config.animationSpeed;
        reaction.y += reaction.vy * this.config.animationSpeed;
        reaction.rotation += reaction.rotationSpeed * this.config.animationSpeed;
        
        // Ceiling bounce
        if (reaction.y <= 60 && reaction.phase === 'rising') {
            reaction.y = 60;
            reaction.vy = Math.abs(reaction.vy) * 0.6;
            reaction.bounces++;
            reaction.phase = 'falling';
            this.onCeilingHit(reaction);
        }
        
        // Wall bounce
        if (reaction.x <= 20 || reaction.x >= this.canvas.width - 20) {
            reaction.vx = -reaction.vx * 0.8;
            reaction.x = reaction.x <= 20 ? 20 : this.canvas.width - 20;
        }
        
        // Check if should remove
        if (reaction.y > this.canvas.height || reaction.bounces > reaction.maxBounces) {
            this.createFinalExplosion(reaction);
            this.returnToPool(reaction, this.activeReactions);
        }
    }
    
    updateParticle(particle) {
        particle.x += particle.vx * this.config.animationSpeed;
        particle.y += particle.vy * this.config.animationSpeed;
        particle.life -= particle.decay * this.config.animationSpeed;
        
        if (particle.gravity) {
            particle.vy += particle.gravity * this.config.animationSpeed;
        }
        
        if (particle.life <= 0) {
            this.returnToPool(particle, this.activeParticles);
        }
    }
    
    onCeilingHit(reaction) {
        // Create explosion based on value
        const explosionSize = 20 + reaction.value;
        
        for (let i = 0; i < explosionSize; i++) {
            const particle = this.getFromPool(this.particlePool, this.activeParticles);
            if (!particle) break;
            
            const angle = (Math.PI * 2 * i) / explosionSize;
            const speed = 3 + Math.random() * 5;
            
            Object.assign(particle, {
                x: reaction.x,
                y: reaction.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 2,
                color: reaction.type === 'pride' ? 
                    this.prideColors[Math.floor(Math.random() * this.prideColors.length)] : 
                    reaction.color,
                life: 1,
                decay: 0.015,
                gravity: 0.1,
                sparkle: true,
                glow: 12
            });
        }
        
        // Trigger hologram for high value reactions
        if (reaction.value >= 20 && this.onCreateHologram) {
            const names = ['JP_Master', 'SF_Local', 'WorkHard_Pro', 'Pride_Power'];
            this.onCreateHologram(names[Math.floor(Math.random() * names.length)], reaction.x, reaction.y);
        }
    }
    
    createFinalExplosion(reaction) {
        const particleCount = Math.min(50 * reaction.intensity, 150);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.getFromPool(this.particlePool, this.activeParticles);
            if (!particle) break;
            
            Object.assign(particle, {
                x: reaction.x,
                y: reaction.y,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                size: Math.random() * 4 + 1,
                color: reaction.color,
                life: 1,
                decay: 0.02,
                gravity: 0.3,
                sparkle: true,
                glow: 15
            });
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Batch render particles
        this.ctx.save();
        for (const particle of this.activeParticles) {
            if (!particle.active) continue;
            
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            
            if (particle.sparkle && this.config.quality !== 'low') {
                this.ctx.shadowBlur = particle.glow;
                this.ctx.shadowColor = particle.color;
            }
            
            this.ctx.fillRect(
                particle.x - particle.size/2, 
                particle.y - particle.size/2, 
                particle.size, 
                particle.size
            );
        }
        this.ctx.restore();
        
        // Draw reactions
        for (const reaction of this.activeReactions) {
            if (!reaction.active) continue;
            
            this.ctx.save();
            this.ctx.translate(reaction.x, reaction.y);
            this.ctx.rotate(reaction.rotation);
            this.ctx.globalAlpha = reaction.opacity;
            
            if (reaction.glow && this.config.quality !== 'low') {
                this.ctx.shadowBlur = reaction.glow;
                this.ctx.shadowColor = reaction.color;
            }
            
            // Draw content based on type
            if (reaction.type === 'money') {
                this.drawMoneyBill(reaction);
            } else if (reaction.type === 'pride') {
                this.drawPrideFlag(reaction);
            } else {
                this.ctx.font = `bold ${reaction.size}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillStyle = reaction.color;
                this.ctx.fillText(reaction.content, 0, 0);
            }
            
            this.ctx.restore();
        }
    }
    
    drawMoneyBill(reaction) {
        const width = reaction.size * 1.8;
        const height = reaction.size * 0.9;
        
        this.ctx.fillStyle = reaction.value >= 50 ? '#FFD700' : '#228B22';
        this.ctx.fillRect(-width/2, -height/2, width, height);
        
        this.ctx.fillStyle = reaction.value >= 50 ? '#000' : '#FFF';
        this.ctx.font = `bold ${reaction.size * 0.4}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`$${reaction.value}`, 0, 0);
    }
    
    drawPrideFlag(reaction) {
        const width = reaction.size * 1.5;
        const height = reaction.size;
        const stripeHeight = height / this.prideColors.length;
        
        this.prideColors.forEach((color, i) => {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(
                -width/2, 
                -height/2 + i * stripeHeight, 
                width, 
                stripeHeight
            );
        });
    }
    
    update() {
        // Update all active reactions
        for (const reaction of this.activeReactions) {
            if (reaction.active) {
                this.updateReaction(reaction);
            }
        }
        
        // Update all active particles
        for (const particle of this.activeParticles) {
            if (particle.active) {
                this.updateParticle(particle);
            }
        }
        
        this.draw();
    }
    
    triggerScreenShake(intensity) {
        if (this.onScreenShake) {
            this.onScreenShake(intensity * (this.config.screenShake / 20));
        }
    }
    
    triggerScreenFlash(color, opacity) {
        if (this.onScreenFlash) {
            this.onScreenFlash(color, opacity);
        }
    }
    
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
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
}
