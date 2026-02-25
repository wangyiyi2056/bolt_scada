<script setup lang="ts">
  import { useAttrs } from "vue";
  import { AvatarRoot } from "reka-ui";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "Avatar", inheritAttrs: false });
  const attrs = useAttrs();
</script>

<template>
  <AvatarRoot
    v-bind="attrs"
    :class="
      cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        attrs.class as string,
      )
    "
  >
    <slot />
  </AvatarRoot>
</template>
