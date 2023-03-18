<template>
    <div 
        @mousedown.native="menuOpened"
        id="left-block"
    >
        <svg id="context-menu-holder"></svg>
        <header>Particle Wave Geometry</header>
        <gradient-scale></gradient-scale>
        <menu-hint
            :isActive="this.showHint"
        ></menu-hint>
        <div id="render"></div>
    </div>
    <div id="right-block">
        <navbar
            :particles="particles"
            :active-particle="activeParticle"
            :nav-link-click="(index) => this.navBarClick(index)"
        ></navbar>
        <particle-viewer
            :particle="particles[activeParticle]"
        ></particle-viewer>
    </div>
</template>

<script>
    import "snapsvg-cjs";
    import Navbar from './components/Navbar.vue';
    import ParticleViewer from './components/ParticleViewer.vue';
    import GradientScale from './components/GradientScale.vue'
    import MenuHint from './components/MenuHint.vue'
    import { ContextMenu } from './components/RadialMenu';
    import { Render } from './components/Render'

    export default {
        name: 'App',
        components: {
            Navbar,
            GradientScale,
            ParticleViewer,
            MenuHint
        },
        created() {
            this.getParticles()
        },
        mounted() {
            this.render = new Render()
            this.render.animate()
            const contextMenu = new ContextMenu([
                {
                    icon: '_menu_icon__camera',
                    hint: 'Float Camera',
                    action: () => this.render.setCameraFloat()
                }, {
                    icon: '_menu_icon__tail_long',
                    hint: 'Long Tail',
                    action: () => this.render.setLongParticleTail()
                }, {
                    icon: '_menu_icon__tail_small',
                    hint: 'Short Tail',
                    action: () => this.render.setShortParticleTail()
                }, {
                    icon: '_menu_icon__tail_off',
                    hint: 'Hide Tail',
                    action: () => this.render.hideParticleTail()
                }, {
                    icon: '_menu_icon__model_expand',
                    hint: 'Expand',
                    action: () => this.render.expandModel()
                }, {
                    icon: '_menu_icon__model_collapse',
                    hint: 'Collapse',
                    action: () => this.render.collapseModel()
                }
            ])
        },
        data() {
            return {
                activeParticle: 0,
                particles: [],
                showHint: true
            }
        },
        methods: {
            async getParticles() {
                let res = await fetch('particles.json')
                let data = await res.json()
                this.particles = data
            },
            navBarClick(index) {
                this.activeParticle = index
                this.render.clearParticles()
                this.render.setPeriods(this.particles[index].periods)
            },
            menuOpened() {
                this.showHint = false
            }
        },
    }
</script>
