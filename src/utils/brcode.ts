export function generateBRCode(): string {

  function formatField(id: string, value: string): string {
    const length: string = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  }

  function generateRandomEVP(): string {
    const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result: string = '';
    for (let i: number = 0; i < 36; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function calculateCRC(data: string): string {
    let crc: number = 0xFFFF;
    for (let i: number = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j: number = 0; j < 8; j++) {
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

  const payloadFormatIndicator: string = formatField('00', '01');

  const gui: string = formatField('00', 'br.gov.bcb.pix');
  const key: string = formatField('01', generateRandomEVP());
  const merchantAccountInfo: string = formatField('26', gui + key);

  const merchantCategoryCode: string = formatField('52', '0000');
  const transactionCurrency: string = formatField('53', '986');
  const countryCode: string = formatField('58', 'BR');
  const merchantName: string = formatField('59', 'Loja XYZ');
  const merchantCity: string = formatField('60', 'SAO PAULO');

  const txid: string = formatField(
    '05',
    'TX' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  );
  const additionalDataField: string = formatField('62', txid);

  const brCodeWithoutCRC: string =
    payloadFormatIndicator +
    merchantAccountInfo +
    merchantCategoryCode +
    transactionCurrency +
    countryCode +
    merchantName +
    merchantCity +
    additionalDataField +
    '6304';

  const crc: string = calculateCRC(brCodeWithoutCRC);
  return brCodeWithoutCRC + crc;
}
