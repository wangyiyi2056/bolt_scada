<script setup lang="ts">
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "./dialog";
  import { Button } from "./button";

  defineOptions({ name: "ConfirmDialog" });

  const props = withDefaults(
    defineProps<{
      open: boolean;
      title: string;
      description?: string;
      confirmText?: string;
      cancelText?: string;
    }>(),
    { confirmText: "确认删除", cancelText: "取消" },
  );

  const emit = defineEmits<{
    openChange: [open: boolean];
    confirm: [];
  }>();
</script>

<template>
  <Dialog
    :open="props.open"
    @open-change="(open: boolean) => emit('openChange', open)"
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
        <DialogDescription v-if="props.description">
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="emit('openChange', false)">
          {{ props.cancelText }}
        </Button>
        <Button variant="destructive" @click="emit('confirm')">
          {{ props.confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
