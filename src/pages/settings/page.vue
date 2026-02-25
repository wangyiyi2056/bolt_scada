<script lang="tsx">
import { defineComponent } from "vue"
import { Save } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/ui/page-header"

export default defineComponent({
  name: "settingsPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="基础配置" description="系统全局参数和基础设置">
            <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save class="h-3.5 w-3.5" />
              <span>{"保存设置"}</span>
            </Button>
          </PageHeader>
    
          <div class="grid gap-6 lg:grid-cols-2">
            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"系统信息"}</CardTitle>
                <CardDescription>{"SCADA 平台基本信息配置"}</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <Label for="sys-name" class="text-xs">{"系统名称"}</Label>
                  <Input id="sys-name" defaultValue="SCADA Control Platform" class="h-8 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="sys-desc" class="text-xs">{"系统描述"}</Label>
                  <Input id="sys-desc" defaultValue="工业监控数据采集与控制系统" class="h-8 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="sys-version" class="text-xs">{"版本号"}</Label>
                  <Input id="sys-version" defaultValue="1.0.0" disabled class="h-8 text-sm" />
                </div>
              </CardContent>
            </Card>
    
            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"数据采集"}</CardTitle>
                <CardDescription>{"采集周期和数据处理参数"}</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <Label for="poll-interval" class="text-xs">{"默认采集周期 (ms)"}</Label>
                  <Input id="poll-interval" type="number" defaultValue="1000" class="h-8 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="timeout" class="text-xs">{"通信超时 (ms)"}</Label>
                  <Input id="timeout" type="number" defaultValue="3000" class="h-8 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="retry" class="text-xs">{"重试次数"}</Label>
                  <Input id="retry" type="number" defaultValue="3" class="h-8 text-sm" />
                </div>
              </CardContent>
            </Card>
    
            {/* Storage */}
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"存储策略"}</CardTitle>
                <CardDescription>{"数据存储和归档配置"}</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"历史数据保留"}</Label>
                  <Select defaultValue="365">
                    <SelectTrigger class="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 天</SelectItem>
                      <SelectItem value="180">180 天</SelectItem>
                      <SelectItem value="365">365 天</SelectItem>
                      <SelectItem value="730">2 年</SelectItem>
                      <SelectItem value="forever">永久</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"自动归档"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"超过保留期的数据自动归档"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"数据压缩"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"归档数据启用压缩存储"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
    
            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"安全设置"}</CardTitle>
                <CardDescription>{"登录和访问安全配置"}</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"双因素认证"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"登录时要求二次验证"}</p>
                  </div>
                  <Switch />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"会话超时"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"无操作自动退出登录"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="session-timeout" class="text-xs">{"超时时间 (分钟)"}</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" class="h-8 text-sm" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"登录失败锁定"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"连续 5 次失败锁定账户"}</p>
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
