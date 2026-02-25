<script lang="tsx">
import { defineComponent } from "vue"
import { Download, Filter } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"

type LoginLog = {
  id: string
  time: string
  user: string
  action: string
  ip: string
  location: string
  device: string
  browser: string
  result: string
  [key: string]: unknown
}

const loginLogs: LoginLog[] = [
  { id: "LL-001", time: "2026-02-09 14:30:00", user: "张明", action: "登录", ip: "10.0.1.50", location: "内网", device: "Windows 11", browser: "Chrome 122", result: "成功" },
  { id: "LL-002", time: "2026-02-09 13:45:00", user: "李华", action: "登录", ip: "10.0.1.51", location: "内网", device: "macOS 14", browser: "Safari 17", result: "成功" },
  { id: "LL-003", time: "2026-02-09 14:10:00", user: "王芳", action: "登录", ip: "10.0.1.52", location: "内网", device: "Windows 11", browser: "Edge 122", result: "成功" },
  { id: "LL-004", time: "2026-02-09 08:00:00", user: "孙丽", action: "登录", ip: "10.0.1.54", location: "内网", device: "Windows 10", browser: "Chrome 122", result: "成功" },
  { id: "LL-005", time: "2026-02-09 12:15:00", user: "郑雪", action: "登录", ip: "10.0.1.55", location: "内网", device: "Linux", browser: "Firefox 123", result: "成功" },
  { id: "LL-006", time: "2026-02-09 07:55:00", user: "孙丽", action: "登录", ip: "10.0.1.54", location: "内网", device: "Windows 10", browser: "Chrome 122", result: "密码错误" },
  { id: "LL-007", time: "2026-02-08 18:30:00", user: "赵强", action: "退出", ip: "10.0.1.53", location: "内网", device: "Windows 11", browser: "Chrome 122", result: "成功" },
  { id: "LL-008", time: "2026-02-08 08:00:00", user: "赵强", action: "登录", ip: "10.0.1.53", location: "内网", device: "Windows 11", browser: "Chrome 122", result: "成功" },
  { id: "LL-009", time: "2026-02-07 20:30:00", user: "unknown", action: "登录", ip: "192.168.100.55", location: "外网", device: "Unknown", browser: "Unknown", result: "账号不存在" },
  { id: "LL-010", time: "2026-02-07 17:00:00", user: "周伟", action: "退出", ip: "10.0.1.56", location: "内网", device: "macOS 14", browser: "Chrome 122", result: "成功" },
]

const resultColors: Record<string, string> = {
  "成功": "bg-success/10 text-success border-success/20",
  "密码错误": "bg-warning/10 text-warning border-warning/20",
  "账号不存在": "bg-destructive/10 text-destructive border-destructive/20",
  "账号锁定": "bg-destructive/10 text-destructive border-destructive/20",
}

const columns: Column<LoginLog>[] = [
  { key: "time", title: "时间", className: "font-mono w-[160px]" },
  { key: "user", title: "用户", render: (l) => <span class="font-medium text-card-foreground">{l.user}</span> },
  { key: "action", title: "操作", render: (l) => <Badge variant="outline" class="text-[10px]">{l.action}</Badge> },
  { key: "ip", title: "IP 地址", className: "font-mono" },
  { key: "location", title: "来源", render: (l) => (
    <Badge variant="outline" class={`text-[10px] ${l.location === "外网" ? "bg-destructive/10 text-destructive border-destructive/20" : ""}`}>
      {l.location}
    </Badge>
  )},
  { key: "device", title: "系统", className: "text-xs" },
  { key: "browser", title: "浏览器", className: "text-xs" },
  { key: "result", title: "结果", render: (l) => <Badge variant="outline" class={`text-[10px] ${resultColors[l.result] || ""}`}>{l.result}</Badge> },
]

export default defineComponent({
  name: "loginPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="登录日志" description="查看用户登录和退出记录">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Filter class="h-3.5 w-3.5" />
              <span>{"筛选"}</span>
            </Button>
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>{"导出"}</span>
            </Button>
          </PageHeader>
    
          <DataTable columns={columns} data={loginLogs} searchPlaceholder="搜索用户名、IP 地址..." pageSize={10} />
        </div>
      )
  }
})
</script>
