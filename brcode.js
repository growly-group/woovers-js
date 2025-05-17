export function generateBRCode() {
  function formatField(id, value) {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  }

  function generateRandomEVP() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 36; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function calculateCRC(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  const payloadFormatIndicator = formatField('00', '01');

  const gui = formatField('00', 'br.gov.bcb.pix');
  const key = formatField('01', generateRandomEVP());
  const merchantAccountInfo = formatField('26', gui + key);

  const merchantCategoryCode = formatField('52', '0000');
  const transactionCurrency = formatField('53', '986');
  const countryCode = formatField('58', 'BR');
  const merchantName = formatField('59', 'Loja XYZ');
  const merchantCity = formatField('60', 'SAO PAULO');

  const txid = formatField('05', 'TX' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
  const additionalDataField = formatField('62', txid);

  const brCodeWithoutCRC = payloadFormatIndicator +
    merchantAccountInfo +
    merchantCategoryCode +
    transactionCurrency +
    countryCode +
    merchantName +
    merchantCity +
    additionalDataField +
    '6304';

  const crc = calculateCRC(brCodeWithoutCRC);
  return brCodeWithoutCRC + crc;
}
