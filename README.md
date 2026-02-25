# SCADA Control Platform

> 基于 Vue 3 的工业 SCADA（数据采集与监控系统）管理平台前端模板

## 预览

一个功能完整的 SCADA 控制平台前端 UI，包含 12 大功能模块、55+ 页面，采用现代化技术栈和统一的组件体系。

## 技术栈

| 类别        | 技术                                                      |
| ----------- | --------------------------------------------------------- |
| **框架**    | Vue 3 + TypeScript                                        |
| **构建**    | Vite 6                                                    |
| **路由**    | Vue Router 4                                              |
| **样式**    | Tailwind CSS 3 + tailwindcss-animate                      |
| **UI 组件** | [shadcn-vue](https://www.shadcn-vue.com/) (new-york 风格) |
| **图表**    | @unovis/vue + ECharts (vue-echarts)                       |
| **图标**    | lucide-vue-next                                           |
| **工具**    | VueUse, class-variance-authority, reka-ui                 |

## 快速开始

```bash
# 克隆项目
git clone https://github.com/wangyiyi2056/bolt_scada.git
cd bolt_scada

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 功能模块

| 模块        | 路由             | 说明                                                     |
| ----------- | ---------------- | -------------------------------------------------------- |
| 🖥️ 仪表盘   | `/dashboard`     | 系统概览、运行监控、统计分析                             |
| 📁 项目工程 | `/projects`      | 项目管理、工程管理、画面管理、模板库、版本管理、发布部署 |
| ⚙️ 设备管理 | `/devices`       | 设备列表、分组、模板、状态、拓扑                         |
| 📊 变量管理 | `/variables`     | 变量列表、分组、模板、实时监控、历史查询                 |
| 📡 通信管理 | `/communication` | 协议管理、通道配置、驱动管理、通信状态                   |
| 🔔 报警管理 | `/alarms`        | 报警规则、实时/历史报警、分组、通知策略、确认            |
| 📝 脚本管理 | `/scripts`       | 脚本列表、编辑器、定时任务、执行日志                     |
| 🌐 节点管理 | `/nodes`         | 节点列表、状态、配置、边缘网关                           |
| 🗄️ 数据库   | `/database`      | 数据源配置、表管理、备份、归档                           |
| 🔐 权限管理 | `/permissions`   | 用户管理、角色管理、菜单/数据权限                        |
| 📋 日志中心 | `/logs`          | 操作日志、系统日志、通信日志、登录日志                   |
| ⚙️ 系统设置 | `/settings`      | 个人信息、基础配置、主题外观、通知、许可证               |

## 项目结构

```
src/
├── App.vue                    # 根组件
├── main.ts                    # 应用入口
├── styles.css                 # 全局样式 + CSS 变量 (Tailwind)
├── router/index.ts            # 路由配置
├── lib/
│   ├── utils.ts               # 工具函数 (cn, clsx)
│   └── nav-config.ts          # 导航菜单配置
├── composables/
│   └── use-theme.ts           # 主题切换逻辑
├── pages/                     # 页面组件 (按路由组织)
│   ├── dashboard/
│   ├── devices/
│   ├── variables/
│   └── ...
└── components/ui/             # 所有 UI 组件 (统一结构)
    ├── button/                # shadcn-vue 组件
    ├── dialog/
    ├── table/
    ├── sidebar/
    ├── ...
    ├── chart/                 # 自定义: 图表封装 (@unovis)
    ├── confirm-dialog/        # 自定义: 确认对话框
    ├── data-table/            # 自定义: 带搜索+分页的数据表格
    ├── form/                  # 自定义: 表单组件
    ├── page-header/           # 自定义: 页面头部
    ├── stat-card/             # 自定义: 统计卡片
    ├── status-badge/          # 自定义: 状态标记
    ├── app-shell/             # 应用布局框架
    ├── app-header/            # 顶部导航栏
    ├── app-sidebar/           # 侧边栏
    ├── nav-main/              # 主导航菜单
    └── ...
```

所有组件遵循统一结构：`组件名/index.ts` + `组件名/Component.vue`

## 添加 shadcn-vue 组件

项目已配置 shadcn-vue CLI，可直接安装新组件：

```bash
npx shadcn-vue@latest add <component-name>
```

## 开发命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 构建生产版本
npm run preview   # 预览生产构建
```

## License

MIT
