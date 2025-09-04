const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const { SigningStargateClient } = require('@cosmjs/stargate');

const app = express();
app.use(cors());
app.use(express.json());

// 简单的内存数据库模拟
class SimpleBlockchain {
  constructor() {
    this.blocks = [];
    this.users = new Map();
    this.balances = new Map();
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.difficulty = 4;
    
    // 创建创世区块
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisBlock = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: "0",
      hash: this.calculateHash(0, Date.now(), [], "0", 0),
      nonce: 0
    };
    this.blocks.push(genesisBlock);
  }

  calculateHash(index, timestamp, transactions, previousHash, nonce) {
    return crypto
      .createHash('sha256')
      .update(index + timestamp + JSON.stringify(transactions) + previousHash + nonce)
      .digest('hex');
  }

  getLatestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  // 创建新用户
  createUser(username, publicKey) {
    if (this.users.has(username)) {
      throw new Error('用户名已存在');
    }
    
    const address = this.generateAddress(publicKey);
    this.users.set(username, {
      username,
      address,
      publicKey,
      createdAt: Date.now()
    });
    
    // 给新用户一些初始代币
    this.balances.set(address, 1000);
    
    return { username, address };
  }

  generateAddress(publicKey) {
    return crypto.createHash('sha256').update(publicKey).digest('hex').substring(0, 40);
  }

  // 获取用户余额
  getBalance(address) {
    return this.balances.get(address) || 0;
  }

  // 创建交易
  createTransaction(fromAddress, toAddress, amount) {
    const senderBalance = this.getBalance(fromAddress);
    
    if (senderBalance < amount) {
      throw new Error('余额不足');
    }

    const transaction = {
      id: crypto.randomUUID(),
      fromAddress,
      toAddress,
      amount,
      timestamp: Date.now()
    };

    this.pendingTransactions.push(transaction);
    return transaction;
  }

  // 挖矿（简化版）
  minePendingTransactions(miningRewardAddress) {
    // 添加挖矿奖励交易
    const rewardTransaction = {
      id: crypto.randomUUID(),
      fromAddress: null, // 系统奖励
      toAddress: miningRewardAddress,
      amount: this.miningReward,
      timestamp: Date.now()
    };

    this.pendingTransactions.push(rewardTransaction);

    const block = {
      index: this.blocks.length,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      previousHash: this.getLatestBlock().hash,
      nonce: 0
    };

    // 简化的工作量证明
    block.hash = this.mineBlock(block);
    
    // 执行交易
    for (let transaction of block.transactions) {
      if (transaction.fromAddress) {
        const fromBalance = this.getBalance(transaction.fromAddress);
        this.balances.set(transaction.fromAddress, fromBalance - transaction.amount);
      }
      
      const toBalance = this.getBalance(transaction.toAddress);
      this.balances.set(transaction.toAddress, toBalance + transaction.amount);
    }

    this.blocks.push(block);
    this.pendingTransactions = [];
    
    return block;
  }

  mineBlock(block) {
    const target = Array(this.difficulty + 1).join("0");
    
    while (block.hash === undefined || block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++;
      block.hash = this.calculateHash(
        block.index,
        block.timestamp,
        block.transactions,
        block.previousHash,
        block.nonce
      );
    }
    
    return block.hash;
  }

  // 获取所有用户
  getAllUsers() {
    return Array.from(this.users.values());
  }

  // 获取用户信息
  getUser(username) {
    return this.users.get(username);
  }

  // 获取区块链信息
  getChainInfo() {
    return {
      blockHeight: this.blocks.length - 1,
      totalUsers: this.users.size,
      pendingTransactions: this.pendingTransactions.length,
      latestBlock: this.getLatestBlock()
    };
  }
}

// 初始化区块链
const blockchain = new SimpleBlockchain();

// API 路由

// 创建用户
app.post('/api/users', (req, res) => {
  try {
    const { username, publicKey } = req.body;
    const user = blockchain.createUser(username, publicKey || crypto.randomBytes(32).toString('hex'));
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 获取所有用户
app.get('/api/users', (req, res) => {
  const users = blockchain.getAllUsers();
  res.json({ success: true, users });
});

// 获取用户信息
app.get('/api/users/:username', (req, res) => {
  const user = blockchain.getUser(req.params.username);
  if (user) {
    const balance = blockchain.getBalance(user.address);
    res.json({ success: true, user: { ...user, balance } });
  } else {
    res.status(404).json({ success: false, error: '用户不存在' });
  }
});

// 获取余额
app.get('/api/balance/:address', (req, res) => {
  const balance = blockchain.getBalance(req.params.address);
  res.json({ success: true, balance });
});

// 创建交易
app.post('/api/transactions', (req, res) => {
  try {
    const { fromAddress, toAddress, amount } = req.body;
    const transaction = blockchain.createTransaction(fromAddress, toAddress, parseFloat(amount));
    res.json({ success: true, transaction });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 挖矿
app.post('/api/mine', (req, res) => {
  try {
    const { minerAddress } = req.body;
    const block = blockchain.minePendingTransactions(minerAddress);
    res.json({ success: true, block });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取区块链信息
app.get('/api/chain-info', (req, res) => {
  const info = blockchain.getChainInfo();
  res.json({ success: true, info });
});

// 获取所有区块
app.get('/api/blocks', (req, res) => {
  res.json({ success: true, blocks: blockchain.blocks });
});

// 获取特定区块
app.get('/api/blocks/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < blockchain.blocks.length) {
    res.json({ success: true, block: blockchain.blocks[index] });
  } else {
    res.status(404).json({ success: false, error: '区块不存在' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`区块链服务器运行在端口 ${PORT}`);
  console.log(`访问 http://localhost:${PORT}/api/chain-info 查看区块链状态`);
});