import { ErrorHandler, topology, grpc } from "orbs-core-library";

import GossipService from "./service";

ErrorHandler.setup();

const server = grpc.gossipServer({
  endpoint: topology().endpoint,
  service: new GossipService()
});
