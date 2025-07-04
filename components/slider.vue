<template>
    <div>
        <iframe src="https://player.vimeo.com/video/582590681?h=ece3d51e11?background=1&muted=1&autoplay=1&dnt=1&loop=1&controls=0" frameborder="0" class="absolute"></iframe>
        <div class="black-box"></div>
        <div class="full-width">
            <div class="text">AI powered SaaS platform for retail stock optimization</div>
        </div>
    </div>
</template>
<style scoped>
.absolute{
    width:100%;
    height:56.25vw;
    min-height:100vh;
    min-width:100vh; 
    transform: translate(-50%,-50%);
    position:absolute;
    top:50%;
    left:50%;
    z-index:1;
}
.black-box{
    width:100%;
    height:100%;
    position:absolute;
    top:-200px;
    background-color:rgba(0,0,0,0.5);
    z-index:1;
}
.text{
    width:350px;
    height:100%;
    margin:auto;
    position:absolute;
    color:white;
    display:flex;
    z-index:1;
    align-items:center;
    text-align:center;
    font-size:34px;
    margin:auto;
}
.full-width{
    display:flex;
    width:100%;
    min-height:600px;
    align-items:center;
    justify-content: center;
    align-content: center;
}
</style>