<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Mail, MessageSquare, Phone, Webhook, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/page-header"
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

type Strategy = {
  id: string
  name: string
  channel: string
  icon: any
  targets: string
  levels: string[]
  delay: string
  cooldown: string
  enabled: boolean
}

const channelIcons: Record<string, any> = {
  邮件: Mail,
  短信: Phone,
  企业微信: MessageSquare,
  钉钉: MessageSquare,
  Webhook: Webhook,
}

const initialStrategies: Strategy[] = [
  { id: "NS-001", name: "邮件通知 - 紧急报警", channel: "邮件", icon: Mail, targets: "运维组全员 (5人)", levels: ["紧急"], delay: "立即", cooldown: "5 分钟", enabled: true },
  { id: "NS-002", name: "短信通知 - 紧急报警", channel: "短信", icon: Phone, targets: "值班负责人", levels: ["紧急"], delay: "立即", cooldown: "10 分钟", enabled: true },
  { id: "NS-003", name: "企微群通知", channel: "企业微信", icon: MessageSquare, targets: "#SCADA监控群", levels: ["紧急", "重要"], delay: "30 秒", cooldown: "3 分钟", enabled: true },
  { id: "NS-004", name: "钉钉群通知", channel: "钉钉", icon: MessageSquare, targets: "#设备运维群", levels: ["紧急", "重要", "次要"], delay: "1 分钟", cooldown: "5 分钟", enabled: false },
  { id: "NS-005", name: "Webhook 推送", channel: "Webhook", icon: Webhook, targets: "https://api.example.com/alarm", levels: ["紧急", "重要"], delay: "立即", cooldown: "无", enabled: true },
  { id: "NS-006", name: "邮件通知 - 日报汇总", channel: "邮件", icon: Mail, targets: "管理层 (3人)", levels: ["紧急", "重要", "次要"], delay: "每日 08:00", cooldown: "24 小时", enabled: true },
]

