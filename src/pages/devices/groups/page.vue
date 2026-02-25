<script lang="tsx">
  import { defineComponent } from "vue";
  import { ref } from "vue";
  import { ConfirmDialog } from "@/components/ui/confirm-dialog";
  import {
    Plus,
    FolderOpen,
    ChevronRight,
    MoreHorizontal,
  } from "lucide-vue-next";
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

  type DeviceGroup = {
    id: string;
    name: string;
    desc: string;
    count: number;
    online: number;
    children: string[];
  };

  const initialGroups: DeviceGroup[] = [
    {
      id: "G001",
      name: "PLC 控制器",
      desc: "西门子、三菱、AB 等 PLC 设备",
      count: 18,
      online: 16,
      children: ["S7-300/400 系列", "FX5U 系列", "CompactLogix"],
    },
    {
      id: "G002",
      name: "RTU 终端",
      desc: "远程终端单元",
      count: 12,
      online: 10,
      children: ["4G RTU", "以太网 RTU"],
    },
    {
      id: "G003",
      name: "IO 模块",
      desc: "分布式 IO 采集模块",
      count: 24,
      online: 22,
      children: ["模拟量模块", "数字量模块", "混合模块"],
    },
    {
      id: "G004",
      name: "HMI 触摸屏",
      desc: "人机界面操作终端",
      count: 8,
      online: 7,
      children: ["7 寸", "10 寸", "15 寸"],
    },
    {
      id: "G005",
      name: "智能仪表",
      desc: "电力仪表、流量计、液位计等",
      count: 32,
      online: 30,
      children: ["电力仪表", "流量计", "液位计", "温度变送器"],
    },
    {
      id: "G006",
      name: "变频器",
      desc: "电机调速变频器",
      count: 16,
      online: 16,
      children: ["水泵变频", "风机变频"],
    },
    {
      id: "G007",
      name: "传感器",
      desc: "各类工业传感器",
      count: 48,
      online: 42,
      children: ["温度传感器", "压力传感器", "湿度传感器"],
    },
    {
      id: "G008",
      name: "网关设备",
      desc: "协议转换网关",
      count: 6,
      online: 5,
      children: ["Modbus 网关", "OPC 网关"],
    },
  ];

  const groups = ref<DeviceGroup[]>(initialGroups);
  const createOpen = ref(false);
  const editOpen = ref(false);
  const createForm = ref({
    name: "",
    desc: "",
    count: "0",
    online: "0",
    children: "",
  });
  const editForm = ref({
    id: "",
    name: "",
    desc: "",
    count: "0",
    online: "0",
    children: "",
  });
  const deleteOpen = ref(false);
  const pendingDeleteId = ref<string | null>(null);

  function nextGroupId() {
    const maxId = groups.value.reduce((max, item) => {
      const num = Number.parseInt(item.id.replace("G", ""), 10);
      return Number.isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `G${String(maxId + 1).padStart(3, "0")}`;
  }

  function parseChildren(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function createGroup() {
    const name = createForm.value.name.trim();
    if (!name) return;
    groups.value.unshift({
      id: nextGroupId(),
      name,
      desc: createForm.value.desc.trim() || "未填写描述",
      count: Number.parseInt(createForm.value.count, 10) || 0,
      online: Number.parseInt(createForm.value.online, 10) || 0,
      children: parseChildren(createForm.value.children),
    });
    createForm.value = {
      name: "",
      desc: "",
      count: "0",
      online: "0",
      children: "",
    };
    createOpen.value = false;
  }

  function startEdit(group: DeviceGroup) {
    editForm.value = {
      id: group.id,
      name: group.name,
      desc: group.desc,
      count: String(group.count),
      online: String(group.online),
      children: group.children.join(", "),
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
      desc: editForm.value.desc.trim() || "未填写描述",
      count: Number.parseInt(editForm.value.count, 10) || 0,
      online: Number.parseInt(editForm.value.online, 10) || 0,
      children: parseChildren(editForm.value.children),
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

          <PageHeader title="设备分组" description="按类型或区域组织设备">
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
                  <DialogTitle>新建设备分组</DialogTitle>
                  <DialogDescription>补全设备分组新增弹框。</DialogDescription>
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
                      <FormLabel>分组描述</FormLabel>
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
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-count">
                      <FormItem>
                        <FormLabel>设备总数</FormLabel>
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
                    <FormField name="create-online">
                      <FormItem>
                        <FormLabel>在线数</FormLabel>
                        <FormControl>
                          <Input
                            value={createForm.value.online}
                            onInput={(e: Event) =>
                              (createForm.value.online = (
                                e.target as HTMLInputElement
                              ).value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <FormField name="create-children">
                    <FormItem>
                      <FormLabel>子类（逗号分隔）</FormLabel>
                      <FormControl>
                        <Input
                          value={createForm.value.children}
                          onInput={(e: Event) =>
                            (createForm.value.children = (
                              e.target as HTMLInputElement
                            ).value)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
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
                <DialogTitle>编辑设备分组</DialogTitle>
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
                    <FormLabel>分组描述</FormLabel>
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
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-count">
                    <FormItem>
                      <FormLabel>设备总数</FormLabel>
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
                  <FormField name="edit-online">
                    <FormItem>
                      <FormLabel>在线数</FormLabel>
                      <FormControl>
                        <Input
                          value={editForm.value.online}
                          onInput={(e: Event) =>
                            (editForm.value.online = (
                              e.target as HTMLInputElement
                            ).value)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <FormField name="edit-children">
                  <FormItem>
                    <FormLabel>子类（逗号分隔）</FormLabel>
                    <FormControl>
                      <Input
                        value={editForm.value.children}
                        onInput={(e: Event) =>
                          (editForm.value.children = (
                            e.target as HTMLInputElement
                          ).value)
                        }
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
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

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groups.value.map((group) => (
              <Card
                key={group.id}
                class="group cursor-pointer transition-colors hover:border-primary/30"
              >
                <CardContent class="p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FolderOpen class="h-4 w-4" />
                      </div>
                      <div>
                        <h3 class="text-sm font-medium text-card-foreground">
                          {group.name}
                        </h3>
                        <p class="text-[11px] text-muted-foreground">
                          {group.desc}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(group)}>
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            class="text-destructive"
                            onSelect={() => requestDelete(group.id)}
                          >
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <ChevronRight class="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>

                  <div class="mt-3 flex items-center gap-2 border-t border-border pt-3">
                    <Badge
                      variant="outline"
                      class="text-[10px]"
                    >{`${group.count} 设备`}</Badge>
                    <div class="flex items-center gap-1">
                      <div class="h-1.5 w-1.5 rounded-full bg-success" />
                      <span class="text-[11px] text-muted-foreground">{`${group.online} 在线`}</span>
                    </div>
                  </div>

                  <div class="mt-2 flex flex-wrap gap-1">
                    {group.children.map((child) => (
                      <span
                        key={child}
                        class="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {child}
                      </span>
                    ))}
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
