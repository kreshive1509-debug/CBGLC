const DEFAULT_DEPLOY_TIMEOUT_MS = 10000;

const getTimestamp = () => new Date().toISOString();

export const triggerVercelDeployment = async (context: string): Promise<boolean> => {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL?.trim();

  if (!deployHookUrl) {
    console.warn(`[${getTimestamp()}] Deployment Failed (${context}): VERCEL_DEPLOY_HOOK_URL is not configured.`);
    return false;
  }

  const timeoutMs = Number(process.env.VERCEL_DEPLOY_TIMEOUT_MS || DEFAULT_DEPLOY_TIMEOUT_MS);
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_DEPLOY_TIMEOUT_MS);

  console.info(`[${getTimestamp()}] Deployment Started (${context})`);

  try {
    const response = await fetch(deployHookUrl, {
      method: 'POST',
      signal: controller.signal
    });

    if (!response.ok) {
      console.error(
        `[${getTimestamp()}] Deployment Failed (${context}): Vercel responded with ${response.status} ${response.statusText}`
      );
      return false;
    }

    console.info(`[${getTimestamp()}] Deployment Successful (${context})`);
    return true;
  } catch (error: any) {
    const reason = error?.name === 'AbortError'
      ? `timed out after ${timeoutMs}ms`
      : error?.message || String(error);

    console.error(`[${getTimestamp()}] Deployment Failed (${context}): ${reason}`);
    return false;
  } finally {
    clearTimeout(timeoutHandle);
  }
};
