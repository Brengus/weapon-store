<script setup>

    
    const container1 = ref('');
    const container2 = ref('');
    const container3 = ref('');
    const focusedName = ref(false);
    const focusedEmail = ref(false);
    const focusedMore = ref(false);
</script>
<template>
    <div class="height">
        <div class="width-80">
            <div class="column">
                <div class="header">Meet us at</div>
                <div>Diemermere 1, 1112TA</div>
                <div style="padding-bottom:16px;">Diemen, The Netherlands</div>
                <div>CoC: 76541223</div>
            </div>
            <div class="column">
                <div class="header">Ready for more?</div>
                <div>
                    <label :class="focusedName || container1 ? 'when-focused' : 'when-not'" >Your name</label>
                    <input type="text" class="one-line" v-model="container1" @focus="focusedName = true" @blur="focusedName = false">
                </div>
                <div>
                    <label :class="focusedEmail || container2 ? 'when-focused' : 'when-not'">Email address</label>
                    <input type="email" class="one-line" @focus="focusedEmail = true" @blur="focusedEmail = false">
                </div>
                <div>
                    <label :class="focusedMore || container3 ? 'when-focused' : 'when-not'">Tell me more about..</label>
                    <textarea class="multiple-lines" name="tell-me-more" cols="50" rows="5" @focus="focusedMore = true" @blur="focusedMore = false"></textarea>
                </div>
                <div class="button-div box3">
                    <button >I AM READY</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>

.button-div{
    display:flex;
    justify-content: space-around;
}
.when-not{
    position:relative;
    z-index:1;
    top:30px;
}
.when-focused{
    position:relative;
    top:0;
}
.one-line{
    position:relative;
    z-index:2;
    background-color:transparent;
    border: none;
    border-bottom:1px solid white;
    height:40px;
    margin-bottom:15px;
    color:white;
    outline:none;
    width:500px;
}
.multiple-lines{
    background-color:transparent;
    border: none;
    position:relative;
    z-index:2;
    border-bottom:1px solid white;
    min-height:88px;
    max-height:88px;
    margin-bottom:15px;
    min-width:500px;
    max-width:500px;
    color:white;
    outline:none;
}
button{
    background-color:rgb(255, 152, 0);
    cursor:pointer;
    width:150px;
    padding:10px 30px;
    color:white;
    border:none;
    border-radius:5px;
}
.width-80{
    width:1000px;
    display:flex;
    margin:auto;

}
.header{
    color:rgb(255, 152, 0);
    font-size:3rem;
    padding-bottom:30px;
}
.height{
    height:600px;
    background-image: url('/public/flash.jpg');
    background-size: cover;
}
.column{
    display: flex;
    flex-direction:column;
    margin-top:120px;
    width:500px;
    color:white;
}
</style>