import type { LogtoConfig } from '@logto/vue';
import { createLogto, UserScope } from '@logto/vue';
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import { setupAuth } from '~/services/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const config: LogtoConfig = {
    endpoint: runtimeConfig?.public?.logtoEndpoint,
    appId: runtimeConfig?.public?.logtoAppId,
    scopes: [
      UserScope.Email,
      UserScope.Phone,
      UserScope.CustomData,
      UserScope.Identities,
      UserScope.Organizations,
      UserScope.Profile,
      UserScope.Roles,
    ],
    resources: [runtimeConfig?.public.backendEndpoint],
  };
  nuxtApp.vueApp.use(createLogto, config);
  setupAuth();
});
