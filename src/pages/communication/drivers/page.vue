<script lang="tsx">
import { defineComponent } from "vue"
import { Upload, Package } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"

const drivers = [
  { name: "Modbus TCP/RTU", version: "3.2.1", author: "System", status: "内置", updated: "2026-01-15", devices: 27, desc: "Modbus TCP/RTU 标准协议驱动" },
  { name: "Siemens S7", version: "2.1.0", author: "System", status: "内置", updated: "2026-01-15", devices: 2, desc: "西门子 S7-300/400/1200/1500 通信驱动" },
  { name: "OPC UA Client", version: "1.8.0", author: "System", status: "内置", updated: "2026-01-15", devices: 3, desc: "OPC UA 客户端驱动" },
  { name: "MQTT Client", version: "2.0.0", author: "System", status: "内置", updated: "2026-01-15", devices: 8, desc: "MQTT 3.1.1/5.0 客户端驱动" },
  { name: "BACnet/IP", version: "1.2.0", author: "Community", status: "插件", updated: "2025-12-20", devices: 3, desc: "BACnet/IP 楼控协议驱动" },
  { name: "IEC 61850 MMS", version: "0.9.0", author: "Premium", status: "商业", updated: "2026-02-01", devices: 0, desc: "IEC 61850 MMS 客户端驱动" },
  { name: "DNP3", version: "1.0.0", author: "Premium", status: "商业", updated: "2026-01-20", devices: 0, desc: "DNP3 主站驱动" },
  { name: "HART", version: "1.1.0", author: "Community", status: "插件", updated: "2025-11-10", devices: 4, desc: "HART 协议驱动（通过 Modbus 网关）" },
]

const statusColors: Record<string, string> = {
  "内置": "bg-primary/10 text-primary border-primary/20",
  "插件": "bg-success/10 text-success border-success/20",
  "商业": "bg-warning/10 text-warning border-warning/20",
}

export default defineComponent({
  name: "driversPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="驱动管理" description="安装和管理通信协议驱动">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Upload class="h-3.5 w-3.5" />
              <span>{"安装驱动"}</span>
            </Button>
          </PageHeader>
    
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {drivers.map((d) => (
              <Card key={d.name} class="transition-colors hover:border-primary/30">
                <CardContent class="p-4">
                  <div class="flex items-start gap-3">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <Package class="h-4 w-4" />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <h3 class="text-sm font-medium text-card-foreground">{d.name}</h3>
                        <Badge variant="outline" class={`text-[10px] ${statusColors[d.status] || ""}`}>{d.status}</Badge>
                      </div>
                      <p class="mt-0.5 text-muted-foreground">{d.desc}</p>
                    </div>
                  </div>
                  <div class="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
                    <div class="flex items-center gap-2">
                      <Badge variant="outline" class="font-mono text-[10px]">{`v${d.version}`}</Badge>
                      <span>{d.author}</span>
                    </div>
                    <span>{`${d.devices} 设备`}</span>
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
