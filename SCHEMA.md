# Field schema

Source of truth for all fields accepted by the relay. Auto-generated from the live Notion schema snapshots in `schemas/`. If something here looks stale, re-run `node scripts/generate-schema-doc.mjs`.

**Payload shape:**

```json
{
  "type": "talent" | "recruit",
  "data": { ... fields below ... }
}
```

- Unknown keys are rejected with `400` — do not invent fields.
- `select` values must exactly match one option from the list (case-sensitive).
- `multi_select` values must each match one option from the list (case-sensitive).
- `checkbox` values must be boolean `true` / `false`.
- `url` values must start with `http://` or `https://`.
- `rich_text` and `title` values are plain strings.

## `talent` — Talent pool

Title key: `name` (required, non-empty string)

| Key | Type | Description |
|---|---|---|
| `name` | title | Candidate name or handle (required) |
| `contact` | rich_text | How to reach them — Telegram / Twitter / email / WeChat |
| `web3_experience` | select | Years of web3 experience |
| `roles` | multi_select | Roles the candidate is open to |
| `skills` | rich_text | Free-text strengths, e.g. "Solidity, React, fuzz testing" |
| `experience` | rich_text | Career highlights in prose |
| `education_level` | select | Highest degree (optional) |
| `education` | rich_text | School / program (optional) |
| `major` | rich_text | Major / field of study (optional) |
| `graduation` | rich_text | Graduation year or range (optional) |
| `languages` | multi_select | Spoken languages |
| `looking_for` | select | How actively they are looking |
| `salary_expectation` | rich_text | Free-text salary expectation |
| `more_links` | rich_text | GitHub, personal site, past work — one per line |
| `fulltime` | checkbox | Open to full-time |
| `parttime` | checkbox | Open to part-time |
| `internship` | checkbox | Open to internships |
| `remote_only` | checkbox | Only wants remote work |
| `is_student` | checkbox | Currently a student or new grad |
| `open_to_recruiters` | checkbox | OK with recruiter outreach |

### talent: valid `select` options

- **`web3_experience`**: `< 1年`, `1-2年`, `2-4年`, `> 4年`
- **`education_level`**: `学士/本科`, `硕士/研究生`, `博士/博士后`, `大专`, `辍学大佬`, `其他`
- **`looking_for`**: `随时合作`, `看看机会`, `交友拓展`

### talent: valid `multi_select` options

<details><summary><b><code>roles</code></b> (41 options)</summary>

`开发`, `前端`, `后端`, `全栈`, `运营`, `BD`, `投研`, `HRBP`, `项目管理`, `翻译`, `法务`, `QA`, `合伙人`, `数据`, `其他`, `风控`, `文案`, `产品`, `交易所`, `DeFi`, `Infra`, `Tokenomics`, `游戏策划`, `UIUX`, `设计`, `视觉`, `3D`, `增长`, `商务`, `游戏`, `投资`, `交易`, `VC`, `测试`, `JavaScript`, `TypeScript`, `Nodejs`, `Python`, `SQL`, `智能合约`, `Solana`

</details>

<details><summary><b><code>languages</code></b> (11 options)</summary>

`English`, `中文`, `粤语`, `한국어`, `日本語`, `Française`, `Deutsch`, `Pусский`, `Española`, `Mandarin`, `Cantonese`

</details>

---

## `recruit` — Recruitment board

Title key: `company` (required, non-empty string)

| Key | Type | Description |
|---|---|---|
| `company` | title | Company or project name (required) |
| `contact_email` | rich_text | Company contact email |
| `source_url` | url | Where you found the listing — aggregator URL (jobs.solana.com / ashbyhq / greenhouse / lever / workable etc.). This is what your agent fetched. |
| `apply_link` | url | Company's own official website (e.g. trustwallet.com, lightcone.trade) — NOT the aggregator URL. If the company has no official site, the admin will reject the submission; warn the user before submitting. |
| `job_description` | rich_text | What the role does |
| `requirements` | rich_text | What the company is looking for |
| `salary` | rich_text | Salary info, free-text |
| `benefits` | rich_text | Benefits and work environment, free-text |
| `apply_info` | rich_text | How to apply — contact info, process, etc. |
| `roles` | multi_select | Role tags / target candidate roles |
| `job_types` | multi_select | Granular job categories for this posting |
| `experience_required` | multi_select | Required years of experience |
| `ecosystem` | multi_select | Blockchain ecosystems relevant to the role (note: casing is inconsistent; use exactly the values below) |
| `company_type` | multi_select | Company category / sector |
| `locations` | multi_select | Office locations or time zones |
| `languages` | multi_select | Required spoken languages |
| `web3_experience` | select | Required years of web3 experience |
| `education_level` | select | Required education level (optional) |
| `looking_for` | select | Hiring posture |
| `fulltime` | checkbox | Full-time role |
| `parttime` | checkbox | Part-time role |
| `internship` | checkbox | Internship role |
| `remote` | checkbox | Remote allowed |
| `open_to_recruiters` | checkbox | Recruiter outreach welcome |
| `token_equity` | checkbox | Compensation includes token / NFT equity |

