import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  Variable,
  Radio,
  Bell,
  FileCode2,
  Network,
  Database,
  Shield,
  ScrollText,
  Settings,
} from "lucide-vue-next"
import type { LucideIcon } from "lucide-vue-next"

export type NavSubItem = {
  title: string
  href: string
}

export type NavItem = {
  title: string
  icon: LucideIcon
  href: string
  children: NavSubItem[]
}

export const navConfig: NavItem[] = [
  {
    title: "仪表盘",
    icon: LayoutDashboard,
    href: "/dashboard",
    children: [
      { title: "系统概览", href: "/dashboard" },
      { title: "运行监控", href: "/dashboard/monitor" },
      { title: "统计分析", href: "/dashboard/analytics" },
    ],
  },
  {
    title: "项目工程",
    icon: FolderKanban,
    href: "/projects",
    children: [
      { title: "项目列表", href: "/projects" },
      { title: "工程管理", href: "/projects/engineering" },
      { title: "画面管理", href: "/projects/screens" },
      { title: "模板库", href: "/projects/templates" },
      { title: "版本管理", href: "/projects/versions" },
      { title: "发布部署", href: "/projects/deploy" },
    ],
  },
  {
    title: "设备管理",
    icon: Cpu,
    href: "/devices",
    children: [
      { title: "设备列表", href: "/devices" },
      { title: "设备分组", href: "/devices/groups" },
      { title: "设备模板", href: "/devices/templates" },
      { title: "设备状态", href: "/devices/status" },
      { title: "设备拓扑", href: "/devices/topology" },
    ],
  },
  {
    title: "变量管理",
    icon: Variable,
    href: "/variables",
    children: [
      { title: "变量列表", href: "/variables" },
      { title: "变量分组", href: "/variables/groups" },
      { title: "变量模板", href: "/variables/templates" },
      { title: "实时监控", href: "/variables/realtime" },
      { title: "历史查询", href: "/variables/history" },
    ],
  },
  {
    title: "通信管理",
    icon: Radio,
    href: "/communication",
    children: [
      { title: "协议管理", href: "/communication" },
      { title: "通道配置", href: "/communication/channels" },
      { title: "驱动管理", href: "/communication/drivers" },
      { title: "通信状态", href: "/communication/status" },
    ],
  },
  {
    title: "报警管理",
    icon: Bell,
    href: "/alarms",
    children: [
      { title: "报警规则", href: "/alarms" },
      { title: "实时报警", href: "/alarms/realtime" },
      { title: "历史报警", href: "/alarms/history" },
      { title: "报警分组", href: "/alarms/groups" },
      { title: "通知策略", href: "/alarms/notifications" },
      { title: "报警确认", href: "/alarms/acknowledge" },
    ],
  },
  {
    title: "脚本管理",
    icon: FileCode2,
    href: "/scripts",
    children: [
      { title: "脚本列表", href: "/scripts" },
      { title: "脚本编辑器", href: "/scripts/editor" },
      { title: "定时任务", href: "/scripts/scheduler" },
      { title: "执行日志", href: "/scripts/logs" },
    ],
  },
  {
    title: "节点管理",
    icon: Network,
    href: "/nodes",
    children: [
      { title: "节点列表", href: "/nodes" },
      { title: "节点状态", href: "/nodes/status" },
      { title: "节点配置", href: "/nodes/config" },
      { title: "边缘网关", href: "/nodes/gateway" },
    ],
  },
  {
    title: "数据库",
    icon: Database,
    href: "/database",
    children: [
      { title: "数据源配置", href: "/database" },
      { title: "数据表管理", href: "/database/tables" },
      { title: "数据备份", href: "/database/backup" },
      { title: "数据归档", href: "/database/archive" },
    ],
  },
  {
    title: "权限管理",
    icon: Shield,
    href: "/permissions",
    children: [
      { title: "用户管理", href: "/permissions" },
      { title: "角色管理", href: "/permissions/roles" },
      { title: "菜单权限", href: "/permissions/menus" },
      { title: "数据权限", href: "/permissions/data" },
    ],
  },
  {
    title: "日志中心",
    icon: ScrollText,
    href: "/logs",
    children: [
      { title: "操作日志", href: "/logs" },
      { title: "系统日志", href: "/logs/system" },
      { title: "通信日志", href: "/logs/communication" },
      { title: "登录日志", href: "/logs/login" },
    ],
  },
  {
    title: "系统设置",
    icon: Settings,
    href: "/settings",
    children: [
      { title: "个人信息", href: "/settings/profile" },
      { title: "基础配置", href: "/settings" },
      { title: "主题外观", href: "/settings/appearance" },
      { title: "通知配置", href: "/settings/notifications" },
      { title: "许可证", href: "/settings/license" },
      { title: "关于", href: "/settings/about" },
    ],
  },
]
