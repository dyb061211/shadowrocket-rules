# Clash Verge Rev / Mihomo（macOS）

这是 2026-11-01 在 macOS 上使用的订阅增强配置。它保留订阅中的节点，在原规则前加入 AI/Google 出口、国内直连、DNS 与 STUN/QUIC 处理，并接入公共规则和 GeoData 更新。

脚本不包含节点、订阅链接、密码或控制器密钥，不是独立的完整订阅。已验证的版本为 Clash Verge Rev 2.5.8 / Mihomo 1.19.32；Windows、Linux 和其他版本未验证。

## 文件

- [`profile-enhancement.js`](./profile-enhancement.js)：放入所选订阅的扩展脚本。
- [`rulesets/`](./rulesets/)：5 个必须复制到 Clash 配置目录的本地集合，共284条条目。
- [规则来源与更新方式](./SOURCES.md)：说明哪些集合来自第三方、哪些保留本地。
- [验证结果与限制](./VALIDATION.md)：区分实际测试和未覆盖场景。

## 安装前确认

1. 当前订阅应在 `proxies` 中包含真实节点。只有 `proxy-providers`、没有展开节点的订阅不受这个脚本支持；没有节点时脚本会报错，不会退回直连。
2. `RESIP-AUTO` 是自动组的名称，不是提供商认证。脚本会按当前订阅中节点顺序创建 fallback；请先确认这些节点都是你愿意用于 AI 的出口。它不会跨订阅筛选，也不能保证任意订阅里的所有节点出口相同。
3. 脚本保留原订阅规则及其他代理组。测试订阅的最终规则为 `MATCH,Proxy`，`Proxy` 选择已有的“自动切换”组。不同订阅需要自行核对最终规则、策略组引用及是否包含直连回退，不能仅导入后就假定一致。
4. 这个 macOS 预设使用 `utun9`，DNS监听 `127.0.0.1:1053`，MTU 1500；若已有接口或端口冲突，先调整。脚本本身不负责打开 TUN 或系统代理，也不设置混合代理端口；测试环境端口为7897。
5. 安装前备份当前订阅扩展脚本和配置。切换客户端时先停用另一个客户端的网络接管，避免两个 TUN 同时运行。

## 安装步骤

1. 下载本仓库。在 Clash Verge 的“设置 → 配置目录”打开实际数据目录。
2. 将这里的 `rulesets` 文件夹合并复制进去，保留其他文件。复制后必须存在：

   ```text
   配置目录/
   └── rulesets/
       ├── shadow-ai.yaml
       ├── shadow-hsbc.yaml
       ├── shadow-hkbanks.yaml
       ├── shadow-hkbroker.yaml
       └── maintained/
           └── google-compat.yaml
   ```

3. 在“订阅”页，右键需要使用的订阅，进入该订阅的“编辑脚本”，备份原内容，再粘贴 `profile-enhancement.js` 的完整内容并保存。不要粘贴到 Shadowrocket 模块或仅修改生成的运行配置。
4. 点击“重新激活订阅”。如果使用其他全局脚本或覆写，确认没有覆盖这里的 DNS、规则或代理组。此方案使用脚本定义 DNS，不需要再打开 GUI 的 DNS 覆写。
5. 在“代理”页使用“规则”模式，将 `AI-GOOGLE` 选为 `RESIP-AUTO`。原订阅的普通代理组仍需按需要选择；测试环境的 `Proxy` 选为“自动切换”。
6. 需要接管普通应用流量时，使用 Clash Verge 的 TUN 开关。TUN 正常运行时不必额外打开系统代理；请确认其他代理客户端没有同时接管网络。
7. 在“规则 → 规则集合”核对下表。首次启用的6个HTTP集合需要网络下载；如果某个集合为空或报错，先检查日志、节点与下载地址。已有有效缓存时，更新失败可以继续使用缓存。

## 分流与稳定性

