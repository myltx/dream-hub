<script setup lang="ts">
import { getSiteAccessInterViewCount } from '~/api/log';

definePageMeta({
  layout: 'admin',
});
const router = useRouter();
const visitAllCount = ref(0);
const moduleList = ref([
  {
    name: '站点管理',
    icon: 'icon-park-outline:ad-product',
    link: '/admin/website',
    description: '配置站点信息，如站点名称、站点描述等',
  },
  {
    name: '分类管理',
    icon: 'icon-park-outline:all-application',
    link: '/admin/categories',
    description: '管理分类信息，如文章分类等',
  },
  {
    name: '标签管理',
    icon: 'heroicons:bookmark',
    link: '/admin/tag',
    description: '管理标签信息，如文章标签等',
  },
  {
    name: '文件管理',
    icon: 'heroicons:archive-box',
    link: '/admin/file',
  },
]);

const getVisitCount = () => {
  getSiteAccessInterViewCount().then((res) => {
    visitAllCount.value = res.data?.totalVisits || 0;
  });
};
getVisitCount();

const toLink = (link: string) => {
  router.push(link);
};
</script>
<template>
  <div
    class="text-xl font-bold text-center mb-4 flex items-center justify-center"
  >
    <Icon name="unjs:nypm" class="mr-2" /> 欢迎来到
    {{ $config.public.projectName }} 管理后台
  </div>
  <div class="text-gray-500 text-center mt-4 flex items-center justify-center">
    <Icon name="emojione:party-popper" class="mr-2" />
    当前项目共被访问:
    <span class="text-blue-500">
      {{ visitAllCount }}
    </span>
    次
    <Icon
      name="icon-park:reload"
      class="cursor-pointer text-xl ml-1"
      @click="getVisitCount"
    />
  </div>
  <!-- 快捷导航 -->
  <div
    class="w-[30%] light:bg-white dark:bg-[#101726] rounded-lg p-4 shadow-md mt-4"
  >
    <div class="text-xl font-bold mb-4 flex items-center">
      <Icon name="icon-park-outline:all-application" class="text-xl mr-1" />
      快捷导航
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div
        class="flex flex-col items-center justify-center cursor-pointer rounded-lg p-4 border cursor-pointer hover:transition-all duration-300 hover:shadow-md"
        v-for="item in moduleList"
        :key="item.name"
        @click="toLink(item.link)"
      >
        <Icon :name="item.icon" class="text-xl mb-2" />
        {{ item.name }}
      </div>
    </div>
  </div>
  <!-- 这里 添加一个显示数据的模块 -->
</template>

<style scoped></style>
