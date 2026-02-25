<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { MoreHorizontal, Plus, Shield, Users } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/ui/page-header"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

type Role = {
  id: string
  name: string
  desc: string
  users: number
  permissions: string[]
  color: string
}

const roleColorOptions = [
  { value: "bg-destructive/10 text-destructive border-destructive/20", label: "高权限（红）" },
  { value: "bg-warning/10 text-warning border-warning/20", label: "管理（黄）" },
  { value: "bg-primary/10 text-primary border-primary/20", label: "工程（蓝）" },
  { value: "bg-success/10 text-success border-success/20", label: "操作（绿）" },
  { value: "bg-muted text-muted-foreground border-border", label: "只读（灰）" },
]

const permissionGroups = [
  {
    name: "平台级",
    items: ["仪表盘查看", "系统配置", "日志查看", "用户管理"],
  },
  {
    name: "工程级",
    items: ["项目管理", "设备管理", "变量管理", "通信管理"],
  },
  {
    name: "运行级",
    items: ["报警管理", "报警处理", "脚本管理", "发布部署"],
  },
]

const roles = ref<Role[]>([
  {
    id: "R-001",
    name: "超级管理员",
    desc: "拥有系统所有权限，可管理其他管理员",
    users: 1,
    permissions: ["全部权限"],
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
  {
    id: "R-002",
    name: "系统管理员",
    desc: "负责系统配置和用户管理，不含数据删除权限",
    users: 1,
    permissions: ["用户管理", "系统配置", "日志查看", "设备管理", "变量管理"],
    color: "bg-warning/10 text-warning border-warning/20",
  },
  {
    id: "R-003",
    name: "工程师",
    desc: "负责工程配置、设备调试和脚本编写",
    users: 3,
    permissions: ["项目管理", "设备管理", "变量管理", "通信管理", "脚本管理", "报警管理"],
    color: "bg-primary/10 text-primary border-primary/20",
  },
  {
    id: "R-004",
    name: "操作员",
    desc: "负责日常监控和报警处理，只读设备配置",
    users: 2,
    permissions: ["仪表盘查看", "报警处理", "变量监控", "日志查看"],
    color: "bg-success/10 text-success border-success/20",
  },
  {
    id: "R-005",
    name: "观察者",
    desc: "仅可查看仪表盘和实时数据，无操作权限",
    users: 1,
    permissions: ["仪表盘查看", "变量监控(只读)"],
    color: "bg-muted text-muted-foreground border-border",
  },
])

const createOpen = ref(false)
const editOpen = ref(false)

const createForm = ref<Omit<Role, "id">>({
  name: "",
  desc: "",
  users: 0,
  permissions: ["仪表盘查看"],
  color: roleColorOptions[2].value,
})

const editForm = ref<Role>({
  id: "",
  name: "",
  desc: "",
  users: 0,
  permissions: [],
  color: roleColorOptions[2].value,
})
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function resetCreateForm() {
  createForm.value = {
    name: "",
    desc: "",
    users: 0,
    permissions: ["仪表盘查看"],
    color: roleColorOptions[2].value,
  }
}

function togglePermission(target: { permissions: string[] }, permission: string, enabled: boolean) {
  if (enabled) {
    if (!target.permissions.includes(permission)) {
      target.permissions = [...target.permissions, permission]
    }
    return
  }
  target.permissions = target.permissions.filter((p) => p !== permission)
}

function createRole() {
  const name = createForm.value.name.trim()
  if (!name) {
    return
  }
  const nextIndex = roles.value.length + 1
  const id = `R-${String(nextIndex).padStart(3, "0")}`
  roles.value = [
    ...roles.value,
    {
      id,
      name,
      desc: createForm.value.desc.trim() || "未填写角色描述",
      users: createForm.value.users,
      permissions: createForm.value.permissions.length ? createForm.value.permissions : ["仪表盘查看"],
      color: createForm.value.color,
    },
  ]
  createOpen.value = false
  resetCreateForm()
}

function startEdit(role: Role) {
  editForm.value = {
    ...role,
    permissions: [...role.permissions],
  }
  editOpen.value = true
}

function saveEdit() {
  if (!editForm.value.id || !editForm.value.name.trim()) {
    return
  }
  roles.value = roles.value.map((role) =>
    role.id === editForm.value.id
      ? {
          ...role,
          name: editForm.value.name.trim(),
          desc: editForm.value.desc.trim() || "未填写角色描述",
          permissions: editForm.value.permissions.length ? editForm.value.permissions : ["仪表盘查看"],
          color: editForm.value.color,
        }
      : role,
  )
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeRole(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeRole(id: string) {
  roles.value = roles.value.filter((role) => role.id !== id)
}

function duplicateRole(role: Role) {
  const nextIndex = roles.value.length + 1
  roles.value = [
    ...roles.value,
    {
      ...role,
      id: `R-${String(nextIndex).padStart(3, "0")}`,
      name: `${role.name}-副本`,
      users: 0,
      permissions: [...role.permissions],
    },
  ]
}

export default defineComponent({
  name: "rolesPage",
  setup() {
    return () => (
        <div class="page-shell">
          <ConfirmDialog
            open={deleteOpen.value}
            onUpdate:open={(open: boolean) => {
              deleteOpen.value = open
              if (!open) pendingDeleteId.value = null
            }}
            title="确认删除"
            description="删除后不可恢复，是否继续？"
            onConfirm={confirmDelete}
          />
    
          <PageHeader title="角色管理" description="配置系统角色和权限模板">
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={resetCreateForm}
                >
                  <Plus class="h-3.5 w-3.5" />
                  <span>新建角色</span>
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[680px]">
                <DialogHeader>
                  <DialogTitle>新建角色</DialogTitle>
                  <DialogDescription>配置角色基础信息和权限范围。</DialogDescription>
                </DialogHeader>
    
                <Form class="grid gap-4">
                  <div class="grid gap-4 md:grid-cols-2">
                    <FormField name="name">
                      <FormItem>
                        <FormLabel>角色名称</FormLabel>
                        <FormControl>
                          <Input
                            value={createForm.value.name}
                            placeholder="例如：值班工程师"
                            onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)}
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="color">
                      <FormItem>
                        <FormLabel>角色样式</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.color} onChange={(value: string) => (createForm.value.color = value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {roleColorOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
    
                  <FormField name="desc">
                    <FormItem>
                      <FormLabel>角色描述</FormLabel>
                      <FormControl>
                        <Textarea
                          value={createForm.value.desc}
                          placeholder="输入该角色的职责说明"
                          onInput={(e: Event) => (createForm.value.desc = (e.target as HTMLTextAreaElement).value)}
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
    
                  <div class="grid gap-3">
                    <div class="text-sm font-medium text-card-foreground">权限设置</div>
                    {permissionGroups.map((group) => (
                      <div key={group.name} class="rounded-lg border border-border p-3">
                        <div class="mb-2 text-xs font-medium text-muted-foreground">{group.name}</div>
                        <div class="grid gap-2 md:grid-cols-2">
                          {group.items.map((permission) => (
                            <div key={permission} class="flex items-center justify-between rounded-md border border-border px-2.5 py-2">
                              <span class="text-xs text-card-foreground">{permission}</span>
                              <Switch
                                modelValue={createForm.value.permissions.includes(permission)}
                                {...({
                                  "onUpdate:modelValue": (checked: boolean) =>
                                    togglePermission(createForm.value, permission, checked),
                                } as any)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Form>
    
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">取消</Button>
                  </DialogClose>
                  <Button onClick={createRole}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent class="sm:max-w-[680px]">
              <DialogHeader>
                <DialogTitle>编辑角色</DialogTitle>
                <DialogDescription>{`角色编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
    
              <Form class="grid gap-4">
                <div class="grid gap-4 md:grid-cols-2">
                  <FormField name="edit-name">
                    <FormItem>
                      <FormLabel>角色名称</FormLabel>
                      <FormControl>
                        <Input
                          value={editForm.value.name}
                          onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)}
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-color">
                    <FormItem>
                      <FormLabel>角色样式</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.color} onChange={(value: string) => (editForm.value.color = value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {roleColorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
    
                <FormField name="edit-desc">
                  <FormItem>
                    <FormLabel>角色描述</FormLabel>
                    <FormControl>
                      <Textarea
                        value={editForm.value.desc}
                        onInput={(e: Event) => (editForm.value.desc = (e.target as HTMLTextAreaElement).value)}
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
    
                <div class="grid gap-3">
                  <div class="text-sm font-medium text-card-foreground">权限设置</div>
                  {permissionGroups.map((group) => (
                    <div key={group.name} class="rounded-lg border border-border p-3">
                      <div class="mb-2 text-xs font-medium text-muted-foreground">{group.name}</div>
                      <div class="grid gap-2 md:grid-cols-2">
                        {group.items.map((permission) => (
                          <div key={permission} class="flex items-center justify-between rounded-md border border-border px-2.5 py-2">
                            <span class="text-xs text-card-foreground">{permission}</span>
                            <Switch
                              modelValue={editForm.value.permissions.includes(permission)}
                              {...({
                                "onUpdate:modelValue": (checked: boolean) =>
                                  togglePermission(editForm.value, permission, checked),
                              } as any)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Form>
    
              <DialogFooter>
                <Button variant="outline" onClick={() => (editOpen.value = false)}>取消</Button>
                <Button onClick={saveEdit}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    
          <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {roles.value.map((role) => (
              <Card key={role.id} class="transition-colors hover:border-primary/30">
                <CardHeader class="pb-3">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <Shield class="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle class="text-sm font-medium text-card-foreground">{role.name}</CardTitle>
                        <Badge variant="outline" class={`mt-0.5 text-[10px] ${role.color}`}>{role.name}</Badge>
                      </div>
                    </div>
    
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Users class="h-3 w-3" />
                        <span>{`${role.users} 人`}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(role)}>编辑角色</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => duplicateRole(role)}>复制角色</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(role.id)}>删除角色</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent class="pt-0">
                  <p class="text-xs leading-relaxed text-muted-foreground">{role.desc}</p>
                  <div class="mt-3 flex flex-wrap gap-1 border-t border-border pt-3">
                    {role.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" class="text-[10px] font-normal">{permission}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
  }
})
</script>