- `AI-GOOGLE` 可以选择 `RESIP-AUTO`、当前订阅的单个节点或 `REJECT`；新增自动组没有 `DIRECT` 成员。
- 主备按订阅顺序选择，健康检查使用 HTTPS `generate_204`，间隔120秒、超时5000毫秒。检查成功不代表所有业务站点都能访问，也不保证已有连接无损切换。
- AI/Google/TikTok 使用指定代理；保留微信、抖音及银行、券商等直连规则。共用字节域名仍存在业务重叠，特定故障应结合命中日志调整。
- STUN 域名和常见端口拦截前置。代理路径的 UDP443 被拦截，促使支持回退的客户端改用TCP；国内直连的UDP443没有一概禁止。
- DNS 使用 fake-IP、UDP/TCP53劫持，Cloudflare/Google DoH指定经 `AI-GOOGLE`；节点域名和直连域名使用国内加密DoT，局域网命名使用系统解析。

## 每日更新在哪里执行

更新在你电脑的 Mihomo 内核里执行，**不会修改你的 GitHub 仓库**。内核运行时按24小时间隔检查来源，下载成功后写入本地缓存；电脑关机时不执行。

| 集合 | 类型 | 本次验证条目数 | 路由 |
| --- | --- | ---: | --- |
| shadow-google | HTTP | 701 | AI-GOOGLE |
| shadow-tiktok | HTTP | 35 | AI-GOOGLE |
| shadow-httpdns | HTTP | 63 | REJECT |
| shadow-douyin | HTTP | 13 | DIRECT |
| shadow-wechat | HTTP | 31 | DIRECT |
| sukka-ai | HTTP | 55 | AI-GOOGLE |
| shadow-ai | File | 51 | AI-GOOGLE |
| local-google-compat | File | 23 | AI-GOOGLE |
| shadow-hsbc | File | 2 | DIRECT |
| shadow-hkbanks | File | 38 | DIRECT |
| shadow-hkbroker | File | 170 | DIRECT |

本次验证合计11个集合、1182条集合内条目；集合之间可能有重叠。测试订阅生成142条主规则，不同基础订阅的主规则数量可能不同。

六个HTTP集合通过 `RESIP-AUTO` 更新；“更新全部”会对它们请求远程来源。五个File集合保留本地定制，点击更新只重读文件，显示较旧日期不代表失效。更新本仓库的脚本或本地规则后，需要重新复制对应内容并重新激活订阅；本仓库代码没有被设置成远程自动执行。

GeoData 是另一套更新机制：`geo-auto-update: true`、`geo-update-interval: 24`，来源为 MetaCubeX 官方 GitHub release。自动维护的是内核实际启用的数据库，不是上表的规则集合。

## 使用后验证与回退

核对同一个 IP 检测地址在浏览器与终端的结果，再在 Clash 连接页查看实际业务域名的策略链。用 BrowserLeaks 检查 DNS/WebRTC；不能只凭首页的IP卡片或规则数量判断。

如果异常，恢复安装前保存的订阅脚本，再“重新激活订阅”。新缓存可以暂时保留，恢复后的配置不会引用它们。不要删除整个应用配置目录来回退。

## 边界

- 这是分流配置，不是系统级断网锁。TUN关闭、Clash退出、系统启动前、睡眠唤醒和换网期间不保证阻断直连。
- `ipv6: false` 不等于永久关闭 macOS 所有接口的IPv6；仍需结合实际网络验证。
- macOS 的TUN不能自动劫持所有发往局域网DNS地址的请求；应用自建DoH/DoQ、非标准端口也不一定受这套53端口规则控制。
- STUN/TURN拦截可能影响会议、通话和游戏；不能覆盖任意端口的WebRTC。浏览器防护仍需单独设置和测试。
- 银行和券商直连是本配置的有意选择；不符合自己需求时应调整这些规则。
- 规则维护者能改变公共集合内容，影响分流范围。HTTPS、缓存及备份不能保证第三方规则永远正确；发现异常时应检查更新差异。
- 不隐藏账号地区、GPS、时区、语言、Cookie或支付资料，不保证账号安全或任何服务解锁。
