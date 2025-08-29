import React, { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumb from "@/components/admin/Breadcrumb";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomPagination from "@/components/CustomPagination";
import {
  auditLogService,
  type AuditLogItem,
} from "@/api/services/admin/auditLogs";
import {
  Button,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
  Popconfirm,
  message,
} from "antd";
import { AUDIT_EVENT_LABELS, AuditEvents } from "@/types/audit";
import { PERMISSION_LABELS } from "@/utils/permissionConfig";
import type { ColumnsType } from "antd/es/table";

const renderTemplate = (template: string, params: Record<string, string>) => {
  // 1) Replace placeholders like {actor} with bold text
  const parts: (string | JSX.Element)[] = [];
  let cursor = 0;
  const regex = /\{(\w+)\}/g;
  let matchedAny = false;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(template))) {
    const [placeholder, key] = match;
    if (match.index > cursor) parts.push(template.slice(cursor, match.index));
    const value = params[key] || placeholder;
    parts.push(
      <span key={`${key}-${match.index}`} style={{ fontWeight: 700 }}>
        {value}
      </span>
    );
    cursor = match.index + placeholder.length;
    matchedAny = true;
  }
  if (cursor < template.length) parts.push(template.slice(cursor));

  // 2) If no placeholders were found (BE already interpolated), highlight values inline
  if (!matchedAny) {
    const values = Object.values(params).filter(Boolean) as string[];
    if (values.length === 0) return <span>{template}</span>;

    // Highlight occurrences of each value by splitting and interleaving <strong>
    const highlightOne = (input: (string | JSX.Element)[], value: string) => {
      const out: (string | JSX.Element)[] = [];
      for (const chunk of input) {
        if (typeof chunk !== "string") {
          out.push(chunk);
          continue;
        }
        let start = 0;
        let idx = chunk.indexOf(value, start);
        if (idx === -1) {
          out.push(chunk);
          continue;
        }
        while (idx !== -1) {
          if (idx > start) out.push(chunk.slice(start, idx));
          out.push(
            <span key={`${value}-${idx}`} style={{ fontWeight: 700 }}>
              {value}
            </span>
          );
          start = idx + value.length;
          idx = chunk.indexOf(value, start);
        }
        if (start < chunk.length) out.push(chunk.slice(start));
      }
      return out;
    };

    // Sort values by length desc to prevent partial overlaps
    values.sort((a, b) => b.length - a.length);
    let result: (string | JSX.Element)[] = [template];
    for (const v of values) result = highlightOne(result, v);
    return <span>{result}</span>;
  }

  return <span>{parts}</span>;
};

