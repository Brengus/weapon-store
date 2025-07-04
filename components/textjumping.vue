<script setup>
import { SplitText } from 'gsap/all';
import {gsap,ScrollTrigger} from 'gsap/all';
gsap.registerPlugin(ScrollTrigger,SplitText);
const sectionRef = ref(null);

onMounted(()=>{
    const splitWeCreate = SplitText.create(".we-create");
    const nextGen = SplitText.create(".next-gen",{
        type:"words",
    });


    const tl= gsap.timeline({
        scrollTrigger:{
            trigger: sectionRef.value,
            start:"top top",
            end: "bottom bottom",
            scrub:1,
            pin:true,
            markers:true
        }
    })

    tl.from(splitWeCreate.chars,{
        y:100,
        autoAlpha:0,
        stagger:0.1
    })
    .from(nextGen.words,{
        y:100,
        autoAlpha:0,
        stagger:0.1
    })
})
</script>

<template>
    <div ref="sectionRef" class="main">
        <div  class="main-section">
            <div class="we-create letter">WE CREATE</div>
            <div class="flex-space-around">
                <div class="letter next-gen">THE NEXT GENERATION OF ENTERTAINMENT WITH CREATORS</div>
            </div>            
        </div>
    </div>
</template>
<style scoped>
.flex-space-around{
    display:flex;
    justify-content:space-around;
}
.next-gen{
    width:45%;
}
.main{
    min-height:300vh;
    position:relative;
    top:60px;
    z-index:100000;
}
.main-section{
    height:300vh;
    position:sticky;
    width:100%;
}
.we-create{
    position:relative;
    top:10vh;
    display:flex;
    justify-content: space-around;
    color:white;
}
.letter{
    color:white;
    font-size: 72px;
}
.next-gen{
    position:relative;
    top:10vh;
}
</style>