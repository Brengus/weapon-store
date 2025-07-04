<template>
    <div class="main">
        <div class="running-text">
            <div class="marquee-content">
                <div class="one-string" v-for="i in 6" :key="i">
                    <div class="recruit">Recruit</div>
                    <div>中途採用について（2025年6月23日更新）</div>
                </div>
                <div class="one-string" v-for="i in 6" :key="i">
                    <div class="recruit">Recruit</div>
                    <div>中途採用について（2025年6月23日更新）</div>
                </div>
            </div>
        </div>


    </div>
</template>
<style scoped>
@keyframes slide{
    from { transform: translateX(0%); }
  to { transform: translateX(-50%); }
}
.main{
    width:100%;
    overflow:hidden;
}
.running-text{
    width:100%;
    color:white;
    padding:10px;
    display: flex;
    overflow:hidden;
    flex-wrap: nowrap;
}
.marquee-content{
    display:flex;
    animation: slide 10s linear infinite;
}
.one-string{
    display:flex;
    align-items:center;
    flex-wrap: nowrap;
    white-space:nowrap;
    margin-right:40px;
    flex-shrink: 0;
}
.recruit{
    height:25px;
    display:flex;
    align-items: center;
    padding:10px 20px;
    margin-right:10px;
    background-color:white;
    color:black;
    border-radius:5px;
}
.no-wrap-text{
    display:flex;
    width:max-content;
    flex-wrap: nowrap;
}
</style>