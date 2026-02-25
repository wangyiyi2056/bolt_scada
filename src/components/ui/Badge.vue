<script setup lang="ts">
  import { cva, type VariantProps } from "class-variance-authority";
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";

  const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors",
    {
      variants: {
        variant: {
          default: "border-transparent bg-primary/90 text-primary-foreground",
          secondary:
            "border-transparent bg-secondary text-secondary-foreground",
          destructive:
            "border-transparent bg-destructive text-destructive-foreground",
          outline: "border-border bg-background/70 text-foreground",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    },
  );

  type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

  defineOptions({ name: "Badge", inheritAttrs: false });

  const props = defineProps<{
    variant?: BadgeVariant;
  }>();

  const attrs = useAttrs();
</script>

<template>
  <div
    v-bind="attrs"
    :class="
      cn(badgeVariants({ variant: props.variant }), attrs.class as string)
    "
  >
    <slot />
  </div>
</template>
