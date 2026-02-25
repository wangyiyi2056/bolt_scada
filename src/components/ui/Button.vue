<script setup lang="ts">
  import { cva, type VariantProps } from "class-variance-authority";
  import { useAttrs } from "vue";
  import { cn } from "@/lib/utils";

  const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    {
      variants: {
        variant: {
          default:
            "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
          destructive:
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
          outline:
            "border border-input/80 bg-background/90 shadow-sm hover:bg-accent hover:text-accent-foreground",
          secondary:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent/80 hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
          default: "h-10 px-4 py-2",
          sm: "h-8 px-3 text-xs",
          lg: "h-11 px-8",
          icon: "h-9 w-9",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    },
  );

  type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
  type ButtonSize = VariantProps<typeof buttonVariants>["size"];

  defineOptions({ name: "Button", inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      variant?: ButtonVariant;
      size?: ButtonSize;
      type?: "button" | "submit" | "reset";
    }>(),
    { type: "button" },
  );

  const attrs = useAttrs();
</script>

<template>
  <button
    v-bind="attrs"
    :type="props.type"
    :class="
      cn(
        buttonVariants({ variant: props.variant, size: props.size }),
        attrs.class as string,
      )
    "
  >
    <slot />
  </button>
</template>
