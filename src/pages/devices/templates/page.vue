<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Cpu, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

type DeviceTemplate = {
  id: string
  name: string
  protocol: string
  variables: number
  desc: string
  uses: number
}

const initialTemplates: DeviceTemplate[] = [
  { id: "DT001", name: "西门子 S7-1200", protocol: "S7", variables: 64, desc: "S7-1200 系列 PLC 标准变量模板", uses: 8 },
  { id: "DT002", name: "三菱 FX5U", protocol: "Modbus TCP", variables: 48, desc: "FX5U 系列 PLC 通信变量模板", uses: 5 },
  { id: "DT003", name: "ABB ACS580 变频器", protocol: "Modbus RTU", variables: 24, desc: "ACS580 变频器标准参数集", uses: 12 },
  { id: "DT004", name: "安科瑞电力仪表", protocol: "Modbus RTU", variables: 32, desc: "APM 系列三相电力仪表", uses: 18 },
  { id: "DT005", name: "E+H 流量计", protocol: "Modbus RTU", variables: 8, desc: "Promag 系列电磁流量计", uses: 10 },
  { id: "DT006", name: "横河温度变送器", protocol: "HART", variables: 4, desc: "YTA 系列温度变送器", uses: 22 },
  { id: "DT007", name: "通用 Modbus TCP 设备", protocol: "Modbus TCP", variables: 16, desc: "通用 Modbus TCP 从站模板", uses: 35 },
  { id: "DT008", name: "通用 OPC UA 设备", protocol: "OPC UA", variables: 32, desc: "通用 OPC UA 节点模板", uses: 14 },
]

const templates = ref<DeviceTemplate[]>(initialTemplates)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", protocol: "Modbus TCP", variables: "0", desc: "" })
const editForm = ref({ id: "", name: "", protocol: "Modbus TCP", variables: "0", desc: "" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextTemplateId() {
  const maxId = templates.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("DT", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `DT${String(maxId + 1).padStart(3, "0")}`
}

function createTemplate() {
  const name = createForm.value.name.trim()
  if (!name) return
  templates.value.unshift({
    id: nextTemplateId(),
    name,
    protocol: createForm.value.protocol.trim() || "Modbus TCP",
    variables: Number.parseInt(createForm.value.variables, 10) || 0,
    desc: createForm.value.desc.trim() || "未填写描述",
    uses: 0,
  })
  createForm.value = { name: "", protocol: "Modbus TCP", variables: "0", desc: "" }
  createOpen.value = false
}

function startEdit(template: DeviceTemplate) {
  editForm.value = {
    id: template.id,
    name: template.name,
    protocol: template.protocol,
    variables: String(template.variables),
    desc: template.desc,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = templates.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  templates.value[index] = {
    ...templates.value[index],
    name: editForm.value.name.trim() || templates.value[index].name,
    protocol: editForm.value.protocol.trim() || "Modbus TCP",
    variables: Number.parseInt(editForm.value.variables, 10) || 0,
    desc: editForm.value.desc.trim() || "未填写描述",
  }
  editOpen.value = false
}

function duplicateTemplate(template: DeviceTemplate) {
  templates.value.unshift({
    ...template,
    id: nextTemplateId(),
    name: `${template.name} 副本`,
    uses: 0,
  })
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeTemplate(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeTemplate(id: string) {
  templates.value = templates.value.filter((item) => item.id !== id)
}

export default defineComponent({
  name: "templatesPage",
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
    
          <PageHeader title="设备模板" description="预定义设备变量和通信参数模板">
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"创建模板"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建设备模板</DialogTitle>
                  <DialogDescription>补全设备模板新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>模板名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-protocol">
                      <FormItem>
                        <FormLabel>通信协议</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.protocol} onInput={(e: Event) => (createForm.value.protocol = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-variables">
                      <FormItem>
                        <FormLabel>变量数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.variables} onInput={(e: Event) => (createForm.value.variables = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <FormField name="create-desc">
                    <FormItem>
                      <FormLabel>模板描述</FormLabel>
                      <FormControl>
                        <Textarea value={createForm.value.desc} onInput={(e: Event) => (createForm.value.desc = (e.target as HTMLTextAreaElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createTemplate}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑设备模板</DialogTitle>
                <DialogDescription>{`模板编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>模板名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-protocol">
                    <FormItem>
                      <FormLabel>通信协议</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.protocol} onInput={(e: Event) => (editForm.value.protocol = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-variables">
                    <FormItem>
                      <FormLabel>变量数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.variables} onInput={(e: Event) => (editForm.value.variables = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <FormField name="edit-desc">
                  <FormItem>
                    <FormLabel>模板描述</FormLabel>
                    <FormControl>
                      <Textarea value={editForm.value.desc} onInput={(e: Event) => (editForm.value.desc = (e.target as HTMLTextAreaElement).value)} />
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
    
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.value.map((tpl) => (
              <Card key={tpl.id} class="group transition-colors hover:border-primary/30">
                <CardContent class="p-4">
                  <div class="flex items-start gap-3">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <Cpu class="h-4 w-4" />
                    </div>
                    <div class="flex-1">
                      <h3 class="text-sm font-medium text-card-foreground">{tpl.name}</h3>
                      <p class="mt-0.5 text-xs text-muted-foreground">{tpl.desc}</p>
                    </div>
                  </div>
                  <div class="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div class="flex items-center gap-2">
                      <Badge variant="outline" class="font-mono text-[10px]">{tpl.protocol}</Badge>
                      <span class="text-[11px] text-muted-foreground">{`${tpl.variables} 变量`}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                            <MoreHorizontal class="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(tpl)}>编辑</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => duplicateTemplate(tpl)}>复制</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(tpl.id)}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <span class="text-[10px] text-muted-foreground">{`${tpl.uses}x`}</span>
                    </div>
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
