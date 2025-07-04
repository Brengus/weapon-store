<template>
    <div class="black-box">
        <div class="full-width">
            <img src="/public/down-button.svg" alt="">
        </div>
        <div class="full-width">
            <div class="flex">
                <div>
                    <h3 class="color-orange">About Thunderstock</h3>
                    <div class="color-white margin-top-12px">Empower your merchandisers with data-driven decision making</div>
                    <div class="color-white margin-top-30px">Thunderstock empowers intelligent and agile stock decisions, allowing merchandisers to focus on macro management and exceptions, instead of manual routines. Visually engaging interfaces allow merchandisers to easily grasp patterns in complex data.</div>
                </div>
                <div>
                    <img src="/public/chart1.png" alt="" class="chart-style">
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.chart-style{
    width:800px;
}
.black-box{
    position:relative;
    width:100%;
    height:900px;
    z-index:1200;
    top:-10%;
    background-color:black;
    margin-top:30px;
    box-shadow: 0px -15px 30px 30px rgba(0, 0, 0, 1);
}
.full-width{
    width:100%;
    display:flex;
    justify-content: space-around;
}
.flex{
    display:flex;
    margin-top:10%;

}
.color-orange{
    color:rgb(255, 152, 0);
    font-weight:bold;
}
.color-white{
    color:white;
    font-weight:bold;
}
.margin-top-30px{
    margin-top:30px;
    width:350px;
    font-size:16px;
}
.margin-top-12px{
    margin-top:12px;
    font-size:34px;
    width:350px;
}
</style>