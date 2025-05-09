<template>
  <div class="p-2 h-[100vh]">
    <HeaderAdmin />
    <div class="flex justify-between items-start h-176">
      <UVerticalNavigation
        v-if="isAdmin"
        :links="links"
        class="w-1/8 shadow min-h-[100%] overflow-y-auto"
        :class="$colorMode.value === 'dark' ? 'shadow-gray' : 'shadow'"
      />
      <div
        v-if="isAdmin"
        class="w-full p-2 h-[100%] overflow-y-auto mx-3"
        :class="
          $colorMode.value === 'dark'
            ? 'bg-gray-800 shadow-gray'
            : 'bg-gray-50 shadow'
        "
      >
        <slot />
      </div>
      <div
        v-else
        class="w-full p-2 h-[100%] overflow-y-auto mx-3"
        :class="
          $colorMode.value === 'dark'
            ? 'bg-gray-800 shadow-gray'
            : 'bg-gray-50 shadow'
        "
      >
        <div class="flex flex-col items-center justify-center h-full">
          <div class="mb-6">
            <div
              class="i-heroicons-shield-exclamation text-6xl text-red-500"
            ></div>
          </div>
          <h2 class="text-2xl font-bold mb-2 text-red-500">访问受限</h2>
          <p class="text-gray-600 dark:text-gray-400">
            很抱歉，您没有权限访问该页面
          </p>
          <UButton
            class="mt-6"
            color="red"
            variant="soft"
            @click="router.push('/')"
          >
            返回首页
          </UButton>
        </div>
      </div>
    </div>
    <FooterAdmin />
  </div>
</template>

<script setup lang="ts">
import { checkAdmin } from '~/api/user';

const router = useRouter();
const isAdmin = ref(false);

const links = [
  //   {
  //     label: 'Profile',
  //     avatar: {
  //       src: 'https://avatars.githubusercontent.com/u/739984?v=4',
  //     },
  //     badge: 100,
  //   },
  {
    label: '首页',
    icon: 'i-heroicons-home',
    to: '/admin',
  },
  {
    label: '站点管理',
    icon: 'icon-park-outline:ad-product',
    to: '/admin/website',
  },
  {
    label: '分类管理',
    icon: 'icon-park-outline:all-application',
    to: '/admin/categories',
  },
  {
    label: '标签管理',
    icon: 'heroicons:bookmark',
    to: '/admin/tag',
  },
  {
    label: '文件管理',
    icon: 'heroicons:archive-box',
    to: '/admin/file',
  },
];
checkAdmin().then((res) => {
  isAdmin.value = res.data || false;
});
</script>

<style scoped></style>
