import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { OptionalAuthGuard } from '../src/auth/guards/optional-auth.guard';
import { clearDatabase } from './test-utils';

describe('Organizations (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  let mockUser: User;
  const authToken = 'Bearer test-token';

  const mockGuard = {
    canActivate: (context: any) => {
      const req = context.switchToHttp().getRequest();
      req.user = mockUser;
      return true;
    },
  };

  const mockOptionalGuard = {
    canActivate: (context: any) => {
      const req = context.switchToHttp().getRequest();
      if (req.headers.authorization) {
        req.user = mockUser;
      }
      return true;
    },
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideGuard(OptionalAuthGuard)
      .useValue(mockOptionalGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
    mockUser = await prisma.user.create({
      data: {
        email: 'org-user@test.com',
        supabaseUserId: 'supa-org-user',
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (app) await app.close();
  });

  it('GET /organizations - should return isSubscribed flags correctly', async () => {
    const org1 = await prisma.organization.create({ data: { name: 'Org 1' } });
    const org2 = await prisma.organization.create({ data: { name: 'Org 2' } });
    await prisma.userOrganizationSubscription.create({
      data: { userId: mockUser.id, organizationId: org1.id },
    });

    const { body } = await request(app.getHttpServer())
      .get('/organizations')
      .set('Authorization', authToken)
      .expect(200);

    expect(body).toHaveLength(2);
    expect(body.find((o) => o.id === org1.id).isSubscribed).toBe(true);
    expect(body.find((o) => o.id === org2.id).isSubscribed).toBe(false);
  });

  it('POST & DELETE /organizations/:id/subscribe - should subscribe and unsubscribe user', async () => {
    const org = await prisma.organization.create({
      data: { name: 'Org to sub' },
    });

    await request(app.getHttpServer())
      .post(`/organizations/${org.id}/subscribe`)
      .set('Authorization', authToken)
      .expect(204);

    let { body: orgDetails } = await request(app.getHttpServer())
      .get(`/organizations/${org.id}`)
      .set('Authorization', authToken)
      .expect(200);
    expect(orgDetails.isSubscribed).toBe(true);

    await request(app.getHttpServer())
      .delete(`/organizations/${org.id}/unsubscribe`)
      .set('Authorization', authToken)
      .expect(204);

    orgDetails = (
      await request(app.getHttpServer())
        .get(`/organizations/${org.id}`)
        .set('Authorization', authToken)
        .expect(200)
    ).body;
    expect(orgDetails.isSubscribed).toBe(false);
  });
});