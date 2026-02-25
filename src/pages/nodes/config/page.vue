<script lang="tsx">
import { defineComponent } from "vue"
import { Save } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/ui/page-header"

export default defineComponent({
  name: "configPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="节点配置" description="配置节点通用参数和运行策略">
            <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save class="h-3.5 w-3.5" />
              <span>{"保存配置"}</span>
            </Button>
          </PageHeader>
    
          <div class="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"心跳检测"}</CardTitle>
                <CardDescription>{"节点存活检测和故障转移配置"}</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"心跳间隔 (秒)"}</Label>
                  <Input type="number" defaultValue="10" class="h-8 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"超时判定 (秒)"}</Label>
                  <Input type="number" defaultValue="30" class="h-8 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"最大重试次数"}</Label>
                  <Input type="number" defaultValue="3" class="h-8 text-sm" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"自动故障转移"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"节点离线时自动将任务迁移到备用节点"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"资源阈值"}</CardTitle>
                <CardDescription>{"节点资源使用告警阈值设置"}</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"CPU 告警阈值 (%)"}</Label>
                  <Input type="number" defaultValue="80" class="h-8 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"内存告警阈值 (%)"}</Label>
                  <Input type="number" defaultValue="85" class="h-8 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"磁盘告警阈值 (%)"}</Label>
                  <Input type="number" defaultValue="90" class="h-8 text-sm" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"资源超限告警"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"超过阈值时自动生成报警"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"负载均衡"}</CardTitle>
                <CardDescription>{"多节点间的任务分配策略"}</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"均衡策略"}</Label>
                  <Select defaultValue="least">
                    <SelectTrigger class="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">{"轮询分配"}</SelectItem>
                      <SelectItem value="least">{"最少连接"}</SelectItem>
                      <SelectItem value="hash">{"一致性哈希"}</SelectItem>
                      <SelectItem value="weight">{"加权分配"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"启用负载均衡"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"在多个采集节点间自动分配设备"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"日志配置"}</CardTitle>
                <CardDescription>{"节点运行日志收集和管理"}</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"日志级别"}</Label>
                  <Select defaultValue="info">
                    <SelectTrigger class="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">{"DEBUG"}</SelectItem>
                      <SelectItem value="info">{"INFO"}</SelectItem>
                      <SelectItem value="warn">{"WARN"}</SelectItem>
                      <SelectItem value="error">{"ERROR"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"日志保留天数"}</Label>
                  <Input type="number" defaultValue="30" class="h-8 text-sm" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"集中收集"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"将所有节点日志上传至中心服务器"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
  }
})
</script>
