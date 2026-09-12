# Shadowrocket 分流与隐私模块

这套配置由两个可独立启用的 Shadowrocket 模块组成，目标是在保留国内服务直连体验的同时，让 AI、Google、TikTok 和出口检测稳定使用指定代理，并减少 DNS、IPv6、QUIC 与 WebRTC 造成的出口不一致风险。

> 这里不包含代理节点、机场订阅、密码或 token。使用前必须先在 Shadowrocket 中导入自己的可用节点或订阅。

## 模块说明

### 1. AI 和 Google 隐私出口

文件：[AI和Google隐私出口.sgmodule](./AI和Google隐私出口.sgmodule)

- 将 Claude、ChatGPT、Codex、Gemini、Google、TikTok 及出口检测域名交给 `AI-GOOGLE` 策略组。
- `AI-GOOGLE` 可手动选择当前 `PROXY`、四节点故障转移组或拒绝连接。
- `US-4-FALLBACK` 每 10 分钟检测一次出口可用性，并在四个美国节点间故障转移。
- 不设置 `DIRECT` 回退，避免 AI/Google 流量在节点故障时意外直连。
- 抖音核心域名和汽水音乐直连，`dig.bdurl.net` 被拒绝，以减少无意义的代理流量。

此模块引用了 `blackmatrix7/ios_rule_script` 的 TikTok 规则，以及 `LingJingMaster/Shadowrocket-Rules` 的 AI、Google 规则。远程规则的内容和可用性由对应项目维护。

### 2. DNS 隐私与直连保护

文件：[DNS隐私与直连保护.sgmodule](./DNS隐私与直连保护.sgmodule)

- 代理域名使用 Cloudflare DoH，备用解析使用 Google DoH，二者均通过代理发送。
- 关闭 IPv6 与 IPv6 优先，降低双栈环境下出口不一致的可能性。
- 劫持常见的明文 DNS 请求，并拒绝已知应用内置 HTTPDNS。
- 对代理流量阻止 QUIC，使其回退到更容易稳定代理的 TCP/TLS。
- 局域网、微信、抖音、部分阿里/字节服务、香港银行和券商保持直连。
- 不强制覆盖 Apple 服务规则；STUN/WebRTC 是否禁用仍由 Shadowrocket 设置页手动控制。

## 安装方法

1. 先将仓库下载到设备，或打开对应 `.sgmodule` 文件的 Raw 地址。
2. 在 Shadowrocket 中进入“配置 → 模块”，点击右上角 `+` 导入模块。
3. 同时启用两个模块，然后重新连接 Shadowrocket。
4. 在“数据”页检查：AI/Google 应命中 `AI-GOOGLE`，微信等国内服务应命中 `DIRECT`。

## 使用前检查

`US-4-FALLBACK` 使用了以下四个节点名称，名称必须与订阅中的节点完全一致：

- `美国 01AI｜原生｜Ai专用｜`
- `美国02 AI｜原生｜Ai专用｜`
- `美国01|🇺🇸|注册|TikToK|家宽|`
- `美国02|🇺🇸|注册|TikToK|家宽|`

如果机场修改了节点名称，需要同步编辑模块，否则故障转移组会找不到对应节点。

## 隐私边界

这些模块可以控制网络出口并降低 DNS、IPv6、QUIC 和 WebRTC 泄漏风险，但不能隐藏账号地区、SIM 卡国家、GPS 定位、时区、语言、付款资料、Cookie 或设备历史。Google、OpenAI 等服务仍可能综合这些信息判断账号地区。

## 建议设置

- Shadowrocket 使用“配置”路由模式，而不是“全局”模式。
- 开启 UDP 转发；若更看重真实 IP 防泄漏，可同时开启“禁用 STUN”。
- 更新模块或订阅后，重新连接并在“数据”页验证实际命中规则。
- 不要把含订阅 token、节点密码或个人证书的完整配置文件提交到公开仓库。
