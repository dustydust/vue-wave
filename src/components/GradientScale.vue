<template>
    <div id="gradient">
            <div class="text">meV -</div>
            <div class="container">
                <div class="gradient-1"><div class="text">-15</div></div>
                <div class="gradient-1-1"><div class="text">-10</div></div>
                <div class="gradient-2"><div class="text">-5</div></div>
                <div class="gradient-2-1"><div class="text">-3</div></div>
                <div class="gradient-3"><div class="text">0</div></div>
                <div class="gradient-3-1"><div class="text">1</div></div>
                <div class="gradient-4"><div class="text">3</div></div>
                <div class="gradient-4-1"><div class="text">5</div></div>
                <div class="gradient-5"><div class="text">10</div></div>
                <div class="gradient-5-1"><div class="text">15</div></div>
            </div>
            <div class="text">meV +</div>
        </div>
</template>

<script>
export default {
    props: {
        page: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {}
    },
    methods: {}
}
</script>