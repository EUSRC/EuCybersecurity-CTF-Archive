// site/app/actions.ts
'use server';

export async function runSystemSelfCheck(formData: FormData) {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log("[AUDIT] System self-check initiated by user.");

  // 这里就是 RCE 真正的利用点，攻击者会篡改 RSC Payload 来控制返回值
  return {
    status: "success",
    message: "核心服务响应正常 (Latency: 2ms)",
    timestamp: new Date().toISOString()
  };
}