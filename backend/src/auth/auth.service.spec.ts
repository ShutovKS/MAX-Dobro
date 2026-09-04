// FILE: backend/src/auth/auth.service.spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Unit tests for Telegram initData HMAC verification including the signature field.
//   SCOPE: buildInitData fixture, AuthService stubs, accept/reject and loginWithTelegram cases
//   DEPENDS: M-AUTH
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   BOT_TOKEN - fixture bot token
//   buildInitData - HMAC-signed initData with optional signature field
//   makeService - AuthService with stub config and prisma
//   describe AuthService — Telegram initData verification - accept, reject, login cases
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import * as crypto from 'crypto';
import { AuthService } from './auth.service';

const BOT_TOKEN = '123456:TEST_BOT_TOKEN_VALUE';

// START_CONTRACT: buildInitData
//   PURPOSE: Build initData with a canonical HMAC hash, optionally adding a dummy signature field.
//   INPUTS: { fields: Record<string, string>, botToken: string, opts.withSignature?: boolean }
//   OUTPUTS: { string - URLSearchParams initData }
//   SIDE_EFFECTS: none
//   LINKS: M-AUTH, V-M-AUTH
// END_CONTRACT: buildInitData
function buildInitData(
  fields: Record<string, string>,
  botToken: string,
  opts: { withSignature?: boolean } = {},
): string {
  // START_BLOCK_BUILD_INIT_DATA
  const dataCheckString = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join('\n');
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  const params = new URLSearchParams();
  Object.entries(fields).forEach(([k, v]) => params.set(k, v));
  if (opts.withSignature) {
    // Произвольное значение — оно НЕ участвует в HMAC, лишь имитирует
    // реальный клиент, добавляющий поле signature в initData.
    params.set('signature', 'AbCdEf0123456789_ed25519_signature_value');
  }
  params.set('hash', hash);
  return params.toString();
  // END_BLOCK_BUILD_INIT_DATA
}

// START_CONTRACT: makeService
//   PURPOSE: Construct AuthService with stub ConfigService and Prisma upsert.
//   INPUTS: { none }
//   OUTPUTS: { AuthService }
//   SIDE_EFFECTS: none
//   LINKS: M-AUTH, V-M-AUTH
// END_CONTRACT: makeService
function makeService(): AuthService {
  // START_BLOCK_MAKE_SERVICE
  const configService = {
    getOrThrow: (key: string) => {
      if (key === 'JWT_INTERNAL_SECRET') return 'test-jwt-secret';
      if (key === 'TELEGRAM_BOT_TOKEN') return BOT_TOKEN;
      if (key === 'MAX_BOT_TOKEN') return BOT_TOKEN;
      return 'unused';
    },
  } as any;
  const prisma = {
    user: { upsert: jest.fn().mockResolvedValue({ id: 1, role: 'volunteer' }) },
  } as any;
  return new AuthService(prisma, configService);
  // END_BLOCK_MAKE_SERVICE
}

describe('AuthService — Telegram initData verification', () => {
  const baseFields = {
    auth_date: '1717400000',
    query_id: 'AAHdF6IQAAAAAN0XohDhrOrc',
    user: JSON.stringify({ id: 42, first_name: 'Тест', last_name: 'Юзер' }),
  };

  // START_BLOCK_TELEGRAM_INITDATA_CASES
  it('accepts valid initData WITH a signature field (modern Telegram clients)', () => {
    const service = makeService();
    const initData = buildInitData(baseFields, BOT_TOKEN, {
      withSignature: true,
    });
    expect(
      (service as any).verifyWebAppInitData(initData, BOT_TOKEN),
    ).toBe(true);
  });

  it('accepts valid initData WITHOUT a signature field (older clients)', () => {
    const service = makeService();
    const initData = buildInitData(baseFields, BOT_TOKEN, {
      withSignature: false,
    });
    expect(
      (service as any).verifyWebAppInitData(initData, BOT_TOKEN),
    ).toBe(true);
  });

  it('rejects initData with a tampered hash', () => {
    const service = makeService();
    const initData = buildInitData(baseFields, BOT_TOKEN, {
      withSignature: true,
    }).replace(/hash=[0-9a-f]+/, 'hash=' + 'deadbeef'.repeat(8));
    expect(
      (service as any).verifyWebAppInitData(initData, BOT_TOKEN),
    ).toBe(false);
  });

  it('loginWithTelegram succeeds for a modern client (signature present)', async () => {
    const service = makeService();
    const initData = buildInitData(baseFields, BOT_TOKEN, {
      withSignature: true,
    });
    const result = await service.loginWithTelegram({ initData });
    expect(result.accessToken).toEqual(expect.any(String));
  });
  // END_BLOCK_TELEGRAM_INITDATA_CASES
});
