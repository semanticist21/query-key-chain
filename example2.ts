import { queryChain } from "@kkoms/query-key-chain";

// dashboard lists
queryChain("dashboard").lists();
queryChain("dashboard").list(1);
queryChain("dashboard").list(1).detail(1);
queryChain("dashboard").list(1).detail(1).action("modal");

// dashboard details
queryChain("dashboard").details();
queryChain("dashboard").detail(1);
queryChain("dashboard").detail(1).action("modal");
queryChain("dashboard").detail(1).action("modal").params({ action: true });

// dashboard with only params
// invalidation only by .all()
queryChain("dashboard").params({ action: true });
