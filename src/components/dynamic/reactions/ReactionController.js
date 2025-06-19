// ReactionController.js - Main controller for reaction system
// 
// 🚨 CRITICAL REQUIREMENT: UNIVERSAL UI
// THE FRONT-END INTERFACE MUST REMAIN IDENTICAL FOR ALL USERS
// - Same buttons, same layout, same controls for everyone
// - Only the shooting effects and visual reactions change based on subscription tier
// - No tier indicators or different UI elements for different users
// - All tier logic handled server-side, UI stays the same
//
// EXAMPLE: 💜 Heart Button
// - Free user clicks 💜 → basic heart flies up
// - VIP user clicks 💜 → holographic heart with particles flies up
// - SAME BUTTON, DIFFERENT MAGIC AFTER THE CLICK
//
import { KnobController } from './KnobController.js';
import { ReactionEngine } from './ReactionEngine.js';
import { HologramEngine } from './HologramEngine.js';

export class ReactionController {
    constructor() {
        this.reactionEngine = null;
        this.hologramEngine = null;
        this.knobs = {};
        this.initialized = false;
        
        // Theme configurations
        this.themes = {
            jp: {
                emojis: ['🗾', '🍙', '🍣', '🍱', '⛩️', '🌸', '🗻', '🎌'],
                colors: ['#FF0066', '#FF1493', '#FF69B4', '#FFC0CB'],
                names: ['Tokyo_Drift', 'Sakura_San', 'Ninja_Master', 'Kawaii_King']
            },
            sf: {
                emojis: ['🌉', '🚋', '🌁', '🦭', '💻', '🌊', '☕', '🏳️‍🌈'],
                colors: ['#00CED1', '#4682B4', '#1E90FF', '#87CEEB'],
                names: ['GoldenGate_Guru', 'Tech_Titan', 'Bay_Boss', 'Fog_Fighter']
            },
            work: {
                emojis: ['💻', '📊', '💼', '📈', '🚀', '💡', '⚡', '🔥'],
                colors: ['#00FF00', '#32CD32', '#7FFF00', '#ADFF2F'],
                names: ['Code_Crusher', 'Data_Demon', 'Sprint_King', 'Bug_Buster']
            },
            pride: {
                emojis: ['🏳️‍🌈', '❤️', '🧡', '💛', '💚', '💙', '💜', '🏳️‍⚧️'],
                colors: ['#E40303', '#FF8C00', '#FFED00', '#008026', '#24408E', '#732982'],
                names: ['Pride_Power', 'Love_Leader', 'Rainbow_Ruler', 'Unity_Ultra']
            }
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Wait for DOM
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Setup canvases
            const reactionCanvas = document.getElementById('reactionCanvas');
            const hologramCanvas = document.getElementById('hologramCanvas');
            
            if (!reactionCanvas || !hologramCanvas) {
                throw new Error('Required canvases not found');
            }
            
            this.resizeCanvases();
            window.addEventListener('resize', () => this.resizeCanvases());
            
            // Initialize engines
            this.reactionEngine = new ReactionEngine(reactionCanvas);
            this.hologramEngine = new HologramEngine(hologramCanvas);
            
            // Connect engines
            this.reactionEngine.onScreenShake = (intensity) => this.screenShake(intensity);
            this.reactionEngine.onScreenFlash = (color, opacity) => this.screenFlash(color, opacity);
            this.reactionEngine.onCreateHologram = (username, x, y) => {
                const theme = this.detectTheme(username);
                this.hologramEngine.createHologram(username, x, y, theme);
            };
            
            // Start engines
            this.reactionEngine.start();
            this.hologramEngine.start();
            
            // Setup UI
            this.setupReactionButtons();
            this.setupKnobs();
            
            // Setup global API
            window.magicalReaction = {
                shoot: (content, type, value = 0) => this.sendReaction(content, type, value),
                shootTheme: (theme) => this.shootThemeReaction(theme),
                updateConfig: (config) => this.updateConfig(config),
                clear: () => this.clear(),
                getStats: () => this.getStats()
            };
            
            this.initialized = true;
            console.log('✨ Magical Reaction System initialized!');
            console.log('📝 Use window.magicalReaction API to control reactions');
            
        } catch (error) {
            console.error('Failed to initialize:', error);
        }
    }
    
