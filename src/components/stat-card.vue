<script setup lang="ts">
  import { type Component } from "vue";
  import { Card, CardContent } from "@/components/ui/card";
  import { cn } from "@/lib/utils";

  defineOptions({ name: "StatCard" });

  const props = withDefaults(
    defineProps<{
      title: string;
      value: string | number;
      description?: string;
      icon: Component;
      trend?: { value: string; positive: boolean };
      class?: string;
    }>(),
    { description: "", class: "" },
  );
</script>

<template>
  <Card :class="cn('relative overflow-hidden', props.class)">
    <CardContent class="p-4">
      <div
        class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/85 via-chart-2/85 to-chart-3/85"
      />
      <div class="flex items-start justify-between">
        <div class="flex flex-col gap-1.5">
          <span
            class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
          >
            {{ props.title }}
          </span>
          <span
            class="text-[1.65rem] font-semibold leading-none tracking-tight text-card-foreground"
          >
            {{ props.value }}
          </span>
          <span
            v-if="props.trend"
            :class="
              cn(
                'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
                props.trend.positive
                  ? 'bg-success/12 text-success'
                  : 'bg-destructive/12 text-destructive',
              )
            "
          >
            {{ props.trend.positive ? "+" : "" }}{{ props.trend.value }}
          </span>
          <span
            v-else-if="props.description"
            class="text-xs text-muted-foreground"
          >
            {{ props.description }}
          </span>
        </div>
        <div
          class="flex h-9 w-9 items-center justify-center rounded-md bg-primary/12 text-primary"
        >
          <component :is="props.icon" class="h-4 w-4" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
