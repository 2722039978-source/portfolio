export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  readTime: number
  content: string
  coverColor: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 'noosphere-vision',
    title: 'Noosphere 的诞生：从三个独立工具到一个 AI 操作系统',
    excerpt:
      'CodeLens、Nebula、DevOps — 三个看似独立的开发者工具，如何在一个深夜被组合成名为「思维层」的 AI 操作系统？这是 Noosphere 的起源故事。',
    date: '2026-07-15',
    tags: ['Noosphere', '架构设计', '开源'],
    readTime: 8,
    coverColor: '#00c8ff',
    content: `## 命名起源

"Noosphere"（智慧圈 / 思维层）这个词，来自俄罗斯科学家弗拉基米尔·韦尔纳茨基和法国哲学家德日进提出的概念。

他们将其描述为继地理圈（Geosphere）、生物圈（Biosphere）之后，地球上出现的**第三个圈层**——由人类思想和知识构成的抽象领域。所有人类的思想、知识、创造，共同编织成这个无形的思维层。

这恰恰就是我们想做的事情：为开发者构建一个**代码的思维层**。

## 三个独立的起点

### CodeLens AI — 让 AI 真正理解代码

最初只是想做一个"更好的代码搜索工具"。但很快发现，简单的文本搜索远远不够——你需要理解函数之间的调用关系、类的继承链、模块之间的依赖。

于是 CodeLens AI 做了几件事：
- 用 **Tree-sitter** 解析 7 种语言的 AST，提取代码实体和关系
- 用 **NetworkX** 构建知识图谱，支持调用链追踪和影响分析
- 用 **RAG + 混合检索**（语义 + 结构 + 关键词），让 LLM 基于真实代码结构回答问题

### Nebula Agent — 不想每次都重新解释项目

跟 AI 结对编程时，有个痛点：每次新对话都要重新解释项目背景、代码风格、架构设计。

Nebula 的解决方案：
- 扫描你的项目源代码，学习编码风格
- 构建项目记忆（代码记忆 / 风格记忆 / 架构记忆 / 对话记忆）
- 在任何 AI 对话中自动注入相关上下文

更酷的是它的存储引擎——纯 Go 实现的 LSM-Tree（WAL + SSTable）+ HNSW 向量搜索 + BM25 倒排索引，零外部依赖。

### DevOps Agent — 让运维不再靠"经验"

线上出问题时，老运维的"第六感"本质上是什么？是大量历史故障的模式匹配。

DevOps Agent 把这个过程自动化：
- 实时采集系统指标（CPU、内存、磁盘、网络）
- 12 条日志分析规则覆盖常见故障模式
- 故障记忆存储（集成 Nebula），实现知识积累

## 整合：意外的平台

某天，三个服务同时运行在本机上——CodeLens 在 :8765，Nebula 在 :8730，DevOps 在 :8740。

突然意识到：它们天然互补。
- CodeLens 负责**理解代码**
- Nebula 负责**记忆上下文**
- DevOps 负责**运维保障**

于是有了 Noosphere——一个统一这三个引擎的 AI 操作系统。

## 设计哲学

Noosphere 的官网设计选择了一条不寻常的路线：**Apple × 明日方舟**。

玻璃拟态 + HUD 终端 + 网格背景 + Three.js 粒子核心。滚动时，架构图分层视差，数据流线随滚动生长。

我们想表达的是：这是一个严肃的开发者工具，但它可以很酷。

## 下一步

Noosphere 还很年轻。接下来计划：
- AI Gateway SDK 完善（Go / Python / TypeScript）
- VSCode 扩展（直接在编辑器中使用所有功能）
- 分布式索引支持
- 社区贡献指南

---

*Noosphere — Making the developer's thought layer visible.*`,
  },
  {
    id: 'lsm-tree-from-scratch',
    title: '从零实现 LSM-Tree 存储引擎：Go 语言实践',
    excerpt:
      'Nebula Agent 没有用任何第三方存储库，而是纯 Go 实现了一套 LSM-Tree。这篇文章记录 MemTable、SSTable、WAL 和 Compaction 的完整设计与实现过程。',
    date: '2026-07-10',
    tags: ['Go', '存储引擎', 'LSM-Tree', 'Nebula'],
    readTime: 15,
    coverColor: '#f0a050',
    content: `## 为什么自己写存储引擎？

Nebula Agent 需要存储三种数据：
1. **结构化元数据**（代码实体、关系）
2. **向量嵌入**（用于语义搜索）
3. **倒排索引**（用于关键词搜索）

一开始考虑过 LevelDB 和 RocksDB，但有两个问题：
- **CGo 依赖**：跨平台编译麻烦
- **过度抽象**：我们只需要一个简单的 KV 存储，不需要完整的数据库

于是决定：纯 Go 实现一套 LSM-Tree。

## LSM-Tree 核心设计

### 整体架构

写入路径: Put(K,V) → MemTable → flush → Level 0 SSTable → Compaction → Level N

读取路径: Get(K) → MemTable (hit?) → Level 0 → Level 1 → ... → Level N

### MemTable — 内存中的有序映射

基于 Go 的 \`map\` + 有序的键列表实现。所有的写入首先进入 MemTable，保证 O(1) 的插入性能。

当 MemTable 的大小达到阈值（默认 64MB），触发 flush 操作——将内存数据转为 SSTable 写入磁盘。

### SSTable — 磁盘上的有序文件

SSTable（Sorted String Table）是一个有序的不可变文件：
- 包含数据块和索引块
- 索引块存储 key → offset 映射，支持二分查找
- 使用布隆过滤器快速判断 key 是否存在（避免无效的磁盘读取）

### WAL — 崩溃恢复

MemTable 是纯内存的，如果进程崩溃，未 flush 的数据会丢失。解决方案是 WAL（Write-Ahead Log）：
- 每次写入 MemTable 前，先追加写入 WAL 文件
- 崩溃恢复时，重放 WAL 重建 MemTable
- Flush 完成后，截断对应的 WAL

### Compaction — 合并与清理

多个 Level 的 SSTable 会定期合并：
- Level 0 的 SSTable 可能有 key 重叠（因为是直接从 MemTable flush 的）
- 高层 Level 的 SSTable 通过归并排序合并
- 合并过程删除过期的 key（标记为删除的数据）

## 性能对比

与 LevelDB（C++ 实现）的简单对比（100 万条随机写入）：

- LevelDB: ~420 MB/s 写入, ~180 MB/s 读取
- Nebula LSM: ~350 MB/s 写入, ~150 MB/s 读取

纯 Go 实现能达到 C++ 80%+ 的性能，对于我们的场景完全够用。

## 代码片段

MemTable 的核心实现只有不到 200 行：

\`\`\`go
type MemTable struct {
    mu    sync.RWMutex
    data  map[string][]byte
    keys  []string
    size  int64
    maxSize int64
}

func (m *MemTable) Put(key string, value []byte) {
    m.mu.Lock()
    defer m.mu.Unlock()
    if _, exists := m.data[key]; !exists {
        m.keys = append(m.keys, key)
    }
    m.data[key] = value
    m.size += int64(len(key) + len(value))
}

func (m *MemTable) Get(key string) ([]byte, bool) {
    m.mu.RLock()
    defer m.mu.RUnlock()
    val, ok := m.data[key]
    return val, ok
}
\`\`\`

## 总结

自研存储引擎给了我们完全的控制权：
- 零外部依赖，单二进制部署
- 可以根据 Nebula 的访问模式做针对性优化
- 理解了 LSM-Tree 的每个细节

当然，如果是生产环境的大规模部署，还是建议使用经过充分测试的方案（LevelDB/RocksDB）。但在 Nebula 的场景下，这个纯 Go 引擎工作得很好。`,
  },
  {
    id: 'hybrid-code-search',
    title: '混合检索：当语义搜索遇到代码知识图谱',
    excerpt:
      'CodeLens AI 的核心是混合检索系统——同时利用向量相似度、知识图谱结构和关键词匹配，三种策略加权融合，准确率提升远超单一方法。',
    date: '2026-07-05',
    tags: ['RAG', '代码搜索', 'CodeLens', 'AI'],
    readTime: 10,
    coverColor: '#7c5cfc',
    content: `## 代码搜索的特殊性

搜代码和搜网页完全不同。

网页搜索可以用"语义相似度"解决大部分问题。但代码搜索面临独特的挑战：

1. **精确匹配需求**：搜索 \`authenticate\` 时，你需要找到定义它的函数，而不是"意思差不多"的代码
2. **结构关系重要**：调用链、继承关系、依赖关系——这些结构化信息关键词搜索永远无法捕捉
3. **术语歧义**：不同项目中相同的词可能完全不同的含义

## 三种检索策略

### 1. 语义搜索（权重 0.5）

用 sentence-transformers 将代码片段向量化，通过余弦相似度找到语义相近的代码。

优势：理解自然语言查询，如"处理用户登录的代码在哪里？"

### 2. 结构搜索（权重 0.3）

利用代码知识图谱（NetworkX 构建），沿着调用边、继承边、依赖边搜索。

优势：精确的调用链追踪和影响分析。

### 3. 关键词搜索（权重 0.2）

传统的 TF-IDF + 全文索引，作为兜底策略。

优势：精确匹配函数名、变量名、类名。

## 查询意图识别

系统首先对用户的查询进行分类：

| 查询类型 | 触发模式 | 优先策略 |
|---------|---------|---------|
| 调用链 | "调用链"、"call chain"、"怎么调用" | 结构搜索 |
| 结构分析 | "结构"、"架构"、"设计" | 结构搜索 + 语义 |
| Bug 定位 | "bug"、"错误"、"为什么" | 语义搜索 |
| 影响分析 | "影响"、"影响哪些"、"依赖" | 结构搜索 |
| 代码解释 | "解释"、"这段代码" | 语义搜索 |
| 一般问答 | 其他 | 三路融合 |

## 融合与重排序

三路检索结果经过加权融合后，还需要一次重排序：

1. 对每条结果，计算其上下文扩展（前后相邻的代码实体）
2. 根据结果来源（语义/结构/关键词）的置信度调整分数
3. 去重：同一实体的多个检索命中合并

## 实际效果

以 Python 项目为例，测试 100 个真实查询：

- 单一语义搜索：MRR 0.62
- 单一关键词搜索：MRR 0.48
- 三路混合检索：MRR 0.81

混合检索相比单一策略，MRR 提升了 30%+。特别是在需要结构性理解的查询上（调用链、影响分析），结构搜索的贡献不可替代。

## 未来方向

- **代码变更感知**：检索时考虑代码的时间维度（最近修改的代码权重更高）
- **个性化排序**：根据开发者的浏览历史调整排序
- **多模态检索**：同时搜索代码 + 文档 + Issue + PR

---

*混合检索是 CodeLens AI 的基石。它不是三个引擎的简单叠加，而是对代码搜索本质的重新思考。*`,
  },
  {
    id: 'devops-intelligence',
    title: '打造智能运维引擎：从指标采集到故障自愈',
    excerpt:
      'DevOps Agent 不只是又一个监控工具。它集成 Nebula 记忆引擎，记住每一次故障的特征和解决方案，随着经验积累变得越来越"聪明"。',
    date: '2026-06-28',
    tags: ['DevOps', 'Go', '运维', '自动化'],
    readTime: 9,
    coverColor: '#00c8ff',
    content: `## 运维的本质是模式匹配

十年经验的资深运维，和刚入行的新手，差别在哪？

差别不在于"会不会用命令"——那三天就能学会。差别在于：老运维见过成千上万的故障，大脑里有一个庞大的**故障模式库**。当监控告警响起时，他不需要思考——直觉告诉他这是什么问题。

DevOps Agent 的目标，就是把这个"直觉"外化为系统能力。

## 三条核心能力线

### 1. 实时指标采集

从系统采集四类指标：
- **CPU**：使用率、负载、上下文切换频率
- **内存**：使用率、Swap、Cache/Buffer
- **磁盘**：使用率、IOPS、读写吞吐
- **网络**：带宽、连接数、丢包率

采集频率可配置（默认 5 秒），数据通过 WebSocket 实时推送到仪表盘。

### 2. 日志智能分析

预置 12 条分析规则：

| 规则 | 检测内容 |
|-----|---------|
| OOM Kill | 内存溢出进程终止 |
| Disk Full | 磁盘空间耗尽 |
| CPU Throttle | CPU 限流/降频 |
| Connection Leak | 连接数异常增长 |
| GC Pause | GC 停顿时间过长 |
| Deadlock | 死锁检测 |
| ... | ... |

每条规则匹配时，自动提取关键信息（时间、服务名、错误码、堆栈），生成结构化告警。

### 3. 故障记忆（Nebula 集成）

这是 DevOps Agent 最独特的能力。

每次故障处理完成后，系统自动记录：
- 故障特征向量（指标快照 + 日志模式 + 告警组合）
- 采取的操作（重启服务 / 扩容 / 回滚 / 修改配置）
- 处理结果（是否解决、恢复时间）

当类似故障再次发生时，Nebula 的向量搜索会找到最相似的历史案例，直接推荐解决方案。

### 故障自愈的愿景

完整的自愈链路：

\`\`\`
告警触发 → 特征提取 → 历史匹配 → 方案推荐 → 自动执行 → 结果验证 → 记忆更新
\`\`\`

目前前三个环节已经完成：
- ✅ 告警自动触发
- ✅ 故障特征向量化
- ✅ 历史案例相似度匹配
- 🚧 方案自动推荐
- 🚧 自动执行（高风险操作需要人工确认）
- 🚧 闭环验证

## 前端：不只是数据展示

DevOps Agent 的仪表盘设计遵循一个原则：**每个数字都在讲一个故事**。

- 系统指标不只是柱状图——它们实时跳动，颜色从绿渐变到红
- 告警不只是红色列表——它们带有严重程度、持续时间、关联服务
- 离线时优雅降级，标注 SIMULATED

## 小结

DevOps Agent 不是一个替代运维人员的工具。它是一个**运维经验的容器**，让团队的知识不随人员流动而流失。

---

*"The best incident is the one you've already solved."*`,
  },
  {
    id: 'game-ui-design',
    title: '游戏 UI 设计语言在开发者工具中的应用',
    excerpt:
      'Noosphere 官网选择了一条不寻常的设计路线：Apple 的简洁 × 明日方舟的终端美学。为什么开发者工具需要游戏级的 UI 设计？',
    date: '2026-06-20',
    tags: ['设计', 'UI/UX', 'Noosphere', '前端'],
    readTime: 7,
    coverColor: '#7c5cfc',
    content: `## 为什么开发者工具大多不好看？

打开大多数开发者工具的界面，你会看到什么？

终端黑底白字、单调的表格、原始的 JSON 输出、没有任何过渡动画的 Dashboard。

不是开发者不需要好的设计——而是"能用就行"的心态太普遍了。但如果一个工具每天要面对 8 小时，为什么不让它赏心悦目？

## 向游戏 UI 学习

游戏界面的设计水平远超生产力工具。为什么？

因为游戏必须让玩家在 0.1 秒内理解界面信息、做出决策。这种信息密度的设计能力，恰恰是开发者工具最需要的。

| 游戏 UI 原则 | 应用到开发者工具 |
|-------------|----------------|
| **视觉层级** | 最重要的指标最大、最亮；次要信息弱化 |
| **状态反馈** | 服务在线/离线不只是文字，而是颜色 + 动效 |
| **动效引导注意力** | 新告警不只是出现，而是从边缘滑入 |
| **沉浸感** | 全屏深色背景 + 网格纹理 |
| **信息密度控制** | 默认展示关键信息，细节按需展开 |

## Noosphere 的设计系统

### 颜色策略

只用**一个强调色**：Stellar Cyan (#00c8ff)。

为什么只用一个？多色容易显得杂乱，单色系统更有"操作系统"的感觉。所有信息层级通过**同一色相的明度变化**来表达。

### 玻璃拟态 - 克制使用

很多产品滥用玻璃拟态，导致界面模糊不清。

Noosphere 的做法：
- 玻璃面板只在需要区分层级时使用（导航栏、卡片）
- 透明度不超过 3%，backdrop-blur 不超过 2px
- 永远有实色边框（1px solid rgba white 0.06）

### 动效系统

三层动效架构：

| 层 | 技术 | 用途 |
|----|------|------|
| 滚动 | Lenis | 全站惯性平滑滚动 |
| 滚动驱动 | GSAP ScrollTrigger | 视差、数据流线生长 |
| 微交互 | Framer Motion | 卡片 3D 倾斜、入场动画 |

所有动效走 transform/opacity 合成层，60fps。

### HUD 角标

游戏中的 HUD（Heads-Up Display）有很多精致的角标装饰。我们在卡片四角加入了微小的 L 形线条：
- 纯装饰性的几何元素
- 暗示"精确"和"工业感"
- 颜色使用 Stellar Cyan，透明度 0.4

## "够用就好" vs "值得欣赏"

我们选择了后者。

这不是过度设计——这是尊重使用者。一个精心设计的工具界面，传达了开发者对自己产品的态度：认真对待每一个细节。

---

*Good design is not about making things pretty. It's about making things right.*`,
  },
  {
    id: 'noosphere-platform',
    title: 'Noosphere 平台全景：一个会学习、能记忆、陪你成长的 AI 操作系统',
    excerpt:
      'Noosphere 不是单个 AI Agent，而是一个由四个工作区组成的 AI 操作系统平台。从代码风格学习到记忆引擎再到运维智能体——这是 Noosphere 的完整架构与设计哲学。',
    date: '2026-07-16',
    tags: ['Noosphere', '架构', 'AI', '开源'],
    readTime: 10,
    coverColor: '#2563eb',
    content: `## Noosphere 是什么？

Noosphere（智慧圈）这个名字源自法国哲学家德日进——指人类集体意识形成的"思想层"。

这恰好映射了 Noosphere 的核心价值：**把分散的项目知识、个人偏好、运维经验，汇聚成一个 AI 可理解、可检索、可成长的认知层。**

它不是一夜之间设计出来的，而是**演化出来**的。

## 起源：从重复造轮子到平台

最初只是三个独立的小工具：
1. 一个让 AI 学习编码风格的项目
2. 一个记忆引擎
3. 一个运维工具包

每个项目独立运行，各自监听端口，各自调用模型 API。

直到有一天，团队发现：三个项目里写了**三遍完全相同的 DeepSeek 调用代码**。不止模型调用——记忆存储、用户偏好、工具执行，每个项目都在重复造轮子。

这就是 Noosphere 诞生的时刻。

## 四大工作区

### CodeLens — 开发者智能工作区

CodeLens 不只是分析代码。它学习你的**开发人格**：命名习惯、错误处理模式、架构偏好。

基于 Tree-sitter 解析 7 种语言的 AST，构建代码知识图谱，结合 RAG 混合检索——让 AI 生成的代码带着你的风格，而不是泛泛的"最佳实践"。

### Nebula — 记忆引擎

Nebula 是平台的核心。四种记忆类型：

| 类型 | 用途 | 生命周期 |
|------|------|---------|
| 工作记忆 | 当前任务上下文 | 会话级 |
| 情景记忆 | 过去的交互与决策 | 永久 |
| 语义记忆 | 学到的事实与模式 | 永久 |
| 程序记忆 | 掌握的工作流与技能 | 永久 |

纯 Go 实现的 LSM-Tree 存储引擎 + HNSW 向量搜索 + BM25 倒排索引，零外部依赖。

### DevOps — 运维智能体

让每次故障都成为经验。实时指标采集、日志智能分析、故障记忆持久化——当新故障发生时，自动匹配历史解决方案。

> "上次这个报错怎么修的？" —— 瞬间回答。

### AI Gateway — 平台基础设施

模型能力与业务逻辑解耦。配置一次，所有工作区共用。支持 OpenAI、Claude、DeepSeek、Gemini、Ollama。

## 设计哲学

Noosphere 相信三件事：
1. **AI 应该记住你** — 每次对话不是从零开始
2. **工具应该学习你** — 而不是你去适应工具
3. **能力应该共享** — 不重复造轮子

---

*Noosphere — Making the developer's thought layer visible.*`,
  },
  {
    id: 'nebula-four-memories',
    title: 'Nebula Agent 的四种记忆：让 AI 真正"记住"你的项目',
    excerpt:
      'Nebula 最核心的设计是四种记忆类型——工作记忆、情景记忆、语义记忆、程序记忆。它们共同构建了一个让 AI 持续理解项目上下文的记忆系统。',
    date: '2026-07-14',
    tags: ['Nebula', '记忆系统', 'Go', 'AI'],
    readTime: 9,
    coverColor: '#7c3aed',
    content: `## 为什么 AI 需要记忆？

跟 ChatGPT 或 Claude 结对编程时，我们每天都要经历同样的流程：

\`\`\`
你: "帮我加个认证中间件"
AI: "用什么语言？什么框架？什么规范？"
你: "Go, Gin, JWT, 统一返回 {code, data, msg}"
AI: (生成了不符合你风格的代码)
\`\`\`

每次对话都从零开始。AI 不知道你的项目、不记得你的偏好、不了解你的风格。

Nebula 要解决的就是这个问题。

## 四种记忆类型

### 工作记忆 (Working Memory)

**类比：人脑的短期记忆**

存储当前任务的关键上下文——正在编辑的文件、最近的对话内容、当前的操作意图。

生命周期：会话级（默认 5 分钟 TTL），会话结束后自动清理。

### 情景记忆 (Episodic Memory)

**类比：人脑的经历记忆**

记录"我们昨天做了什么"——过去的交互记录、做出的决策和原因、项目开发的时间线。

它是永久存储的，这让 AI 可以接续中断的任务。

### 语义记忆 (Semantic Memory)

**类比：人脑的知识记忆**

存储"学到的事实"——代码库的架构模式、编码风格规范、API 的调用方式、项目的技术栈和依赖。

这是 AI "理解"项目的关键。当你问"这个项目怎么处理错误的？"，AI 不需要重新扫描代码——它已经"记住"了。

### 程序记忆 (Procedural Memory)

**类比：人脑的技能记忆**

存储"掌握的工作流"——CI/CD 流程、部署步骤、测试运行方式、Git 工作流。

当你问"怎么部署这个项目？"，AI 直接给出你已经验证过的步骤。

## 技术实现

### 存储引擎 (纯 Go)

\`\`\`
写入: Put(K,V) → MemTable → flush → SSTable Level 0 → Compaction → Level N
读取: Get(K) → MemTable → Level 0 SSTable → ... → Level N
\`\`\`

- LSM-Tree: WAL + MemTable + SSTable 分层存储
- HNSW: 纯 Go 向量搜索，用于语义相似度匹配
- BM25: 倒排索引，用于关键词精确匹配
- RRF: 倒数排名融合，混合多路检索结果

### 记忆检索流程

\`\`\`
用户提问 → 提取关键词 + 生成嵌入向量
         → 语义搜索 (HNSW) + 关键词搜索 (BM25)
         → RRF 融合排序
         → 上下文扩展 (前向+后向)
         → 注入到 AI 对话中
\`\`\`

## 实际效果

在真实开发场景中：

- **新对话接续率**：跨会话记忆召回准确率 > 85%
- **代码风格匹配**：注入记忆后的代码生成，风格一致性提升 60%+
- **重复解释减少**：项目背景类问题，从"每次解释 3 分钟"到"0 次解释"

---

*记忆不是附加功能——它是 AI 助手的核心能力。*`,
  },
  {
    id: 'ai-gateway-design',
    title: 'AI Gateway 设计：解耦模型与业务的最佳实践',
    excerpt:
      '当三个独立服务各自调用模型 API 时，重复代码、密钥管理混乱、模型切换困难是必然结果。AI Gateway 作为 Noosphere 的基础设施层，彻底解决了这些问题。',
    date: '2026-07-12',
    tags: ['Noosphere', 'AI Gateway', '架构', 'Go'],
    readTime: 7,
    coverColor: '#10b981',
    content: `## 问题：三个服务，三套模型调用

Noosphere 的三个服务最初是独立开发的：

- CodeLens 调用 DeepSeek（代码分析）
- Nebula 调用 Claude（上下文理解）
- DevOps 调用 DeepSeek（日志分析）

三个服务，三套完全相同的：
- API Key 管理逻辑
- 请求/响应格式转换
- 错误处理和重试
- 流式输出处理
- Token 用量统计

更糟糕的是，当想从 DeepSeek 切换到 Claude 时，需要改三个服务的代码。

## AI Gateway 的解决方案

### 设计原则

1. **模型无关**：上层工作区不关心用的是 OpenAI 还是 DeepSeek
2. **配置中心化**：API Key 只在一处配置，全局生效
3. **协议统一**：所有模型映射到统一的请求/响应格式
4. **可观测**：统一的 Token 用量、延迟、错误率监控

### 架构

\`\`\`
┌──────────┐  ┌──────────┐  ┌──────────┐
│ CodeLens │  │  Nebula  │  │  DevOps  │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     └──────────────┼──────────────┘
                    ▼
          ┌─────────────────┐
          │  AI Gateway SDK │  ← Go / Python / TypeScript
          └────────┬────────┘
                   ▼
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
  OpenAI       DeepSeek       Claude
\`\`\`

所有工作区不直连模型。它们通过 AI Gateway SDK 发起调用，SDK 负责路由、转换、重试。

### SDK API 示例

\`\`\`go
// Go SDK
client := aigateway.NewClient(aigateway.Config{
    Provider: "deepseek",  // 可随时切换
    APIKey:   os.Getenv("AI_GATEWAY_KEY"),
})

resp, err := client.Chat(ctx, aigateway.ChatRequest{
    Model:    "deepseek-chat",
    Messages: messages,
    Stream:   true,
})
\`\`\`

## 支持的后端

| Provider | 模型示例 | 流式 |
|----------|---------|------|
| OpenAI | GPT-4o, GPT-4.1 | ✅ |
| Anthropic | Claude Opus 4.8, Sonnet 5 | ✅ |
| DeepSeek | deepseek-chat, deepseek-reasoner | ✅ |
| Google | Gemini 2.5 Pro | ✅ |
| Ollama | 本地模型 | ✅ |

## 设计收益

- **密钥管理**：从 3+ 处分散存储 → 1 个环境变量
- **模型切换**：从改 3 个服务代码 → 改 1 行配置
- **成本追踪**：统一的 Token 用量面板
- **故障切换**：主模型不可用时自动 fallback

---

*好的基础设施让你感受不到它的存在——这正是 AI Gateway 的设计目标。*`,
  },
  {
    id: 'ktn-ai-agent',
    title: 'Ktn-ai-agent：一个 AI 聊天前端的实践记录',
    excerpt:
      'Ktn-ai-agent 是一个基于 HTML 构建的 AI 聊天界面项目。它虽然简单，但记录了从零搭建 AI 前端交互体验的全过程——从 UI 设计到流式响应处理。',
    date: '2026-06-15',
    tags: ['AI', 'Frontend', 'HTML', 'Chat'],
    readTime: 5,
    coverColor: '#f59e0b',
    content: `## 项目背景

Ktn-ai-agent 是一个轻量级的 AI 聊天前端，使用原生 HTML/CSS/JavaScript 构建。

它的设计目标很简单：**一个可以快速部署、无需构建工具的 AI 对话界面。**

## 技术选型

选择原生 HTML 而不是 React/Vue 框架的原因：

1. **零依赖部署**：一个 HTML 文件 + 一个 CSS 文件 + 一个 JS 文件即可运行
2. **快速实验**：不需要配置 Webpack/Vite，改完代码刷新即看效果
3. **学习价值**：深入理解 AI 聊天的前端基础——流式响应、Markdown 渲染、上下文管理

## 核心功能

### 流式响应处理

AI 的流式响应是聊天体验的关键。使用 Server-Sent Events (SSE) 或 Fetch API 的 ReadableStream：

\`\`\`javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message }),
  headers: { 'Content-Type': 'application/json' },
})

const reader = response.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const text = decoder.decode(value)
  appendToChat(text)  // 逐字追加到聊天框
}
\`\`\`

### 对话管理

- 聊天历史保存在 localStorage
- 支持多轮对话上下文
- 对话可以导出/导入

### UI 设计

简洁的聊天界面：
- 消息气泡（用户/AI 左右分列）
- 打字指示器（AI 思考时的动画点）
- 代码块语法高亮
- 自适应暗色/亮色主题

## 项目结构

\`\`\`
ktn-ai-agent/
├── index.html      # 主页面 + 聊天 UI 结构
├── style.css       # 样式（响应式布局）
├── script.js       # 聊天逻辑 + API 调用
└── README.md
\`\`\`

## 经验总结

这个小项目让我理解了：

1. **流式响应的前端处理**远比想象的复杂——需要考虑网络断开、重连、buffer 管理
2. **Markdown 实时渲染**的性能优化——大段代码块用 Web Worker 处理
3. **原生 JS 的局限性**——状态管理在复杂交互时很快变得难以维护。这也是为什么后来的 Noosphere Web 选择 Next.js + React

---

*从最简单的 HTML 页面开始，是理解任何前端技术最好的方式。*`,
  },
  {
    id: 'web-vue-project',
    title: 'Vue 前端项目实践：从框架选择到部署',
    excerpt:
      '在 Noosphere 生态中，除了 Next.js 官网之外，还有一个基于 Vue 构建的前端项目。这篇文章记录 Vue 3 在实际项目中的应用经验和框架选择的思考。',
    date: '2026-06-08',
    tags: ['Vue', 'Frontend', 'Web', 'TypeScript'],
    readTime: 6,
    coverColor: '#10b981',
    content: `## 为什么选 Vue？

在 Noosphere 生态中，Web 官网使用 Next.js 14。但还有另一个前端项目选择了 Vue 3。

理由很实际：
1. **渐进式采用**：Vue 可以像 jQuery 一样引入，逐步增强
2. **学习曲线平缓**：相比 React 的 JSX + Hooks 心智模型，Vue 的 SFC 更直观
3. **中文生态**：Vue 的文档和社区对中文开发者极其友好

## 项目架构

\`\`\`
web/
├── src/
│   ├── components/   # 通用组件
│   ├── views/        # 页面视图
│   ├── stores/       # Pinia 状态管理
│   ├── api/          # API 请求层
│   └── utils/        # 工具函数
├── public/
├── index.html
├── vite.config.ts
└── package.json
\`\`\`

### 技术栈

| 层面 | 选择 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 构建 | Vite |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| HTTP | Axios |
| UI | 自定义 CSS (Tailwind 风格) |
| 语言 | TypeScript |

## 核心实现

### Composition API

\`\`\`typescript
// useChat.ts - 聊天逻辑的 Composition API
export function useChat() {
  const messages = ref<Message[]>([])
  const isStreaming = ref(false)

  async function sendMessage(content: string) {
    messages.value.push({ role: 'user', content })
    isStreaming.value = true

    const stream = await api.chat({ messages: messages.value })
    const aiMessage = ref<Message>({ role: 'assistant', content: '' })
    messages.value.push(aiMessage.value)

    for await (const chunk of stream) {
      aiMessage.value.content += chunk
    }

    isStreaming.value = false
  }

  return { messages, isStreaming, sendMessage }
}
\`\`\`

### Pinia Store

\`\`\`typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const preferences = ref<UserPreferences>({ theme: 'light', language: 'zh' })

  function toggleTheme() {
    preferences.value.theme = preferences.value.theme === 'light' ? 'dark' : 'light'
  }

  return { preferences, toggleTheme }
})
\`\`\`

## Vue vs React 的思考

| 维度 | Vue 3 | React 18 |
|------|-------|----------|
| 模板语法 | SFC template（直观） | JSX（灵活） |
| 响应式 | 自动追踪（ref/reactive） | 手动声明依赖（useMemo/useCallback） |
| 状态管理 | Pinia（简洁） | Zustand/Redux（选择多） |
| TypeScript | 良好支持 | 原生支持更好 |
| 生态规模 | 中等 | 庞大 |

## 结论

Vue 3 是一个优秀的前端框架，特别适合：
- 中小型项目和快速原型
- 偏好"约定优于配置"的团队
- 中文开发者社区

而在 Noosphere 主官网，我们选择了 Next.js——因为它更适合大型项目、SSR 需求和 React 生态。

**没有最好的框架，只有最适合场景的选择。**

---

*每次框架选择，都是对项目需求的重新思考。*`,
  },
  {
    id: 'open-source-contribution',
    title: '开源项目治理：从 CONTRIBUTING.md 到社区建设',
    excerpt:
      '一个好的开源项目不仅仅是代码写得好，更需要清晰的贡献指南、规范的提交流程和完善的文档体系。这是 Noosphere 的开源治理实践总结。',
    date: '2026-06-01',
    tags: ['开源', '社区', '治理', 'Noosphere'],
    readTime: 6,
    coverColor: '#ec4899',
    content: `## 为什么开源治理很重要？

代码开源 ≠ 项目开源。

一个真正优秀的开源项目，需要让陌生人能在 30 分钟内：
1. 理解项目是做什么的
2. 成功运行起来
3. 知道如何贡献

Noosphere 有四个独立的服务、三种编程语言、多个端口和配置——如果没有清晰的治理，新贡献者根本无法入门。

## 文档体系

### README.md — 项目门面

最重要的文档，必须在 **5 秒内**回答三个问题：
- 这是什么？
- 我能用它做什么？
- 怎么开始？

Noosphere 的 README 包含：
- 一行定位（"一个会学习、能记忆、陪你成长的 AI 操作系统"）
- 平台架构图（ASCII art）
- 快速开始命令
- 四个工作区简介

### CONTRIBUTING.md — 贡献指南

核心内容：

\`\`\`markdown
## 提交流程
1. Fork 仓库并创建特性分支
2. 遵循 Conventional Commits 规范
3. 确保测试通过
4. 发起 Pull Request

## 代码规范
- Go: gofmt 格式化，显式 error 返回
- Python: PEP 8，类型注解优先
- 安全红线: 密钥严禁提交
\`\`\`

### 其他必要文档

| 文档 | 作用 |
|------|------|
| LICENSE | 法律保护（Noosphere 使用 MIT） |
| CHANGELOG | 版本变更记录 |
| ARCHITECTURE | 架构决策记录 |
| API.md | API 参考文档 |

## Conventional Commits

提交信息规范让 Git 历史变得可读、可自动化：

\`\`\`
feat(codelens): 支持 Kotlin AST 解析
fix(nebula): 修复 HNSW 并发写入时的索引崩溃
docs(api): 补充 WebSocket 端点文档
chore(deps): 升级 Go 到 1.26.5
\`\`\`

格式：\`<type>(<scope>): <description>\`

好处：
- 自动生成 CHANGELOG
- 自动决定版本号（semver）
- 一眼看出每次提交的影响范围

## 安全红线

Noosphere 的安全策略有硬性规定：

1. **密钥绝不提交**：API Key、Token 一律走环境变量
2. **CI 检查**：包含 \`sk-\` 模式的提交会被自动拒绝
3. **.env 必须 gitignore**：即使是示例密钥也不行

## 社区建设

开源不只是代码。更重要的是：

1. **响应速度**：Issue 和 PR 在 48 小时内得到回复
2. **友好氛围**：新人提问不被嘲笑，"这是个好问题"
3. **认可贡献**：CONTRIBUTORS.md 记录每一位贡献者
4. **清晰的 Roadmap**：让大家知道项目走向

## 小结

好的开源治理 = 好的文档 + 清晰的流程 + 友善的社区。

没有这些，再好的代码也不会有人用、有人贡献。

---

*Open source is not just about source code. It's about community.*`,
  },
]