### recruit: valid `select` options

- **`web3_experience`**: `< 1年`, `1-2年`, `2-4年`, `> 4年`
- **`education_level`**: `学士/本科`, `硕士/研究生`, `博士/博士后`, `大专`, `辍学大佬`, `其他`
- **`looking_for`**: `随时合作`, `看看机会`, `交友拓展`

### recruit: valid `multi_select` options

<details><summary><b><code>roles</code></b> (56 options)</summary>

`开发`, `前端`, `后端`, `全栈`, `智能合约`, `Solana`, `EVM`, `QA`, `测试`, `产品`, `设计`, `平面`, `3D`, `视觉`, `UIUX`, `运营`, `BD`, `HRBP`, `Infra`, `Tokenomics`, `DeFi`, `VC`, `交易`, `风控`, `量化`, `交易所`, `合伙人`, `增长`, `投研`, `投资`, `数据`, `文案`, `法务`, `游戏`, `游戏策划`, `翻译`, `项目管理`, `其他`, `Python`, `C++`, `Java`, `JavaScript`, `Nodejs`, `SQL`, `C#`, `PHP`, `TypeScript`, `Go`, `Rust`, `Solidity`, `Swift`, `Figma`, `PS`, `AE`, `PR`, `运维`

</details>

<details><summary><b><code>job_types</code></b> (130 options)</summary>

`投研`, `开发`, `产品`, `UI/UX`, `设计`, `运营`, `市场`, `增长`, `PR`, `BD`, `Mod`, `客服`, `数据`, `运维`, `安全`, `PHP`, `Rust`, `前端`, `后端`, `全栈`, `智能合约`, `运维devops`, `数据分析`, `测试`, `python`, `技术负责人`, `区块链开发`, `solidity`, `zk`, `架构`, `技术支持`, `Linux`, `Java`, `游戏开发`, `Golang`, `开发者关系DevRel`, `iOS`, `React`, `Go`, `移动端`, `安卓`, `分析师`, `CMO`, `品牌包装`, `开发者社区`, `项目经理`, `实习生`, `助理`, `翻译`, `合规`, `DBA`, `HR`, `partners`, `合伙人`, `写作者`, `其他`, `交易员`, `研究员`, `风控`, `投资`, `Unity`, `社区经理`, `密码学`, `公链开发`, `大使`, `用户资产`, `游戏商业化`, `Flutter`, `设计师`, `投后`, `商务`, `会计`, `nodejs`, `嵌入式`, `编辑`, `人事`, `财务`, `C`, `C++`, `SQL`, `行政`, `算法`, `视频剪辑`, `Android`, `COO`, `矿场`, `全站`, `游戏策划`, `AI`, `api`, `clarity`, `runtime`, `web`, `法务`, `KYC`, `solana`, `审计`, `QA`, `涉及`, `move`, `活动策划`, `项目管理`, `支付`, `动画`, `交易`, `IOT`, `defi`, `文案`, `SRE`, `以太坊`, `做市`, `量化`, `机构`, `运营‘`, `#增长`, `钱包`, `SEO`, `cosmos`, `CTO`, `策略`, `DEX`, `校园大使`, `推广`, `爬虫`, `经济设计`, `美术`, `内容`, `视觉`, `技术顾问`, `视觉设计`

</details>

<details><summary><b><code>experience_required</code></b> (17 options)</summary>

`1年`, `2年`, `3年`, `4年`, `5年`, `8年`, `10年+`, `1-3年`, `不限`, `1-5年`, `5-8年`, `2-5年`, `在校大学生`, `应届`, `实习`, `在校生`, `3-5年`

</details>

<details><summary><b><code>ecosystem</code></b> (54 options)</summary>

`Bitcoin`, `solana`, `Multi-chain/Cross-chain`, `Ethereum`, `BSC/BNBChain`, `Polkadot/Substrate`, `NEAR`, `Avalanche`, `Move`, `Wormhole`, `Axie Infinity`, `IPFS`, `Terra`, `NYM`, `Stacks`, `EVM`, `Sui`, `Polygon`, `Cosmos`, `Tezos`, `Bitget`, `Aptos`, `Fantom`, `StarkNet`, `IOTA`, `Celo`, `zksync`, `Nervos`, `republic of vertu`, `Aleo`, `Arbitrum`, `zkSync`, `Celestia`, `Aurora`, `Starkware`, `Scroll`, `IoTeX`, `LayerZero`, `BASE`, `Ton`, `laun`, `Launchpad`, `Defi`, `Filecoin`, `Blast`, `Merlin`, `farcaster`, `lens`, `Sei`, `Injective`, `conflux`, `Kaspa`, `Morph`, `BeraChain`

</details>

<details><summary><b><code>company_type</code></b> (175 options)</summary>