const AuditLogPageInner: React.FC = () => {
  const [items, setItems] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await auditLogService.list({
        page: pagination.current,
        limit: pagination.pageSize,
        search,
      });
      setItems(data.items);
      setPagination((prev) => ({ ...prev, total: data.pagination.total }));
    } catch {
      message.error("Lỗi khi tải nhật ký hệ thống");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, search]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const EVENT_LABELS = AUDIT_EVENT_LABELS;

  const columns: ColumnsType<AuditLogItem> = useMemo(
    () => [
      {
        title: "Thời gian",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (v: string) => new Date(v).toLocaleString("vi-VN"),
      },
      {
        title: "Tác vụ",
        dataIndex: "event",
        key: "event",
        render: (e: string) => <Tag color="blue">{EVENT_LABELS[e] || e}</Tag>,
      },
      {
        title: "Module",
        dataIndex: "module",
        key: "module",
        render: (m: string) => <Tag>{m}</Tag>,
      },
      {
        title: "Nội dung",
        key: "content",
        width: 420,
        onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
        render: (_, r) => {
          const normalizeParams = (params: Record<string, string>) => {
            const p = { ...(params || {}) } as Record<string, string>;
            if (p.status) {
              const v = (p.status || "").toLowerCase();
              const userStatusMap: Record<string, string> = {
                active: "hoạt động",
                inactive: "khóa",
              };
              const bookingStatusMap: Record<string, string> = {
                pending: "chờ xác nhận",
                confirmed: "đã xác nhận",
                completed: "hoàn thành",
                cancelled: "đã hủy",
              };
              if (v in userStatusMap) p.status = userStatusMap[v];
              if (v in bookingStatusMap) p.status = bookingStatusMap[v];
            }
            // Translate permission keys to Vietnamese labels for added/removed lists
            const translateList = (csv?: string) => {
              if (!csv) return csv;
              const parts = csv
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((key) => PERMISSION_LABELS[key]?.label || key);
              return parts.join(", ");
            };
            if (p.added) p.added = translateList(p.added) || "-";
            if (p.removed) p.removed = translateList(p.removed) || "-";
            return p;
          };
          return (
            <div
              style={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {renderTemplate(
                r.messageTemplate,
                normalizeParams(r.messageParams || {})
              )}
            </div>
          );
        },
      },
      {
        title: "Người thực hiện",
        dataIndex: "actorUserName",
        key: "actorUserName",
        render: (_: string, r) => (
          <Tooltip
            title={
              <div>
                <div>
                  <b>Tên:</b> {r.actorUserName || "-"}
                </div>
                <div>
                  <b>Vai trò:</b> {r.actorRole || "-"}
                </div>
                <div>
                  <b>ID:</b> {r.actorId}
                </div>
              </div>
            }
          >
            <span>{r.actorUserName || "-"}</span>
          </Tooltip>
        ),
      },
      {
        title: "Đối tượng",
        dataIndex: "entityName",
        key: "entityName",
        render: (_: string, r) => (
          <Tooltip
            title={
              <div>
                <div>
                  <b>Tên:</b> {r.entityName || "-"}
                </div>
                <div>
                  <b>Loại:</b> {r.entityType || "-"}
                </div>
                <div>
                  <b>ID:</b> {r.entityId || "-"}
                </div>
              </div>
            }
          >
            <span>{r.entityName || "-"}</span>
          </Tooltip>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "read",
        key: "read",
        render: (read: boolean) => (
          <Tag color={read ? "default" : "red"}>
            {read ? "Đã duyệt" : "Chưa duyệt"}
          </Tag>
        ),
      },
    ],
    []
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  const selectedLogs = useMemo(
    () => items.filter((i) => selectedRowKeys.includes(i._id)),
    [items, selectedRowKeys]
  );
  const canRestoreOrPurge = useMemo(
    () =>
      selectedLogs.length > 0 &&
      selectedLogs.every(
        (l) =>
          l.entityType === "Booking" && l.event === AuditEvents.BOOKING_DELETED
      ),
    [selectedLogs]
  );

  const handleMarkRead = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      await auditLogService.markRead(selectedRowKeys as string[]);
      message.success("Đã đánh dấu đã xem");
      setSelectedRowKeys([]);
      fetchLogs();
    } catch {
      message.error("Lỗi khi đánh dấu đã xem");
    }
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      await auditLogService.deleteMany(selectedRowKeys as string[]);
      message.success("Đã xóa nhật ký đã chọn");
      setSelectedRowKeys([]);
      fetchLogs();
    } catch {
      message.error("Lỗi khi xóa nhật ký");
    }
  };

  const handleRestoreBookingsFromLogs = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      await auditLogService.deleteManyWithOptions(selectedRowKeys as string[], {
        restore: true,
      });
      message.success("Đã khôi phục các đặt lịch liên quan và xóa lịch sử");
      setSelectedRowKeys([]);
      fetchLogs();
    } catch {
      message.error("Lỗi khi khôi phục từ nhật ký");
    }
  };

  const handlePurgeBookingsFromLogs = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      await auditLogService.deleteManyWithOptions(selectedRowKeys as string[], {
        purge: true,
      });
      message.success("Đã xóa vĩnh viễn các đặt lịch liên quan và xóa lịch sử");
      setSelectedRowKeys([]);
      fetchLogs();
    } catch {
      message.error("Lỗi khi xóa vĩnh viễn từ nhật ký");
    }
  };

  return (
    <div>
      <Breadcrumb title="Nhật ký hệ thống" showAddButton={false} />

      <div
        className="mb-4"
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <div>
          <Input.Search
            placeholder="Tìm kiếm"
            onSearch={(v) => setSearch(v)}
            style={{ width: 300 }}
          />
        </div>
        <div>
          <Space>
            <Button
              type="default"
              size="middle"
              disabled={selectedRowKeys.length === 0}
              onClick={handleMarkRead}
            >
              Đánh dấu đã duyệt
            </Button>
            <Popconfirm
              title="Bạn có chắc muốn xóa các lịch sử đã chọn?"
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
              onConfirm={handleDelete}
              disabled={selectedRowKeys.length === 0}
            >
              <Button
                type="primary"
                danger
                size="middle"
                disabled={selectedRowKeys.length === 0}
              >
                Xóa lịch sử
              </Button>
            </Popconfirm>
            {canRestoreOrPurge && (
              <Popconfirm
                title="Khôi phục các đặt lịch liên quan và xóa lịch sử?"
                okText="Khôi phục"
                cancelText="Hủy"
                onConfirm={handleRestoreBookingsFromLogs}
                disabled={!canRestoreOrPurge}
              >
                <Button
                  type="default"
                  size="middle"
                  disabled={!canRestoreOrPurge}
                >
                  Khôi phục từ nhật ký
                </Button>
              </Popconfirm>
            )}
            {canRestoreOrPurge && (
              <Popconfirm
                title="Xóa vĩnh viễn các đặt lịch liên quan và xóa lịch sử?"
                okText="Xóa vĩnh viễn"
                cancelText="Hủy"
                okType="danger"
                onConfirm={handlePurgeBookingsFromLogs}
                disabled={!canRestoreOrPurge}
              >
                <Button
                  type="default"
                  danger
                  size="middle"
                  disabled={!canRestoreOrPurge}
                >
                  Xóa vĩnh viễn từ nhật ký
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={items}
        loading={loading}
        rowSelection={rowSelection}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <CustomPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) =>
            setPagination({
              current: page,
              pageSize: pageSize || pagination.pageSize,
              total: pagination.total,
            })
          }
        />
      </div>
    </div>
  );
};

const AuditLogPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin>
      <AuditLogPageInner />
    </ProtectedRoute>
  );
};

export default AuditLogPage;
