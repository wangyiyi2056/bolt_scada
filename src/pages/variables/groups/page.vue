<script lang="tsx">
  import { defineComponent } from "vue";
  import { ref } from "vue";
  import { ConfirmDialog } from "@/components/ui/confirm-dialog";
  import { Plus, FolderOpen, MoreHorizontal } from "lucide-vue-next";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Card, CardContent } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
  } from "@/components/ui/form";
  import { PageHeader } from "@/components/page-header";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

  type VariableGroup = {
    id: string;
    name: string;
    count: number;
    good: number;
    bad: number;
    desc: string;
  };

  const initialGroups: VariableGroup[] = [
    {
      id: "VG01",
      name: "温度",
      count: 128,
      good: 125,
      bad: 3,
      desc: "温度采集变量",
    },
    {
      id: "VG02",
      name: "压力",
      count: 96,
      good: 96,
      bad: 0,
      desc: "压力采集变量",
    },
    {
      id: "VG03",
      name: "流量",
      count: 64,
      good: 62,
      bad: 2,
      desc: "流量采集变量",
    },
    {
      id: "VG04",
      name: "液位",
      count: 48,
      good: 48,
      bad: 0,
      desc: "液位采集变量",
    },
    {
      id: "VG05",
      name: "电力",
      count: 256,
      good: 254,
      bad: 2,
      desc: "电力参数采集",
    },
    {
      id: "VG06",
      name: "控制",
      count: 180,
      good: 180,
      bad: 0,
      desc: "控制输出变量",
    },
    {
      id: "VG07",
      name: "状态",
      count: 320,
      good: 312,
      bad: 8,
      desc: "设备状态信号",
    },
    {
      id: "VG08",
      name: "分析",
      count: 32,
      good: 28,
      bad: 4,
      desc: "分析仪器数据",
    },
  ];

  const groups = ref<VariableGroup[]>(initialGroups);
  const createOpen = ref(false);
  const editOpen = ref(false);
  const createForm = ref({
    name: "",
    count: "0",
    good: "0",
    bad: "0",
    desc: "",
  });
  const editForm = ref({
    id: "",
    name: "",
    count: "0",
    good: "0",
    bad: "0",
    desc: "",
  });
  const deleteOpen = ref(false);
  const pendingDeleteId = ref<string | null>(null);

  function nextGroupId() {
    const maxId = groups.value.reduce((max, item) => {
      const num = Number.parseInt(item.id.replace("VG", ""), 10);
      return Number.isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `VG${String(maxId + 1).padStart(2, "0")}`;
  }

  function createGroup() {
    const name = createForm.value.name.trim();
    if (!name) return;
    groups.value.unshift({
      id: nextGroupId(),
      name,
      count: Number.parseInt(createForm.value.count, 10) || 0,
      good: Number.parseInt(createForm.value.good, 10) || 0,
      bad: Number.parseInt(createForm.value.bad, 10) || 0,
      desc: createForm.value.desc.trim() || "未填写描述",
    });
    createForm.value = { name: "", count: "0", good: "0", bad: "0", desc: "" };
    createOpen.value = false;
  }

  function startEdit(group: VariableGroup) {
    editForm.value = {
      id: group.id,
      name: group.name,
      count: String(group.count),
      good: String(group.good),
      bad: String(group.bad),
      desc: group.desc,
    };
    editOpen.value = true;
  }

  function saveEdit() {
    const index = groups.value.findIndex(
      (item) => item.id === editForm.value.id,
    );
    if (index < 0) return;
    groups.value[index] = {
      ...groups.value[index],
      name: editForm.value.name.trim() || groups.value[index].name,
      count: Number.parseInt(editForm.value.count, 10) || 0,
      good: Number.parseInt(editForm.value.good, 10) || 0,
      bad: Number.parseInt(editForm.value.bad, 10) || 0,
      desc: editForm.value.desc.trim() || "未填写描述",
    };
    editOpen.value = false;
  }

  function requestDelete(id: string) {
    pendingDeleteId.value = id;
    deleteOpen.value = true;
  }

  function confirmDelete() {
    if (!pendingDeleteId.value) return;
    removeGroup(pendingDeleteId.value);
    pendingDeleteId.value = null;
    deleteOpen.value = false;
  }

  function removeGroup(id: string) {
    groups.value = groups.value.filter((item) => item.id !== id);
  }

  export default defineComponent({
    name: "groupsPage",
    setup() {
      return () => (
        <div class="page-shell">
          <ConfirmDialog
            open={deleteOpen.value}
            onUpdate:open={(open: boolean) => {
              deleteOpen.value = open;
              if (!open) pendingDeleteId.value = null;
            }}
            title="确认删除"
            description="删除后不可恢复，是否继续？"
            onConfirm={confirmDelete}
          />

          <PageHeader
            title="变量分组"
            description="按工艺区域或功能分组管理变量"
          >
            <Dialog
              open={createOpen.value}
              onUpdate:open={(open: boolean) => (createOpen.value = open)}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"新建分组"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建变量分组</DialogTitle>
                  <DialogDescription>补全变量分组新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>分组名称</FormLabel>
                      <FormControl>
                        <Input
                          value={createForm.value.name}
                          onInput={(e: Event) =>
                            (createForm.value.name = (
                              e.target as HTMLInputElement
                            ).value)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-desc">
                    <FormItem>
                      <FormLabel>描述</FormLabel>
                      <FormControl>
                        <Textarea
                          value={createForm.value.desc}
                          onInput={(e: Event) =>
                            (createForm.value.desc = (
                              e.target as HTMLTextAreaElement
                            ).value)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-count">
                      <FormItem>
                        <FormLabel>变量总数</FormLabel>
                        <FormControl>
                          <Input
                            value={createForm.value.count}
                            onInput={(e: Event) =>
                              (createForm.value.count = (
                                e.target as HTMLInputElement
                              ).value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-good">
                      <FormItem>
                        <FormLabel>Good 数</FormLabel>
                        <FormControl>
                          <Input
                            value={createForm.value.good}
                            onInput={(e: Event) =>
                              (createForm.value.good = (
                                e.target as HTMLInputElement
                              ).value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-bad">
                      <FormItem>
                        <FormLabel>Bad 数</FormLabel>
                        <FormControl>
                          <Input
                            value={createForm.value.bad}
                            onInput={(e: Event) =>
                              (createForm.value.bad = (
                                e.target as HTMLInputElement
                              ).value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => (createOpen.value = false)}
                  >
                    取消
                  </Button>
                  <Button onClick={createGroup}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>

          <Dialog
            open={editOpen.value}
            onUpdate:open={(open: boolean) => (editOpen.value = open)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑变量分组</DialogTitle>
                <DialogDescription>{`分组编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>分组名称</FormLabel>
                    <FormControl>
                      <Input
                        value={editForm.value.name}
                        onInput={(e: Event) =>
                          (editForm.value.name = (
                            e.target as HTMLInputElement
                          ).value)
                        }
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-desc">
                  <FormItem>
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Textarea
                        value={editForm.value.desc}
                        onInput={(e: Event) =>
                          (editForm.value.desc = (
                            e.target as HTMLTextAreaElement
                          ).value)
                        }
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-count">
                    <FormItem>
                      <FormLabel>变量总数</FormLabel>
                      <FormControl>
                        <Input
                          value={editForm.value.count}
                          onInput={(e: Event) =>
                            (editForm.value.count = (
                              e.target as HTMLInputElement
                            ).value)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-good">
                    <FormItem>
                      <FormLabel>Good 数</FormLabel>
                      <FormControl>
                        <Input
                          value={editForm.value.good}
                          onInput={(e: Event) =>
                            (editForm.value.good = (
                              e.target as HTMLInputElement
                            ).value)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-bad">
                    <FormItem>
                      <FormLabel>Bad 数</FormLabel>
                      <FormControl>
                        <Input
                          value={editForm.value.bad}
                          onInput={(e: Event) =>
                            (editForm.value.bad = (
                              e.target as HTMLInputElement
                            ).value)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
              </Form>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => (editOpen.value = false)}
                >
                  取消
                </Button>
                <Button onClick={saveEdit}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {groups.value.map((g) => (
              <Card
                key={g.id}
                class="cursor-pointer transition-colors hover:border-primary/30"
              >
                <CardContent class="p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FolderOpen class="h-4 w-4" />
                      </div>
                      <div>
                        <h3 class="text-sm font-medium text-card-foreground">
                          {g.name}
                        </h3>
                        <p class="text-[11px] text-muted-foreground">
                          {g.desc}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-7 w-7 text-muted-foreground"
                        >
                          <MoreHorizontal class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => startEdit(g)}>
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          class="text-destructive"
                          onSelect={() => requestDelete(g.id)}
                        >
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div class="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px]">
                    <Badge
                      variant="outline"
                      class="text-[10px]"
                    >{`${g.count} 变量`}</Badge>
                    <div class="flex items-center gap-2 text-muted-foreground">
                      <span class="flex items-center gap-1">
                        <span class="h-1.5 w-1.5 rounded-full bg-success" />
                        {`${g.good} Good`}
                      </span>
                      {g.bad > 0 && (
                        <span class="flex items-center gap-1 text-destructive">
                          <span class="h-1.5 w-1.5 rounded-full bg-destructive" />
                          {`${g.bad} Bad`}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    },
  });
</script>
