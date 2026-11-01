# Shadowrocket / Clash Verge 分流与隐私配置

本仓库提供两种客户端的配置，文件格式不能混用：

| 客户端 | 配置入口 | 用途 |
| --- | --- | --- |
| Shadowrocket | 下方两个 `.sgmodule` 模块 | 保留原有 AI/Google 出口与 DNS/国内直连配置 |
| Clash Verge Rev / Mihomo（macOS） | [Clash Verge 安装说明](./clash-verge/README.md) | 订阅增强脚本、主备切换、远程规则每日更新和 GeoData 维护 |

2026-11-01 新增 Clash Verge 版本：6 个公共规则集合每24小时更新，保留银行、券商等本地定制规则，并提供[规则来源](./clash-verge/SOURCES.md)及[验证范围](./clash-verge/VALIDATION.md)。更新由本机运行中的 Mihomo 执行，不是这个 GitHub 仓库的定时任务。

仓库不包含节点、机场订阅、密码或 token。先在对应客户端导入自己的可用订阅，再按该客户端的说明安装。

## Shadowrocket 版本

这套配置由两个可独立启用的 Shadowrocket 模块组成，目标是在保留国内服务直连体验的同时，让 AI、Google、TikTok 和出口检测稳定使用指定代理，并减少 DNS、IPv6、QUIC 与 WebRTC 造成的出口不一致风险。

> 这里不包含代理节点、机场订阅、密码或 token。使用前必须先在 Shadowrocket 中导入自己的可用节点或订阅。

## Shadowrocket 模块说明

### 1. AI 和 Google 隐私出口

文件：[AI和Google隐私出口.sgmodule](./AI和Google隐私出口.sgmodule)

- 将 Claude、ChatGPT、Codex、Gemini、Google、TikTok 及出口检测域名交给 `AI-GOOGLE` 策略组。
- `AI-GOOGLE` 可手动选择当前 `PROXY`、动态生成的 `全部节点` 组或拒绝连接。
- `全部节点` 会读取订阅中的节点，不绑定机场名称、国家、节点协议或固定节点名；流量提示、到期提示、续费官网及代理广告等伪节点会被排除。
- 不设置 `DIRECT` 回退，避免 AI/Google 流量在节点故障时意外直连。
- 抖音核心域名、部分国内字节电商/日志域名和汽水音乐直连，`dig.bdurl.net` 被拒绝，以减少无意义的代理流量；规则只放行已确认的国内域名，不会把 TikTok 共用的整个字节域名后缀改为直连。

此模块引用了 `blackmatrix7/ios_rule_script` 的 TikTok 规则，以及 `LingJingMaster/Shadowrocket-Rules` 的 AI、Google 规则。远程规则的内容和可用性由对应项目维护。

### 2. DNS 隐私与直连保护

文件：[DNS隐私与直连保护.sgmodule](./DNS隐私与直连保护.sgmodule)

- 代理域名使用 Cloudflare DoH，备用解析使用 Google DoH，二者均通过代理发送。
- 关闭 IPv6 与 IPv6 优先，降低双栈环境下出口不一致的可能性。
- 劫持常见的明文 DNS 请求，并拒绝已知应用内置 HTTPDNS。
- 对代理流量阻止 QUIC，使其回退到更容易稳定代理的 TCP/TLS。
- 局域网、微信、抖音、部分阿里/字节/百度对象存储服务、香港银行和券商保持直连。
- 不强制覆盖 Apple 服务规则；STUN/WebRTC 是否禁用仍由 Shadowrocket 设置页手动控制。

## Shadowrocket 安装方法

1. 先将仓库下载到设备，或打开对应 `.sgmodule` 文件的 Raw 地址。
2. 在 Shadowrocket 中进入“配置 → 模块”，点击右上角 `+` 导入模块。
3. 同时启用两个模块，然后重新连接 Shadowrocket。
4. 在“数据”页检查：AI/Google 应命中 `AI-GOOGLE`，微信等国内服务应命中 `DIRECT`。

## 使用前检查

`全部节点` 通过节点名称正则动态生成，不依赖当前机场的固定节点名。如果某个真实节点名称含有“剩余流量、套餐到期、续费官网、官网、佣金、合作代理”等字样，它也会被排除，需要按实际情况调整过滤表达式。

不同地区的节点不一定都能解锁相同服务。选择节点后，应分别验证出口 IP、Google/Gemini、OpenAI 和 TikTok；“能连接”不代表账号地区或流媒体解锁一定通过。

## 隐私边界

这些模块可以控制网络出口并降低 DNS、IPv6、QUIC 和 WebRTC 泄漏风险，但不能隐藏账号地区、SIM 卡国家、GPS 定位、时区、语言、付款资料、Cookie 或设备历史。Google、OpenAI 等服务仍可能综合这些信息判断账号地区。

## 建议设置

- Shadowrocket 使用“配置”路由模式，而不是“全局”模式。
- 开启 UDP 转发；若更看重真实 IP 防泄漏，可同时开启“禁用 STUN”。
- 更新模块或订阅后，重新连接并在“数据”页验证实际命中规则。

