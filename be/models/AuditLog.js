const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    // Who performed the action
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorUserName: { type: String },
    actorRole: { type: String },

    // What module and event
    module: { type: String, required: true },
    event: { type: String, required: true },

    // Which entity was affected
    entityType: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: false },
    entityName: { type: String },

    // Message templating
    messageTemplate: { type: String, required: true },
    messageParams: { type: Object, default: {} },

    // Additional data for debugging/inspection
    metadata: { type: Object, default: {} },

    // Read state for admin
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ module: 1, event: 1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
module.exports = AuditLog;
