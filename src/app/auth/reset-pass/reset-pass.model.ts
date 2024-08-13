export interface resetRes {
  success: boolean;
  message: string;
  data: {
    email: string;
    image: string;
    mobile: string;
    name: string;
    password: string;
    token: string;
    type: string;
    _id: string;
  };
}
