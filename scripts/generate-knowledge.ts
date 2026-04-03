import { writeFileSync } from "fs";
import { join } from "path";
import { buildKnowledgeDocuments } from "../data/aiKnowledge";

const docs = buildKnowledgeDocuments();
const outputPath = join(process.cwd(), "public", "portfolio-knowledge.json");
writeFileSync(outputPath, JSON.stringify(docs, null, 2), "utf-8");
console.log(
  `Generated ${docs.length} knowledge documents → public/portfolio-knowledge.json`,
);
