import { CMSAuth, CMSLogin, CMSLoginMFAVetify, CMSMFASetup } from 'src/types/auth.js';
import { getApiClient } from '../api/index.js';

export const RegisterCMSAccount = async (data: CMSAuth) => {
  const client = getApiClient();
  return (
    await client.post('authentication/register', data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
  ).data;
};

export const LoginCMSAccount = async (data: CMSLogin) => {
  const client = getApiClient();
  return (
    await client.post('authentication/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
  ).data;
};

export const VerifyLoginMFA = async (data: CMSLoginMFAVetify) => {
  const client = getApiClient();
  return (
    await client.post(
      `authentication/login/mfa/${data.userId}`,
      { mfa_code: data.code },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
  ).data;
};

export const MFaSetUp = async (data: CMSMFASetup) => {
  const cliennt = getApiClient();
  return (
    await cliennt.post(
      `authentication/mfa/verify/${data.user_id}`,
      {
        token_id: data.token_id,
        code: data.code,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
  ).data;
};

export const getMfaSetup = async (userId: string) => {
  const client = getApiClient();
  return (await client.post(`authentication/mfa/setup/${userId}`)).data;
};

export const fetchMe = async (email: string) => {
  const client = getApiClient();
  return (
    await client.get(`authentication/me`, {
      params: { email },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
  ).data;
};
