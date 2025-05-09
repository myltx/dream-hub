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

// 添加数据概览
const statistics = ref([
  { title: '今日访问', value: '2,851', percentage: '12.5', trend: 'up' },
  { title: '文章总数', value: '156', percentage: '8.2', trend: 'up' },
  { title: '评论数', value: '384', percentage: '5.3', trend: 'down' },
  { title: '用户量', value: '1,893', percentage: '15.8', trend: 'up' },
]);
</script>
<template>
  <div class="admin-dashboard">
    <!-- 顶部欢迎banner -->
    <div
      class="welcome-banner p-6 mb-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
    >
      <div class="text-2xl font-bold text-white mb-2 flex items-center">
        <Icon name="unjs:nypm" class="mr-3 text-3xl" />
        欢迎来到 {{ $config.public.projectName }} 管理后台
      </div>
      <div class="text-white/80 flex items-center">
        <Icon name="emojione:party-popper" class="mr-2" />
        访问统计：
        <span class="font-semibold mx-2">{{ visitAllCount }}</span>
        次
        <Icon
          name="icon-park:reload"
          class="cursor-pointer text-xl ml-2 hover:rotate-180 transition-all duration-300"
          @click="getVisitCount"
        />
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div
        v-for="stat in statistics"
        :key="stat.title"
        class="stat-card p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="text-gray-500 dark:text-gray-400 mb-2 text-sm">
          {{ stat.title }}
        </div>
        <div class="text-2xl font-bold">{{ stat.value }}</div>
        <div
          class="mt-2 text-sm"
          :class="stat.trend === 'up' ? 'text-green-500' : 'text-red-500'"
        >
          <Icon
            :name="
              stat.trend === 'up'
                ? 'heroicons:arrow-trending-up'
                : 'heroicons:arrow-trending-down'
            "
            class="mr-1"
          />
          {{ stat.percentage }}%
        </div>
      </div>
    </div>

    <!-- 快捷导航模块 -->
    <div class="grid grid-cols-2 gap-6">
      <!-- 快捷导航 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div class="text-xl font-bold mb-4 flex items-center">
          <Icon name="icon-park-outline:all-application" class="text-xl mr-2" />
          快捷导航
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="item in moduleList"
            :key="item.name"
            @click="toLink(item.link)"
            class="module-card p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300"
          >
            <div class="flex items-center">
              <Icon :name="item.icon" class="text-2xl text-blue-500 mr-3" />
              <div>
                <div class="font-semibold">{{ item.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ item.description || '暂无描述' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div class="text-xl font-bold mb-4 flex items-center">
          <Icon name="heroicons:clock" class="text-xl mr-2" />
          最近活动
        </div>
        <div class="space-y-4">
          <div
            v-for="i in 4"
            :key="i"
            class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div
              class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
            >
              <Icon name="heroicons:user" class="text-blue-500" />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium">系统更新完成</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                2分钟前
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  @apply space-y-6;
}

.module-card {
  @apply relative overflow-hidden;
}

.module-card::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/10 dark:to-transparent opacity-0 transition-opacity duration-300;
}

.module-card:hover::before {
  @apply opacity-100;
}
</style>
