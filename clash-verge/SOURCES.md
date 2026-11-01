# 规则来源

本项目负责组合规则、设置路由策略和保留定制条目。第三方域名/IP清单由各自上游维护，不作为本项目原创或准确性保证；上游内容的授权和使用条件以对应项目为准。

## 运行时下载的公共集合

以下文件不随本仓库复制发布，由 Mihomo 通过HTTPS下载到 `rulesets/maintained/`。每24小时更新，下载代理为 `RESIP-AUTO`。

| 集合 | 维护项目 | 原生文件 |
| --- | --- | --- |
| Google | [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script) | [Google.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml) |
| TikTok | 同上 | [TikTok.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TikTok/TikTok.yaml) |
| HTTPDNS | 同上 | [BlockHttpDNS.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BlockHttpDNS/BlockHttpDNS.yaml) |
| 抖音 | 同上 | [DouYin.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/DouYin/DouYin.yaml) |
| 微信 | 同上 | [WeChat.yaml](https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/WeChat/WeChat.yaml) |
| AI | [SukkaW/Surge](https://github.com/SukkaW/Surge) | [Clash/non_ip/ai.txt](https://ruleset.skk.moe/Clash/non_ip/ai.txt) |

前五个文件使用 `classical + yaml`；Sukka使用 `classical + text`。仓库名称包含Surge不代表文件只支持Surge，必须选择其Mihomo格式。不要把Shadowrocket列表或MRS文件随意替换进相同解析设置。

## 本地定制快照

这些文件不会自动跟随上游变化。2026-10-28迁移时从 [LingJingMaster/Shadowrocket-Rules](https://github.com/LingJingMaster/Shadowrocket-Rules) 引用的列表转换；2026-11-01拆出Google补充条目。

| 本地文件 | 来源 | 转换说明 |
| --- | --- | --- |
| `rulesets/shadow-ai.yaml` | [AI.list](https://github.com/LingJingMaster/Shadowrocket-Rules/blob/main/AI.list) | 保留51条；原文件blob `a1099da8b0d8cb24221b9f98bb46b270e70ee0cd` |
| `rulesets/shadow-hsbc.yaml` | [HSBC_HK.list](https://github.com/LingJingMaster/Shadowrocket-Rules/blob/main/HSBC_HK.list) | 保留2条；blob `2fe0b15ad52dd0ca4a11ba5d770997a52e50f069` |
| `rulesets/shadow-hkbanks.yaml` | [HK_Banks_Direct.list](https://github.com/LingJingMaster/Shadowrocket-Rules/blob/main/HK_Banks_Direct.list) | 39条中转换38条，未转换1条URL-REGEX；blob `e055635ea254d4bdc5f628394e4f18027fe970ae` |
| `rulesets/shadow-hkbroker.yaml` | [HK_Broker.list](https://github.com/LingJingMaster/Shadowrocket-Rules/blob/main/HK_Broker.list) | 保留170条；blob `bca19ae995a90bed2cade7f6efe829e265bdaddf` |
| `rulesets/maintained/google-compat.yaml` | [Google.list](https://github.com/LingJingMaster/Shadowrocket-Rules/blob/main/Google.list) | 原721条中3条USER-AGENT未转换；从其余718条中保留当前blackmatrix7原生Google集合缺少的23条；原blob `64b89214a3805d970f1051618db395c99dab9225` |

本地快照与对应Shadowrocket列表并非完全等价。不支持的URL-REGEX/USER-AGENT没有被悄悄扩大为整个域名直连；Google原生集合另外带有少量进程规则。IP类规则的“不额外解析”处理在增强脚本的RULE-SET引用中保留。

## GeoData 与实现依据

- 数据来源：[MetaCubeX/meta-rules-dat 官方 release](https://github.com/MetaCubeX/meta-rules-dat/releases/tag/latest)。2026-11-01部署时校验了GeoIP、GeoSite、Country MMDB三个文件的GitHub发布SHA256。
- [Mihomo规则集合文档](https://wiki.metacubex.one/config/rule-providers/)：HTTP/File、缓存路径、更新间隔与下载代理。
- [Mihomo全局配置](https://wiki.metacubex.one/config/general/)：GeoData参数。
- [Mihomo TUN说明](https://wiki.metacubex.one/config/inbound/tun/)：DNS劫持及平台限制。
- [1.19.32版本GEO更新源码](https://github.com/MetaCubeX/mihomo/blob/v1.19.32/component/updater/update_geo.go)：实际启用数据库的更新逻辑。
