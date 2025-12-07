import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.GOOGLE_CLIENT_ID = 'gid';
process.env.GOOGLE_CLIENT_SECRET = 'gsecret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost/callback';
process.env.MICROSOFT_CLIENT_ID = 'mid';
process.env.MICROSOFT_CLIENT_SECRET = 'msecret';
process.env.MICROSOFT_TENANT_ID = 'tenant';
process.env.MICROSOFT_CALLBACK_URL = 'http://localhost/ms-callback';
process.env.OAUTH_ENCRYPTION_KEY = '12345678901234567890123456789012';

const mockOAuthToken = {
  findOne: jest.fn(),
  update: jest.fn(),
};

const mockUser = {
  update: jest.fn(),
  findByPk: jest.fn(),
};

const noopModel = {};

const mockDecrypt = jest.fn((v) => v);
const mockEncrypt = jest.fn((v) => v);

const mockRefreshAccessToken = jest.fn().mockResolvedValue({
  credentials: {
    access_token: 'refreshed',
    refresh_token: 'refreshed_r',
    expiry_date: Date.now() + 3600 * 1000,
  },
});

const mockSetCredentials = jest.fn();
const mockAuthClient = {
  setCredentials: mockSetCredentials,
  refreshAccessToken: mockRefreshAccessToken,
};

const mockCoursesList = jest.fn().mockResolvedValue({
  data: { courses: [{ id: '1', name: 'Class A', courseState: 'ACTIVE' }] },
});

const mockClassroom = {
  courses: { list: mockCoursesList },
};

jest.unstable_mockModule('../models/index.js', () => ({
  OAuthToken: mockOAuthToken,
  User: mockUser,
  Project: noopModel,
  Task: noopModel,
  Submission: noopModel,
  Attendance: noopModel,
  Notification: noopModel,
  BnccGeneralCompetency: noopModel,
  BnccDiscipline: noopModel,
  BnccSkill: noopModel,
  SkillGeneralCompetency: noopModel,
  ProjectSkill: noopModel,
  SkillIndicator: noopModel,
  StudentSkillEvaluation: noopModel,
  StudentSkillSummary: noopModel,
  BnccNotification: noopModel,
  StudentSkillShare: noopModel,
  TheoreticalReference: noopModel,
  StudentFeedback: noopModel,
  EvaluationBenchmarks: noopModel,
  TutorInteraction: noopModel,
  Assignment: noopModel,
  Class: noopModel,
  Team: noopModel,
  Rubrica: noopModel,
  RubricaCriterio: noopModel,
  RubricaNivel: noopModel,
  AvaliacaoEquipe: noopModel,
  AvaliacaoCriterio: noopModel,
  ProjectCollaborator: noopModel,
  ProjectInvite: noopModel,
  CollaboratorPermission: noopModel,
  sequelize: {},
  default: {
    OAuthToken: mockOAuthToken,
    User: mockUser,
    Project: noopModel,
    Task: noopModel,
    Submission: noopModel,
    Attendance: noopModel,
    Notification: noopModel,
    BnccGeneralCompetency: noopModel,
    BnccDiscipline: noopModel,
    BnccSkill: noopModel,
    SkillGeneralCompetency: noopModel,
    ProjectSkill: noopModel,
    SkillIndicator: noopModel,
    StudentSkillEvaluation: noopModel,
    StudentSkillSummary: noopModel,
    BnccNotification: noopModel,
    StudentSkillShare: noopModel,
    TheoreticalReference: noopModel,
    StudentFeedback: noopModel,
    EvaluationBenchmarks: noopModel,
    TutorInteraction: noopModel,
    Assignment: noopModel,
    Class: noopModel,
    Team: noopModel,
    Rubrica: noopModel,
    RubricaCriterio: noopModel,
    RubricaNivel: noopModel,
    AvaliacaoEquipe: noopModel,
    AvaliacaoCriterio: noopModel,
    ProjectCollaborator: noopModel,
    ProjectInvite: noopModel,
    CollaboratorPermission: noopModel,
    sequelize: {},
  },
}));

jest.unstable_mockModule('../utils/oauthCrypto.js', () => ({
  decryptToken: mockDecrypt,
  encryptToken: mockEncrypt,
}));

jest.unstable_mockModule('googleapis', () => ({
  google: {
    classroom: jest.fn(() => mockClassroom),
    auth: { OAuth2: jest.fn(() => mockAuthClient) },
  },
}));

const fetchMock = jest.fn();
global.fetch = fetchMock;

let app;

beforeAll(async () => {
  const mod = await import('../server.js');
  app = mod.default;
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Sync routes', () => {
  const token = jwt.sign({ id: 'user-1', role: 'teacher' }, process.env.JWT_SECRET);

  test('status returns disconnected when no tokens', async () => {
    mockOAuthToken.findOne.mockResolvedValue(null);
    mockUser.findByPk.mockResolvedValue({ lastSyncAt: null });

    const res = await request(app)
      .get('/sync/status')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.google.connected).toBe(false);
    expect(res.body.microsoft.connected).toBe(false);
  });

  test('classroom returns 400 when not connected', async () => {
    mockOAuthToken.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/sync/classroom')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  test('classroom lists courses when connected', async () => {
    const future = new Date(Date.now() + 60 * 60 * 1000);
    mockOAuthToken.findOne.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresAt: future,
      update: jest.fn(),
    });
    mockUser.update.mockResolvedValue([1]);

    const res = await request(app)
      .post('/sync/classroom')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(mockCoursesList).toHaveBeenCalled();
    expect(res.body.courseCount).toBe(1);
    expect(res.body.courses[0].name).toBe('Class A');
  });

  test('teams lists joined teams when connected', async () => {
    const future = new Date(Date.now() + 60 * 60 * 1000);
    mockOAuthToken.findOne.mockResolvedValue({
      accessToken: 'ms_access',
      refreshToken: 'ms_refresh',
      expiresAt: future,
      update: jest.fn(),
    });

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ value: [{ id: 't1', displayName: 'Team 1' }] }),
      text: async () => 'ok',
    });

    const res = await request(app)
      .post('/sync/teams')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(fetchMock).toHaveBeenCalled();
    expect(res.body.teamCount).toBe(1);
  });
});
