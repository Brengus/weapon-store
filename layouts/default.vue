<template>
    <div style="background:black">
        <AppHeader/>
        <div class="position">
            <slot />
        </div>

        <AppFooter/>
        <SmallFooter/>
    </div>
</template>
<style scoped>
.position{
    position:relative;
    top:60px;
}
</style>