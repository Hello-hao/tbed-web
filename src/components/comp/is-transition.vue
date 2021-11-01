<template>
  <transition  mode="out-in" >
    <router-view  @getMessage="getRouterInfo"></router-view>
  </transition>
</template>

<script>
export default {
  name: "is-transition",
  data () {
    return {
      direction:''
    }
  },
  methods: {
    getRouterInfo(val){
      console.log(val);

    }
  },
  watch: {//使用watch 监听$router的变化
    $route(to, from,next) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
/*      this.direction = 'left-leave';
      if(to.meta.index > from.meta.index){
        //设置动画名称
        this.direction = 'left-leave';
      }else{
        this.direction = 'left-enter';
      }*/

/*      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      if (to.path == "/") {
        this.direction = "slide-right";
      } else if (from.path == "/") {
        this.direction = "slide-left";
      }else{
        this.direction = toDepth < fromDepth ? "slide-right" : "slide-left";
      }*/
      next();
    }
  }
}
</script>

<style scoped>
.v-enter{
  opacity: 0;
}
.v-enter-active{
  transition: 0.5s;
}
.v-enter-to{
  opacity: 0.8;
}
.v-leave{
  opacity: 0.8;
}
.v-leave-to{
  opacity:0;
}
.v-leave-active{
  transition: 0.5s;
}
</style>