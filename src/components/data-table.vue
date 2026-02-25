<script setup lang="ts">
  import { computed, ref } from "vue";
  import { Search } from "lucide-vue-next";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Input } from "@/components/ui/input";
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";

  export interface Column<T> {
    key: string;
    title: string;
    render?: (item: T) => any;
    className?: string;
  }

  defineOptions({ name: "DataTable" });

  const props = withDefaults(
    defineProps<{
      columns: Column<Record<string, unknown>>[];
      data: Record<string, unknown>[];
      searchable?: boolean;
      searchPlaceholder?: string;
      pageSize?: number;
    }>(),
    { searchable: true, searchPlaceholder: "搜索...", pageSize: 10 },
  );

  const search = ref("");
  const page = ref(0);

  const filtered = computed(() => {
    if (!search.value.trim()) return props.data;
    const keyword = search.value.toLowerCase();
    return props.data.filter((item) =>
      props.columns.some((col) => {
        const val = item[col.key];
        return (
          val !== undefined &&
          val !== null &&
          String(val).toLowerCase().includes(keyword)
        );
      }),
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filtered.value.length / props.pageSize)),
  );

  const paged = computed(() => {
    const safePage = Math.min(page.value, totalPages.value - 1);
    if (safePage !== page.value) page.value = safePage;
    return filtered.value.slice(
      page.value * props.pageSize,
      (page.value + 1) * props.pageSize,
    );
  });

  const pageNumbers = computed(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, page.value + 1 - half);
    let end = Math.min(totalPages.value, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  });

  function onSearchInput(e: Event) {
    search.value = (e.target as HTMLInputElement).value;
    page.value = 0;
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="props.searchable" class="relative max-w-sm">
      <Search
        class="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        :placeholder="props.searchPlaceholder"
        :value="search"
        class="h-8 pl-8 text-sm"
        @input="onSearchInput"
      />
    </div>

    <div
      class="overflow-hidden rounded-md border border-border/80 bg-card/70 shadow-sm"
    >
      <Table>
        <TableHeader>
          <TableRow class="bg-muted/40 hover:bg-muted/40">
            <TableHead
              v-for="col in props.columns"
              :key="col.key"
              :class="col.className"
            >
              {{ col.title }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="paged.length === 0">
            <TableRow>
              <TableCell
                :colspan="props.columns.length"
                class="h-24 text-center text-muted-foreground"
              >
                暂无数据
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow v-for="(item, i) in paged" :key="`${page}-${i}`">
              <TableCell
                v-for="col in props.columns"
                :key="col.key"
                :class="col.className"
              >
                <component
                  v-if="col.render"
                  :is="() => col.render!(item as any)"
                />
                <template v-else>{{ item[col.key] }}</template>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div
      v-if="totalPages > 1"
      class="flex flex-col items-start justify-between gap-2 text-xs text-muted-foreground md:flex-row md:items-center"
    >
      <span>共 {{ filtered.length }} 条记录</span>
      <Pagination class="mx-0 w-auto justify-start md:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              :disabled="page === 0"
              @click="page = Math.max(0, page - 1)"
            />
          </PaginationItem>
          <PaginationItem v-for="p in pageNumbers" :key="p">
            <PaginationLink :is-active="p - 1 === page" @click="page = p - 1">
              {{ p }}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              :disabled="page >= totalPages - 1"
              @click="page = Math.min(totalPages - 1, page + 1)"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