    resizeCanvases() {
        const canvases = ['reactionCanvas', 'hologramCanvas'];
        canvases.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        });
    }
    
    setupReactionButtons() {
        const buttons = document.querySelectorAll('.reaction-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const type = button.dataset.type;
                const value = parseInt(button.dataset.value) || 0;
                let content;
                
                if (type === 'money') {
                    content = `$${value}`;
                } else if (button.dataset.theme) {
                    this.shootThemeReaction(button.dataset.theme);
                    return;
                } else {
                    content = button.dataset.emoji || '✨';
                }
                
                this.sendReaction(content, type, value);
                
                // Button animation
                button.classList.add('clicked');
                setTimeout(() => button.classList.remove('clicked'), 200);
            });
        });
    }
    
    setupKnobs() {
        // Intensity Knob
        const intensityKnob = document.getElementById('intensityKnob');
        if (intensityKnob) {
            this.knobs.intensity = new KnobController(intensityKnob, {
                sensitivity: 0.5,
                inertia: 0.92,
                onChange: (value) => {
                    this.reactionEngine.updateConfig({ particleIntensity: value });
                    this.updateEffectsStatus();
                }
            });
        }
        
        // Speed Knob
        const speedKnob = document.getElementById('speedKnob');
        if (speedKnob) {
            this.knobs.speed = new KnobController(speedKnob, {
                sensitivity: 0.6,
                inertia: 0.90,
                onChange: (value) => {
                    this.reactionEngine.updateConfig({ animationSpeed: value });
                    this.updateEffectsStatus();
                }
            });
        }
        
        // Shake Knob
        const shakeKnob = document.getElementById('shakeKnob');
        if (shakeKnob) {
            this.knobs.shake = new KnobController(shakeKnob, {
                sensitivity: 0.4,
                snapToStep: true,
                onChange: (value) => {
                    this.reactionEngine.updateConfig({ screenShake: value });
                    this.updateEffectsStatus();
                }
            });
        }
        
        // Magic Level Knob
        const magicKnob = document.getElementById('magicKnob');
        if (magicKnob) {
            this.knobs.magic = new KnobController(magicKnob, {
                sensitivity: 0.3,
                snapToStep: true,
                onChange: (value) => {
                    this.reactionEngine.updateConfig({ magicLevel: value });
                    this.updateEffectsStatus();
                }
            });
        }
    }
    
    updateEffectsStatus() {
        const status = document.getElementById('effectsStatus');
        if (!status || !this.reactionEngine) return;
        
        const config = this.reactionEngine.config;
        let messages = [];
        
        if (config.particleIntensity > 2.5) messages.push('🔥 MAX INTENSITY!');
        if (config.animationSpeed > 1.5) messages.push('⚡ HYPER SPEED!');
        if (config.screenShake > 40) messages.push('🌪️ MEGA SHAKE!');
        if (config.magicLevel > 8) messages.push('✨ ULTIMATE MAGIC!');
        
        status.textContent = messages.length > 0 ? 
            messages.join(' ') : 
            'Adjust knobs to control the magic! ✨';
    }
    
    sendReaction(content, type, value) {
        if (!this.initialized) return;
        
        const x = window.innerWidth / 2 + (Math.random() - 0.5) * 300;
        const y = window.innerHeight - 120;
        
        const config = {
            x: x,
            y: y,
            content: content,
            type: type,
            value: value,
            color: this.getReactionColor(type)
        };
        
        this.reactionEngine.addReaction(config);
    }
    
    shootThemeReaction(themeName) {
        if (!this.initialized) return;
        
        const theme = this.themes[themeName];
        if (!theme) return;
        
        // Shoot multiple themed reactions
        const count = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const emoji = theme.emojis[Math.floor(Math.random() * theme.emojis.length)];
                const color = theme.colors[Math.floor(Math.random() * theme.colors.length)];
                const value = 10 + Math.floor(Math.random() * 40);
                
                const x = window.innerWidth / 2 + (Math.random() - 0.5) * 400;
                const y = window.innerHeight - 120;
                
                this.reactionEngine.addReaction({
                    x: x,
                    y: y,
                    content: emoji,
                    type: themeName,
                    value: value,
                    color: color
                });
            }, i * 150);
        }
    }
    
    detectTheme(username) {
        const lower = username.toLowerCase();
        if (lower.includes('jp') || lower.includes('tokyo') || lower.includes('sakura')) return 'jp';
        if (lower.includes('sf') || lower.includes('bay') || lower.includes('golden')) return 'sf';
        if (lower.includes('work') || lower.includes('code') || lower.includes('data')) return 'work';
        if (lower.includes('pride') || lower.includes('love') || lower.includes('rainbow')) return 'pride';
        return 'default';
    }
    
    getReactionColor(type) {
        const colors = {
            love: '#ff006e',
            fire: '#ff6b35',
            money: '#ffd700',
            jp: '#FF0066',
            sf: '#00CED1',
            work: '#00FF00',
            pride: '#FFD700',
            default: '#ffffff'
        };
        return colors[type] || colors.default;
    }
    
    screenShake(intensity) {
        const container = document.querySelector('.magical-reaction-container');
        if (!container) return;
        
        let shakeTime = 0;
        const maxShakes = Math.min(Math.floor(intensity / 2), 20);
        
        const shake = () => {
            if (shakeTime < maxShakes) {
                const x = (Math.random() - 0.5) * intensity * 0.5;
                const y = (Math.random() - 0.5) * intensity * 0.5;
                const rotate = (Math.random() - 0.5) * intensity * 0.02;
                
                container.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
                shakeTime++;
                requestAnimationFrame(shake);
            } else {
                container.style.transform = 'translate(0, 0) rotate(0)';
            }
        };
        
        shake();
    }
    
    screenFlash(color, opacity) {
        const container = document.querySelector('.magical-reaction-container');
        if (!container) return;
        
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: ${color};
            opacity: ${opacity};
            pointer-events: none;
            z-index: 9998;
            mix-blend-mode: screen;
        `;
        
        container.appendChild(flash);
        
        // Fade out
        setTimeout(() => {
            flash.style.transition = 'opacity 0.5s ease-out';
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 500);
        }, 50);
    }
    
    updateConfig(config) {
        if (this.reactionEngine) {
            this.reactionEngine.updateConfig(config);
        }
    }
    
    clear() {
        if (this.hologramEngine) {
            this.hologramEngine.clear();
        }
    }
    
    getStats() {
        if (!this.reactionEngine) return null;
        
        return {
            activeReactions: this.reactionEngine.activeReactions.size,
            activeParticles: this.reactionEngine.activeParticles.size,
            activeHolograms: this.hologramEngine ? this.hologramEngine.holograms.size : 0,
            config: this.reactionEngine.config
        };
    }
    
    destroy() {
        // Stop engines
        if (this.reactionEngine) {
            this.reactionEngine.stop();
        }
        if (this.hologramEngine) {
            this.hologramEngine.stop();
        }
        
        // Destroy knobs
        Object.values(this.knobs).forEach(knob => {
            if (knob && knob.destroy) {
                knob.destroy();
            }
        });
        
        // Remove global API
        delete window.magicalReaction;
        
        this.initialized = false;
    }
}
