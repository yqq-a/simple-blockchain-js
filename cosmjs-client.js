// CosmJS 客户端示例 - 连接到真实的Cosmos网络
const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const { SigningStargateClient, StargateClient } = require('@cosmjs/stargate');
const { coins } = require('@cosmjs/amino');

class CosmosClient {
  constructor() {
    this.client = null;
    this.wallet = null;
    this.address = null;
  }

  // 连接到Cosmos测试网
  async connectToTestnet(mnemonic = null) {
    try {
      // 如果没有提供助记词，生成一个新的
      if (!mnemonic) {
        this.wallet = await DirectSecp256k1HdWallet.generate(24, { prefix: "cosmos" });
        console.log("生成的助记词:", this.wallet.mnemonic);
      } else {
        this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "cosmos" });
      }

      // 获取钱包地址
      const accounts = await this.wallet.getAccounts();
      this.address = accounts[0].address;
      console.log("钱包地址:", this.address);

      // 连接到Cosmos Hub测试网
      const rpcEndpoint = "https://rpc.sentry-02.theta-testnet.polypore.xyz";
      this.client = await SigningStargateClient.connectWithSigner(rpcEndpoint, this.wallet);
      
      console.log("成功连接到Cosmos测试网");
      return true;
    } catch (error) {
      console.error("连接失败:", error.message);
      return false;
    }
  }

  // 获取账户余额
  async getBalance(address = null) {
    try {
      const targetAddress = address || this.address;
      const balance = await this.client.getAllBalances(targetAddress);
      console.log(`地址 ${targetAddress} 的余额:`, balance);
      return balance;
    } catch (error) {
      console.error("获取余额失败:", error.message);
      return [];
    }
  }

  // 发送代币
  async sendTokens(recipientAddress, amount, denom = "uatom", memo = "") {
    try {
      if (!this.client || !this.address) {
        throw new Error("请先连接到网络");
      }

      const sendAmount = coins(amount, denom);
      const fee = {
        amount: coins(5000, "uatom"),
        gas: "200000",
      };

      const result = await this.client.sendTokens(
        this.address,
        recipientAddress,
        sendAmount,
        fee,
        memo
      );

      console.log("交易成功:", result.transactionHash);
      return result;
    } catch (error) {
      console.error("发送代币失败:", error.message);
      throw error;
    }
  }

  // 查询交易
  async getTransaction(txHash) {
    try {
      const tx = await this.client.getTx(txHash);
      console.log("交易详情:", tx);
      return tx;
    } catch (error) {
      console.error("查询交易失败:", error.message);
      return null;
    }
  }

  // 获取账户信息
  async getAccountInfo(address = null) {
    try {
      const targetAddress = address || this.address;
      const account = await this.client.getAccount(targetAddress);
      console.log("账户信息:", account);
      return account;
    } catch (error) {
      console.error("获取账户信息失败:", error.message);
      return null;
    }
  }

  // 模拟交易（估算手续费）
  async simulateTransaction(recipientAddress, amount, denom = "uatom") {
    try {
      const sendAmount = coins(amount, denom);
      const gasEstimate = await this.client.simulate(
        this.address,
        [{
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: {
            fromAddress: this.address,
            toAddress: recipientAddress,
            amount: sendAmount,
          },
        }],
        ""
      );

      console.log("预估Gas用量:", gasEstimate);
      return gasEstimate;
    } catch (error) {
      console.error("模拟交易失败:", error.message);
      return null;
    }
  }

  // 获取网络状态
  async getNetworkStatus() {
    try {
      // 使用只读客户端获取网络信息
      const readOnlyClient = await StargateClient.connect("https://rpc.sentry-02.theta-testnet.polypore.xyz");
      
      const height = await readOnlyClient.getHeight();
      const chainId = await readOnlyClient.getChainId();
      
      console.log("网络状态:");
      console.log("- 链ID:", chainId);
      console.log("- 当前高度:", height);
      
      return { chainId, height };
    } catch (error) {
      console.error("获取网络状态失败:", error.message);
      return null;
    }
  }
}

// 使用示例
async function example() {
  const client = new CosmosClient();
  
  // 连接到测试网
  await client.connectToTestnet();
  
  // 获取网络状态
  await client.getNetworkStatus();
  
  // 获取余额
  await client.getBalance();
  
  // 获取账户信息
  await client.getAccountInfo();
  
  // 示例：发送代币（需要测试网代币）
  // await client.sendTokens("cosmos1recipient...", "1000000", "uatom", "测试转账");
}

// 导出客户端类
module.exports = CosmosClient;

// 如果直接运行此文件，执行示例
if (require.main === module) {
  example().catch(console.error);
}