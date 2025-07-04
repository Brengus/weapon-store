<script setup>
import scapinoLogo from "../public/scapino.png";
import americaTodayLogo from "../public/america.png";
import nelsonLogo from "../public/nelson.png";
import msmodeLogo from "../public/msmode.png";
import e5Logo from "../public/e5.png";
</script>
<template>
  <div class="logos-slide">
    <img :src="scapinoLogo" alt="Scapino logo" />
    <img :src="americaTodayLogo" alt="America Today logo" />
    <img :src="nelsonLogo" alt="Nelson logo" />
    <img :src="msmodeLogo" alt="MS Mode logo" />
    <img :src="e5Logo" alt="e5 logo" />
  </div>
</template>
<style scoped>
.logos-slide img{
    height:50px;
    vertical-align:middle;
    margin:15px 30px;
}
</style>
