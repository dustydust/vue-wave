<template>
    <div :class="activeClasses" id="menu-hint">
       Please, hold left mouse to show a context menu...
    </div>
</template>

<script>
    export default {
        props: ['isActive'],
        computed: {
            activeClasses() {
                return {
                    active: this.isActive
                }
            }
        }
    }
</script>