//  @type {import('next').NextConfig} 
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID:1140973754,
    NEXT_PUBLIC_ZEGO_SERVER_ID:"c8af5cd0d6ffdb8ee976eab9c6c97516"
  },
  images:{domains:["localhost"]}
};

module.exports= nextConfig;
