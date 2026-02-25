<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, FolderOpen, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/ui/page-header"
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

type AlarmGroup = {
  id: string
  name: string
  desc: string
  rules: number
  active: number
  level: string
  color: string
}

const levelMeta: Record<string, string> = {
  紧急: "bg-destructive/10 text-destructive border-destructive/20",
  重要: "bg-warning/10 text-warning border-warning/20",
  次要: "bg-muted text-muted-foreground border-border",
}

const initialAlarmGroups: AlarmGroup[] = [
  { id: "AG-001", name: "温度报警", desc: "锅炉、管道、环境温度相关报警", rules: 18, active: 3, level: "紧急", color: "bg-destructive/10 text-destructive border-destructive/20" },
  { id: "AG-002", name: "压力报警", desc: "管道压力、容器压力相关报警", rules: 12, active: 1, level: "紧急", color: "bg-destructive/10 text-destructive border-destructive/20" },
  { id: "AG-003", name: "通信报警", desc: "设备通信中断、超时相关报警", rules: 24, active: 2, level: "重要", color: "bg-warning/10 text-warning border-warning/20" },
  { id: "AG-004", name: "电气报警", desc: "电压、电流、功率异常报警", rules: 15, active: 0, level: "重要", color: "bg-warning/10 text-warning border-warning/20" },
  { id: "AG-005", name: "液位报警", desc: "水箱、料仓液位相关报警", rules: 8, active: 0, level: "次要", color: "bg-muted text-muted-foreground border-border" },
  { id: "AG-006", name: "设备健康", desc: "设备运行时间、振动、健康指数报警", rules: 10, active: 1, level: "次要", color: "bg-muted text-muted-foreground border-border" },
  { id: "AG-007", name: "系统资源", desc: "CPU、内存、磁盘资源占用报警", rules: 6, active: 1, level: "次要", color: "bg-muted text-muted-foreground border-border" },
  { id: "AG-008", name: "安全联锁", desc: "安全联锁动作、紧急停机相关报警", rules: 5, active: 0, level: "紧急", color: "bg-destructive/10 text-destructive border-destructive/20" },
]

const alarmGroups = ref<AlarmGroup[]>(initialAlarmGroups)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", desc: "", rules: "0", active: "0", level: "重要" })
const editForm = ref({ id: "", name: "", desc: "", rules: "0", active: "0", level: "重要" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextGroupId() {
  const maxId = alarmGroups.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("AG-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `AG-${String(maxId + 1).padStart(3, "0")}`
}

function createGroup() {
  const name = createForm.value.name.trim()
  if (!name) return
  alarmGroups.value.unshift({
    id: nextGroupId(),
    name,
    desc: createForm.value.desc.trim() || "未填写描述",
    rules: Number.parseInt(createForm.value.rules, 10) || 0,
    active: Number.parseInt(createForm.value.active, 10) || 0,
    level: createForm.value.level,
    color: levelMeta[createForm.value.level] || levelMeta.次要,
  })
  createForm.value = { name: "", desc: "", rules: "0", active: "0", level: "重要" }
  createOpen.value = false
}

function startEdit(group: AlarmGroup) {
  editForm.value = {
    id: group.id,
    name: group.name,
    desc: group.desc,
    rules: String(group.rules),
    active: String(group.active),
    level: group.level,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = alarmGroups.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  alarmGroups.value[index] = {
    ...alarmGroups.value[index],
    name: editForm.value.name.trim() || alarmGroups.value[index].name,
    desc: editForm.value.desc.trim() || "未填写描述",
    rules: Number.parseInt(editForm.value.rules, 10) || 0,
    active: Number.parseInt(editForm.value.active, 10) || 0,
    level: editForm.value.level,
    color: levelMeta[editForm.value.level] || levelMeta.次要,
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeGroup(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeGroup(id: string) {
  alarmGroups.value = alarmGroups.value.filter((item) => item.id !== id)
}

export default defineComponent({
  name: "groupsPage",
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
    
          <PageHeader title="报警分组" description="按类别管理和组织报警规则">
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"新建分组"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建报警分组</DialogTitle>
                  <DialogDescription>补全报警分组新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>分组名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-desc">
                    <FormItem>
                      <FormLabel>描述</FormLabel>
                      <FormControl>
                        <Textarea value={createForm.value.desc} onInput={(e: Event) => (createForm.value.desc = (e.target as HTMLTextAreaElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-rules">
                      <FormItem>
                        <FormLabel>规则数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.rules} onInput={(e: Event) => (createForm.value.rules = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-active">
                      <FormItem>
                        <FormLabel>活跃数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.active} onInput={(e: Event) => (createForm.value.active = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-level">
                      <FormItem>
                        <FormLabel>级别</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.level} onChange={(v: string) => (createForm.value.level = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="紧急">紧急</SelectItem>
                              <SelectItem value="重要">重要</SelectItem>
                              <SelectItem value="次要">次要</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createGroup}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑报警分组</DialogTitle>
                <DialogDescription>{`分组编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>分组名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-desc">
                  <FormItem>
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Textarea value={editForm.value.desc} onInput={(e: Event) => (editForm.value.desc = (e.target as HTMLTextAreaElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-rules">
                    <FormItem>
                      <FormLabel>规则数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.rules} onInput={(e: Event) => (editForm.value.rules = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-active">
                    <FormItem>
                      <FormLabel>活跃数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.active} onInput={(e: Event) => (editForm.value.active = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-level">
                    <FormItem>
                      <FormLabel>级别</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.level} onChange={(v: string) => (editForm.value.level = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="紧急">紧急</SelectItem>
                            <SelectItem value="重要">重要</SelectItem>
                            <SelectItem value="次要">次要</SelectItem>
                          </SelectContent>
                        </Select>
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
    
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {alarmGroups.value.map((group) => (
              <Card key={group.id} class="group cursor-pointer transition-colors hover:border-primary/30">
                <CardHeader class="pb-2">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <FolderOpen class="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle class="text-sm font-medium text-card-foreground">{group.name}</CardTitle>
                        <Badge variant="outline" class={`mt-0.5 text-[10px] ${group.color}`}>
                          {group.level}
                        </Badge>
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      {group.active > 0 && (
                        <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-medium text-destructive-foreground">
                          {group.active}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(group)}>编辑</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(group.id)}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent class="pt-0">
                  <p class="text-xs text-muted-foreground leading-relaxed">{group.desc}</p>
                  <div class="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
                    <span>{`${group.rules} 条规则`}</span>
                    <span>{group.active > 0 ? `${group.active} 条活跃` : "无活跃报警"}</span>
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
