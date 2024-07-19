// @ts-ignore
import UAParser from 'ua-parser-js';

export const getDeviceInfo = () => {
  const parser = new UAParser();
  const result = parser.getResult();

  const deviceType = result.device.type || 'Unknown';
  const osName = result.os.name || 'Unknown OS';
  const osVersion = result.os.version || 'Unknown Version';
  const browserName = result.browser.name || 'Unknown Browser';
  const browserVersion = result.browser.version || 'Unknown Version';

  return {
    deviceType,
    osName,
    osVersion,
    browserName,
    browserVersion,
  };
};