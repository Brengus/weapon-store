<script setup>
    const showSearch = ref(false);

    const handleSearchClick = () => showSearch.value = !showSearch.value
</script>
<template>
    <div class="full-width shadow-bottom padding-top-bottom-10px absolute-headers">
        <div class="grid-3-columns align-items-center font-weight-medium padding-left-right-20px">
            <div class="flex align-items-center">
                <img src="/public/thunderstock.png" alt="" class="width-40px">
            </div>
            <div class="flex space-evenly">
                <div class="font-color cursor-pointer">Modules</div>
                <div class="font-color cursor-pointer">Cases</div>
                <div class="font-color cursor-pointer">Contact</div>
            </div>
            <div class="flex row-reverse">
                <div @click="handleSearchClick" class="cursor-pointer"><img src="/public/search.png" class="width-24px" alt=""></div>
                <div v-if="showSearch" class="align-content-center"><input type="text"></div>
            </div>
        </div>
    </div>
</template>
<style>
.absolute-headers{
    position:absolute;
    z-index:1100;
    top:0;
    left:0;
}
.shadow-bottom{
    box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.2);
}
.width-24px{
    width:24px;
}
.padding-left-5px{
    padding-left:5px;
}
.padding-top-bottom-10px{
    padding:10px 0 !important;
}
.grid-3-columns{
    display:grid;
    grid-template-columns: 1fr 2fr 1fr;
}
.width-40px{
    width:196px;
    height:40px;
}
.color-white{
    color:white;
}
.font-color{
    color:white;
}

.font-size-26px{
    font-size: 24px;
}

.font-color:hover{
    color:oklch(0.55 0.05 249.78);
}
.font-weight-medium{
    font-weight: 500;
}
.flex{
    display: flex;
}

.align-content-center{
    align-content: center;
}

.align-items-center{
    align-items: center;
}

.row-reverse{
    flex-direction: row-reverse;
}

.padding-left-right-20px{
    padding:0 20px;
}

.full-width{
    width:100%;
}

.cursor-pointer{
    cursor:pointer;
}


.space-evenly{
    justify-content: space-evenly;
}
</style>