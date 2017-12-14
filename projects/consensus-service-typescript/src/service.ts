import { topology, grpc, topologyPeers, types } from "orbs-common-library";
import bind from "bind-decorator";
import PaxosConsensus from "./paxos-consensus";
import PbftConsensus from "./pbft-consensus";

export default class ConsensusService {

  consensus = new PbftConsensus();

  // rpc interface

  @bind
  public async getHeartbeat(rpc: types.GetHeartbeatContext) {
    console.log(`${topology.name}: service '${rpc.req.requesterName}(v${rpc.req.requesterVersion})' asked for heartbeat`);
    rpc.res = { responderName: topology.name, responderVersion: topology.version };
  }

  @bind
  public async sendTransaction(rpc: types.SendTransactionContext) {
    console.log(`${topology.name}: sendTransaction ${JSON.stringify(rpc.req)}`);
    await this.consensus.proposeChange(rpc.req.transaction);
    rpc.res = {};
  }

  @bind
  public async gossipMessageReceived(rpc: types.GossipMessageReceivedContext) {
    console.log(`${topology.name}: gossipMessageReceived ${JSON.stringify(rpc.req)}`);
    const obj: any = JSON.parse(rpc.req.Buffer.toString("utf8"));
    this.consensus.gossipMessageReceived(rpc.req.FromAddress, rpc.req.MessageType, obj);
  }

  // service logic

  async main() {
  }

  constructor() {
    console.log(`${topology.name}: service started`);
    setTimeout(() => this.main(), 2000);
    process.on("uncaughtException", (err: Error) => {
      console.error(`Caught exception: ${err}`);
      console.error(err.stack);
    });
    process.on("unhandledRejection", (err: Error) => {
      console.error(`Unhandled rejection: ${err}`);
      console.error(err.stack);
    });



  }

}