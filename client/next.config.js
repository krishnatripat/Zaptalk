//  @type {import('next').NextConfig} 
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID:1690962753,
    NEXT_PUBLIC_ZEGO_SERVER_ID:"83fa38e967ede7cfe15fa117f1a07613"
  },
  images:{domains:["localhost"]}
};

module.exports= nextConfig;
