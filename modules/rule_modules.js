import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
  ruleName: {
    type: String,
  },
  condition: {
    type: String,
  },
  note: {
    type: String,
  },
});

export const Rule = mongoose.model("Rule", ruleSchema);
