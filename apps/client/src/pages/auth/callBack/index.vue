<template>
  <div>
    <!-- 当正在处理中 -->
    <FullLoading v-if="isLoading" :text="'正在登录中，请稍后...'" />
  </div>
</template>

<script setup lang="ts">
import { useHandleSignInCallback } from '@logto/vue';
import { createUser, getUserInfoByUserId } from '~/api/user';
import { fetchUserInfo, getIdTokenClaims } from '~/services/auth';
import { useUserStore } from '~/store/user';

definePageMeta({
  layout: false,
});

const userStore = useUserStore();

const { isLoading } = useHandleSignInCallback(async () => {
  console.log('回调');
  // 完成后执行某些操作，例如重定向到主页
  const res = await fetchUserInfo();

  const claims = await getIdTokenClaims();
  const userInfo = ref<any>({});
  const { data } = await getUserInfoByUserId({
    userId: res?.sub as string,
  });
  // TODO: 暂时并未添加异常处理
  if (!data) {
    await createUser({
      userId: res?.sub,
      email: res?.email,
    });
    const { data: userData } = await getUserInfoByUserId({
      userId: res?.sub as string,
    });
    userInfo.value = userData;
  } else {
    userInfo.value = data;
  }
  userStore.initUser({
    ...res,
    ...claims,
    userInfo: userInfo.value,
  });

  navigateTo('/');
});
</script>

<style scoped></style>
