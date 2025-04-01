<template>
  <div
    class="text-center text-gray-500 text-sm"
    :class="isMobile() ? 'pt-1' : 'py-2'"
  >
    <!-- <UDivider :label="$config.public.projectName" :ui="{

    }" /> -->
    {{ $config.public.projectName }}
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
