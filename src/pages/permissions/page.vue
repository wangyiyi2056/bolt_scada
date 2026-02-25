<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { Plus, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

type User = {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
  lastLogin: string
  [key: string]: unknown
}

const initialUsers: User[] = [
  { id: "U001", name: "张明", email: "zhangming@scada.local", role: "超级管理员", department: "运维部", status: "在线", lastLogin: "2026-02-09 14:30" },
  { id: "U002", name: "李华", email: "lihua@scada.local", role: "系统管理员", department: "运维部", status: "在线", lastLogin: "2026-02-09 13:45" },
  { id: "U003", name: "王芳", email: "wangfang@scada.local", role: "工程师", department: "工程部", status: "在线", lastLogin: "2026-02-09 14:10" },
  { id: "U004", name: "赵强", email: "zhaoqiang@scada.local", role: "工程师", department: "工程部", status: "离线", lastLogin: "2026-02-08 18:30" },
  { id: "U005", name: "孙丽", email: "sunli@scada.local", role: "操作员", department: "生产部", status: "在线", lastLogin: "2026-02-09 08:00" },
  { id: "U006", name: "周伟", email: "zhouwei@scada.local", role: "操作员", department: "生产部", status: "离线", lastLogin: "2026-02-07 17:00" },
  { id: "U007", name: "吴刚", email: "wugang@scada.local", role: "观察者", department: "管理部", status: "离线", lastLogin: "2026-02-05 10:20" },
  { id: "U008", name: "郑雪", email: "zhengxue@scada.local", role: "工程师", department: "工程部", status: "在线", lastLogin: "2026-02-09 12:15" },
]

const roleColors: Record<string, string> = {
  超级管理员: "bg-destructive/10 text-destructive border-destructive/20",
  系统管理员: "bg-warning/10 text-warning border-warning/20",
  工程师: "bg-primary/10 text-primary border-primary/20",
  操作员: "bg-success/10 text-success border-success/20",
  观察者: "bg-muted text-muted-foreground border-border",
}

const users = ref<User[]>(initialUsers)
const createOpen = ref(false)
const createForm = ref({ name: "", email: "", role: "工程师", department: "工程部" })
const editOpen = ref(false)
const editForm = ref({ id: "", name: "", email: "", role: "工程师", department: "工程部" })

function nextUserId() {
  const maxId = users.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("U", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `U${String(maxId + 1).padStart(3, "0")}`
}

function now() {
  return new Date().toISOString().slice(0, 16).replace("T", " ")
}

function startEdit(user: User) {
  editForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
  }
  editOpen.value = true
}

function createUser() {
  const name = createForm.value.name.trim()
  if (!name) return

  users.value.unshift({
    id: nextUserId(),
    name,
    email: createForm.value.email.trim() || `${name.toLowerCase()}@scada.local`,
    role: createForm.value.role,
    department: createForm.value.department.trim() || "未分配部门",
    status: "在线",
    lastLogin: now(),
  })
  createForm.value = { name: "", email: "", role: "工程师", department: "工程部" }
  createOpen.value = false
}

function saveEdit() {
  const index = users.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return

  users.value[index] = {
    ...users.value[index],
    name: editForm.value.name.trim() || users.value[index].name,
    email: editForm.value.email.trim() || users.value[index].email,
    role: editForm.value.role,
    department: editForm.value.department.trim() || "未分配部门",
    lastLogin: now(),
  }
  editOpen.value = false
}

function disableUser(id: string) {
  users.value = users.value.map((user) => (user.id === id ? { ...user, status: "离线" } : user))
}

function resetPassword(id: string) {
  users.value = users.value.map((user) =>
    user.id === id
      ? { ...user, status: "在线", lastLogin: now() }
      : user,
  )
}

const columns: Column<User>[] = [
  {
    key: "name",
    title: "用户",
    render: (u) => (
      <div class="flex items-center gap-2.5">
        <Avatar class="h-7 w-7">
          <AvatarFallback class="bg-primary/10 text-primary">{u.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div class="text-sm font-medium text-card-foreground">{u.name}</div>
          <div class="text-[11px] text-muted-foreground">{u.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    title: "角色",
    render: (u) => (
      <Badge variant="outline" class={`text-[10px] ${roleColors[u.role] || ""}`}>
        {u.role}
      </Badge>
    ),
  },
  { key: "department", title: "部门" },
  {
    key: "status",
    title: "状态",
    render: (u) => (
      <div class="flex items-center gap-1.5">
        <div class={`h-2 w-2 rounded-full ${u.status === "在线" ? "bg-success" : "bg-muted-foreground"}`} />
        <span class="text-xs">{u.status}</span>
      </div>
    ),
  },
  { key: "lastLogin", title: "最近登录", className: "text-xs text-muted-foreground" },
  {
    key: "actions",
    title: "",
    className: "w-[40px]",
    render: (u) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => startEdit(u)}>编辑</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => resetPassword(u.id)}>重置密码</DropdownMenuItem>
          <DropdownMenuItem class="text-destructive" onSelect={() => disableUser(u.id)}>禁用</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default defineComponent({
  name: "permissionsPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="用户管理" description="管理系统用户、角色和访问权限">
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>添加用户</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增用户</DialogTitle>
                  <DialogDescription>补全原来缺失的新增用户弹框内容。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="name">
                    <FormItem>
                      <FormLabel>姓名</FormLabel>
                      <FormControl>
                        <Input
                          value={createForm.value.name}
                          onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)}
                          placeholder="请输入姓名"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="email">
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input
                          value={createForm.value.email}
                          onInput={(e: Event) => (createForm.value.email = (e.target as HTMLInputElement).value)}
                          placeholder="请输入邮箱"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="role">
                    <FormItem>
                      <FormLabel>角色</FormLabel>
                      <FormControl>
                        <Select modelValue={createForm.value.role} onChange={(v: string) => (createForm.value.role = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="超级管理员">超级管理员</SelectItem>
                            <SelectItem value="系统管理员">系统管理员</SelectItem>
                            <SelectItem value="工程师">工程师</SelectItem>
                            <SelectItem value="操作员">操作员</SelectItem>
                            <SelectItem value="观察者">观察者</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="department">
                    <FormItem>
                      <FormLabel>部门</FormLabel>
                      <FormControl>
                        <Input
                          value={createForm.value.department}
                          onInput={(e: Event) => (createForm.value.department = (e.target as HTMLInputElement).value)}
                          placeholder="请输入部门"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createUser}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑用户</DialogTitle>
                <DialogDescription>{`用户编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-email">
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.email} onInput={(e: Event) => (editForm.value.email = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-department">
                  <FormItem>
                    <FormLabel>部门</FormLabel>
                    <FormControl>
                      <Input
                        value={editForm.value.department}
                        onInput={(e: Event) => (editForm.value.department = (e.target as HTMLInputElement).value)}
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-role">
                  <FormItem>
                    <FormLabel>角色</FormLabel>
                    <FormControl>
                      <Select modelValue={editForm.value.role} onChange={(v: string) => (editForm.value.role = v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="超级管理员">超级管理员</SelectItem>
                          <SelectItem value="系统管理员">系统管理员</SelectItem>
                          <SelectItem value="工程师">工程师</SelectItem>
                          <SelectItem value="操作员">操作员</SelectItem>
                          <SelectItem value="观察者">观察者</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </FormField>
              </Form>
              <DialogFooter>
                <Button variant="outline" onClick={() => (editOpen.value = false)}>取消</Button>
                <Button onClick={saveEdit}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    
          <DataTable columns={columns} data={users.value} searchPlaceholder="搜索用户名、邮箱..." />
        </div>
      )
  }
})
</script>
