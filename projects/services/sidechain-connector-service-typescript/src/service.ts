import * as _ from "lodash";
import bind from "bind-decorator";

import { logger, config, topology, grpc, types } from "orbs-core-library";

import { SidechainConnector, SidechainConnectorOptions } from "orbs-core-library";

const nodeTopology = topology();

export default class SidechainConnectorService {
  private sidechainConnector: SidechainConnector;

  // Sidechain Connector RPC:

  @bind
  public async getHeartbeat(rpc: types.GetHeartbeatContext) {
    logger.debug(`${nodeTopology.name}: service '${rpc.req.requesterName}(v${rpc.req.requesterVersion})' asked for heartbeat`);

    rpc.res = { responderName: nodeTopology.name, responderVersion: nodeTopology.version };
  }

  @bind
  public async callEthereumContract(rpc: types.CallEthereumContractContext) {
    const { result, block } = await this.sidechainConnector.callEthereumContract(rpc.req);

    rpc.res = {
      resultJson: JSON.stringify(result),
      blockNumber: block.number.toString(),
      timestamp: block.timestamp
    };
  }

  async askForHeartbeat(peer: types.HeardbeatClient) {
    const res = await peer.getHeartbeat({ requesterName: nodeTopology.name, requesterVersion: nodeTopology.version });
    logger.debug(`${nodeTopology.name}: received heartbeat from '${res.responderName}(v${res.responderVersion})'`);
  }

  askForHeartbeats() {
  }

  async main(options: SidechainConnectorOptions) {
    logger.info(`${nodeTopology.name}: service started`);

    this.sidechainConnector = new SidechainConnector(options);

    setInterval(() => this.askForHeartbeats(), 5000);
  }

  constructor(options: SidechainConnectorOptions) {
    setTimeout(() => this.main(options), 0);
  }
}
