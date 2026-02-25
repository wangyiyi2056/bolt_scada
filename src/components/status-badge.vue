<script setup lang="ts">
  import { cn } from "@/lib/utils";

  type StatusType =
    | "online"
    | "offline"
    | "warning"
    | "error"
    | "running"
    | "stopped"
    | "pending";

  const statusConfig: Record<
    StatusType,
    { label: string; dotClass: string; textClass: string }
  > = {
    online: {
      label: "在线",
      dotClass: "bg-success",
      textClass: "text-success",
    },
    offline: {
      label: "离线",
      dotClass: "bg-muted-foreground",
      textClass: "text-muted-foreground",
    },
    warning: {
      label: "告警",
      dotClass: "bg-warning",
      textClass: "text-warning",
    },
    error: {
      label: "故障",
      dotClass: "bg-destructive",
      textClass: "text-destructive",
    },
    running: {
      label: "运行中",
      dotClass: "bg-success",
      textClass: "text-success",
    },
    stopped: {
      label: "已停止",
      dotClass: "bg-muted-foreground",
      textClass: "text-muted-foreground",
    },
    pending: {
      label: "等待中",
      dotClass: "bg-warning",
      textClass: "text-warning",
    },
  };

  defineOptions({ name: "StatusBadge" });

  const props = withDefaults(
    defineProps<{
      status: StatusType;
      label?: string;
      class?: string;
    }>(),
    { label: "", class: "" },
  );
</script>

<template>
  <div :class="cn('flex items-center gap-1.5', props.class)">
    <div
      :class="cn('h-2 w-2 rounded-full', statusConfig[props.status].dotClass)"
    />
    <span
      :class="cn('text-xs font-medium', statusConfig[props.status].textClass)"
    >
      {{ props.label || statusConfig[props.status].label }}
    </span>
  </div>
</template>
