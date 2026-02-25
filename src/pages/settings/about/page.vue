<script lang="tsx">
import { defineComponent } from "vue"
import { ExternalLink } from "lucide-vue-next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"

const systemInfo = [
  { label: "平台版本", value: "1.0.0" },
  { label: "构建号", value: "Build 20260209.1432" },
  { label: "运行环境", value: "Production" },
  { label: "操作系统", value: "Linux 5.15.0-91-generic" },
  { label: "Node.js", value: "v20.11.0" },
  { label: "数据库", value: "TDengine 3.2 / PostgreSQL 16" },
]

const dependencies = [
  { name: "Next.js", version: "16.0.0", desc: "Web 应用框架" },
  { name: "React", version: "19.2.0", desc: "UI 组件库" },
  { name: "TDengine Client", version: "3.2.0", desc: "时序数据库驱动" },
  { name: "MQTT.js", version: "5.3.0", desc: "MQTT 协议客户端" },
  { name: "node-modbus", version: "4.2.0", desc: "Modbus 协议库" },
  { name: "node-opcua", version: "2.120.0", desc: "OPC UA 协议库" },
]

const changelog = [
  { version: "1.0.0", date: "2026-02-01", changes: ["正式发布 v1.0", "完成 12 个功能模块", "支持深浅主题切换", "支持多协议通信"] },
  { version: "0.9.0", date: "2025-12-15", changes: ["新增脚本引擎", "新增定时任务管理", "优化报警通知策略"] },
  { version: "0.8.0", date: "2025-11-01", changes: ["新增边缘网关管理", "新增设备拓扑视图", "优化数据采集性能"] },
]

export default defineComponent({
  name: "aboutPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="关于" description="SCADA 轻量聚合管理平台" />
    
          <div class="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"系统信息"}</CardTitle>
              </CardHeader>
              <CardContent class="flex flex-col gap-2.5">
                {systemInfo.map((item, i) => (
                  <div key={item.label}>
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="text-muted-foreground">{item.label}</span>
                      <span class="font-mono text-card-foreground">{item.value}</span>
                    </div>
                    {i < systemInfo.length - 1 && <Separator class="mt-2.5" />}
                  </div>
                ))}
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"核心依赖"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="flex flex-col gap-2">
                  {dependencies.map((dep) => (
                    <div key={dep.name} class="flex items-center justify-between rounded-md border border-border p-2.5">
                      <div>
                        <span class="text-xs font-medium text-card-foreground">{dep.name}</span>
                        <span class="ml-2 text-[11px] text-muted-foreground">{dep.desc}</span>
                      </div>
                      <Badge variant="outline" class="font-mono text-[10px]">{dep.version}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
    
            <Card class="lg:col-span-2">
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"更新日志"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="page-shell">
                  {changelog.map((release) => (
                    <div key={release.version} class="relative pl-6 before:absolute before:left-[7px] before:top-2 before:h-full before:w-px before:bg-border last:before:hidden">
                      <div class="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
                      <div class="flex items-center gap-2">
                        <Badge variant="outline" class="font-mono text-[10px]">{`v${release.version}`}</Badge>
                        <span class="text-[11px] text-muted-foreground">{release.date}</span>
                      </div>
                      <ul class="mt-2 flex flex-col gap-1">
                        {release.changes.map((change) => (
                          <li key={change} class="text-xs text-card-foreground">{`- ${change}`}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
  }
})
</script>
