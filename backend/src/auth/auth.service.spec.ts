import * as crypto from 'crypto';
import { AuthService } from './auth.service';

/**
 * <context:auth_initdata_verification_test>
 * Проверяем верификацию подписи Telegram initData. Современные клиенты
 * добавляют поле `signature` (Ed25519) рядом с `hash`. Канонический алгоритм
 * исключает из data-check-string ОБА поля — `hash` и `signature`. Если
 * `signature` остаётся в строке, HMAC не сходится и вход падает с 401.
 * </context:auth_initdata_verification_test>
 */

const BOT_TOKEN = '123456:TEST_BOT_TOKEN_VALUE';

/** Строит initData с корректным hash (по канону: исключая hash и signature). */
function buildInitData(
  fields: Record<string, string>,
  botToken: string,
  opts: { withSignature?: boolean } = {},
): string {
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
}

function makeService(): AuthService {
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
}

describe('AuthService — Telegram initData verification', () => {
  const baseFields = {
    auth_date: '1717400000',
    query_id: 'AAHdF6IQAAAAAN0XohDhrOrc',
    user: JSON.stringify({ id: 42, first_name: 'Тест', last_name: 'Юзер' }),
  };

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
});
