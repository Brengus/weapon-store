<template>
    <div class="black-box">
        <div class="title">
            <div>
                <div class="small-title">Forecasts</div>
                <div class="medium-title">Let AI help you do the work</div>
                <div class="charts">
                    <img src="/public/forecast1.png" alt="" class="charts">
                </div>
                <div>
                    <div class="text">
                        Stock optimizations rely on our proprietary, AI-based forecasting engine, generating superior demand forecasts. This allows us to accurately tailor stock levels to customer demand and avoid missed sales with just enough stock.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.text{
    color:white;
    font-size:16px;
    text-align: center;
    max-width:600px;
    margin:auto;
}
.charts{
    max-width:986px;
    height:100%;
}
.medium-title{
    color:white;
    font-size:28px;
    text-align: center;
    position:relative;
}
.small-title{
    color:orange;
    text-align: center;
    padding-bottom:20px;
}
.title{
    padding:90px;
    width:986px;
    margin:0 auto;
    transform:skewY(6deg);
}
.black-box{
    transform: skewY(-6deg);
    width:100%;
    background-image: url('/public/forcast-background.jpg');
    background-size:cover;
    position:relative;
}
</style>