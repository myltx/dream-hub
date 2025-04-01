<script setup lang="ts">
const { data, error } = await useFetch('https://api.moyuhuashui.com/baidu/');
const handleClick = (data: any) => {
  window.open(data.url, '_blank');
};
</script>

<template>
  <div class="px-30 mt-2 flex items-center">
    <!-- <div class="text-xl font-bold">热点:</div> -->
    <div class="flex flex-wrap items-center">
      <div
        class="w-1/5 p-2"
        v-for="item in data?.data.slice(0, 5)"
        :key="item.id"
        @click="handleClick(item)"
      >
        <div
          class="text-sm overflow-hidden cursor-pointer whitespace-nowrap text-ellipsis"
        >
          🔥 百度：
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
