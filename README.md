# 🔗 JavaScript 简单区块链项目

这是一个基于JavaScript的教学用区块链项目，帮助初学者理解区块链的基本概念和工作原理。

## ✨ 功能特性

- ✅ **代币生成**: 自动为新用户分配初始代币
- ✅ **用户管理**: 创建和管理区块链用户
- ✅ **转账功能**: 用户间代币转账交易
- ✅ **挖矿系统**: 简化的工作量证明挖矿
- ✅ **可视化界面**: 直观的Web前端界面
- ✅ **CosmJS集成**: 可连接真实Cosmos网络

## 🚀 快速开始

### 环境要求

- Node.js 14.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yqq-a/simple-blockchain-js.git
cd simple-blockchain-js
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务器**
```bash
npm start
```

4. **打开浏览器**
访问 `http://localhost:3001`，然后打开 `index.html` 文件

## 📖 使用教程

### 1. 创建用户
- 在"用户管理"标签页输入用户名
- 点击"创建用户"按钮
- 系统会自动生成地址并分配1000个初始代币

### 2. 转账交易
- 切换到"转账交易"标签页
- 选择发送方和接收方
- 输入转账金额
- 点击"创建交易"（交易会进入待处理状态）

### 3. 挖矿
- 在"挖矿"标签页选择矿工
- 点击"开始挖矿"
- 系统会处理所有待处理交易并给矿工奖励

### 4. 查看区块链
- "区块链"标签页显示所有区块
- 可以查看每个区块的交易记录

## 🔧 API 接口

### 用户管理
- `POST /api/users` - 创建新用户
- `GET /api/users` - 获取所有用户
- `GET /api/users/:username` - 获取特定用户信息

### 余额查询
- `GET /api/balance/:address` - 查询地址余额

### 交易管理
- `POST /api/transactions` - 创建新交易
- `POST /api/mine` - 挖矿处理交易

### 区块链信息
- `GET /api/chain-info` - 获取区块链状态
- `GET /api/blocks` - 获取所有区块
- `GET /api/blocks/:index` - 获取特定区块

## 🌟 CosmJS 集成

项目包含 `cosmjs-client.js` 文件，展示如何使用CosmJS连接真实的Cosmos网络：

```javascript
const CosmosClient = require('./cosmjs-client');

async function useCosmJS() {
  const client = new CosmosClient();
  
  // 连接到Cosmos测试网
  await client.connectToTestnet();
  
  // 获取余额
  await client.getBalance();
  
  // 发送代币
  await client.sendTokens("接收地址", "1000000", "uatom");
}
```

## 📚 学习要点

这个项目帮助你理解：

1. **区块链基础结构**
   - 区块如何链接
   - 哈希算法的作用
   - 交易的生命周期

2. **工作量证明**
   - 挖矿的基本原理
   - Nonce值的作用
   - 难度调整机制

3. **数字钱包**
   - 地址生成
   - 公私钥概念
   - 签名验证

4. **分布式账本**
   - 交易记录
   - 余额计算
   - 状态管理

## 🔄 与真实区块链的区别

这是一个**教学用简化版本**，与真实区块链相比：

**简化的部分：**
- 使用内存存储（真实区块链使用持久化数据库）
- 简化的共识机制（真实网络有复杂的验证）
- 中心化服务器（真实区块链是去中心化的）
- 简化的密码学（真实区块链有更复杂的安全机制）

**保留的核心概念：**
- 区块链式数据结构
- 哈希链接
- 交易处理
- 挖矿奖励机制

## 🛠️ 技术栈

- **后端**: Node.js + Express
- **前端**: HTML5 + CSS3 + JavaScript
- **区块链**: CosmJS (可选)
- **加密**: Node.js crypto模块

## 📈 扩展建议

学习完本项目后，你可以：

1. **添加更多功能**
   - 智能合约支持
   - 多重签名
   - 交易手续费机制

2. **改进安全性**
   - 真实的数字签名
   - 网络通信加密
   - 防双花攻击

3. **连接真实网络**
   - 使用CosmJS连接Cosmos Hub
   - 部署到测试网
   - 与其他区块链交互

## 🤝 贡献

欢迎提交问题和改进建议！这个项目旨在帮助更多人学习区块链技术。

## 📄 许可证

MIT License - 可以自由使用和修改

---

**注意**: 这是一个教学项目，不应用于生产环境。真实的区块链开发需要考虑更多安全性和性能因素。

## 🎯 下一步学习

1. 学习Cosmos SDK的Go语言开发
2. 研究其他区块链平台（Ethereum, Polkadot）
3. 深入理解密码学原理
4. 学习分布式系统设计

祝你学习愉快！🚀

## 📷 项目截图

![区块链界面](https://via.placeholder.com/800x400?text=Simple+Blockchain+Interface)

*简洁美观的区块链管理界面*

## 🔗 相关链接

- [Cosmos SDK 官方文档](https://docs.cosmos.network/)
- [CosmJS GitHub](https://github.com/cosmos/cosmjs)
- [区块链技术学习资源](https://github.com/blockchain-resources)