import api from './api';

export const sendEvent = async (event: string, properties: Record<string, any> = {}) => {
  try {
    // no await to avoid blocking navigation; but keep fire-and-forget
    api.post('/analytics', { event, properties }).catch(err => {
      console.warn('[analytics] failed to send event', err);
    });
  } catch (err) {
    console.warn('[analytics] error', err);
  }
};

export default { sendEvent };