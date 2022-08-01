export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        AWS_BUCKET_NAME:string;
        AWS_BUCKET_REGION:string;
        AWS_ACCESS_KEY_ID:string;
        AWS_SECRET_ACCESS_KEY:string;
        SERVER_URL:string;
        PORT:number;
    }
  }
}