<script setup>
import { gsap,Draggable } from 'gsap/all';

gsap.registerPlugin(Draggable);

const sceneRef = ref(null);
const cubeRef = ref(null);

onMounted(()=>{
  let rotationX = -30;
  let rotationY = -45;

  Draggable.create(cubeRef.value,{
    type: "x,y",
    onDrag:function(){
      rotationX += this.deltaY * 0.5;
      rotationY += this.deltaX * 0.5;

      gsap.to(cubeRef.value,{
        duration:0.5,
        rotationX:rotationX,
        rotationY: rotationY,
        ease: 'power2.out'
      })
    },
    inertia:true
  })
})

</script>
<template>
  <div>

  
  <div ref="sceneRef" class="scene">
      <div ref="cubeRef" class="cube">
        <div class="cube__face cube__face--front">
          <img src="https://picsum.photos/id/237/200/200" alt="Dog">
        </div>
        <div class="cube__face cube__face--back">
          <img src="https://picsum.photos/id/238/200/200" alt="Mountain">
        </div>
        <div class="cube__face cube__face--right">
          <img src="https://picsum.photos/id/239/200/200" alt="Flower">
        </div>
        <div class="cube__face cube__face--left">
          <img src="https://picsum.photos/id/240/200/200" alt="City">
        </div>
        <div class="cube__face cube__face--top">
          <img src="https://picsum.photos/id/241/200/200" alt="Bird">
        </div>
        <div class="cube__face cube__face--bottom">
          <img src="https://picsum.photos/id/242/200/200" alt="Road">
        </div>
      </div>
    </div>
    <japanese/>
    <textjumping/>

  </div>
</template>
<style scoped>
.scene{
  --cube-size:400px;
  background: white;
  width:100%;
  height:80vh;
  perspective:1000px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  cursor:grab;
}

.cube{
  position:relative;
  width:var(--cube-size);
  height:var(--cube-size);
  transform-style: preserve-3d;
  transform: translateZ(calc(var(--cube-size) * -0.5)) rotateX(-30deg) rotateY(-45deg);
}

.cube__face{
  position:absolute;
  width:var(--cube-size);
  height:var(--cube-size);
  backface-visibility: hidden;
}

.cube__face img{
  width:100%;
  height:100%;
  object-fit: cover;
}

.cube__face--front{transform:rotateY(0deg) translateZ(calc(var(--cube-size)/2))}
.cube__face--back{transform:rotateY(180deg) translateZ(calc(var(--cube-size)/2))}
.cube__face--right{transform: rotateY(90deg) translateZ(calc(var(--cube-size)/2))}
.cube__face--left{transform: rotateY(-90deg) translateZ(calc(var(--cube-size)/2))}
.cube__face--top{transform: rotateX(90deg) translateZ(calc(var(--cube-size)/2))}
.cube__face--bottom{transform:rotateX(-90deg) translateZ(calc(var(--cube-size)/2))}
</style>