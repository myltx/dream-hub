<template>
  <!-- 首页加载全屏动画 -->
  <FullLoading v-if="status === 'pending'" />
  <NuxtLayout>
    <!-- 在页面导航之间显示一个进度条 -->
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
  <UModals />
</template>

<script setup lang="ts">
import { getUserInfoByUserId } from '~/api/user';
import {
  fetchUserInfo,
  getIdTokenClaims,
  isTokenExpired,
} from './services/auth';
import { useUserStore } from './store/user';
import { createSiteAccessLog } from './api/log';

const userStore = useUserStore();
const { status } = useAsyncData('initApplication', async () => {
  if (await isTokenExpired()) {
    const user = await fetchUserInfo();
    const claims = await getIdTokenClaims();
    console.log(claims, 'claims');
    const { data } = await getUserInfoByUserId({
      userId: user?.sub as string,
    });

    userStore.initUser({
      ...user,
      ...claims,
      userInfo: data,
    });
  }

  const { userAgent, platform } = navigator;
  // 获取地理位置
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       console.log('Geolocation:', position.coords);
  //     },
  //     (error) => {
  //       console.error('Geolocation Error:', error.message);
  //     }
  //   );
  // } else {
  //   console.log('Geolocation not supported');
  // }
  await createSiteAccessLog({
    userAgent,
    platform,
    browserName: getBrowserInfo().browserName,
    deviceType: isMobile() ? 'Mobile' : 'PC',
  });
});
</script>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}
</style>
