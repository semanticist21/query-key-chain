import { keyChain } from "@kkoms/query-key-chain";

// dashboard lists
keyChain("dashboard").lists();
keyChain("dashboard").list(1);
keyChain("dashboard").list(1).detail(1);
keyChain("dashboard").list(1).detail(1).action("modal");

// dashboard details
keyChain("dashboard").details();
keyChain("dashboard").detail(1);
keyChain("dashboard").detail(1).action("modal");
keyChain("dashboard").detail(1).action("modal").params({ action: true });

// dashboard with only params
// invalidation only by .all()
keyChain("dashboard").params({ action: true });