`开发者社区`, `开发者工具`, `孵化器`, `PE/VC/咨询`, `审计`, `区块链基建`, `安全`, `跨链`, `Layer1`, `Layer2`, `协议`, `隐私`, `预言机`, `矿业/节点服务`, `SaaS`, `云`, `zk`, `钱包`, `入口`, `支付`, `DID`, `稳定币`, `DeFi`, `复合金融`, `资产管理`, `数据`, `NFT基建`, `社区基建`, `工具`, `AI`, `游戏`, `HealthFi`, `metaverse`, `DEX`, `CEX/交易所`, `做市商`, `视频`, `社交`, `DAO`, `平台`, `工作室`, `媒体`, `自媒体`, `其他`, `人力资源`, `技术支持`, `硬件钱包`, `数据分析`, `NFTfi`, `营销服务`, `内容`, `研究`, `Social`, `搜索引擎`, `AIGC`, `ERC3525`, `darkpool`, `Web3`, `游戏引擎`, `技术服务`, `sk`, `layer3`, `on-chain game`, `StakingaaS`, `DAO Tools`, `项目孵化/加速`, `品牌和内容`, `dapp`, `bugbounty`, `platform`, `infra`, `x-to-earn`, `Vtuber`, `launchpad`, `zk-rollup`, `evm`, `data`, `借贷`, `musicfi`, `密码学`, `算法`, `Hedge Fund`, `BTC`, `解决方案`, `hackathon`, `on chain fund platform`, `broker`, `音乐NFT`, `社会组织`, `生态基金`, `创作者经济`, `NFT平台`, `机构级`, `IM`, `衍生品交易`, `RWA`, `数字艺术`, `NFC`, `虚拟生活`, `元宇宙`, `socialFi`, `Perp DEX`, `线下活动`, `链`, `域名`, `Marketing`, `公链`, `投资分析`, `产品`, `企业支持`, `碳中和`, `交易所`, `信息聚合`, `加速器`, `DePIN`, `知识付费`, `用户教育`, `算力`, `矿池`, `矿场`, `RPC`, `对赌`, `社区`, `机构`, `券商`, `Broker`, `交易`, `MMORPG`, `laucn`, `模拟经营`, `手机`, `数码产品`, `存储`, `sdk`, `dpein`, `电商`, `信用卡`, `平替`, `内容营销`, `交易工具`, `框架`, `法务`, `GPU Network`, `投研`, `社团`, `量化`, `AI+web3`, `冷钱包`, `cec`, `浏览器`, `DNS`, `layae`, `区块浏览器`, `DeFund`, `隐私计算`, `渠道`, `liquidfund`, `可穿戴设备`, `咨询`, `deNet`, `金融`, `证券`, `股票`, `直播`, `矿机`, `NFT`, `SUi`, `Sui`, `分布式`, `云计算`, `SVM`, `比特币`, `潮玩`, `IP`, `游戏开发`

</details>

<details><summary><b><code>locations</code></b> (136 options)</summary>

`深圳`, `香港`, `HongKong`, `上海`, `global`, `看人`, `北京`, `成都`, `杭州`, `合肥`, `台北`, `Singapore`, `Canada`, `US`, `SF`, `NYC`, `Seattle`, `EST`, `Australia`, `Europe`, `Britain`, `Brazil`, `Dubai`, `Remote`, `Paris`, `SanFrancisco`, `Lisbon`, `Berlin`, `Miami`, `Zurich`, `Poland`, `Czechia`, `UK`, `苏州`, `Malaysia`, `India`, `分布式`, `Israel`, `Switzerland`, `Tokyo`, `Sydney`, `London`, `Lincolnshire`, `Scunthorpe`, `迪拜`, `Tel Aviv`, `上海/北京/深圳/成都办公均可`, `China`, `LasVegas`, `LA`, `Bangkok`, `Szczecin`, `Brussels`, `Asia`, `Vietnam`, `Pakistan`, `southkorea`, `Barcelona`, `Dublin`, `Madrid`, `Portugal`, `Boston`, `EMEA`, `APAC`, `Limassol`, `USA`, `Colombia`, `SouthEastAsia`, `Japan`, `Taipei`, `LosAngeles`, `Hawaii`, `SantaMonica`, `大理`, `Russia`, `伦敦`, `non-china`, `美国`, `吉隆坡`, `Korean`, `Korea`, `印度`, `台湾`, `PST`, `bangalore`, `大连`, `马尼拉`, `Manila`, `Philippine`, `osaka`, `base`, `韩国`, `maca`, `中国`, `中山`, `广州`, `mainland china/ HK`, `新加坡`, `amsterdam`, `SriLanka`, `remote`, `东京`, `青岛`, `Toronto`, `Bengualuru`, `Americas`, `日本`, `germany`, `france`, `netherlands`, `spain`, `NCY`, `Portland`, `工作签`, `CQ`, `France`, `hybrid`, `losaltos`, `南京`, `温哥华`, `Vancouver`, `菲律宾`, `马来西亚`, `South America`, `melbourne`, `江浙沪`, `长沙`, `denver`, `远程`, `Kualar Lumpur`, `泰国`, `SilliconValley`, `Taiwan`, `曼谷`, `Abu Dhabi`, `UTC+8`

</details>

<details><summary><b><code>languages</code></b> (11 options)</summary>

`English`, `中文`, `粤语`, `한국어`, `日本語`, `Française`, `Deutsch`, `Pусский`, `Española`, `Mandarin`, `Cantonese`

</details>

