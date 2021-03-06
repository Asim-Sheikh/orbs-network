import { ErrorHandler, grpc, topology } from "orbs-core-library";

import VirtualMachineService from "./service";

ErrorHandler.setup();

const server = grpc.virtualMachineServer({
  endpoint: topology().endpoint,
  service: new VirtualMachineService()
});
