const AuditLog = require("../models/AuditLog");

// Fire-and-forget audit logging to avoid blocking the main request flow
// Usage: auditLogger.log({ actor, module, event, entityType, entityId, entityName, messageTemplate, messageParams, metadata })
// 'actor' can be { id, userName, role }
const auditLogger = {
  log: (payload) => {
    try {
      const {
        actor = {},
        module,
        event,
        entityType,
        entityId,
        entityName,
        messageTemplate,
        messageParams = {},
        metadata = {},
      } = payload || {};

      // Schedule asynchronously, without awaiting
      setImmediate(async () => {
        try {
          await AuditLog.create({
            actorId: actor.id,
            actorUserName: actor.userName,
            actorRole: actor.role,
            module,
            event,
            entityType,
            entityId,
            entityName,
            messageTemplate,
            messageParams,
            metadata,
          });
        } catch (err) {
          // Log error for observability but do not interrupt the main flow
          console.error(
            "[auditLogger] Failed to write audit log:",
            {
              event,
              module,
              entityType,
              entityId,
              actorId: actor && actor.id,
            },
            err && err.message
          );
        }
      });
    } catch (outerErr) {
      // Log unexpected usage errors
      console.error(
        "[auditLogger] Unexpected error scheduling audit log:",
        outerErr && outerErr.message
      );
    }
  },
};

module.exports = auditLogger;
