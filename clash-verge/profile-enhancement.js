// Profile-specific Clash Verge Rev enhancement. Contains no subscription credentials.
// Native upstream rule files refresh daily; custom rules remain local.
function main(config) {
  const prefix = 'shadow-';
  const ids = ['ai','google','tiktok','httpdns','douyin','wechat','hsbc','hkbanks','hkbroker'];
  const nodes = (config.proxies || []).filter(p =>
    !['direct','reject','dns'].includes(String(p.type).toLowerCase()) &&
    !/(剩余流量|套餐到期|续费官网|官网|佣金|合作代理)/.test(p.name || '')
  ).map(p => p.name);
  if (!nodes.length) throw new Error('Migration requires real proxy nodes; refusing DIRECT fallback.');
  // Keep manual choices; automatic failover never includes DIRECT or unrelated nodes.
  const autoName = 'RESIP-AUTO';
  const health = {url:'https://www.gstatic.com/generate_204',interval:120,
    timeout:5000,'max-failed-times':3,lazy:false,'expected-status':204};
  const groups = (config['proxy-groups'] || [])
    .filter(p => !['AI-GOOGLE',autoName].includes(p.name))
    .map(p => p.name === '自动切换' && p.type === 'fallback' ? {...p,...health} : p);
  config['proxy-groups'] = [
    {name:'AI-GOOGLE',type:'select',proxies:[autoName,...nodes,'REJECT']},
    {name:autoName,type:'fallback',proxies:nodes,...health}, ...groups];
  config['rule-providers'] = {...(config['rule-providers'] || {})};
  for (const id of ids) config['rule-providers'][prefix + id] = {
    type:'file',behavior:'classical',format:'yaml',path:'./rulesets/shadow-' + id + '.yaml'
  };
  const nativeSets = {google:'Google',tiktok:'TikTok',httpdns:'BlockHttpDNS',douyin:'DouYin',wechat:'WeChat'};
  for (const [id, folder] of Object.entries(nativeSets)) {
    config['rule-providers'][prefix + id] = {
      type:'http',behavior:'classical',format:'yaml',interval:86400,proxy:autoName,
      url:'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/'+folder+'/'+folder+'.yaml',
      path:'./rulesets/maintained/'+id+'.yaml','size-limit':2097152
    };
  }
  config['rule-providers']['sukka-ai'] = {
    type:'http',behavior:'classical',format:'text',interval:86400,proxy:autoName,
    url:'https://ruleset.skk.moe/Clash/non_ip/ai.txt',
    path:'./rulesets/maintained/sukka-ai.txt','size-limit':2097152
  };
  // Preserve the custom Google additions absent from the native upstream file.
  config['rule-providers']['local-google-compat'] = {
    type:'file',behavior:'classical',format:'yaml',path:'./rulesets/maintained/google-compat.yaml'
  };
  config['geo-auto-update'] = true;
  config['geo-update-interval'] = 24;
  config['geox-url'] = {...(config['geox-url'] || {}),
    geoip:'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.dat',
    geosite:'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat',
    mmdb:'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country.mmdb'
  };
  config.dns = {
    enable:true,listen:'127.0.0.1:1053',ipv6:false,
    'enhanced-mode':'fake-ip','fake-ip-range':'198.18.0.1/16',
    'fake-ip-filter':['*.lan','*.local','*.arpa','+.pool.ntp.org','time.*.com','ntp.*.com','+.msftconnecttest.com','+.msftncsi.com'],
    'prefer-h3':false,'respect-rules':true,
    'use-hosts':true,'use-system-hosts':false,
    'default-nameserver':['tls://223.5.5.5:853','tls://120.53.53.53:853'],
    nameserver:['https://cloudflare-dns.com/dns-query#AI-GOOGLE','https://dns.google/dns-query#AI-GOOGLE'],
    'proxy-server-nameserver':['tls://223.5.5.5:853','tls://120.53.53.53:853'],
    'direct-nameserver':['tls://223.5.5.5:853','tls://120.53.53.53:853'],
    'direct-nameserver-follow-policy':false,
    'nameserver-policy':{'+.lan':['system'],'+.local':['system'],'+.in-addr.arpa':['system'],'+.ip6.arpa':['system']},
    fallback:[]
  };
  config.ipv6 = false;
  config.tun = {...(config.tun || {}),device:'utun9','auto-route':true,'auto-detect-interface':true,
    'dns-hijack':['any:53','tcp://any:53'],mtu:1500};
  config.profile = {...(config.profile || {}),'store-selected':true,'store-fake-ip':true};
  const localDirect = [
    'DOMAIN-SUFFIX,local,DIRECT','DOMAIN-SUFFIX,in-addr.arpa,DIRECT','DOMAIN-SUFFIX,ip6.arpa,DIRECT',
    'IP-CIDR,127.0.0.0/8,DIRECT,no-resolve','IP-CIDR,10.0.0.0/8,DIRECT,no-resolve',
    'IP-CIDR,172.16.0.0/12,DIRECT,no-resolve','IP-CIDR,192.168.0.0/16,DIRECT,no-resolve',
    'IP-CIDR,169.254.0.0/16,DIRECT,no-resolve'
  ];
  const domesticDirect = [
    ...['aweme.snssdk.com','log.snssdk.com','ecomuser.snssdk.com','pitaya.bytedance.com','www.bytedance.com'].map(x=>'DOMAIN,'+x+',DIRECT'),
    ...['ecombdpage.com','qishui.com','gdtimg.com','alipayobjects.com','baydn.com','bcebos.com','amemv.com','zijieapi.com','ecombdapi.com','bytegecko.com','byteeffecttos.com'].map(x=>'DOMAIN-SUFFIX,'+x+',DIRECT')
  ];
  const protectedRules = [
    ...['api.ipify.org','api64.ipify.org','api.ipapi.is','proxycheck.io'].map(x=>'DOMAIN,'+x+',AI-GOOGLE'),
    ...['chatgpt.com','openai.com','oaistatic.com','oaiusercontent.com','anthropic.com','claude.ai','claude.com','claudeusercontent.com','google.com','googleapis.com','gstatic.com','tiktok.com','tiktokv.com','x.ai','grok.com','perplexity.ai','statsigapi.net','statsig.com','featuregates.org','arkoselabs.com','browserleaks.com','ipleak.net','dnsleaktest.com'].map(x=>'DOMAIN-SUFFIX,'+x+',AI-GOOGLE'),
    'RULE-SET,shadow-ai,AI-GOOGLE','RULE-SET,sukka-ai,AI-GOOGLE',
    'RULE-SET,local-google-compat,AI-GOOGLE','RULE-SET,shadow-google,AI-GOOGLE,no-resolve','RULE-SET,shadow-tiktok,AI-GOOGLE'
  ];
  const directSets = ['douyin','wechat','hsbc','hkbanks','hkbroker'].map(x=>'RULE-SET,shadow-'+x+',DIRECT,no-resolve');
  const oldRules = (config.rules || []).filter(r => r !== 'AND,((NETWORK,udp),(DST-PORT,443)),REJECT');
  // Defense in depth only: STUN/TURN may use other ports. Browser protection is still required.
  // These guards intentionally precede domestic and Google routes; calls may be affected.
  const rtcGuards = ['DOMAIN-KEYWORD,stun,REJECT',
    'DST-PORT,3478,REJECT','DST-PORT,5349,REJECT','DST-PORT,19302-19309,REJECT'];
  const routes = [...rtcGuards,...localDirect,'DOMAIN,dig.bdurl.net,REJECT','RULE-SET,shadow-httpdns,REJECT,no-resolve',
    ...domesticDirect,...protectedRules,...directSets,...oldRules];
  const result = [];
  for (const rule of routes) {
    const parts=rule.split(',');
    const tail=parts[parts.length-1] === 'no-resolve' ? parts.length-2 : parts.length-1;
    const action=parts[tail];
    if (action==='AI-GOOGLE' || action==='Proxy' || action==='PROXY') {
      const condition=parts.slice(0,tail).join(',') + (parts[parts.length-1] === 'no-resolve' ? ',no-resolve' : '');
      const guard=condition==='MATCH' ? 'AND,((NETWORK,udp),(DST-PORT,443)),REJECT' :
        'AND,((NETWORK,udp),(DST-PORT,443),('+condition+')),REJECT';
      result.push(guard);
    }
    result.push(rule);
  }
  config.rules=[...new Set(result)];
  return config;
}
