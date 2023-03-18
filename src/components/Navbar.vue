<template>
    <div class="nav-block">
        <nav 
            class="navbar navbar-expand-lg"
            :class="[`navbar-${theme}`, `bg-${theme}`, 'navbar', 'navbar-expand-lg']"
        >
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li v-for="(particle, index) in particles" class="nav-item" :key="index">
                        <navbar-link
                            :particle="particle"
                            :isActive="activeParticle === index"
                            @click.prevent="navLinkClick(index)">
                        </navbar-link>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
import NavbarLink from './NavbarLink.vue'
export default {
    components: { NavbarLink },
    props:['particles', 'activeParticle', 'navLinkClick'],
    created() {
        this.getThemeSetting()
    },
    data() {
        return {
            theme: 'light'
        }
    },
    methods: {
        changeTheme() {
            let theme = 'light'
            if (this.theme == 'light') {
                theme = 'dark'
            }
            this.theme = theme
            this.storeThemeSetting()
        },
        storeThemeSetting() {
            localStorage.setItem('theme', this.theme)
        },
        getThemeSetting() {
            let theme = localStorage.getItem('theme')
            if (theme) this.theme = theme
        }
    }
}
</script>