'use client';

import React from 'react';
import { useFormState } from 'react-dom';
import { runSystemSelfCheck } from './actions';  // 从单独文件导入

export default function Dashboard() {
  const [state, formAction] = useFormState(runSystemSelfCheck, {
    status: '',
    message: '',
    timestamp: ''
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0f172a",
      color: "#e2e8f0",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* 顶部导航栏 */}
      <header style={{
        borderBottom: "1px solid #1e293b",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#1e293b"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "white"
          }}>EA</div>
          <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>
            欧亚网安工作室 <span style={{ opacity: 0.5, fontSize: "0.9rem" }}>| 基础设施监控平台</span>
          </span>
        </div>
        <div style={{ fontSize: "0.85rem", color: "#94a3b8", display: "flex", gap: "20px" }}>
          <span>当前环境: <strong style={{ color: "#ef4444" }}>INTRA-NET (Unrestricted)</strong></span>
          <span>节点: CN-HQ-003</span>
        </div>
      </header>

      <main style={{ flex: 1, padding: "3rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          color: "#fca5a5",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          Warning <strong>机密信息警告：</strong> 本系统仅限欧亚工作室红队成员及授权运维人员访问。
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <StatusCard title="WAF 防火墙状态" status="Active" color="#22c55e" value="99.9%" />
          <StatusCard title="威胁情报订阅" status="Syncing" color="#3b82f6" value="v2025.12.03" />
          <StatusCard title="靶场容器集群" status="Warning" color="#eab308" value="3 Nodes Down" />
        </div>

        <div style={{ background: "#1e293b", borderRadius: "12px", padding: "2rem", border: "1px solid #334155" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.25rem", borderBottom: "1px solid #334155", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
            节点快速诊断工具 (Node Diagnostics)
          </h2>

          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
            <div style={{ flex: 1, color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6" }}>
              <p>使用 RSC (React Server Components) 协议对当前节点进行深度健康检查。此操作将检查：</p>
              <ul style={{ paddingLeft: "1.5rem" }}>
                <li>服务端环境依赖完整性</li>
                <li>内部数据库连接延迟</li>
                <li>Flight 协议传输通道状态</li>
              </ul>
            </div>

            <div style={{ flex: 1 }}>
              <form action={formAction} style={{ background: "#0f172a", padding: "1.5rem", borderRadius: "8px" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "#64748b" }}>目标范围</label>
                  <select style={{ width: "100%", padding: "0.6rem", background: "#1e293b", border: "1px solid #334155", color: "white", borderRadius: "4px" }}>
                    <option>Localhost (Current Node)</option>
                    <option disabled>Cluster-A (Maintenance)</option>
                  </select>
                </div>

                <button type="submit" style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  执行系统自检 (Execute Check)
                </button>

                <p style={{ marginTop: "0.8rem", fontSize: "0.75rem", color: "#64748b", textAlign: "center" }}>
                  *操作 ID 将被记录至 SIEM 系统
                </p>

                {state.message && (
                  <div style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    background: "#1e293b",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    color: "#e2e8f0"
                  }}>
                    <p style={{ color: "#22c55e" }}><strong>Status:</strong> {state.status}</p>
                    <p><strong>Message:</strong> {state.message}</p>
                    <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>{state.timestamp}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusCard({ title, status, color, value }: { title: string; status: string; color: string; value: string }) {
  return (
    <div style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "10px", border: "1px solid #334155" }}>
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", color: "#94a3b8", textTransform: "uppercase" }}>{title}</h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</span>
        <span style={{ color, background: `${color}20`, padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.8rem", fontWeight: "600" }}>
          ● {status}
        </span>
      </div>
    </div>
  );
}