import { types } from "../common-library/types";

export interface TransactionHandlerConfig {
  validateSubscription(): boolean;
}

export class TransactionHandler {
  private consensus: types.ConsensusClient;
  private subscriptionMaanger: types.SubscriptionManagerClient;
  private config: TransactionHandlerConfig;

  public async handle(transaction: types.SendTransactionInput) {
    if (this.config.validateSubscription()) {
      const subscriptionKey = transaction.transactionAppendix.subscriptionKey;

      const { active } = await this.subscriptionMaanger.getSubscriptionStatus({ subscriptionKey });

      if (!active) {
        throw new Error(`subscription with key [${subscriptionKey}] inactive`);
      }
    }

    await this.consensus.sendTransaction(transaction);
  }

  constructor(consensus: types.ConsensusClient, subscriptionManager: types.SubscriptionManagerClient,
    config: TransactionHandlerConfig) {
    this.consensus = consensus;
    this.subscriptionMaanger = this.subscriptionMaanger;
    this.config = config;
  }
}
