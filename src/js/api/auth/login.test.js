// LOGIN TEST JS

import { login } from './login';

const TestingTheMail = 'haider.fahim@stud.noroff.no';

const TestingThePassword = 'haiderfahim1995';

const TestingSuccess = {
  name: 'Haider',
  email: 'haider.fahim@stud.noroff.no',
  accessToken: 'token',
};

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

function fetchSuccess() {
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(TestingSuccess),
  });
}

function fetchInvalidLogin() {
  return Promise.resolve({
    ok: false,
    status: 401,
    statusText: 'Unauthorized',
  });
}

describe('The user can login', () => {
  it('Here it returns a valid ACCESS TOKEN in local storage and valid RESPONSE OBJECT!', async () => {
    global.fetch = jest.fn(() => fetchSuccess());
    const expectedToken = TestingSuccess.accessToken;
    const response = await login(TestingTheMail, TestingThePassword);
    const storedToken = JSON.parse(localStorage.getItem('token'));
    expect(storedToken).toEqual(expectedToken);
    expect(response).toEqual(TestingSuccess);
  });

  it('Throws error message on INVALID details!', async () => {
    global.fetch = jest.fn(() => fetchInvalidLogin());
    await expect(login(TestingTheMail, TestingThePassword)).rejects.toThrow(
      'Unauthorized'
    );
  });
});