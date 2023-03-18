<template>
    <a 
        class="nav-link"
        :class="activeClasses"
        :href="particle.link.url"
        :title="`This link goes to the ${particle.link.text} particle`"
    ><u>{{ particle.link.text.charAt(0) }}</u>{{ particle.link.text.substr(1) }}</a>
</template>

<script>
    export default {
        props: ['particle', 'isActive'],
        computed: {
            activeClasses() {
                return {
                    active: this.isActive,
                    emphasize: this.isActive
                }
            }
        }
    }
</script>

<style scoped>
</style>