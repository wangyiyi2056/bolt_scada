<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type DataPermission = {
  id: string
  role: string
  scope: string
  resource: string
  nodes: string
  devices: string
  variables: string
  desc: string
  [key: string]: unknown
}

const initialDataPermissions: DataPermission[] = [
  { id: "DP-001", role: "超级管理员", scope: "全局", resource: "所有资源", nodes: "全部", devices: "全部", variables: "全部", desc: "不受数据权限限制" },
  { id: "DP-002", role: "系统管理员", scope: "全局", resource: "所有资源", nodes: "全部", devices: "全部", variables: "全部", desc: "不受数据权限限制" },
  { id: "DP-003", role: "工程师 (A区)", scope: "区域", resource: "A 区设备和变量", nodes: "主控-01, 采集-02", devices: "A区 12 台", variables: "A区 1,024 个", desc: "仅可访问 A 区相关数据" },
  { id: "DP-004", role: "工程师 (B区)", scope: "区域", resource: "B 区设备和变量", nodes: "采集-05, 网关-06", devices: "B区 8 台", variables: "B区 768 个", desc: "仅可访问 B 区相关数据" },
  { id: "DP-005", role: "操作员 (A区)", scope: "区域", resource: "A 区监控数据", nodes: "主控-01, 采集-02", devices: "A区 12 台(只读)", variables: "A区 1,024 个(只读)", desc: "只读 A 区数据" },
  { id: "DP-006", role: "操作员 (B区)", scope: "区域", resource: "B 区监控数据", nodes: "采集-05, 网关-06", devices: "B区 8 台(只读)", variables: "B区 768 个(只读)", desc: "只读 B 区数据" },
  { id: "DP-007", role: "观察者", scope: "受限", resource: "仪表盘数据", nodes: "无", devices: "无", variables: "汇总数据(只读)", desc: "仅可查看聚合仪表盘" },
]

