export type CMSAuth = {
  id: string;
  email: string;
  username: string;
  role: string;
};

export type CMSMFASetup = {
  user_id: string;
  token_id: string;
  code: string;
};

export type CMSLogin = {
  email: string;
  password: string;
};

export type CMSLoginMFAVetify = {
  userId: string;
  code: string;
};
