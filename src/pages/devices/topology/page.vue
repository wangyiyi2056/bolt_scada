<script lang="tsx">
import { defineComponent } from "vue"
import { Network, Server, Cpu, Radio, Monitor } from "lucide-vue-next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"

const topologyNodes = [
  {
    name: "主控节点-01",
    icon: Server,
    status: "online" as const,
    children: [
      { name: "PLC-Station-01", type: "PLC", status: "online" as const, protocol: "Modbus TCP" },
      { name: "PLC-Station-02", type: "PLC", status: "online" as const, protocol: "S7" },
      { name: "HMI-Panel-01", type: "HMI", status: "online" as const, protocol: "Modbus TCP" },
      { name: "HMI-Panel-02", type: "HMI", status: "warning" as const, protocol: "Modbus TCP" },
    ],
  },
  {
    name: "采集节点-02",
    icon: Server,
    status: "online" as const,
    children: [
      { name: "RTU-Node-01", type: "RTU", status: "online" as const, protocol: "Modbus RTU" },
      { name: "RTU-Node-07", type: "RTU", status: "offline" as const, protocol: "Modbus TCP" },
      { name: "VFD-Pump-01", type: "变频器", status: "online" as const, protocol: "Modbus RTU" },
      { name: "VFD-Fan-02", type: "变频器", status: "online" as const, protocol: "Modbus RTU" },
    ],
  },
  {
    name: "边缘网关-03",
    icon: Radio,
    status: "warning" as const,
    children: [
      { name: "IO-Module-01", type: "IO", status: "online" as const, protocol: "OPC UA" },
      { name: "IO-Module-11", type: "IO", status: "warning" as const, protocol: "OPC UA" },
      { name: "Meter-Power-01", type: "仪表", status: "online" as const, protocol: "MQTT" },
      { name: "Sensor-Temp-01", type: "传感器", status: "error" as const, protocol: "MQTT" },
    ],
  },
  {
    name: "备用节点-04",
    icon: Server,
    status: "offline" as const,
    children: [],
  },
]

export default defineComponent({
  name: "topologyPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="设备拓扑" description="以节点-设备层级展示网络拓扑结构" />
    
          {/* Central node */}
          <div class="flex flex-col items-center gap-6">
            <Card class="w-fit">
              <CardContent class="flex items-center gap-3 p-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Network class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-card-foreground">{"SCADA 控制中心"}</h3>
                  <p class="text-xs text-muted-foreground">{"10.0.0.1 - 核心交换机"}</p>
                </div>
                <StatusBadge status="online" class="ml-4" />
              </CardContent>
            </Card>
    
            <div class="h-8 w-px bg-border" />
    
            {/* Node level */}
            <div class="grid w-full gap-4 lg:grid-cols-2">
              {topologyNodes.map((node) => {
                const Icon = node.icon
                return (
                  <Card key={node.name} class="transition-colors hover:border-primary/30">
                    <CardHeader class="pb-3">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                            <Icon class="h-4 w-4" />
                          </div>
                          <CardTitle class="text-sm font-medium text-card-foreground">{node.name}</CardTitle>
                        </div>
                        <StatusBadge status={node.status} />
                      </div>
                    </CardHeader>
                    <CardContent class="pt-0">
                      {node.children.length === 0 ? (
                        <p class="text-xs text-muted-foreground">{"暂无接入设备"}</p>
                      ) : (
                        <div class="grid gap-2 sm:grid-cols-2">
                          {node.children.map((child) => (
                            <div key={child.name} class="flex items-center justify-between rounded-md border border-border p-2">
                              <div class="flex items-center gap-2">
                                <Cpu class="h-3 w-3 text-muted-foreground" />
                                <div>
                                  <span class="text-[11px] font-medium text-card-foreground">{child.name}</span>
                                  <div class="flex items-center gap-1">
                                    <span class="text-[10px] text-muted-foreground">{child.type}</span>
                                    <Badge variant="outline" class="h-4 text-[9px] font-mono">{child.protocol}</Badge>
                                  </div>
                                </div>
                              </div>
                              <StatusBadge status={child.status} />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      )
  }
})
</script>