const dataPermissions = ref<DataPermission[]>(initialDataPermissions)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ role: "", scope: "区域", resource: "", nodes: "", devices: "", variables: "", desc: "" })
const editForm = ref({ id: "", role: "", scope: "区域", resource: "", nodes: "", devices: "", variables: "", desc: "" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextPermissionId() {
  const maxId = dataPermissions.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("DP-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `DP-${String(maxId + 1).padStart(3, "0")}`
}

function createPermission() {
  const role = createForm.value.role.trim()
  if (!role) return
  dataPermissions.value.unshift({
    id: nextPermissionId(),
    role,
    scope: createForm.value.scope,
    resource: createForm.value.resource.trim() || "未设置资源",
    nodes: createForm.value.nodes.trim() || "无",
    devices: createForm.value.devices.trim() || "无",
    variables: createForm.value.variables.trim() || "无",
    desc: createForm.value.desc.trim() || "未填写说明",
  })
  createForm.value = { role: "", scope: "区域", resource: "", nodes: "", devices: "", variables: "", desc: "" }
  createOpen.value = false
}

function startEdit(permission: DataPermission) {
  editForm.value = {
    id: permission.id,
    role: permission.role,
    scope: permission.scope,
    resource: permission.resource,
    nodes: permission.nodes,
    devices: permission.devices,
    variables: permission.variables,
    desc: permission.desc,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = dataPermissions.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  dataPermissions.value[index] = {
    ...dataPermissions.value[index],
    role: editForm.value.role.trim() || dataPermissions.value[index].role,
    scope: editForm.value.scope,
    resource: editForm.value.resource.trim() || "未设置资源",
    nodes: editForm.value.nodes.trim() || "无",
    devices: editForm.value.devices.trim() || "无",
    variables: editForm.value.variables.trim() || "无",
    desc: editForm.value.desc.trim() || "未填写说明",
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removePermission(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removePermission(id: string) {
  dataPermissions.value = dataPermissions.value.filter((item) => item.id !== id)
}

const scopeColors: Record<string, string> = {
  "全局": "bg-destructive/10 text-destructive border-destructive/20",
  "区域": "bg-primary/10 text-primary border-primary/20",
  "受限": "bg-muted text-muted-foreground border-border",
}

const columns: Column<DataPermission>[] = [
  { key: "role", title: "角色", render: (d) => <span class="font-medium text-card-foreground">{d.role}</span> },
  { key: "scope", title: "范围", render: (d) => <Badge variant="outline" class={`text-[10px] ${scopeColors[d.scope] || ""}`}>{d.scope}</Badge> },
  { key: "resource", title: "资源描述" },
  { key: "nodes", title: "节点", className: "text-xs" },
  { key: "devices", title: "设备", className: "text-xs" },
  { key: "variables", title: "变量", className: "text-xs" },
  {
    key: "actions",
    title: "",
    className: "w-[40px]",
    render: (d) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => startEdit(d)}>编辑</DropdownMenuItem>
          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(d.id)}>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default defineComponent({
  name: "dataPage",
  setup() {
    return () => (
        <div class="page-shell">
          <ConfirmDialog
            open={deleteOpen.value}
            onOpenChange={(open: boolean) => {
              deleteOpen.value = open
              if (!open) pendingDeleteId.value = null
            }}
            title="确认删除"
            description="删除后不可恢复，是否继续？"
            onConfirm={confirmDelete}
          />
    
          <PageHeader title="数据权限" description="配置基于角色的数据访问范围">
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"新建规则"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建数据权限</DialogTitle>
                  <DialogDescription>创建角色的数据访问规则。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-role">
                    <FormItem>
                      <FormLabel>角色</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.role} onInput={(e: Event) => (createForm.value.role = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-scope">
                    <FormItem>
                      <FormLabel>范围</FormLabel>
                      <FormControl>
                        <Select modelValue={createForm.value.scope} onChange={(v: string) => (createForm.value.scope = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="全局">全局</SelectItem>
                            <SelectItem value="区域">区域</SelectItem>
                            <SelectItem value="受限">受限</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-resource">
                    <FormItem>
                      <FormLabel>资源描述</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.resource} onInput={(e: Event) => (createForm.value.resource = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-nodes">
                      <FormItem>
                        <FormLabel>节点</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.nodes} onInput={(e: Event) => (createForm.value.nodes = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-devices">
                      <FormItem>
                        <FormLabel>设备</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.devices} onInput={(e: Event) => (createForm.value.devices = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-variables">
                      <FormItem>
                        <FormLabel>变量</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.variables} onInput={(e: Event) => (createForm.value.variables = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createPermission}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑数据权限</DialogTitle>
                <DialogDescription>{`规则编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-role">
                  <FormItem>
                    <FormLabel>角色</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.role} onInput={(e: Event) => (editForm.value.role = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-scope">
                  <FormItem>
                    <FormLabel>范围</FormLabel>
                    <FormControl>
                      <Select modelValue={editForm.value.scope} onChange={(v: string) => (editForm.value.scope = v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="全局">全局</SelectItem>
                          <SelectItem value="区域">区域</SelectItem>
                          <SelectItem value="受限">受限</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-resource">
                  <FormItem>
                    <FormLabel>资源描述</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.resource} onInput={(e: Event) => (editForm.value.resource = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-nodes">
                    <FormItem>
                      <FormLabel>节点</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.nodes} onInput={(e: Event) => (editForm.value.nodes = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-devices">
                    <FormItem>
                      <FormLabel>设备</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.devices} onInput={(e: Event) => (editForm.value.devices = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-variables">
                    <FormItem>
                      <FormLabel>变量</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.variables} onInput={(e: Event) => (editForm.value.variables = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
              </Form>
              <DialogFooter>
                <Button variant="outline" onClick={() => (editOpen.value = false)}>取消</Button>
                <Button onClick={saveEdit}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    
          <DataTable columns={columns} data={dataPermissions.value} searchPlaceholder="搜索角色、资源..." />
        </div>
      )
  }
})
</script>
