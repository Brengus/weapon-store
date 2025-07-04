<script setup>
    const boxHovered = () =>{

    }
</script>
<template>
    <div class="skewed">
        <div style="display:flex; width:80%; margin:0 10%; height:100%;">
            <div style="width:30%;">
                <div class="skewedY-6deg box">
                    <div class="flex-space-around height-70-pct"><img src="/public/cube.svg" alt="" class="cube-dim"></div>
                    <div class="flex-space-around text-style">Strategy</div>
                </div>
                <div class="skewedY-6deg box">
                    <div class="flex-space-around height-70-pct"><img src="/public/cube.svg" alt="" class="cube-dim"></div>
                    <div class="flex-space-around text-style">Strategy</div>
                </div>
                <div class="skewedY-6deg box" :class="boxHovered()">
                    <div class="flex-space-around height-70-pct"><img src="/public/cube.svg" alt="" class="cube-dim"></div>
                    <div class="flex-space-around text-style">Strategy</div>
                </div>
            </div>
            <div style="width:30%;">
                <div class="skewedY-6deg box-2">
                    <div class="flex-space-around height-70-pct"><img src="/public/cube.svg" alt="" class="cube-dim"></div>
                    <div class="flex-space-around text-style">Strategy</div>
                </div>
                <div class="skewedY-6deg box-2">
                    <div class="flex-space-around height-70-pct"><img src="/public/cube.svg" alt="" class="cube-dim"></div>
                    <div class="flex-space-around text-style">Strategy</div>
                </div>
            </div>
            <div class="skewedY-6deg modules-text">
                <h4>Our Modules</h4>
                <div class="module-description">Each of our modules aids the merchandising process at different stages of the product life cycle</div>
                <div class="learn-more-button">Learn more</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.height-70-pct{
    height:70%;
}
h4{
    color:orange;
}
.learn-more-button{
    margin-top:40px;
    padding:10px 20px;
    border:1px solid black;
    width:100px;
    display:flex;
    justify-content: space-around;
    border-radius:10px;
    background-color:white;
    cursor:pointer;
}
.learn-more-button:hover{
    background-color:#f4f4f4;
}
.module-description{
    width:500px;
    font-size:34px;
}
.skewed{
    position:relative;
    width:100%;
    z-index:10000;
    height:800px;
    transform: skewY(-6deg);
    background-image:url('/public/background-image-white.jpg');
}
.skewedY-6deg{
    transform:skewY(6deg);
}
.modules-text{
    height:100%;
    align-content: center;
    padding: 0 50px;
    width:40%;
}
.box{
    background-color:white;
    width:181px;
    position:relative;
    top:-10%;
    height:181px;
    border:1px solid #f4f4f4;
    border-radius:10px;
    margin:0 auto 30px auto;
    cursor:pointer;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
    transform: perspective(-600px) rotateX(0deg) rotateY(0deg) scale(1);
    transition:transform 1s ease-out;
}

.box:hover{
    transform: perspective(600px) rotateX(0deg) rotateY(-30deg) scale(1.1);
    transition: transform 1s ease-out;
}

.box-2{
    background-color:white;
    width:181px;
    position:relative;
    top:15%;
    height:181px;
    border:1px solid #f4f4f4;
    border-radius:10px;
    margin:0 auto 30px auto;
    cursor:pointer;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
}

.flex-space-around{
    display:flex;
    justify-content: space-around;
}

.cube-dim{
    width:50px;
    padding: 25px 0 15px;
}
.text-style{
    height:30%;
    box-sizing:border-box;
    display:flex;
    align-items:center;
    font-weight:bold;
    border-top: 1px solid #f4f4f4;
}
</style>