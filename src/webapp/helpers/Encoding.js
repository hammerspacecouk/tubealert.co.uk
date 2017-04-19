export default (base64UrlData) => {
  const padding = '='.repeat((4 - (base64UrlData.length % 4)) % 4);
  const base64 = (base64UrlData + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const buffer = new window.Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer;
};
