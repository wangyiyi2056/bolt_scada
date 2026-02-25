<script setup lang="ts">
  import { useAttrs } from "vue";
  import { AvatarFallback as AvatarFallbackPrimitive } from "reka-ui";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "AvatarFallback", inheritAttrs: false });
  const attrs = useAttrs();
</script>

<template>
  <AvatarFallbackPrimitive
    v-bind="attrs"
    :class="
      cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        attrs.class as string,
      )
    "
  >
    <slot />
  </AvatarFallbackPrimitive>
</template>
