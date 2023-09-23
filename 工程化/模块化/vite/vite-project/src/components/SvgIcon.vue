<script setup lang="ts">
defineProps({
  //xlink:href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  //svg矢量图的名称
  name: String,
  //svg图标的颜色
  color: {
    type: String,
    default: '',
  },
  //svg图标的宽度
  width: {
    type: String,
    default: '16px',
  },
  //svg图标的高度
  height: {
    type: String,
    default: '16px',
  },
});
</script>

<template>
  <div>
    <svg :style="{ width: width, height: height }">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<style scoped></style>
