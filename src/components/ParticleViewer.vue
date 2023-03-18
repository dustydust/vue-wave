<template>
    <div id="content" class="container">
        <div class="outer">
            <div class="inner">
                <h1>{{ particle.particleTitle }}</h1>
                <p>{{ particle.description }}</p>
                <hr v-if="particle.quote"/>
                <blockquote v-if="particle.quote">{{ particle.quote }}</blockquote>
                <hr v-if="particle.quote"/>
                <p v-if="particle.resume">{{ particle.resume }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        particle: {
            type: Object,
            default(rawProps) {
                return {
                    particleTitle: '',
                    description: ''
                }
            }
        }
    },
    data() {
        return {}
    },
    methods: {}
}
</script>