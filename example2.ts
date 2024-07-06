import { queryChain } from "@kkoms/query-key-chain";

queryChain("dashboard").lists();
queryChain("dashboard").list(1);
queryChain("dashboard").details();
queryChain("dashboard").detail(1);
queryChain("dashboard").detail(1).action("modal");
queryChain("dashboard").detail(1).action("modal").params({ action: true });
queryChain("dashboard").params({ action: true });