const strategies = ref<Strategy[]>(initialStrategies)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", channel: "邮件", targets: "", levels: "紧急", delay: "立即", cooldown: "5 分钟", enabled: true })
const editForm = ref({ id: "", name: "", channel: "邮件", targets: "", levels: "紧急", delay: "立即", cooldown: "5 分钟", enabled: true })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextStrategyId() {
  const maxId = strategies.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("NS-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `NS-${String(maxId + 1).padStart(3, "0")}`
}

function parseLevels(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function createStrategy() {
  const name = createForm.value.name.trim()
  if (!name) return
  strategies.value.unshift({
    id: nextStrategyId(),
    name,
    channel: createForm.value.channel,
    icon: channelIcons[createForm.value.channel] || MessageSquare,
    targets: createForm.value.targets.trim() || "未设置",
    levels: parseLevels(createForm.value.levels),
    delay: createForm.value.delay.trim() || "立即",
    cooldown: createForm.value.cooldown.trim() || "无",
    enabled: createForm.value.enabled,
  })
  createForm.value = { name: "", channel: "邮件", targets: "", levels: "紧急", delay: "立即", cooldown: "5 分钟", enabled: true }
  createOpen.value = false
}

function startEdit(strategy: Strategy) {
  editForm.value = {
    id: strategy.id,
    name: strategy.name,
    channel: strategy.channel,
    targets: strategy.targets,
    levels: strategy.levels.join(", "),
    delay: strategy.delay,
    cooldown: strategy.cooldown,
    enabled: strategy.enabled,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = strategies.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  strategies.value[index] = {
    ...strategies.value[index],
    name: editForm.value.name.trim() || strategies.value[index].name,
    channel: editForm.value.channel,
    icon: channelIcons[editForm.value.channel] || MessageSquare,
    targets: editForm.value.targets.trim() || "未设置",
    levels: parseLevels(editForm.value.levels),
    delay: editForm.value.delay.trim() || "立即",
    cooldown: editForm.value.cooldown.trim() || "无",
    enabled: editForm.value.enabled,
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeStrategy(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeStrategy(id: string) {
  strategies.value = strategies.value.filter((item) => item.id !== id)
}

function updateEnabled(id: string, enabled: boolean) {
  strategies.value = strategies.value.map((item) => (item.id === id ? { ...item, enabled } : item))
}

const levelColors: Record<string, string> = {
  "紧急": "bg-destructive/10 text-destructive border-destructive/20",
  "重要": "bg-warning/10 text-warning border-warning/20",
  "次要": "bg-muted text-muted-foreground border-border",
}

export default defineComponent({
  name: "notificationsPage",
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
    
          <PageHeader title="通知策略" description="配置报警通知渠道和推送规则">
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"新建策略"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建通知策略</DialogTitle>
                  <DialogDescription>补全通知策略新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>策略名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-channel">
                    <FormItem>
                      <FormLabel>通知渠道</FormLabel>
                      <FormControl>
                        <Select modelValue={createForm.value.channel} onChange={(v: string) => (createForm.value.channel = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="邮件">邮件</SelectItem>
                            <SelectItem value="短信">短信</SelectItem>
                            <SelectItem value="企业微信">企业微信</SelectItem>
                            <SelectItem value="钉钉">钉钉</SelectItem>
                            <SelectItem value="Webhook">Webhook</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-targets">
                    <FormItem>
                      <FormLabel>接收目标</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.targets} onInput={(e: Event) => (createForm.value.targets = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-levels">
                    <FormItem>
                      <FormLabel>触发级别（逗号分隔）</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.levels} onInput={(e: Event) => (createForm.value.levels = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-delay">
                      <FormItem>
                        <FormLabel>发送延迟</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.delay} onInput={(e: Event) => (createForm.value.delay = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-cooldown">
                      <FormItem>
                        <FormLabel>冷却时间</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.cooldown} onInput={(e: Event) => (createForm.value.cooldown = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createStrategy}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑通知策略</DialogTitle>
                <DialogDescription>{`策略编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>策略名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-channel">
                  <FormItem>
                    <FormLabel>通知渠道</FormLabel>
                    <FormControl>
                      <Select modelValue={editForm.value.channel} onChange={(v: string) => (editForm.value.channel = v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="邮件">邮件</SelectItem>
                          <SelectItem value="短信">短信</SelectItem>
                          <SelectItem value="企业微信">企业微信</SelectItem>
                          <SelectItem value="钉钉">钉钉</SelectItem>
                          <SelectItem value="Webhook">Webhook</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-targets">
                  <FormItem>
                    <FormLabel>接收目标</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.targets} onInput={(e: Event) => (editForm.value.targets = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-levels">
                  <FormItem>
                    <FormLabel>触发级别（逗号分隔）</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.levels} onInput={(e: Event) => (editForm.value.levels = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-delay">
                    <FormItem>
                      <FormLabel>发送延迟</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.delay} onInput={(e: Event) => (editForm.value.delay = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-cooldown">
                    <FormItem>
                      <FormLabel>冷却时间</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.cooldown} onInput={(e: Event) => (editForm.value.cooldown = (e.target as HTMLInputElement).value)} />
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
    
          <div class="grid gap-4 lg:grid-cols-2">
            {strategies.value.map((s) => {
              const Icon = s.icon
              return (
                <Card key={s.id} class={`transition-colors hover:border-primary/30 ${!s.enabled ? "opacity-60" : ""}`}>
                  <CardHeader class="pb-3">
                    <div class="flex items-start justify-between">
                      <div class="flex items-center gap-2.5">
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                          <Icon class="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle class="text-sm font-medium text-card-foreground">{s.name}</CardTitle>
                          <Badge variant="outline" class="mt-0.5 text-[10px] font-mono">{s.channel}</Badge>
                        </div>
                      </div>
                      <div class="flex items-center gap-1">
                        <Switch modelValue={s.enabled} onChange={(value: boolean) => updateEnabled(s.id, value)} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
                              <MoreHorizontal class="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => startEdit(s)}>编辑</DropdownMenuItem>
                            <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(s.id)}>删除</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent class="pt-0">
                    <div class="flex flex-col gap-2 text-[11px]">
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">{"接收目标"}</span>
                        <span class="text-card-foreground">{s.targets}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">{"触发级别"}</span>
                        <div class="flex items-center gap-1">
                          {s.levels.map((l) => (
                            <Badge key={l} variant="outline" class={`text-[9px] ${levelColors[l] || ""}`}>{l}</Badge>
                          ))}
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">{"发送延迟"}</span>
                        <span class="text-card-foreground">{s.delay}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">{"冷却时间"}</span>
                        <span class="text-card-foreground">{s.cooldown}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )
  }
})
</script>
