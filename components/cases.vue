<script setup>
    const i = ref(0);
    const texts = [`“At our company, responding to the local demand of our customers is a top priority. However, with so many variables to consider, it became impossible to manually analyze everything in detail. Thunderstock now takes care of this for us.”`,
    `“Through better use of historical and current data in Thunderstock, we realize an optimal allocation for all channels (brick stores and online shops). But it also let's us replenish based on sales potential, this minimizes missed sales and improves margin”` 
]
const intervalId = ref(null);

onMounted(()=>{
    intervalId.value = setInterval(()=>{
        i.value = (i.value + 1)%texts.length
    },5000)
})
onUnmounted(()=>{
    clearInterval(intervalId);
})

const sliderTransformStyle = computed(()=>{
    return{
        transform: `translateX(-${i.value * 900}px)`
    }
})
</script>
<template>
    <div class="white-background">
        <div class="row">
            <div class="clients">
                <div class="small-title">What our clients say</div>
                <div class="slider">
                    <div class="text-wrapper" :style="sliderTransformStyle">
                        <div class="text-style" v-for="(text, index) in texts" :key="index">
                        {{ text }}
                        </div>
                    </div>
                </div>
                <div class="container-style">
                    <div class="logos">
                        <logosSlide />
                        <logosSlide />
                        <logosSlide />
                    </div>
                </div>
                <div style="display: flex; justify-content: space-around;">
                    <div class="button-roi">Cases & ROI</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.button-roi{
    padding:10px 20px;
    border:1px solid black;
    width:100px;
    display:flex;
    justify-content: space-around;
    border-radius:5px;
    background-color:white;
    cursor:pointer;
}
.text-wrapper {
    display: flex;
    transition: transform 2s ease-in-out;
}
.container-style {
    width: 900px;
    overflow: hidden;
    padding:30px 0;
}

.logos{
    display:flex;
    white-space: nowrap;
    animation: slide 15s linear infinite;
}

@keyframes slide{
    0%{
        transform: translateX(100%);
    }
    100%{
        transform: translateX(0%);
    }
}

.slider{
    width:900px;
    font-size:28px;
    text-align:center;
    font-weight:500;
    display:flex;
    padding-bottom:40px;
    overflow:hidden;
}

.text-style{
    min-width:900px;
    max-height:100px;
}
.row{
    display:flex;
    justify-content:center;
}
.clients{
    display:flex;
    flex-direction:column;
}
.small-title{
    padding: 90px 0 30px 0;
    color:rgb(255, 152, 0);
    font-weight: bold;
    text-align:center;
}
.white-background{
    background-color: #FAFAFA;
    width:100%;
    position:relative;
    height:600px;
}
</style>