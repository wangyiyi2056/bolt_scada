<script setup lang="ts">
  import { useAttrs } from "vue";
  import { AvatarImage as AvatarImagePrimitive } from "reka-ui";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "AvatarImage", inheritAttrs: false });
  const attrs = useAttrs();
</script>

<template>
  <!-- @vue-ignore -->
  <AvatarImagePrimitive
    v-bind="attrs as any"
    :class="cn('aspect-square h-full w-full', attrs.class as string)"
  >
    <slot />
  </AvatarImagePrimitive>
</template>
